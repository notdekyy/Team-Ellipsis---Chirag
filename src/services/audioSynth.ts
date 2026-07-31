class AudioSynthService {
  private audioCtx: AudioContext | null = null;
  private sirenOscillator: OscillatorNode | null = null;
  private sirenGain: GainNode | null = null;
  private sirenInterval: any = null;
  private isSirenActive = false;

  private initContext() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public startSirenAlarm() {
    if (this.isSirenActive) return;
    this.initContext();
    if (!this.audioCtx) return;

    this.isSirenActive = true;
    try {
      this.sirenOscillator = this.audioCtx.createOscillator();
      this.sirenGain = this.audioCtx.createGain();

      this.sirenOscillator.type = 'sawtooth';
      this.sirenOscillator.frequency.setValueAtTime(800, this.audioCtx.currentTime);

      this.sirenGain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);

      this.sirenOscillator.connect(this.sirenGain);
      this.sirenGain.connect(this.audioCtx.destination);
      this.sirenOscillator.start();

      // Oscillate frequency between 700Hz and 1200Hz to simulate real emergency siren
      let high = false;
      this.sirenInterval = setInterval(() => {
        if (!this.audioCtx || !this.sirenOscillator || !this.isSirenActive) return;
        const now = this.audioCtx.currentTime;
        high = !high;
        this.sirenOscillator.frequency.exponentialRampToValueAtTime(high ? 1200 : 700, now + 0.3);
      }, 350);
    } catch (e) {
      console.warn('Audio Siren playback error:', e);
    }
  }

  public stopSirenAlarm() {
    this.isSirenActive = false;
    if (this.sirenInterval) {
      clearInterval(this.sirenInterval);
      this.sirenInterval = null;
    }
    if (this.sirenOscillator) {
      try {
        this.sirenOscillator.stop();
        this.sirenOscillator.disconnect();
      } catch (e) {}
      this.sirenOscillator = null;
    }
    if (this.sirenGain) {
      try {
        this.sirenGain.disconnect();
      } catch (e) {}
      this.sirenGain = null;
    }
  }

  public playCheckInPing() {
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, this.audioCtx.currentTime); // D5 note
      gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.5);
    } catch (e) {}
  }
}

export const audioSynth = new AudioSynthService();
