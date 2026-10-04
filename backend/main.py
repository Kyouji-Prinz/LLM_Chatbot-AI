import os
import json
from datetime import datetime
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq

load_dotenv(dotenv_path="../.env")
api_key = os.getenv("GROQ_API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=api_key) if api_key else None
MODEL_ID = 'qwen/qwen3.8-27b'

SYSTEM_PROMPT = """Kamu adalah 'Sobat Laptop', asisten AI spesialis teknisi hardware, software, dan optimasi performa untuk semua jenis dan merk laptop.
Tugasmu:
- Memberikan diagnosa dan solusi terkait masalah laptop seperti: lemot, cepat panas, baterai bocor, blue screen, dll.
- Memberikan tips merawat laptop agar awet.
- Memberikan rekomendasi upgrade (RAM, SSD) atau saran perbaikan.
- Jelaskan masalah teknis dengan bahasa yang bersahabat, santai, dan mudah dipahami oleh orang awam maupun mahasiswa.
- Gunakan format markdown dengan rapi (seperti bullet points, bold untuk penekanan).
"""

chat_sessions = {}

class ChatRequest(BaseModel):
    session_id: str
    message: str

class ChatResponse(BaseModel):
    response: str
    session_id: str

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not client:
        raise HTTPException(status_code=500, detail="Groq API Key is not configured. Silakan cek file .env kamu!")

    session_id = request.session_id
    
    if session_id not in chat_sessions:
        chat_sessions[session_id] = [
            {"role": "system", "content": SYSTEM_PROMPT}
        ]
    
    chat_sessions[session_id].append({"role": "user", "content": request.message})

    try:
        completion = client.chat.completions.create(
            model=MODEL_ID,
            messages=chat_sessions[session_id],
            temperature=0.7,
        )
        
        response_text = completion.choices[0].message.content
        
        chat_sessions[session_id].append({"role": "assistant", "content": response_text})
        
        return ChatResponse(response=response_text, session_id=session_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/clear")
async def clear_chat(session_id: str):
    if session_id in chat_sessions:
        del chat_sessions[session_id]
    return {"status": "ok"}
