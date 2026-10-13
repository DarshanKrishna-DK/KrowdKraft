// Browsers require a user gesture before audio. No remote media or microphone.
export class DuckSound {
  private context: AudioContext | null = null;
  private enabled = false;
  private generation = 0;
  private lastQuack = -Infinity;
  get isEnabled() {
    return this.enabled;
  }
  async enable(): Promise<boolean> {
    const ticket = ++this.generation;
    try {
      this.enabled = true;
      const context = this.context ?? new AudioContext();
      this.context = context;
      await context.resume();
      if (
        ticket !== this.generation ||
        !this.enabled ||
        this.context !== context
      )
        return false;
      return true;
    } catch {
      if (ticket === this.generation) this.disable();
      return false;
    }
  }
  disable() {
    this.generation++;
    this.enabled = false;
    const context = this.context;
    this.context = null;
    if (context && context.state !== "closed")
      void context.close().catch(() => {});
  }
  quack(celebrate = false) {
    const context = this.context;
    if (!this.enabled || !context || context.state !== "running") return;
    if (context.currentTime - this.lastQuack < 1.2 || document.hidden) return;
    this.lastQuack = context.currentTime;
    for (let index = 0; index < (celebrate ? 2 : 1); index++) {
      const start = context.currentTime + index * 0.16;
      const source = context.createOscillator(),
        filter = context.createBiquadFilter(),
        gain = context.createGain();
      source.type = "sawtooth";
      source.frequency.setValueAtTime(620 + index * 100, start);
      source.frequency.exponentialRampToValueAtTime(310, start + 0.12);
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1050, start);
      filter.Q.value = 3.5;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.055, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.14);
      source.connect(filter).connect(gain).connect(context.destination);
      source.onended = () => {
        source.disconnect();
        filter.disconnect();
        gain.disconnect();
      };
      source.start(start);
      source.stop(start + 0.15);
    }
  }
}
