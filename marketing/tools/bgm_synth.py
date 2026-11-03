# 직접 합성한 저작권 없는 배경음악 (C-G-Am-F, 108 BPM, 45초)
import numpy as np, wave
SR=44100; BPM=108; beat=60/BPM; DUR=45.2
N=int(SR*DUR); out=np.zeros((N,2))
def note(f): return 440*2**((f-69)/12)
chords=[[48,52,55,59,64],[43,50,55,59,62],[45,52,57,60,64],[41,48,53,57,64]]  # Cmaj7, G, Am, Fmaj7
bass=[36,43,45,41]
def add(sig,start,pan=0.5,gain=1.0):
    i=int(start*SR); j=min(N,i+len(sig))
    if i>=N: return
    s=sig[:j-i]*gain; out[i:j,0]+=s*(1-pan); out[i:j,1]+=s*pan
def env(n,a,r):
    e=np.ones(n); A=int(a*SR); R=int(r*SR)
    e[:A]=np.linspace(0,1,A); e[-R:]*=np.linspace(1,0,R); return e
def pad(freqs,d):
    t=np.arange(int(d*SR))/SR; s=np.zeros_like(t)
    for f in freqs:
        for det in (-0.12,0,0.12):
            ff=f*2**(det/12); s+=np.sin(2*np.pi*ff*t)+0.25*np.sin(4*np.pi*ff*t)
    return s/len(freqs)/3*env(len(t),0.4,0.6)
def pluck(f,d=0.35):
    t=np.arange(int(d*SR))/SR
    return (np.sin(2*np.pi*f*t)+0.4*np.sin(4*np.pi*f*t)+0.15*np.sin(6*np.pi*f*t))*np.exp(-t*9)
def bassn(f,d):
    t=np.arange(int(d*SR))/SR
    return (np.sin(2*np.pi*f*t)+0.3*np.sin(4*np.pi*f*t))*env(len(t),0.01,0.08)
def kick():
    t=np.arange(int(0.3*SR))/SR; f=50+90*np.exp(-t*30)
    return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*10)
rng=np.random.default_rng(1)
def hat():
    n=int(0.06*SR); s=rng.standard_normal(n); s=np.diff(s,prepend=0)
    return s*np.exp(-np.arange(n)/SR*60)
def clap():
    n=int(0.15*SR); s=rng.standard_normal(n); s=np.diff(s,prepend=0)
    return s*np.exp(-np.arange(n)/SR*25)
bar=4*beat; nbars=int(DUR/bar)+1
arp_pat=[0,2,4,3,1,3,4,2]
for b in range(nbars):
    t0=b*bar; c=b%4; ch=chords[c]; fr=[note(m+12) for m in ch[:4]]
    add(pad(fr,bar+0.3),t0,0.5,0.22)
    for k in range(4):
        add(bassn(note(bass[c]),beat*0.9),t0+k*beat,0.5,0.32)
    intro = b<2
    for k in range(8):
        m=ch[arp_pat[k]%len(ch)]+24
        add(pluck(note(m)),t0+k*beat/2,0.3+0.4*(k%2),0.10 if intro else 0.13)
    if not intro:
        for k in range(4): add(kick(),t0+k*beat,0.5,0.55)
        for k in (1,3): add(clap(),t0+k*beat,0.5,0.10)
        for k in range(8): add(hat(),t0+k*beat/2+beat/4*0,0.65,0.05 if k%2==0 else 0.08)
# fade
fo=int(3*SR); out[-fo:]*=np.linspace(1,0,fo)[:,None]; fi=int(0.3*SR); out[:fi]*=np.linspace(0,1,fi)[:,None]
out/=np.abs(out).max()*1.12
with wave.open('bgm.wav','wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out*32767).astype('<i2').tobytes())
print('ok')
