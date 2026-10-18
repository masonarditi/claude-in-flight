import math, random, struct, wave
from pathlib import Path

RATE = 44100
OUT = Path(__file__).resolve().parent.parent / "public" / "sfx"


def write(name, dur, fn):
    OUT.mkdir(parents=True, exist_ok=True)
    with wave.open(str(OUT / f"{name}.wav"), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(RATE)
        w.writeframes(b"".join(struct.pack("<h", int(max(-1, min(1, fn(i / RATE))) * 32767)) for i in range(int(dur * RATE))))


def ding(t, f, start):
    return 0 if t < start else math.sin(2 * math.pi * f * (t - start)) * math.exp(-9 * (t - start))


random.seed(1)
write("send", 0.22, lambda t: 0.45 * math.sin(2 * math.pi * (500 * t + 2600 * t * t)) * math.exp(-14 * t))
write("receive", 0.55, lambda t: 0.33 * ding(t, 1318.5, 0) + 0.33 * ding(t, 1760, 0.08))
write("tick", 0.03, lambda t: 0.35 * (random.random() * 2 - 1) * math.exp(-160 * t))
write("thud", 0.9, lambda t: 0.9 * math.sin(2 * math.pi * (70 - 30 * t) * t) * math.exp(-4.5 * t) + 0.2 * (random.random() * 2 - 1) * math.exp(-40 * t))
