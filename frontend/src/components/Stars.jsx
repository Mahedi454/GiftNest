import { useState } from 'react';

const STAR = 'M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.6l1.2-6.5L2.5 9.5l6.6-.9L12 2.6Z';

function Row({ size, className }) {
  return (
    <span className={`stars__row ${className}`} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 24 24" width={size} height={size}><path d={STAR} /></svg>
      ))}
    </span>
  );
}

// Read-only stars. Accepts decimals (4.5 fills four and a half stars).
export function Stars({ value = 0, size = 18, label }) {
  const clamped = Math.max(0, Math.min(5, Number(value) || 0));
  return (
    <span className="stars" role="img" aria-label={label || `${clamped} out of 5 stars`}>
      <Row size={size} className="stars__bg" />
      <span className="stars__fill" style={{ width: `${(clamped / 5) * 100}%` }}>
        <Row size={size} className="stars__fg" />
      </span>
    </span>
  );
}

const wording = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'];

// Clickable star picker: hover to preview, click or use the arrow keys to choose.
export function StarInput({ value, onChange, error }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  const onKeyDown = (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault();
      onChange(Math.min(5, (value || 0) + 1));
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault();
      onChange(Math.max(1, (value || 2) - 1));
    }
  };

  return (
    <div className={`starinput ${error ? 'has-error' : ''}`}>
      <div className="starinput__row" role="radiogroup" aria-label="Your rating" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} ${n === 1 ? 'star' : 'stars'}`}
            tabIndex={value === n || (!value && n === 1) ? 0 : -1}
            className={shown >= n ? 'is-on' : ''}
            onMouseEnter={() => setHover(n)}
            onClick={() => onChange(n)}
            onKeyDown={onKeyDown}
          >
            <svg viewBox="0 0 24 24" width="34" height="34"><path d={STAR} /></svg>
          </button>
        ))}
        <span className="starinput__word">{wording[shown] || 'Tap a star to rate'}</span>
      </div>
      {error && <span className="fld__error" role="alert">{error}</span>}
    </div>
  );
}
