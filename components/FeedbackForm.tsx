/**
 * FeedbackForm — Google Forms no-cors submission
 *
 * HOW TO GET YOUR GOOGLE FORM ACTION URL & ENTRY IDs
 * ---------------------------------------------------
 * 1. Create a Google Form with fields matching the constants below.
 * 2. Click the eye icon (Preview) to open the live form in a new tab.
 * 3. Open DevTools → Network tab, then submit the form with dummy data.
 * 4. Find the POST request to `https://docs.google.com/forms/d/.../formResponse`
 *    — copy that full URL into GOOGLE_FORM_ACTION below.
 * 5. In the request payload, note the keys like `entry.XXXXXXXXX`.
 *    Map each key to its constant below.
 *
 * Alternative (pre-filled link method):
 * 1. In the form editor, click ⋮ → "Get pre-filled link".
 * 2. Fill every field with a placeholder, then "Get Link".
 * 3. The resulting URL contains `entry.XXXXXXXXX=placeholder` params.
 *    Strip the base URL and placeholder values to find each entry ID.
 *
 * NOTE: Because we POST with mode:'no-cors', the browser sends the data
 * but we never see the response. This is expected — Google Forms silently
 * accepts the submission. Show a success state immediately after fetch resolves.
 */

'use client';

import { useState } from 'react';

// ─── Replace these with your real values ────────────────────────────────────
const GOOGLE_FORM_ACTION =
  'https://docs.google.com/forms/d/e/1FAIpQLSdI8iTIwLTPpSlKOuYRs9GfjajeLJOValeSLrGKznmNyGzEHQ/formResponse';

const ENTRY_NAME     = 'entry.203990896';  // Name (optional)
const ENTRY_LAGNA    = 'entry.627749791';  // Lagna result (pre-filled)
const ENTRY_RATING   = 'entry.1146443651'; // Star rating 1-5
const ENTRY_FEEDBACK = 'entry.1460015634'; // Feedback message (required)
// ────────────────────────────────────────────────────────────────────────────

type Props = {
  defaultLagna: string;
};

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

