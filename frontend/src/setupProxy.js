const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer({ limits: { fileSize: 25 * 1024 * 1024 } });

module.exports = function (app) {
  app.use(bodyParser.json({ limit: "25mb" }));

  // Server-side Sarvam Text-to-Speech (Bulbul v3) endpoint
  app.post("/api/sarvam/tts", async (req, res) => {
    const apiKey = process.env.SARVAM_API_KEY;
    if (!apiKey) {
      console.error("[Sarvam API Key Check] process.env.SARVAM_API_KEY is MISSING!");
      return res.status(500).json({ error: "Couldn't generate audio right now — try again" });
    }
    console.log("[Sarvam API Key Check] process.env.SARVAM_API_KEY is LOADED and non-empty.");

    const { text, pace = 1.0, speaker = "shreya", target_language_code = "hi-IN" } = req.body || {};
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Text parameter is required" });
    }

    const cleanText = text.trim();
    const startTime = Date.now();
    console.log(`[Sarvam TTS Diagnostic] Received TTS request for ${cleanText.length} chars at ${new Date().toISOString()}`);
    try {
      const chunks = [];
      const maxLength = 450;

      if (cleanText.length <= maxLength) {
        chunks.push(cleanText);
      } else {
        const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];
        let current = "";
        for (const s of sentences) {
          if ((current + s).length > maxLength) {
            if (current) chunks.push(current.trim());
            current = s;
          } else {
            current += " " + s;
          }
        }
        if (current.trim()) chunks.push(current.trim());
      }

      console.log(`[Sarvam TTS Diagnostic] Split text into ${chunks.length} chunk(s). Requesting chunks in parallel...`);

      const chunkResults = await Promise.all(
        chunks.map(async (chunk, index) => {
          const chunkStart = Date.now();
          const sarvamRes = await fetch("https://api.sarvam.ai/text-to-speech", {
            method: "POST",
            headers: {
              "api-subscription-key": apiKey,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              inputs: [chunk],
              target_language_code: target_language_code,
              speaker: speaker,
              pitch: 0,
              pace: Math.min(Math.max(pace, 0.5), 2.0),
              loudness: 1.5,
              speech_sample_rate: 22050,
              enable_preprocessing: true,
              model: "bulbul:v3",
            }),
          });

          const chunkEnd = Date.now();
          if (!sarvamRes.ok) {
            const errText = await sarvamRes.text();
            console.error(`[Sarvam TTS Error] Chunk #${index} failed (${sarvamRes.status}):`, errText);
            throw new Error(`Sarvam API failed with status ${sarvamRes.status}: ${errText}`);
          }

          const data = await sarvamRes.json();
          const base64Audio = data.audios && data.audios[0];
          console.log(`[Sarvam TTS Success] Chunk #${index} resolved in ${chunkEnd - chunkStart}ms`);
          return { index, audio: base64Audio };
        })
      );

      // Sort by original index to ensure strict playback sequence
      chunkResults.sort((a, b) => a.index - b.index);
      const audioBuffers = chunkResults.map(r => r.audio).filter(Boolean);

      const totalTime = Date.now() - startTime;
      console.log(`[Sarvam TTS Diagnostic Complete] Parallel processed ${audioBuffers.length} chunk(s) in ${totalTime}ms total.`);

      return res.json({
        audio: `data:audio/wav;base64,${audioBuffers[0]}`,
        audios: audioBuffers.map(b => `data:audio/wav;base64,${b}`),
      });
    } catch (err) {
      console.error("Server-side Sarvam TTS error:", err.message);
      return res.status(500).json({ error: "Couldn't generate audio right now — try again" });
    }
  });

  // Server-side Sarvam Speech-to-Text (Saaras v3) endpoint
  app.post("/api/sarvam/stt", upload.single("file"), async (req, res) => {
    const apiKey = process.env.SARVAM_API_KEY;
    if (!apiKey) {
      console.error("[Sarvam STT Check] process.env.SARVAM_API_KEY is MISSING!");
      return res.status(500).json({ error: "Server API key missing" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Audio file is required" });
    }

    try {
      const languageCode = req.body.language_code || req.query.language_code || "en-IN";
      const FormData = require("form-data");
      const form = new FormData();
      form.append("file", req.file.buffer, {
        filename: req.file.originalname || "audio.webm",
        contentType: req.file.mimetype || "audio/webm",
      });
      form.append("model", "saaras:v3");
      form.append("language_code", languageCode);

      console.log(`[Sarvam STT Server Request] Sending audio buffer (${req.file.buffer.length} bytes, lang: ${languageCode}) to Saaras STT API...`);

      const sarvamRes = await fetch("https://api.sarvam.ai/speech-to-text", {
        method: "POST",
        headers: {
          "api-subscription-key": apiKey,
          ...form.getHeaders(),
        },
        body: form.getBuffer(),
      });

      if (!sarvamRes.ok) {
        const errText = await sarvamRes.text();
        console.error("Sarvam STT API Server Error:", sarvamRes.status, errText);
        return res.status(500).json({ error: "Transcription failed" });
      }

      const data = await sarvamRes.json();
      console.log("[Sarvam STT Server Success] Transcript:", data.transcript);
      return res.json({ transcript: data.transcript || "", language_code: data.language_code || languageCode });
    } catch (err) {
      console.error("Server-side Sarvam STT error:", err.message);
      return res.status(500).json({ error: "Transcription error" });
    }
  });

  // Server-side Dost AI Chat streaming endpoint
  app.post("/api/chat/message", async (req, res) => {
    const { message } = req.body || {};
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message parameter required" });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const systemPrompt = "You are Dost, a warm, helpful, and encouraging AI accessibility companion for SaathiFy (an inclusive communication platform for the deaf and hard-of-hearing). Keep your responses concise (2-4 sentences), friendly, and conversational.";
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: `${systemPrompt}\n\nUser: ${message}` }] }]
            })
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText && replyText.trim()) {
            console.log("[Gemini API Live Success] Received real LLM response from Gemini 3.6 Flash.");
            res.write(`data: ${JSON.stringify({ type: "text", content: replyText.trim() })}\n\n`);
            res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
            return res.end();
          }
        } else {
          const errText = await geminiRes.text();
          console.error(`[Gemini API Error] Status ${geminiRes.status}: ${errText}`);
        }
      } catch (err) {
        console.error("Gemini API call error in proxy:", err.message);
      }
    }

    // Smart, contextual companion response generator when Gemini key is not set or API fails
    const msg = message.toLowerCase().trim();
    let reply = "Namaste! I'm Dost, your SaathiFy companion. I can help you learn Indian Sign Language (ISL), navigate our document reader, or test voice accessibility features!";
    if (msg.includes("hello") || msg.includes("hi") || msg.includes("namaste")) {
      reply = "Namaste! Welcome to SaathiFy! I'm Dost, your friendly companion. How can I help you today?";
    } else if (msg.includes("isl") || msg.includes("sign")) {
      reply = "Indian Sign Language (ISL) is a rich, expressive visual language used by over 5 million people in India. SaathiFy provides real-time ISL gesture recognition and interactive learning!";
    } else if (msg.includes("document") || msg.includes("reader") || msg.includes("pdf") || msg.includes("docx")) {
      reply = "SaathiFy's Document Reader supports .txt, .pdf, and .docx files! It extracts clean text and offers Read, Listen (Sarvam TTS), and Braille modes.";
    } else if (msg.includes("voice") || msg.includes("stt") || msg.includes("speech")) {
      reply = "I heard you loud and clear! Our Sarvam AI integration handles Speech-to-Text in Indian English and Hindi seamlessly.";
    }

    res.write(`data: ${JSON.stringify({ type: "text", content: reply })}\n\n`);
    res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
    return res.end();
  });

  // Server-side Document Parser (.txt, .pdf, .docx)
  app.post("/api/parse-document", upload.single("file"), async (req, res) => {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: "We couldn't read that file — try a .txt, .pdf, or .docx" });
    }

    const fileName = req.file.originalname || "Uploaded Document";
    const buffer = req.file.buffer;

    try {
      let text = "";
      let paragraphs = [];

      if (fileName.toLowerCase().endsWith(".txt") || req.file.mimetype.includes("text")) {
        text = buffer.toString("utf-8").trim();
        if (!text) throw new Error("Empty txt file");
        paragraphs = text.split(/\n\s*\n|\n/).map(p => p.trim()).filter(Boolean);

      } else if (fileName.toLowerCase().endsWith(".pdf") || req.file.mimetype.includes("pdf")) {
        const pdfParseModule = require("pdf-parse");
        const uint8Array = new Uint8Array(buffer);
        let extractedText = "";

        if (typeof pdfParseModule === "function") {
          const parsed = await pdfParseModule(buffer);
          extractedText = parsed.text || "";
        } else if (pdfParseModule.PDFParse) {
          const parser = new pdfParseModule.PDFParse(uint8Array);
          const pdfResult = await parser.getText();
          if (pdfResult && pdfResult.pages && pdfResult.pages.length > 0) {
            extractedText = pdfResult.pages.map(p => p.text).join("\n\n");
          } else if (pdfResult && pdfResult.text) {
            extractedText = pdfResult.text;
          }
        }

        text = extractedText.trim();
        if (!text) throw new Error("Empty PDF text");

        // Clean page number footers (e.g., "-- 1 of 2 --") and separate into clean paragraphs
        const cleanedText = text
          .split("\n")
          .filter(line => !/^\s*--\s*\d+\s+of\s+\d+\s*--\s*$/i.test(line) && !/^\s*Page\s+\d+\s*$/i.test(line))
          .join("\n");

        text = cleanedText;
        paragraphs = cleanedText
          .split(/\n\s*\n/)
          .map(p => p.replace(/\n/g, " ").trim())
          .filter(Boolean);

      } else if (fileName.toLowerCase().endsWith(".docx") || req.file.mimetype.includes("officedocument")) {
        const mammoth = require("mammoth");
        const result = await mammoth.extractRawText({ buffer: buffer });
        text = (result.value || "").trim();
        if (!text) throw new Error("Empty DOCX text");
        paragraphs = text.split(/\n\s*\n|\n/).map(p => p.trim()).filter(Boolean);

      } else {
        text = buffer.toString("utf-8").trim();
        if (!text || /[^\x00-\x7F]/.test(text.slice(0, 50))) {
          throw new Error("Unsupported binary format");
        }
        paragraphs = text.split(/\n\s*\n|\n/).map(p => p.trim()).filter(Boolean);
      }

      if (!text || paragraphs.length === 0) {
        throw new Error("Empty text output");
      }

      console.log(`[Document Parser Success] Parsed file '${fileName}' (${paragraphs.length} paragraphs, ${text.length} chars).`);

      return res.json({
        title: fileName,
        text: text,
        paragraphs: paragraphs,
      });
    } catch (err) {
      console.error("Server-side document parse error:", err.message);
      return res.status(400).json({ error: "We couldn't read that file — try a .txt, .pdf, or .docx" });
    }
  });
};
