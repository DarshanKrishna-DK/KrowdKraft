'use client';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/icon';
export function PinField() {
  const host = useRef<HTMLDivElement>(null),
    status = useRef<HTMLSpanElement>(null);
  const controller = useRef<{ set(value: number): void; play(): void; stop(): void } | null>(null);
  const [ready, setReady] = useState(false),
    [playing, setPlaying] = useState(false);
  useEffect(() => {
    let cancelled = false,
      dispose = () => {};
    import('./pin-field.generated.mjs')
      .then(({ HL, definition }) => {
        if (cancelled || !host.current) return;
        HL.inject(document);
        const stage = host.current,
          svg = HL.mk('svg', { viewBox: '0 0 400 320', 'aria-hidden': 'true' }, stage);
        let tour: { stop(): void } | null = null;
        const read = {
          get textContent() {
            return status.current?.textContent || 'rest';
          },
          set textContent(value: string) {
            if (status.current) status.current.textContent = value;
          },
        };
        const figure = definition.mount({ stage, svg, read }, 2.7);
        const stop = () => {
          tour?.stop();
          tour = null;
          setPlaying(false);
        };
        controller.current = {
          set: figure.set,
          play: () => {
            tour?.stop();
            tour = HL.tour(stage, definition.tour);
            setPlaying(true);
          },
          stop,
        };
        stage.addEventListener('pointerdown', stop);
        dispose = () => {
          tour?.stop();
          figure.destroy();
          stage.removeEventListener('pointerdown', stop);
          controller.current = null;
        };
        setReady(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      dispose();
    };
  }, []);
  return (
    <div className="pin-field">
      <div className="pin-field-read">
        <span>02 / Pin field</span>
        <span ref={status}>rest</span>
      </div>
      <div
        ref={host}
        data-hairline="pin-field"
        role="img"
        aria-label="A sculpted bed of pins. Move across it to raise the surface."
      />
      {!ready && <p className="pin-field-fallback">An interactive surface study</p>}
      <div className="pin-field-controls">
        <label htmlFor="pin-reach">Reach</label>
        <input
          id="pin-reach"
          type="range"
          min="1.5"
          max="4.5"
          step="0.1"
          defaultValue="2.7"
          disabled={!ready}
          onChange={(e) => controller.current?.set(Number(e.target.value))}
        />
        <button
          className="icon-button"
          disabled={!ready}
          aria-label={playing ? 'Pause pin field' : 'Play pin field'}
          aria-pressed={playing}
          onClick={() => (playing ? controller.current?.stop() : controller.current?.play())}
        >
          <Icon name={playing ? 'pause' : 'play'} size={16} />
        </button>
      </div>
    </div>
  );
}
