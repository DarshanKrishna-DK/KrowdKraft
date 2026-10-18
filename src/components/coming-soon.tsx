'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { comingSoonTarget } from '@/lib/coming-soon';

export function ComingSoon() {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest('a');
      if (!anchor) return;
      const raw = anchor.getAttribute('href');
      if (!raw) return;
      let destination: URL;
      try {
        destination = new URL(raw, window.location.href);
      } catch {
        return;
      }
      if (!comingSoonTarget(window.location.pathname, destination, window.location.origin)) return;
      event.preventDefault();
      event.stopPropagation();
      setOpen(true);
    }
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);

  return (
    <dialog
      ref={dialog}
      className="coming-soon-dialog"
      aria-labelledby={titleId}
      onClose={() => setOpen(false)}
      onClick={(event) => {
        if (event.target === event.currentTarget) setOpen(false);
      }}
    >
      <h2 id={titleId} tabIndex={-1}>
        Coming soon
      </h2>
      <p>Projects and the leaderboard will open here shortly.</p>
      <button type="button" className="button" onClick={() => setOpen(false)}>
        Got it
      </button>
    </dialog>
  );
}
