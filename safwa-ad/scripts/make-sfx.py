"""Synthesize the motion sound effects used in the ad (no music, no voice).

Run: python3 scripts/make-sfx.py  -> writes WAV files into public/sfx/
Everything is generated from noise and sine waves, so there are no
third-party licences involved.
"""

import os
import wave

import numpy as np

SR = 48000
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "sfx")
rng = np.random.default_rng(7)


def bandpass(x, f0, q):
    """Time-varying RBJ band-pass biquad. f0 is an array (Hz) per sample."""
    y = np.zeros_like(x)
    x1 = x2 = y1 = y2 = 0.0
    for i in range(len(x)):
        w = 2 * np.pi * f0[i] / SR
        alpha = np.sin(w) / (2 * q)
        b0, b2 = alpha, -alpha
        a0, a1, a2 = 1 + alpha, -2 * np.cos(w), 1 - alpha
        yi = (b0 * x[i] + b2 * x2 - a1 * y1 - a2 * y2) / a0
        x2, x1 = x1, x[i]
        y2, y1 = y1, yi
        y[i] = yi
    return y


def env(n, attack, release_curve=2.0):
    t = np.linspace(0, 1, n)
    a = np.clip(t / attack, 0, 1)
    r = np.clip((1 - t) / (1 - attack), 0, 1) ** release_curve
    return np.minimum(a, 1) * r


def whoosh(dur, f_from, f_to, attack=0.45, q=1.4, pan_from=-0.6, pan_to=0.6):
    n = int(dur * SR)
    noise = rng.standard_normal(n)
    t = np.linspace(0, 1, n)
    f = f_from * (f_to / f_from) ** (t**0.8)
    body = bandpass(noise, f, q) * env(n, attack, 2.2)
    air = bandpass(noise, f * 2.6, 2.5) * env(n, attack * 0.8, 3) * 0.35
    mono = body + air
    pan = pan_from + (pan_to - pan_from) * t
    return np.stack([mono * np.sqrt((1 - pan) / 2), mono * np.sqrt((1 + pan) / 2)], 1)


def pop(freq=520, dur=0.11):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = freq * (1 - 0.45 * t / dur)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 38)
    click = bandpass(rng.standard_normal(n), np.full(n, 3500.0), 3) * np.exp(-t * 400) * 0.25
    m = s + click
    return np.stack([m, m], 1)


def shimmer(dur=1.6, base=880):
    n = int(dur * SR)
    t = np.arange(n) / SR
    m = np.zeros(n)
    for k, (mult, amp, delay) in enumerate(
        [(1.0, 1.0, 0.0), (1.5, 0.7, 0.06), (2.0, 0.55, 0.12), (3.0, 0.3, 0.18)]
    ):
        tt = np.clip(t - delay, 0, None)
        on = (t >= delay).astype(float)
        m += amp * on * np.sin(2 * np.pi * base * mult * tt) * np.exp(-tt * 2.6) * np.clip(tt / 0.01, 0, 1)
    l = m * (1 + 0.15 * np.sin(2 * np.pi * 0.9 * t))
    r = m * (1 - 0.15 * np.sin(2 * np.pi * 0.9 * t))
    return np.stack([l, r], 1)


def thump(dur=0.45):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 95 * np.exp(-t * 5) + 45
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) * np.clip(t / 0.004, 0, 1)
    return np.stack([s, s], 1)


def riser(dur=1.3):
    w = whoosh(dur, 300, 3800, attack=0.92, q=2.2, pan_from=0, pan_to=0)
    return w


def normalize(x, peak_db):
    peak = np.max(np.abs(x))
    return x / peak * (10 ** (peak_db / 20))


def write(name, x, peak_db):
    x = normalize(x, peak_db)
    fade = int(0.004 * SR)
    x[:fade] *= np.linspace(0, 1, fade)[:, None]
    x[-fade:] *= np.linspace(1, 0, fade)[:, None]
    data = (np.clip(x, -1, 1) * 32767).astype("<i2")
    with wave.open(os.path.join(OUT, name), "wb") as f:
        f.setnchannels(2)
        f.setsampwidth(2)
        f.setframerate(SR)
        f.writeframes(data.tobytes())
    print(name, f"{len(x) / SR:.2f}s")


os.makedirs(OUT, exist_ok=True)
write("whoosh-long.wav", whoosh(1.1, 260, 2400, attack=0.5), -3)
write("whoosh-short.wav", whoosh(0.55, 400, 3200, attack=0.4, q=1.8, pan_from=0.5, pan_to=-0.5), -5)
write("swish.wav", whoosh(0.32, 900, 5200, attack=0.35, q=2.4, pan_from=-0.3, pan_to=0.3), -8)
write("pop.wav", pop(), -10)
write("pop-high.wav", pop(760, 0.09), -11)
write("shimmer.wav", shimmer(), -12)
write("thump.wav", thump(), -6)
write("riser.wav", riser(), -7)
