from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
try:
    from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone
    HAS_EMERGENT = True
except ImportError:
    HAS_EMERGENT = False
import os
import logging
import json
from datetime import datetime, timezone
from pathlib import Path
from pydantic import BaseModel

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'saathify')]

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DOST_SYSTEM = """You are Dost, a warm and friendly AI companion for SaathiFy — an inclusive communication platform built for the deaf and hard-of-hearing community.

You help users:
- Learn about Indian Sign Language (ISL) signs, vocabulary, and grammar
- Navigate SaathiFy's features: ISL Camera recognition, Live Communication workspace, Accessible Document Reader, and the ISL Avatar
- Understand accessibility resources and tools
- Feel welcome, supported, and empowered

Guidelines:
- Be warm, concise (under 120 words per response), and encouraging
- Use simple, clear language; avoid jargon unless explaining ISL terms
- Suggest relevant SaathiFy features naturally when they help the user
- Always be inclusive and celebratory of the deaf community"""


class ChatPayload(BaseModel):
    session_id: str
    message: str


@api_router.get("/")
async def root():
    return {"message": "SaathiFy 2.0 API running"}


@api_router.post("/chat/message")
async def chat_message(payload: ChatPayload):
    api_key = os.environ.get('GEMINI_API_KEY') or os.environ.get('EMERGENT_LLM_KEY')
    if not api_key:
        raise HTTPException(status_code=500, detail="AI key not configured")

    async def event_gen():
        full = ""
        try:
            if HAS_EMERGENT:
                chat = LlmChat(
                    api_key=api_key,
                    session_id=payload.session_id,
                    system_message=DOST_SYSTEM
                ).with_model("gemini", "gemini-3-flash-preview")
                async for ev in chat.stream_message(UserMessage(text=payload.message)):
                    if isinstance(ev, TextDelta):
                        full += ev.content
                        yield f"data: {json.dumps({'type': 'text', 'content': ev.content})}\n\n"
                    elif isinstance(ev, StreamDone):
                        yield f"data: {json.dumps({'type': 'done'})}\n\n"
                        break
            else:
                import httpx
                async with httpx.AsyncClient(timeout=15.0) as client_http:
                    res = await client_http.post(
                        f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key={api_key}",
                        headers={"Content-Type": "application/json"},
                        json={
                            "contents": [{"parts": [{"text": f"{DOST_SYSTEM}\n\nUser: {payload.message}"}]}]
                        }
                    )
                    if res.status_code == 200:
                        data = res.json()
                        reply = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                    else:
                        reply = "Namaste! I am Dost, your SaathiFy companion. How can I support your accessibility journey today?"

                yield f"data: {json.dumps({'type': 'text', 'content': reply.strip()})}\n\n"
                yield f"data: {json.dumps({'type': 'done'})}\n\n"
        except Exception as e:
            logger.error(f"Dost chat error: {e}")
            yield f"data: {json.dumps({'type': 'error', 'content': 'Something went wrong. Please try again.'})}\n\n"

    return StreamingResponse(
        event_gen(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )


class TTSPayload(BaseModel):
    text: str
    pace: float = 1.0
    speaker: str = "shreya"
    target_language_code: str = "hi-IN"


@api_router.post("/sarvam/tts")
async def sarvam_tts(payload: TTSPayload):
    import httpx
    api_key = os.environ.get('SARVAM_API_KEY')
    if not api_key:
        raise HTTPException(status_code=500, detail="Sarvam API key not configured")

    if not payload.text or not payload.text.strip():
        raise HTTPException(status_code=400, detail="Text parameter required")

    try:
        async with httpx.AsyncClient(timeout=30.0) as client_http:
            res = await client_http.post(
                "https://api.sarvam.ai/text-to-speech",
                headers={
                    "api-subscription-key": api_key,
                    "Content-Type": "application/json"
                },
                json={
                    "inputs": [payload.text.strip()[:450]],
                    "target_language_code": payload.target_language_code,
                    "speaker": payload.speaker,
                    "pitch": 0,
                    "pace": min(max(payload.pace, 0.5), 2.0),
                    "loudness": 1.5,
                    "speech_sample_rate": 22050,
                    "enable_preprocessing": True,
                    "model": "bulbul:v3"
                }
            )

            if res.status_code != 200:
                logger.error(f"Sarvam TTS Error: {res.text}")
                raise HTTPException(status_code=500, detail="Couldn't generate audio right now — try again")

            data = res.json()
            audios = data.get("audios", [])
            if not audios:
                raise HTTPException(status_code=500, detail="Couldn't generate audio right now — try again")

            return {
                "audio": f"data:audio/wav;base64,{audios[0]}",
                "audios": [f"data:audio/wav;base64,{a}" for a in audios]
            }
    except Exception as e:
        logger.error(f"Server Sarvam TTS Exception: {e}")
        raise HTTPException(status_code=500, detail="Couldn't generate audio right now — try again")


@api_router.post("/sarvam/stt")
async def sarvam_stt(file: UploadFile = File(...)):
    import httpx
    api_key = os.environ.get('SARVAM_API_KEY')
    if not api_key:
        raise HTTPException(status_code=500, detail="Sarvam API key not configured")

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Audio file required")

    try:
        async with httpx.AsyncClient(timeout=30.0) as client_http:
            files = {
                "file": (file.filename or "audio.webm", content, file.content_type or "audio/webm")
            }
            data = {
                "model": "saaras:v3",
                "language_code": "hi-IN"
            }
            res = await client_http.post(
                "https://api.sarvam.ai/speech-to-text",
                headers={"api-subscription-key": api_key},
                files=files,
                data=data
            )
            if res.status_code != 200:
                logger.error(f"Sarvam STT Error: {res.text}")
                raise HTTPException(status_code=500, detail="Transcription failed")

            res_json = res.json()
            return {"transcript": res_json.get("transcript", "")}
    except Exception as e:
        logger.error(f"Server Sarvam STT Exception: {e}")
        raise HTTPException(status_code=500, detail="Transcription failed")


@api_router.get("/chat/history/{session_id}")
async def get_history(session_id: str):
    msgs = await db.chat_messages.find(
        {"session_id": session_id}, {"_id": 0}
    ).sort("timestamp", 1).to_list(100)
    return msgs


import io


@api_router.post("/parse-document")
async def parse_document(file: UploadFile = File(...)):
    filename = file.filename or "Uploaded Document"
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="We couldn't read that file — try a .txt, .pdf, or .docx")

    text = ""
    paragraphs = []

    try:
        if filename.lower().endswith(".txt"):
            text = content.decode("utf-8", errors="replace").strip()
            if not text:
                raise ValueError("Empty file")
            paragraphs = [p.strip() for p in text.split("\n") if p.strip()]

        elif filename.lower().endswith(".pdf"):
            import pypdf
            reader = pypdf.PdfReader(io.BytesIO(content))
            extracted_pages = []
            for page in reader.pages:
                p_text = page.extract_text() or ""
                if p_text.strip():
                    extracted_pages.append(p_text.strip())
            text = "\n\n".join(extracted_pages).strip()
            if not text:
                raise ValueError("No text extracted from PDF")
            paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
            if len(paragraphs) == 1 and "\n" in paragraphs[0]:
                paragraphs = [p.strip() for p in text.split("\n") if p.strip()]

        elif filename.lower().endswith(".docx"):
            import docx
            doc = docx.Document(io.BytesIO(content))
            para_list = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
            text = "\n\n".join(para_list).strip()
            if not text:
                raise ValueError("No text extracted from DOCX")
            paragraphs = para_list

        else:
            text = content.decode("utf-8", errors="replace").strip()
            if not text or len(text) < 5:
                raise ValueError("Unsupported format")
            paragraphs = [p.strip() for p in text.split("\n") if p.strip()]

        if not text or not paragraphs:
            raise ValueError("Empty output")

        return {
            "title": filename,
            "text": text,
            "paragraphs": paragraphs
        }
    except Exception as e:
        logger.error(f"Document parsing error for {filename}: {e}")
        raise HTTPException(status_code=400, detail="We couldn't read that file — try a .txt, .pdf, or .docx")


@app.on_event("shutdown")
async def shutdown():
    client.close()


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
