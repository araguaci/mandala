/**
 * Motor de Áudio Solfeggio via Web Audio API.
 * Gera tons puros + sub-harmônico + batimento binaural suave, sem dependências externas.
 */

export class SolfeggioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.leftOsc = null;
    this.rightOsc = null;
    this.subOsc = null;
    this.lfo = null;
    this.isPlaying = false;
    this.frequency = 639;
    this.volume = 0.25;
    this.binauralOffset = 4; // 4 Hz (onda Theta suave)
  }

  _ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  start(freq = this.frequency, volume = this.volume) {
    this._ensureContext();
    this.frequency = freq;
    this.volume = volume;

    if (this.isPlaying) {
      this.setFrequency(freq);
      this.setVolume(volume);
      return;
    }

    const now = this.ctx.currentTime;

    const master = this.ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(Math.max(0.001, this.volume * 0.35), now + 1.2);
    master.connect(this.ctx.destination);

    // Canal esquerdo (frequência base)
    const leftOsc = this.ctx.createOscillator();
    const leftPan = this.ctx.createStereoPanner();
    leftOsc.type = 'sine';
    leftOsc.frequency.setValueAtTime(this.frequency, now);
    leftPan.pan.setValueAtTime(-0.5, now);
    leftOsc.connect(leftPan).connect(master);

    // Canal direito (batimento binaural sutil de 4Hz para relaxamento)
    const rightOsc = this.ctx.createOscillator();
    const rightPan = this.ctx.createStereoPanner();
    rightOsc.type = 'sine';
    rightOsc.frequency.setValueAtTime(this.frequency + this.binauralOffset, now);
    rightPan.pan.setValueAtTime(0.5, now);
    rightOsc.connect(rightPan).connect(master);

    // Sub-harmônico suave (uma oitava abaixo, bem baixo) para calor sonoro
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(this.frequency / 2, now);
    subGain.gain.setValueAtTime(0.22, now);
    subOsc.connect(subGain).connect(master);

    // Modulação lenta de respiração (LFO ~0.12 Hz = ciclo ~8s)
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.12, now);
    lfoGain.gain.setValueAtTime(0.04, now);
    lfo.connect(lfoGain).connect(master.gain);

    leftOsc.start(now);
    rightOsc.start(now);
    subOsc.start(now);
    lfo.start(now);

    this.masterGain = master;
    this.leftOsc = leftOsc;
    this.rightOsc = rightOsc;
    this.subOsc = subOsc;
    this.lfo = lfo;
    this.isPlaying = true;
  }

  stop() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const gain = this.masterGain;
    const nodes = [this.leftOsc, this.rightOsc, this.subOsc, this.lfo];

    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(Math.max(0.0001, gain.gain.value), now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

    setTimeout(() => {
      nodes.forEach((n) => {
        try {
          n?.stop();
          n?.disconnect();
        } catch {
          // already stopped
        }
      });
      try {
        gain.disconnect();
      } catch {
        // ignore
      }
    }, 650);

    this.masterGain = null;
    this.leftOsc = null;
    this.rightOsc = null;
    this.subOsc = null;
    this.lfo = null;
    this.isPlaying = false;
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    }
    this.start();
    return true;
  }

  setFrequency(freq) {
    this.frequency = freq;
    if (!this.isPlaying || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.leftOsc?.frequency.exponentialRampToValueAtTime(freq, now + 0.8);
    this.rightOsc?.frequency.exponentialRampToValueAtTime(freq + this.binauralOffset, now + 0.8);
    this.subOsc?.frequency.exponentialRampToValueAtTime(freq / 2, now + 0.8);
  }

  setVolume(vol) {
    this.volume = Math.min(1, Math.max(0, vol));
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setTargetAtTime(Math.max(0.0001, this.volume * 0.35), now, 0.12);
  }

  /** Sino meditativo suave ao encerrar o timer */
  playBell() {
    this._ensureContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const overtone = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(528, now);
    overtone.type = 'sine';
    overtone.frequency.setValueAtTime(528 * 2.756, now);

    const overtoneGain = this.ctx.createGain();
    overtoneGain.gain.setValueAtTime(0.18, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.28, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

    osc.connect(gain);
    overtone.connect(overtoneGain).connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    overtone.start(now);
    osc.stop(now + 4.6);
    overtone.stop(now + 4.6);
  }
}
