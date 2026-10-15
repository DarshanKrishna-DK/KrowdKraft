'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { Icon } from '../icon';
import type { EventRecord } from '@/lib/types';
import { dateLabel, googleCalendarUrl, timeLabel } from '@/lib/events';
import { useLoopingFigure } from './use-looping-figure';

function printTickets(root: HTMLDivElement) {
  const paper = root.querySelector<SVGGElement>('[data-printer-paper]');
  if (!paper) return [];
  const x = Number(paper.dataset.feedX),
    y = Number(paper.dataset.feedY);
  const position = (distance: number) => `translate(${x * distance}px, ${y * distance}px)`;
  return [
    paper.animate(
      [
        { transform: position(-7), opacity: 0, offset: 0 },
        { transform: position(-7), opacity: 1, offset: 0.05 },
        { transform: position(-5.7), opacity: 1, offset: 0.17 },
        { transform: position(0), opacity: 1, offset: 0.65, easing: 'ease-in-out' },
        { transform: position(0), opacity: 1, offset: 0.76 },
        { transform: position(3.6), opacity: 0, offset: 0.94 },
        { transform: position(-7), opacity: 0, offset: 1 },
      ],
      { duration: 6200, iterations: Infinity, easing: 'linear' },
    ),
  ];
}

export function Printer({ children, event }: { children: React.ReactNode; event?: EventRecord }) {
  const root = useRef<HTMLDivElement>(null),
    card = useRef<HTMLDivElement>(null),
    trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const cardId = useId();
  useLoopingFigure(root, printTickets);
  useEffect(() => {
    if (!open) return;
    const slip = card.current;
    if (slip) {
      slip.focus({ preventScroll: true });
      // Use layout coordinates: the print animation temporarily translates the card.
      const top = (root.current?.getBoundingClientRect().top || 0) + slip.offsetTop;
      const bottom = top + slip.offsetHeight;
      const clearance = (document.querySelector('.site-header')?.getBoundingClientRect().bottom || 0) + 16;
      if (top < clearance) window.scrollBy({ top: top - clearance, behavior: 'instant' });
      else if (bottom > window.innerHeight - 24)
        window.scrollBy({ top: bottom - window.innerHeight + 24, behavior: 'instant' });
    }
    const outside = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [open]);
  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };
  return (
    <div
      ref={root}
      className={'printer-figure' + (open ? ' is-printing' : '')}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          close();
        }
      }}
    >
      {children}
      {event && (
        <>
          {open && (
            <div
              className="calendar-slip"
              id={cardId}
              ref={card}
              role="region"
              aria-label="Calendar options"
              tabIndex={-1}
            >
              <div className="slip-top">
                <Icon name="calendar" size={18} />
                <span>Save your place in time</span>
                <button onClick={close} className="icon-button" aria-label="Close calendar options">
                  <Icon name="close" size={16} />
                </button>
              </div>
              <h3>{event.title}</h3>
              <p>
                {dateLabel(event.date)}
                {event.starts_at && (
                  <>
                    <br />
                    {timeLabel(event.starts_at)} IST
                  </>
                )}
              </p>
              <p>{event.venue}</p>
              <a href={googleCalendarUrl(event)} target="_blank" rel="noreferrer" className="button">
                Google Calendar
                <Icon name="diagonal" size={17} />
              </a>
              <a href={'/events/' + event.slug + '/calendar'} className="button">
                Apple / Outlook (.ics)
                <Icon name="diagonal" size={17} />
              </a>
            </div>
          )}
          <button
            ref={trigger}
            className="button calendar-trigger"
            aria-expanded={open}
            aria-controls={open ? cardId : undefined}
            onClick={() => {
              if (open) {
                close();
                return;
              }
              setOpen(true);
            }}
          >
            <Icon name="calendar" size={16} />
            Add to calendar
          </button>
        </>
      )}
    </div>
  );
}
