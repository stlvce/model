class SoundManager {
  private audioContext: AudioContext | null = null;
  private backgroundGain: GainNode | null = null;
  private effectGain: GainNode | null = null;
  private isEnabled: boolean = true;

  initialize() {
    if (this.audioContext) return;

    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.backgroundGain = this.audioContext.createGain();
    this.effectGain = this.audioContext.createGain();

    this.backgroundGain.connect(this.audioContext.destination);
    this.effectGain.connect(this.audioContext.destination);

    this.backgroundGain.gain.value = 0.3;
    this.effectGain.gain.value = 0.5;
  }

  playBackgroundAmbient() {
    if (!this.audioContext || !this.backgroundGain || !this.isEnabled) return;

    const oscillator = this.audioContext.createOscillator();
    const lfo = this.audioContext.createOscillator();
    const lfoGain = this.audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = 120;

    lfo.type = 'sine';
    lfo.frequency.value = 0.5;
    lfoGain.gain.value = 10;

    lfo.connect(lfoGain);
    lfoGain.connect(oscillator.frequency);
    oscillator.connect(this.backgroundGain);

    oscillator.start();
    lfo.start();

    setTimeout(() => {
      oscillator.stop();
      lfo.stop();
    }, 5000);
  }

  playClickSound() {
    if (!this.audioContext || !this.effectGain || !this.isEnabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.effectGain);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  playWaterFlow() {
    if (!this.audioContext || !this.effectGain || !this.isEnabled) return;

    const bufferSize = this.audioContext.sampleRate * 2;
    const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.audioContext.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;

    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = 0.1;

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.effectGain);

    noise.start();
    noise.stop(this.audioContext.currentTime + 2);
  }

  playBubbleSound() {
    if (!this.audioContext || !this.effectGain || !this.isEnabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.effectGain);

    oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.3);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (!enabled && this.audioContext) {
      this.audioContext.suspend();
    } else if (enabled && this.audioContext) {
      this.audioContext.resume();
    }
  }

  getEnabled() {
    return this.isEnabled;
  }
}

export const soundManager = new SoundManager();
