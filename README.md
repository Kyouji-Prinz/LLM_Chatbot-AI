# LOQ-Tech AI Chatbot

Aplikasi ini sudah dipisah menjadi **Backend** (FastAPI) dan **Frontend** (React + Vite + TailwindCSS) untuk menghasilkan desain yang indah, modern (Glassmorphism, Soft Light) sesuai referensi Cortex/Spotlight.

## Cara Menjalankan

### 1. Menjalankan Backend (Terminal 1)
Buka terminal baru, masuk ke folder project ini, lalu jalankan:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
*Backend akan berjalan di http://127.0.0.1:8000*

*(Pastikan file `.env` yang berisi `GEMINI_API_KEY` ada di root folder)*

### 2. Menjalankan Frontend (Terminal 2)
Buka terminal baru lainnya, masuk ke folder project ini, lalu jalankan:

```bash
cd frontend
npm run dev
```
*Frontend akan berjalan di link localhost yang tertera di terminal (biasanya http://localhost:5173).* Buka link tersebut di browser.

### Catatan
- File-file lama (`chatbot.py`, `app_streamlit.py`, dll) sudah diamankan di dalam folder `old_scripts/`.
