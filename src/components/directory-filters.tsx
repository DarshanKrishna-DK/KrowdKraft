'use client';

import { useEffect, useId, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from './icon';

type Option = { value: string; label: string };
type EventFiltersValue = { q: string; when: string; type: string; year: string };

function DirectorySelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
}) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState({ side: 'bottom', height: 300 });
  const selected = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const [active, setActive] = useState(selected);
  const typed = useRef({ text: '', at: 0 });

  useEffect(() => {
    if (!open) return;
    function place() {
      const bounds = root.current?.getBoundingClientRect();
      if (!bounds) return;
      const below = window.innerHeight - bounds.bottom - 16;
      const above = bounds.top - 16;
      const side = below < 220 && above > below ? 'top' : 'bottom';
      setPlacement({ side, height: Math.min(300, Math.max(100, side === 'top' ? above : below)) });
    }
    function outside(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    place();
    document.addEventListener('pointerdown', outside);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, { passive: true });
    return () => {
      document.removeEventListener('pointerdown', outside);
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place);
    };
  }, [open]);

  useEffect(() => {
    const option = document.getElementById(`${id}-option-${active}`);
    const menu = list.current;
    if (!open || !option || !menu) return;
    // Scroll only the option list; opening a filter must not shift the page.
    if (option.offsetTop < menu.scrollTop) menu.scrollTop = option.offsetTop;
    else if (option.offsetTop + option.offsetHeight > menu.scrollTop + menu.clientHeight) {
      menu.scrollTop = option.offsetTop + option.offsetHeight - menu.clientHeight;
    }
  }, [active, id, open]);

  function choose(index: number) {
    onChange(options[index].value);
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  }

  return (
    <div
      className="directory-select"
      ref={root}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <label id={`${id}-label`} htmlFor={id}>
        {label}
      </label>
      <button
        ref={trigger}
        id={id}
        type="button"
        className="directory-select-trigger"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-labelledby={`${id}-label ${id}-value`}
        aria-activedescendant={open ? `${id}-option-${active}` : undefined}
        onClick={() => {
          setActive(selected);
          setOpen(!open);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            setOpen(false);
            return;
          }
          if (event.key === 'Tab') {
            setOpen(false);
            return;
          }
          if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
            event.preventDefault();
            setOpen(true);
            setActive((current) => {
              if (event.key === 'Home') return 0;
              if (event.key === 'End') return options.length - 1;
              if (!open) return selected;
              return (current + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
            });
          } else if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            if (open) choose(active);
            else {
              setActive(selected);
              setOpen(true);
            }
          } else if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
            const now = Date.now();
            typed.current = {
              text: now - typed.current.at > 700 ? event.key : typed.current.text + event.key,
              at: now,
            };
            const match = options.findIndex((option) =>
              option.label.toLowerCase().startsWith(typed.current.text.toLowerCase()),
            );
            if (match !== -1) {
              setActive(match);
              setOpen(true);
            }
          }
        }}
      >
        <span id={`${id}-value`}>{options[selected].label}</span>
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true">
          <path
            d="m5 7.5 5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <ul
          ref={list}
          className="directory-select-options"
          data-side={placement.side}
          style={{ maxHeight: placement.height }}
          id={`${id}-list`}
          role="listbox"
          aria-labelledby={`${id}-label`}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`${id}-option-${index}`}
              role="option"
              aria-selected={index === selected}
              className={index === active ? 'is-active' : ''}
              onPointerMove={() => setActive(index)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(index)}
            >
              <span>{option.label}</span>
              {index === selected && <Icon name="check" size={15} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function EventFilters({ value, years }: { value: EventFiltersValue; years: string[] }) {
  const router = useRouter();
  const [filters, setFilters] = useState(value);
  const latest = useRef(value);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requested = useRef<string | null>(null);
  const typing = useRef(false);
  const [waiting, setWaiting] = useState(false);
  const [pending, startTransition] = useTransition();
  const hasFilters = !!(filters.q || filters.type || filters.year || filters.when !== 'all');

  useEffect(() => {
    const incoming = JSON.stringify(value);
    if (requested.current && requested.current !== incoming) return;
    requested.current = null;
    if (typing.current) return;
    setFilters(value);
    latest.current = value;
  }, [value.q, value.when, value.type, value.year]); // URL back/forward keeps the controls in sync.
  useEffect(() => {
    function restoreHistory() {
      requested.current = null;
      typing.current = false;
      if (timer.current) clearTimeout(timer.current);
      setWaiting(false);
    }
    window.addEventListener('popstate', restoreHistory);
    return () => {
      if (timer.current) clearTimeout(timer.current);
      window.removeEventListener('popstate', restoreHistory);
    };
  }, []);

  function navigate(next: EventFiltersValue, replace = false) {
    if (timer.current) clearTimeout(timer.current);
    typing.current = false;
    setWaiting(false);
    requested.current = JSON.stringify({ ...next, q: next.q.trim() });
    const query = new URLSearchParams();
    if (next.q.trim()) query.set('q', next.q.trim());
    if (next.when !== 'all') query.set('when', next.when);
    if (next.type) query.set('type', next.type);
    if (next.year) query.set('year', next.year);
    const href = '/events' + (query.size ? `?${query}` : '');
    startTransition(() =>
      replace ? router.replace(href, { scroll: false }) : router.push(href, { scroll: false }),
    );
  }
  function change(key: keyof EventFiltersValue, selected: string) {
    const next = { ...latest.current, [key]: selected };
    latest.current = next;
    setFilters(next);
    if (key === 'q') {
      if (timer.current) clearTimeout(timer.current);
      typing.current = true;
      setWaiting(true);
      timer.current = setTimeout(() => navigate(latest.current, true), 350);
    } else navigate(next);
  }

  return (
    <form
      className="directory-filter-panel"
      aria-label="Filter events"
      onSubmit={(event) => {
        event.preventDefault();
        navigate(latest.current, true);
      }}
    >
      <div className="directory-filters">
        <label className="directory-search">
          Search events
          <span>
            <svg viewBox="0 0 24 24" width="19" height="19" fill="none" aria-hidden="true">
              <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              aria-controls="directory-event-results"
              type="search"
              name="q"
              value={filters.q}
              placeholder="An event, topic or venue"
              maxLength={120}
              onChange={(event) => change('q', event.target.value)}
            />
          </span>
        </label>
        <DirectorySelect
          label="When"
          value={filters.when}
          onChange={(next) => change('when', next)}
          options={[
            { value: 'all', label: 'Any time' },
            { value: 'upcoming', label: 'Upcoming' },
            { value: 'past', label: 'Past events' },
          ]}
        />
        <DirectorySelect
          label="Format"
          value={filters.type}
          onChange={(next) => change('type', next)}
          options={[
            { value: '', label: 'Every format' },
            { value: 'hackathon', label: 'Hackathons' },
            { value: 'workshop', label: 'Workshops' },
            { value: 'meetup', label: 'Meetups' },
            { value: 'technical-session', label: 'Technical sessions' },
          ]}
        />
        <DirectorySelect
          label="Year"
          value={filters.year}
          onChange={(next) => change('year', next)}
          options={[
            { value: '', label: 'All years' },
            ...years.map((year) => ({ value: year, label: year })),
          ]}
        />
      </div>
      <div className="directory-filter-status">
        <span role="status" aria-live="polite">
          {pending || waiting
            ? 'Updating events…'
            : hasFilters
              ? 'Showing your selection'
              : 'Browse the complete event archive'}
        </span>
        {hasFilters && (
          <button
            className="button directory-clear"
            type="button"
            onClick={() => {
              const reset = { q: '', when: 'all', type: '', year: '' };
              latest.current = reset;
              setFilters(reset);
              navigate(reset);
            }}
          >
            Clear filters <Icon name="close" size={13} />
          </button>
        )}
      </div>
    </form>
  );
}

export function LeaderboardMonth({ month, current }: { month: string; current: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [selected, setSelected] = useState(month);
  useEffect(() => setSelected(month), [month]);
  const [year, number] = selected.split('-');
  const years = Array.from({ length: Number(current.slice(0, 4)) - 1999 }, (_, index) =>
    String(Number(current.slice(0, 4)) - index),
  );
  const limit = year === current.slice(0, 4) ? Number(current.slice(5, 7)) : 12;
  const months = Array.from({ length: limit }, (_, index) => ({
    value: String(index + 1).padStart(2, '0'),
    label: new Intl.DateTimeFormat('en', { month: 'long', timeZone: 'UTC' }).format(
      new Date(Date.UTC(2000, index, 1)),
    ),
  }));
  function change(nextYear: string, nextMonth: string) {
    const next = `${nextYear}-${nextMonth}` > current ? current : `${nextYear}-${nextMonth}`;
    setSelected(next);
    startTransition(() => router.push(`/leaderboard?month=${next}`, { scroll: false }));
  }
  return (
    <div className="directory-month-picker" aria-label="Choose leaderboard month">
      <DirectorySelect
        label="Month"
        value={number}
        options={months}
        onChange={(next) => change(year, next)}
      />
      <DirectorySelect
        label="Year"
        value={year}
        options={years.map((value) => ({ value, label: value }))}
        onChange={(next) => change(next, number)}
      />
      <span className="directory-month-status" role="status">
        {pending ? 'Updating…' : ''}
      </span>
    </div>
  );
}
