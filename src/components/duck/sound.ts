// Audio is created only after an explicit sound-button gesture. No remote media or microphone.
export class DuckSound {
  private context: AudioContext | null = null;
  private enabled = false;
  async enable(): Promise<boolean> {
    try {
      this.enabled = true;
      const context = this.context ?? new AudioContext(); this.context = context;
      await context.resume();
      if (!this.enabled || this.context !== context) return false;
      this.quack(); return true;
    } catch { this.disable(); return false; }
  }
  disable() { this.enabled = false; const context = this.context; this.context = null; if (context && context.state !== "closed") void context.close().catch(() => {}); }
  quack(celebrate = false) {
    const context = this.context;
    if (!this.enabled || !context || context.state !== "running") return;
    for (let index = 0; index < (celebrate ? 2 : 1); index++) {
      const start = context.currentTime + index * .16;
      const source = context.createOscillator(), filter = context.createBiquadFilter(), gain = context.createGain();
      source.type = "sawtooth"; source.frequency.setValueAtTime(620 + index * 100, start); source.frequency.exponentialRampToValueAtTime(310, start + .12);
      filter.type = "bandpass"; filter.frequency.setValueAtTime(1050, start); filter.Q.value = 3.5;
      gain.gain.setValueAtTime(0, start); gain.gain.linearRampToValueAtTime(.055, start + .012); gain.gain.exponentialRampToValueAtTime(.001, start + .14);
      source.connect(filter).connect(gain).connect(context.destination);
      source.onended = () => { source.disconnect(); filter.disconnect(); gain.disconnect(); };
      source.start(start); source.stop(start + .15);
    }
  }
}
