from pathlib import Path
p = Path("src/app/components/sun-rays.tsx")
s = p.read_text(encoding="utf-8")

teal = '"repeating-conic-gradient(from 210deg at 46% 14%, rgba(0,210,211,0.00) 0deg, rgba(0,210,211,0.42) 12deg, rgba(0,210,211,0.00) 28deg)"'
if teal not in s:
    raise SystemExit("Teal repeating-conic-gradient not found. Search the exact line in the file and retry.")
white = '"repeating-conic-gradient(from 210deg at 46% 14%, rgba(255,255,255,0.00) 0deg, rgba(255,255,255,0.26) 10deg, rgba(255,255,255,0.00) 26deg)"'

# Insert white layer immediately after teal layer (once)
if white not in s:
    s = s.replace(teal, teal + ",\n              " + white)

p.write_text(s, encoding="utf-8")
print("Added white rays layer.")
