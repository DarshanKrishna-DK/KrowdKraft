'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import {
  emptyMembership,
  membershipPaths,
  occupations,
  submitMembership,
  type MembershipPath,
  type MembershipValues,
} from '@/lib/membership';

const copy: Record<MembershipPath, { label: string; description: string; submit: string }> = {
  general: {
    label: 'General member',
    description:
      'Be part of a 1.6K+ member developer community. Get updates on events and hackathons in and around Bengaluru, and on major hackathons and events across India.',
    submit: 'Submit and join',
  },
  amigos: {
    label: 'Amigos',
    description:
      'Amigos is the inner circle of KrowdKraft, for content creators and active members who want to grow: winning hackathons, getting mentored, building products, hosting, and solo entrepreneurship. The group stays useful through real conversation, not spam.',
    submit: 'Submit',
  },
  core: {
    label: 'Core team',
    description: 'Help build the KrowdKraft community by hosting events and activations.',
    submit: 'Submit',
  },
};

function OccupationField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const listId = useId();
  const labelId = useId();
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const selected = occupations.findIndex((occupation) => occupation === value);

  useEffect(() => {
    if (!open) return;
    function closeOnOutside(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('pointerdown', closeOnOutside);
    return () => document.removeEventListener('pointerdown', closeOnOutside);
  }, [open]);

  function choose(index: number) {
    onChange(occupations[index]);
    setOpen(false);
  }

  function move(key: string) {
    setOpen(true);
    setActive((current) => {
      const start = open ? current : Math.max(selected, 0);
      if (key === 'Home') return 0;
      if (key === 'End') return occupations.length - 1;
      const step = key === 'ArrowDown' ? 1 : -1;
      return (start + step + occupations.length) % occupations.length;
    });
  }

  return (
    <div className="form-field membership-occupation" ref={root}>
      <span id={labelId}>Occupation</span>
      <div className="membership-occupation-control">
      <button
        type="button"
        className={value ? 'membership-occupation-trigger' : 'membership-occupation-trigger is-empty'}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={labelId}
        onClick={() => {
          setActive(selected >= 0 ? selected : 0);
          setOpen((current) => !current);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            setOpen(false);
            return;
          }
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Home' || event.key === 'End') {
            event.preventDefault();
            move(event.key);
            return;
          }
          if ((event.key === 'Enter' || event.key === ' ') && open) {
            event.preventDefault();
            choose(active);
          }
        }}
      >
        <span>{value || 'Choose one'}</span>
        <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
          <path
            d="m5 7.5 5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <ul id={listId} className="membership-occupation-menu" role="listbox">
          {occupations.map((occupation, index) => (
            <li key={occupation} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={occupation === value}
                className={index === active ? 'is-active' : undefined}
                onMouseEnter={() => setActive(index)}
                onClick={() => choose(index)}
              >
                {occupation}
              </button>
            </li>
          ))}
        </ul>
      )}
      </div>
    </div>
  );
}

export function JoinCommunity({ whatsapp }: { whatsapp: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [path, setPath] = useState<MembershipPath>('general');
  const [values, setValues] = useState<MembershipValues>(emptyMembership);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);

  function close() {
    setOpen(false);
    setError('');
    setDone(false);
    setPending(false);
  }

  function update<K extends keyof MembershipValues>(key: K, value: MembershipValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setPending(true);
    try {
      await submitMembership(path, values);
      if (path === 'general') {
        window.location.assign(whatsapp);
        return;
      }
      setDone(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Something went wrong. Try again.');
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button type="button" className="button header-join" onClick={() => setOpen(true)}>
        Be a Krafter
      </button>
      <dialog
        ref={dialog}
        className="membership-dialog"
        aria-labelledby={titleId}
        onClose={close}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <h2 id={titleId}>Be a Krafter</h2>
        <div className="membership-paths" role="tablist" aria-label="Ways to join">
          {membershipPaths.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={path === item}
              onClick={() => {
                setPath(item);
                setError('');
                setDone(false);
              }}
            >
              {copy[item].label}
            </button>
          ))}
        </div>
        {done ? (
          <p className="form-message success" role="status">
            Received. We’ll read your application and write back.
          </p>
        ) : (
          <form onSubmit={submit}>
            <p>{copy[path].description}</p>
            <div className="form-grid">
              <label className="form-field">
                Full name
                <input
                  name="fullName"
                  autoComplete="name"
                  required
                  value={values.fullName}
                  onChange={(event) => update('fullName', event.target.value)}
                />
              </label>
              <label className="form-field">
                Email
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={values.email}
                  onChange={(event) => update('email', event.target.value)}
                />
              </label>
              <OccupationField value={values.occupation} onChange={(occupation) => update('occupation', occupation)} />
              <label className="form-field">
                University or company
                <input
                  name="organization"
                  required
                  value={values.organization}
                  onChange={(event) => update('organization', event.target.value)}
                />
              </label>
              {path !== 'general' && (
                <>
                  <label className="form-field">
                    LinkedIn
                    <input
                      name="linkedin"
                      type="url"
                      required
                      placeholder="https://"
                      value={values.linkedin}
                      onChange={(event) => update('linkedin', event.target.value)}
                    />
                  </label>
                  <label className="form-field">
                    GitHub
                    <input
                      name="github"
                      type="url"
                      required
                      placeholder="https://"
                      value={values.github}
                      onChange={(event) => update('github', event.target.value)}
                    />
                  </label>
                  <label className="form-field membership-span">
                    Video link
                    <input
                      name="video"
                      type="url"
                      required
                      placeholder="https://"
                      value={values.video}
                      onChange={(event) => update('video', event.target.value)}
                    />
                    <small>
                      {path === 'amigos'
                        ? 'A public 2–3 minute video on why you want to join Amigos. YouTube, including unlisted, or Google Drive is fine.'
                        : 'A public 2–3 minute video on why you want to join the core team, and any experience you already have.'}
                    </small>
                  </label>
                </>
              )}
            </div>
            {path === 'amigos' && (
              <div className="checkbox-stack">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={values.activeConversation}
                    onChange={(event) => update('activeConversation', event.target.checked)}
                  />
                  I agree to be active in the conversations in this group.
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={values.ownGoal}
                    onChange={(event) => update('ownGoal', event.target.checked)}
                  />
                  I will stay active in pursuing my own goal.
                </label>
              </div>
            )}
            {path === 'core' && (
              <div className="checkbox-stack">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={values.coreContribution}
                    onChange={(event) => update('coreContribution', event.target.checked)}
                  />
                  I will stay active in contributing to the KrowdKraft community and its activations.
                </label>
              </div>
            )}
            {error && (
              <p className="form-message" role="alert">
                {error}
              </p>
            )}
            <button className="button" type="submit" disabled={pending}>
              {pending ? 'Sending…' : copy[path].submit}
            </button>
          </form>
        )}
      </dialog>
    </>
  );
}
