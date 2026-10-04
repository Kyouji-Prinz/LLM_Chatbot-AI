import os
import re

tw_path = 'frontend/tailwind.config.js'
with open(tw_path, 'r', encoding='utf-8') as f:
    tw_code = f.read()
tw_code = tw_code.replace('plugins: [],', 'plugins: [require(' + chr(39) + '@tailwindcss/typography' + chr(39) + ')],')
with open(tw_path, 'w', encoding='utf-8') as f:
    f.write(tw_code)

be_path = 'backend/main.py'
with open(be_path, 'r', encoding='utf-8') as f:
    be_code = f.read()

new_prompt = 'SYSTEM_PROMPT = ' + chr(34) + chr(34) + chr(34) + 'Kamu adalah ' + chr(39) + 'TechBuddy' + chr(39) + ', sahabat AI ahli IT dan teknisi laptop yang siap membantu masalah segala jenis dan merk laptop/PC.\nTugasmu:\n- Memberikan solusi masalah umum seperti lemot, panas (overheating), baterai boros, atau bluescreen.\n- Memandu tips perawatan laptop, upgrade hardware, dan instalasi software.\n- Gunakan format markdown (bold, list, dll) agar teks terstruktur dan rapi.\n- Gunakan bahasa Indonesia yang santai, suportif, dan mudah dipahami pengguna awam.\n' + chr(34) + chr(34) + chr(34)

be_code = re.sub(r'SYSTEM_PROMPT = ' + chr(34) + chr(34) + chr(34) + r'[\s\S]*?' + chr(34) + chr(34) + chr(34), new_prompt, be_code)
be_code = be_code.replace(chr(39) + 'gemini-3.6-flash' + chr(39), chr(39) + 'gemini-1.5-flash' + chr(39))

with open(be_path, 'w', encoding='utf-8') as f:
    f.write(be_code)

app_path = 'frontend/src/App.jsx'
with open(app_path, 'r', encoding='utf-8') as f:
    app_code = f.read()

if 'import ReactMarkdown' not in app_code:
    app_code = app_code.replace('import { v4', 'import ReactMarkdown from ' + chr(39) + 'react-markdown' + chr(39) + ';\nimport { v4')

app_code = app_code.replace('LOQ-Tech', 'TechBuddy')
app_code = app_code.replace('Halo, Engineer.', 'Halo!')
app_code = app_code.replace('Ada masalah apa dengan Lenovo LOQ-mu hari ini?', 'Ada masalah apa dengan laptop/komputermu hari ini?')
app_code = app_code.replace('✨ Optimasi FPS & Suhu', '✨ Mengatasi Lemot & Panas')
app_code = app_code.replace('🛠️ Setup BIOS & Vantage', '🛠️ Tips & Trik Perawatan')
app_code = app_code.replace('{msg.content}', '<ReactMarkdown className=' + chr(34) + 'prose prose-sm md:prose-base leading-relaxed text-current max-w-none' + chr(34) + '>{msg.content}</ReactMarkdown>')

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app_code)
print('Success')
