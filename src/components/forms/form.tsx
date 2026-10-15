'use client';
import { createContext, useActionState, useContext, useEffect, useId, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Icon } from '@/components/icon';
import type { ActionResult } from '@/lib/types';
const Errors = createContext<Record<string, string[]>>({});
export function ActionForm({
  action,
  children,
  once = false,
  className = '',
  successLink,
  successAction,
  focusOnMount = false,
}: {
  action: (state: ActionResult, data: FormData) => Promise<ActionResult>;
  children: React.ReactNode;
  once?: boolean;
  className?: string;
  successLink?: { href: string; label: string };
  successAction?: { label: string; onClick: () => void };
  focusOnMount?: boolean;
}) {
  const [state, submit, pending] = useActionState(action, { ok: false, message: '' });
  const message = useRef<HTMLDivElement>(null);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (focusOnMount) form.current?.querySelector<HTMLInputElement>('input:not([type="hidden"])')?.focus();
  }, [focusOnMount]);
  useEffect(() => {
    if (state.message) message.current?.focus();
  }, [state]);
  return (
    <form ref={form} action={submit} className={className}>
      <Errors.Provider value={state.fieldErrors || {}}>
        <fieldset disabled={pending} aria-busy={pending} hidden={once && state.ok}>
          {children}
        </fieldset>
      </Errors.Provider>
      {state.message && (
        <div
          ref={message}
          tabIndex={-1}
          role={state.ok ? 'status' : 'alert'}
          className={`form-message ${state.ok ? 'success' : ''}`}
        >
          {state.message}
          {state.ok && successLink && (
            <p>
              <a className="text-link" href={successLink.href}>
                {successLink.label} <Icon name="arrow" size={16} />
              </a>
            </p>
          )}
          {state.ok && successAction && (
            <p>
              <button className="text-link" type="button" onClick={successAction.onClick}>
                {successAction.label}
                <Icon name="plus" size={16} />
              </button>
            </p>
          )}
        </div>
      )}
    </form>
  );
}
export function Field({
  label,
  name,
  value = '',
  help,
  multiline = false,
  options,
  required = false,
  maxLength,
  minLength,
  type = 'text',
  readOnly = false,
  rows = 5,
  placeholder,
  autoComplete,
}: {
  label: string;
  name: string;
  value?: string | null;
  help?: string;
  multiline?: boolean;
  options?: { value: string; label: string }[];
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  type?: string;
  readOnly?: boolean;
  rows?: number;
  placeholder?: string;
  autoComplete?: string;
}) {
  const id = useId(),
    errors = useContext(Errors)[name],
    [content, setContent] = useState(value || '');
  useEffect(() => {
    setContent(value || '');
  }, [value]);
  const common = {
    id,
    name,
    required,
    value: content,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setContent(e.target.value),
    'aria-invalid': !!errors,
    'aria-describedby': `${help ? id + '-help ' : ''}${errors ? id + '-error' : ''}`.trim() || undefined,
  };
  return (
    <div className="form-field">
      <label htmlFor={id}>
        {label}
        {!required && !readOnly && <span className="optional-label"> (optional)</span>}
      </label>
      {options ? (
        <select {...common}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : multiline ? (
        <textarea
          {...common}
          readOnly={readOnly}
          maxLength={maxLength}
          minLength={minLength}
          rows={rows}
          placeholder={placeholder}
        />
      ) : (
        <input
          {...common}
          type={type}
          readOnly={readOnly}
          maxLength={maxLength}
          minLength={minLength}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
      )}
      {help && <small id={id + '-help'}>{help}</small>}
      {errors && (
        <span id={id + '-error'} className="field-error">
          {errors.join(' ')}
        </span>
      )}
    </div>
  );
}
export function Checkbox({
  name,
  label,
  checked = false,
}: {
  name: string;
  label: string;
  checked?: boolean;
}) {
  const [value, setValue] = useState(checked);
  useEffect(() => setValue(checked), [checked]);
  return (
    <label className="checkbox-label">
      <input type="checkbox" name={name} checked={value} onChange={(e) => setValue(e.target.checked)} />
      {label}
    </label>
  );
}
export function Submit({
  children,
  pendingText = 'Saving…',
  quiet = false,
}: {
  children: React.ReactNode;
  pendingText?: string;
  quiet?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`button ${quiet ? 'button-quiet' : 'button-silver'}`}>
      {pending ? pendingText : children}
    </button>
  );
}