export default function FeedbackForm({ defaultLagna }: Props) {
  const [open, setOpen]         = useState(false);
  const [name, setName]         = useState('');
  const [lagna, setLagna]       = useState(defaultLagna);
  const [rating, setRating]     = useState(0);
  const [hovered, setHovered]   = useState(0);
  const [feedback, setFeedback] = useState('');
  const [status, setStatus]     = useState<SubmitState>('idle');

  const canSubmit = rating > 0 && feedback.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus('submitting');
    try {
      const fd = new FormData();
      if (name.trim())    fd.append(ENTRY_NAME, name.trim());
      fd.append(ENTRY_LAGNA,    lagna);
      fd.append(ENTRY_RATING,   String(rating));
      fd.append(ENTRY_FEEDBACK, feedback.trim());

      await fetch(GOOGLE_FORM_ACTION, { method: 'POST', mode: 'no-cors', body: fd });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setStatus('idle');
    setName('');
    setLagna(defaultLagna);
    setRating(0);
    setFeedback('');
  };

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    padding: '11px 14px',
    color: '#F4F0E8',
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    colorScheme: 'dark' as React.CSSProperties['colorScheme'],
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '9px',
    letterSpacing: '0.16em',
    color: 'rgba(255,255,255,0.3)',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '6px',
  };

  // ── Trigger button ────────────────────────────────────────────────────────
  if (!open) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <button
          onClick={() => setOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            padding: '8px 20px',
            background: 'rgba(212,160,23,0.08)',
            border: '1px solid rgba(212,160,23,0.25)',
            borderRadius: '20px',
            color: 'rgba(212,160,23,0.85)',
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            letterSpacing: '0.06em',
            cursor: 'pointer',
            transition: 'background 0.2s, border-color 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(212,160,23,0.14)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(212,160,23,0.45)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(212,160,23,0.08)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(212,160,23,0.25)';
          }}
        >
          <span style={{ fontSize: '11px' }}>✦</span>
          Share Feedback
        </button>
      </div>
    );
  }

  // ── Expanded form card ────────────────────────────────────────────────────
  return (
    <div style={{
      marginTop: '20px',
      border: '1px solid rgba(212,160,23,0.2)',
      borderRadius: '20px',
      background: 'rgba(12,12,24,0.92)',
      overflow: 'hidden',
    }}>
      {/* Card header */}
      <div style={{
        padding: '16px 22px',
        background: 'linear-gradient(90deg, rgba(212,160,23,0.10) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(212,160,23,0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <span style={{ color: '#D4A017', fontSize: '12px' }}>✦</span>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '13px',
            color: '#F4F0E8',
            letterSpacing: '0.08em',
          }}>
            Share Feedback
          </span>
        </div>
        <button
          onClick={handleClose}
          aria-label="Close feedback form"
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.3)',
            fontSize: '18px',
            cursor: 'pointer',
            lineHeight: 1,
            padding: '2px 6px',
            borderRadius: '6px',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)')}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.3)')}
        >
          ×
        </button>
      </div>

      <div style={{ padding: '22px' }}>

        {/* ── Success state ── */}
        {status === 'success' && (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: '28px', marginBottom: '14px' }}>✦</div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '20px',
              color: '#D4A017',
              letterSpacing: '0.06em',
              marginBottom: '8px',
            }}>
              நன்றி · नन्द्रि · Thank You
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '22px' }}>
              Your feedback has been received.
            </div>
            <button
              onClick={handleClose}
              style={{
                padding: '8px 24px',
                background: 'rgba(212,160,23,0.12)',
                border: '1px solid rgba(212,160,23,0.3)',
                borderRadius: '20px',
                color: '#D4A017',
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                cursor: 'pointer',
                letterSpacing: '0.06em',
              }}
            >
              Close
            </button>
          </div>
        )}

        {/* ── Error state ── */}
        {status === 'error' && (
          <div style={{
            background: 'rgba(239,68,68,0.07)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '12px',
            padding: '12px 16px',
            color: '#FCA5A5',
            fontSize: '12px',
            marginBottom: '16px',
            textAlign: 'center',
          }}>
            ⚠ Submission failed. Please try again or contact directly.
            <button
              onClick={() => setStatus('idle')}
              style={{
                display: 'block',
                margin: '8px auto 0',
                background: 'none',
                border: 'none',
                color: '#FCA5A5',
                fontSize: '11px',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Try again
            </button>
          </div>
        )}

        {/* ── Form fields ── */}
        {(status === 'idle' || status === 'error') && (
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>

            {/* Name */}
            <div>
              <label style={labelStyle}>Name <span style={{ color: 'rgba(255,255,255,0.18)' }}>(optional)</span></label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                maxLength={80}
                style={inputStyle}
                onFocus={e => {
                  (e.target as HTMLInputElement).style.borderColor = 'rgba(212,160,23,0.5)';
                  (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(212,160,23,0.08)';
                }}
                onBlur={e => {
                  (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.08)';
                  (e.target as HTMLInputElement).style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Lagna (pre-filled, editable) */}
            <div>
              <label style={labelStyle}>Your Lagna Result</label>
              <input
                type="text"
                value={lagna}
                onChange={e => setLagna(e.target.value)}
                placeholder="e.g. Simha Udaya"
                maxLength={60}
                style={{ ...inputStyle, color: '#D4A017' }}
                onFocus={e => {
                  (e.target as HTMLInputElement).style.borderColor = 'rgba(212,160,23,0.5)';
                  (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(212,160,23,0.08)';
                }}
                onBlur={e => {
                  (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.08)';
                  (e.target as HTMLInputElement).style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Star rating */}
            <div>
              <label style={labelStyle}>Rating</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[1, 2, 3, 4, 5].map(star => {
                  const active = star <= (hovered || rating);
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHovered(star)}
                      onMouseLeave={() => setHovered(0)}
                      aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '26px',
                        lineHeight: 1,
                        color: active ? '#D4A017' : 'rgba(255,255,255,0.12)',
                        filter: active ? 'drop-shadow(0 0 5px rgba(212,160,23,0.7))' : 'none',
                        transition: 'color 0.15s, filter 0.15s',
                        padding: '2px',
                      }}
                    >
                      ★
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feedback message */}
            <div>
              <label style={labelStyle}>Feedback <span style={{ color: 'rgba(239,68,68,0.6)' }}>*</span></label>
              <textarea
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                placeholder="Share your thoughts, corrections, or suggestions…"
                rows={4}
                required
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  minHeight: '96px',
                  lineHeight: 1.6,
                }}
                onFocus={e => {
                  (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(212,160,23,0.5)';
                  (e.target as HTMLTextAreaElement).style.boxShadow = '0 0 0 3px rgba(212,160,23,0.08)';
                }}
                onBlur={e => {
                  (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(255,255,255,0.08)';
                  (e.target as HTMLTextAreaElement).style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!canSubmit}
              style={{
                padding: '14px',
                background: canSubmit
                  ? 'linear-gradient(135deg, #D4A017 0%, #B8860B 100%)'
                  : 'rgba(255,255,255,0.05)',
                color: canSubmit ? '#100d00' : 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '12px',
                fontFamily: 'var(--font-display)',
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '0.08em',
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                transition: 'background 0.2s, color 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              ✦ Submit Feedback
            </button>

            {/* Privacy note */}
            <p style={{
              fontSize: '10px',
              color: 'rgba(255,255,255,0.18)',
              textAlign: 'center',
              letterSpacing: '0.04em',
              lineHeight: 1.5,
              margin: 0,
            }}>
              Responses stored in Google Forms · No personal data collected without consent
            </p>
          </form>
        )}

        {/* Submitting spinner */}
        {status === 'submitting' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '28px 0' }}>
            <div style={{
              width: '24px',
              height: '24px',
              border: '2px solid rgba(255,255,255,0.1)',
              borderTopColor: '#D4A017',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em' }}>Sending…</span>
          </div>
        )}
      </div>
    </div>
  );
}
