'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from './icon';

/** The intercepted route owns navigation; the native dialog owns focus and modality. */
export function ProjectDialog({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const closing = useRef(false);
  const backdropPointer = useRef(false);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const opener =
      document.querySelector<HTMLElement>('[data-project-dialog-opener]') ||
      (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closing.current = false;
    if (!element.open) element.showModal();
    title.current?.focus({ preventScroll: true });
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      // Run after the router's focus handling. Retain the marker for browser Forward reopening.
      requestAnimationFrame(() => {
        if (opener?.isConnected && !document.querySelector('dialog[open]')) {
          opener.focus({ preventScroll: true });
        }
      });
    };
  }, []);

  function dismiss() {
    if (closing.current) return;
    closing.current = true;
    router.back();
  }

  function outside(event: React.PointerEvent<HTMLDialogElement> | React.MouseEvent<HTMLDialogElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return (
      event.target === event.currentTarget &&
      (event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom)
    );
  }

  return (
    <dialog
      ref={dialog}
      className="project-dialog"
      aria-labelledby="project-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        dismiss();
      }}
      onPointerDown={(event) => {
        backdropPointer.current = outside(event);
      }}
      onClick={(event) => {
        if (backdropPointer.current && outside(event)) dismiss();
        backdropPointer.current = false;
      }}
    >
      <header className="project-dialog-bar">
        <span className="project-dialog-emblem" aria-hidden="true">
          <Icon name="code" size={22} />
        </span>
        <h2 id="project-dialog-title" ref={title} tabIndex={-1}>
          Share your project
        </h2>
        <button type="button" className="icon-button" onClick={dismiss} aria-label="Close project popup">
          <Icon name="close" />
        </button>
      </header>
      <div className="project-dialog-body">{children}</div>
    </dialog>
  );
}
