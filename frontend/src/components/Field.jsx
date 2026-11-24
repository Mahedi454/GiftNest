import { useId, useState } from 'react';

export function TextField({ label, error, className = '', ...input }) {
  const id = useId();
  return (
    <div className={`fld ${error ? 'has-error' : ''} ${className}`}>
      <label htmlFor={id}>{label}</label>
      <input id={id} className="fld__input" aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-err` : undefined} {...input} />
      {error && <span className="fld__error" id={`${id}-err`} role="alert">{error}</span>}
    </div>
  );
}

// Password input with a show/hide (eye) button.
export function PasswordField({ label, error, className = '', ...input }) {
  const id = useId();
  const [visible, setVisible] = useState(false);

  return (
    <div className={`fld ${error ? 'has-error' : ''} ${className}`}>
      <label htmlFor={id}>{label}</label>
      <div className="fld__wrap">
        <input
          id={id}
          className="fld__input fld__input--pw"
          type={visible ? 'text' : 'password'}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-err` : undefined}
          {...input}
        />
        <button
          type="button"
          className="fld__eye"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {visible ? (
              <>
                <path d="M3 3l18 18" />
                <path d="M10.6 6.1A10.4 10.4 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.5 6.6C3.7 8.4 2 12 2 12s3.6 7 10 7c1.7 0 3.2-.4 4.5-1M9.9 9.9a3 3 0 0 0 4.2 4.2" />
              </>
            ) : (
              <>
                <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                <circle cx="12" cy="12" r="3" />
              </>
            )}
          </svg>
        </button>
      </div>
      {error && <span className="fld__error" id={`${id}-err`} role="alert">{error}</span>}
    </div>
  );
}

const strengthLabels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];

export function passwordScore(value) {
  if (!value) return 0;
  if (value.length < 8) return 0;
  let score = 1;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value) || value.length >= 12) score += 1;
  return score;
}

export function StrengthMeter({ value }) {
  if (!value) return null;
  const score = passwordScore(value);
  return (
    <div className={`strength strength--${score}`} aria-live="polite">
      <div className="strength__bars" aria-hidden="true">
        {[1, 2, 3, 4].map((n) => <i key={n} className={n <= score ? 'is-on' : ''} />)}
      </div>
      <span>Password strength: <b>{strengthLabels[score]}</b></span>
    </div>
  );
}
