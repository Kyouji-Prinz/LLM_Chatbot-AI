import os
import json
from datetime import datetime
from dotenv import load_dotenv
from google import genai
from google.genai import types

# 1. Muat API Key
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("Error: API Key tidak ditemukan di .env.")
    exit()

client = genai.Client(api_key=api_key)
MODEL_ID = 'gemini-3.6-flash'

# 2. Setup System Prompt (Karakter Chatbot)
SYSTEM_PROMPT = """Kamu adalah 'LOQ-Tech', asisten AI spesialis teknisi hardware dan optimasi performa laptop gaming, khususnya untuk seri Lenovo LOQ 15IAX9.
Tugasmu:
- Memberikan solusi terkait masalah drop FPS, bottleneck, dan manajemen thermal (suhu).
- Memandu pengaturan BIOS, Lenovo Vantage/Legion Toolkit, dan upgrade hardware (RAM/SSD).
- Menjelaskan masalah driver grafis dengan bahasa yang teknis namun mudah dipahami mahasiswa.
- Gunakan bahasa Indonesia yang santai tapi profesional.
"""

# 3. Fungsi untuk membuat sesi obrolan baru
def create_chat_session():
    return client.chats.create(
        model=MODEL_ID,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            temperature=0.7, # Sedikit variasi agar luwes
        )
    )

# 4. Fungsi untuk menyimpan riwayat (Bonus Nilai)
def save_history(chat_session):
    filename = f"riwayat_loq_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    
    # Ekstrak history dari objek chat
    history_data = []
    for message in chat_session.get_history():
        role = message.role
        # Mengambil teks dari struktur message SDK baru
        text = message.parts[0].text if message.parts else ""
        history_data.append({"role": role, "content": text})
        
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(history_data, f, ensure_ascii=False, indent=2)
    print(f"\n[SISTEM] Riwayat percakapan berhasil disimpan ke: {filename}")

# --- PROGRAM UTAMA ---
def main():
    print("=" * 55)
    print(" 🛠️  LOQ-Tech: Lenovo Performance Assistant 🛠️")
    print("=" * 55)
    print("Ketik 'exit'  -> Keluar dari program")
    print("Ketik 'clear' -> Hapus ingatan dan mulai percakapan baru")
    print("Ketik 'save'  -> Simpan riwayat percakapan ke file JSON")
    print("-" * 55)

    # Inisialisasi sesi obrolan pertama
    chat = create_chat_session()

    while True:
        try:
            user_input = input("\nKamu: ").strip()

            if not user_input:
                continue

            if user_input.lower() == 'exit':
                print("\n[LOQ-Tech] Sesi teknis selesai. Jangan lupa pantau suhu laptopmu! Sampai jumpa.")
                break
                
            elif user_input.lower() == 'clear':
                chat = create_chat_session() # Bikin sesi baru
                print("\n[SISTEM] Memori obrolan telah di-reset.")
                continue
                
            elif user_input.lower() == 'save':
                save_history(chat)
                continue

            # Kirim pesan ke LLM
            response = chat.send_message(user_input)
            print(f"\nLOQ-Tech: {response.text}")

        except Exception as e:
            print(f"\n[SISTEM] Terjadi kesalahan: {e}")
            print("[SISTEM] Coba tanyakan lagi atau ketik 'clear' untuk reset.")

if __name__ == "__main__":
    main()