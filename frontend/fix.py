import io
import re

with io.open('src/App.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('?? Diagnosa', '?? Diagnosa')
text = text.replace('??? Tips', '??? Tips')
text = text.replace('?? Rekomendasi', '?? Rekomendasi')
text = text.replace('??', '??') # Catch the robot emoji

with io.open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
