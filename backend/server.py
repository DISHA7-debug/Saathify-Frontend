from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone
import os
import logging
import json
from datetime import datetime, timezone
from pathlib import Path
from pydantic import BaseModel

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

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

    chat = LlmChat(
        api_key=api_key,
        session_id=payload.session_id,
        system_message=DOST_SYSTEM
    ).with_model("gemini", "gemini-3-flash-preview")

    await db.chat_messages.insert_one({
        "session_id": payload.session_id,
        "role": "user",
        "content": payload.message,
        "timestamp": datetime.now(timezone.utc).isoformat()
    })

    async def event_gen():
        full = ""
        try:
            async for ev in chat.stream_message(UserMessage(text=payload.message)):
                if isinstance(ev, TextDelta):
                    full += ev.content
                    yield f"data: {json.dumps({'type': 'text', 'content': ev.content})}\n\n"
                elif isinstance(ev, StreamDone):
                    await db.chat_messages.insert_one({
                        "session_id": payload.session_id,
                        "role": "assistant",
                        "content": full,
                        "timestamp": datetime.now(timezone.utc).isoformat()
                    })
                    yield f"data: {json.dumps({'type': 'done'})}\n\n"
                    break
        except Exception as e:
            logger.error(f"Dost chat error: {e}")
            yield f"data: {json.dumps({'type': 'error', 'content': 'Something went wrong. Please try again.'})}\n\n"

    return StreamingResponse(
        event_gen(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )


@api_router.get("/chat/history/{session_id}")
async def get_history(session_id: str):
    msgs = await db.chat_messages.find(
        {"session_id": session_id}, {"_id": 0}
    ).sort("timestamp", 1).to_list(100)
    return msgs


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown():
    client.close()
