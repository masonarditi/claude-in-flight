import math, random, struct, wave
from pathlib import Path

RATE = 44100
OUT = Path(__file__).resolve().parent.parent / "public" / "sfx"
random.seed(1)


def write(name, samples):
    OUT.mkdir(parents=True, exist_ok=True)
    peak = max(abs(s) for s in samples) or 1
    with wave.open(str(OUT / f"{name}.wav"), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(RATE)
        w.writeframes(b"".join(struct.pack("<h", int(s / peak * 0.9 * 32767)) for s in samples))


def bandpass(signal, freq, q):
    x1 = x2 = y1 = y2 = 0.0
    out = []
    for i, x in enumerate(signal):
        w0 = 2 * math.pi * freq(i / RATE) / RATE
        alpha = math.sin(w0) / (2 * q)
        a0, a1, a2 = 1 + alpha, -2 * math.cos(w0), 1 - alpha
        y = (alpha * x - alpha * x2 - a1 * y1 - a2 * y2) / a0
        x2, x1, y2, y1 = x1, x, y1, y
        out.append(y)
    return out


def noise(n):
    return [random.uniform(-1, 1) for _ in range(n)]


def env(t, attack, decay):
    return min(t / attack, 1) * math.exp(-max(t - attack, 0) * decay)


# Sent: an airy swoosh that sweeps upward, like iMessage's send.
n = int(0.32 * RATE)
air = bandpass(noise(n), lambda t: 400 + 5200 * (t / 0.32) ** 1.6, 2.2)
write("send", [a * env(i / RATE, 0.07, 14) for i, a in enumerate(air)])

# Received in an open chat: a soft, rounded pop with a quick upward glide.
n = int(0.22 * RATE)
write("receive", [
    env(t, 0.004, 26) * (math.sin(2 * math.pi * (620 * t + 2600 * t * t)) + 0.25 * math.sin(4 * math.pi * (620 * t + 2600 * t * t)))
    for t in (i / RATE for i in range(n))
])

# Keyboard: a short, crisp tock like the iPhone key click.
n = int(0.025 * RATE)
crisp = bandpass(noise(n), lambda t: 3200, 1.4)
write("tick", [0.8 * c * math.exp(-t * 420) + 0.5 * math.sin(2 * math.pi * 1150 * t) * math.exp(-t * 300) for c, t in zip(crisp, (i / RATE for i in range(n)))])

# Outro: a low thud for the hard cut.
n = int(0.9 * RATE)
write("thud", [0.9 * math.sin(2 * math.pi * (70 - 30 * t) * t) * math.exp(-4.5 * t) + 0.2 * random.uniform(-1, 1) * math.exp(-40 * t) for t in (i / RATE for i in range(n))])
