import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api, initials, timeAgo } from '../api.js';
import { TextAreaField } from './Field.jsx';
import Icon from './Icon.jsx';
import { StarInput, Stars } from './Stars.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const COMMENT_MAX = 1000;
const REPLY_MAX = 600;

/* ---------- Summary ---------- */
function Summary({ summary, onWrite, canWrite, hasReview, loggedIn }) {
  const { average, count, distribution } = summary;
  return (
    <div className="rsum">
      <div className="rsum__score">
        <strong>{count ? average.toFixed(1) : '–'}</strong>
        <Stars value={average} size={22} />
        <span>{count === 0 ? 'No reviews yet' : `Based on ${count} ${count === 1 ? 'review' : 'reviews'}`}</span>
      </div>

      <ul className="rsum__bars" aria-label="Rating breakdown">
        {[5, 4, 3, 2, 1].map((star) => {
          const n = distribution[star] || 0;
          return (
            <li key={star}>
              <span>{star} <Icon name="star" /></span>
              <i><b style={{ width: count ? `${(n / count) * 100}%` : '0%' }} /></i>
              <em>{n}</em>
            </li>
          );
        })}
      </ul>

      <div className="rsum__cta">
        <h3>{hasReview ? 'Thanks for reviewing' : 'Share your thoughts'}</h3>
        <p>{hasReview ? 'You can edit or delete your review at any time.' : 'Bought this gift? Tell others how it was.'}</p>
        {canWrite ? (
          <button className="btn" type="button" onClick={onWrite}>{hasReview ? 'Edit your review' : 'Write a review'}</button>
        ) : loggedIn ? null : (
          <Link className="btn" to="/login" state={{ from: window.location.pathname }}>Log in to write a review</Link>
        )}
      </div>
    </div>
  );
}

/* ---------- Write / edit a review ---------- */
function ReviewForm({ productId, existing, onSaved, onCancel, onDeleted }) {
  const [rating, setRating] = useState(existing?.rating || 0);
  const [comment, setComment] = useState(existing?.comment || '');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setErrors({});
    setMessage('');
    const found = {};
    if (!rating) found.rating = 'Please choose a star rating.';
    if (comment.trim().length < 3) found.comment = 'Please write a few words about the product.';
    if (Object.keys(found).length) return setErrors(found);

    setBusy(true);
    try {
      if (existing) await api.put(`/reviews/${existing.id}`, { rating, comment });
      else await api.post(`/products/${productId}/reviews`, { rating, comment });
      onSaved(existing ? 'Your review was updated.' : 'Thank you! Your review is now live.');
    } catch (error) {
      setErrors(error.errors || {});
      if (!Object.keys(error.errors || {}).length) setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm('Delete your review? This cannot be undone.')) return;
    try {
      await api.delete(`/reviews/${existing.id}`);
      onDeleted();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <form className="rform" onSubmit={submit} noValidate>
      <h3>{existing ? 'Edit your review' : 'Write a review'}</h3>
      {message && <div className="acc-notice acc-notice--error" role="alert">{message}</div>}

      <div className="rform__rating">
        <span>Your rating</span>
        <StarInput value={rating} onChange={setRating} error={errors.rating} />
      </div>

      <TextAreaField
        label="Your review"
        rows="4"
        value={comment}
        onChange={(e) => setComment(e.target.value.slice(0, COMMENT_MAX))}
        placeholder="What did you like? How was the quality, packaging and delivery?"
        error={errors.comment}
      />
      <div className="rform__count">{comment.length} / {COMMENT_MAX}</div>

      <div className="rform__actions">
        <button className="btn" type="submit" disabled={busy}>{busy ? 'Saving…' : existing ? 'Save changes' : 'Post review'}</button>
        {onCancel && <button className="btn btn--ghost" type="button" onClick={onCancel}>Cancel</button>}
        {existing && <button className="rform__delete" type="button" onClick={remove}>Delete review</button>}
      </div>
    </form>
  );
}

/* ---------- A single reply ---------- */
export function Reply({ reply, canDelete, onDelete }) {
  return (
    <li className={`reply ${reply.isTeam ? 'reply--team' : ''}`}>
      <span className={`reply__avatar ${reply.isTeam ? 'reply__avatar--team' : ''}`}>
        {reply.isTeam ? <img src="/gift-svgrepo-com.svg" alt="" /> : initials(reply.author)}
      </span>
      <div className="reply__body">
        <div className="reply__head">
          <strong>{reply.author}</strong>
          {reply.isTeam && <span className="tag tag--team">Store team</span>}
          {!reply.isTeam && reply.isReviewer && <span className="tag">Reviewer</span>}
          <time>{timeAgo(reply.createdAt)}</time>
        </div>
        <p>{reply.message}</p>
        {canDelete && <button className="linkbtn" type="button" onClick={() => onDelete(reply)}>Delete</button>}
      </div>
    </li>
  );
}

/* ---------- A review with its replies ---------- */
function ReviewItem({ review, onEdit, onChanged, onRemoved }) {
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const [replying, setReplying] = useState(false);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const sendReply = async (event) => {
    event.preventDefault();
    setError('');
    if (!text.trim()) return setError('Please write a reply.');
    setBusy(true);
    try {
      const { review: updated } = await api.post(`/reviews/${review.id}/replies`, { message: text });
      onChanged(updated);
      setText('');
      setReplying(false);
    } catch (e) {
      setError(e.errors?.message || e.message);
    } finally {
      setBusy(false);
    }
  };

  const deleteReply = async (reply) => {
    if (!window.confirm('Delete this reply?')) return;
    try {
      const { review: updated } = await api.delete(`/reviews/${review.id}/replies/${reply.id}`);
      onChanged(updated);
    } catch (e) {
      setError(e.message);
    }
  };

  const deleteReview = async () => {
    if (!window.confirm('Delete this review? This cannot be undone.')) return;
    try {
      await api.delete(`/reviews/${review.id}`);
      onRemoved();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <article className="review" id={`review-${review.id}`}>
      <header className="review__head">
        <span className="review__avatar">{initials(review.author)}</span>
        <div className="review__who">
          <strong>{review.author}</strong>
          {review.verified && <span className="tag tag--ok"><Icon name="check" width={3} /> Verified purchase</span>}
        </div>
        <div className="review__meta">
          <Stars value={review.rating} size={16} />
          <time dateTime={review.createdAt}>{timeAgo(review.createdAt)}</time>
        </div>
      </header>

      <p className="review__text">{review.comment}</p>

      <div className="review__actions">
        {user ? (
          <button className="linkbtn" type="button" onClick={() => setReplying((v) => !v)}>
            <Icon name="chat" /> Reply{review.replies.length ? ` (${review.replies.length})` : ''}
          </button>
        ) : (
          <Link className="linkbtn" to="/login" state={{ from: location.pathname }}><Icon name="chat" /> Log in to reply</Link>
        )}
        {review.isMine && <button className="linkbtn" type="button" onClick={onEdit}>Edit</button>}
        {(review.isMine || isAdmin) && <button className="linkbtn linkbtn--danger" type="button" onClick={deleteReview}>Delete</button>}
      </div>

      {review.replies.length > 0 && (
        <ul className="replies">
          {review.replies.map((reply) => (
            <Reply key={reply.id} reply={reply} canDelete={reply.isMine || isAdmin} onDelete={deleteReply} />
          ))}
        </ul>
      )}

      {replying && (
        <form className="replyform" onSubmit={sendReply} noValidate>
          <textarea
            rows="3"
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, REPLY_MAX))}
            placeholder={isAdmin ? 'Reply as the GiftNest team…' : 'Write a reply…'}
            aria-label="Your reply"
            autoFocus
          />
          {error && <span className="fld__error" role="alert">{error}</span>}
          <div className="replyform__row">
            <small>{text.length} / {REPLY_MAX}</small>
            <button className="btn btn--ghost btn--small" type="button" onClick={() => { setReplying(false); setError(''); }}>Cancel</button>
            <button className="btn btn--small" type="submit" disabled={busy}>{busy ? 'Sending…' : 'Send reply'}</button>
          </div>
        </form>
      )}
      {!replying && error && <span className="fld__error" role="alert">{error}</span>}
    </article>
  );
}

/* ---------- The whole section ---------- */
export default function Reviews({ productId, onSummary }) {
  const { user } = useAuth();
  const [sort, setSort] = useState('newest');
  const [state, setState] = useState({ loading: true, loadingMore: false, error: null, items: [], page: 1, pages: 1, total: 0, summary: { average: 0, count: 0, distribution: {} }, mine: null });
  const [writing, setWriting] = useState(false);
  const [notice, setNotice] = useState('');
  const formRef = useRef(null);
  const { hash } = useLocation();

  const load = useCallback(async (page = 1) => {
    setState((s) => ({ ...s, loading: page === 1 ? s.items.length === 0 : s.loading, loadingMore: page > 1, error: null }));
    try {
      const data = await api.get(`/products/${productId}/reviews?sort=${sort}&page=${page}`);
      setState((s) => ({
        loading: false,
        loadingMore: false,
        error: null,
        items: page === 1 ? data.items : [...s.items, ...data.items],
        page: data.page,
        pages: data.pages,
        total: data.total,
        summary: data.summary,
        mine: data.mine,
      }));
      onSummary?.(data.summary);
    } catch (error) {
      setState((s) => ({ ...s, loading: false, loadingMore: false, error }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, sort, user?.id]);

  useEffect(() => {
    load(1);
  }, [load]);

  // Arriving from a product card's rating link (…#reviews) should land on this section.
  useEffect(() => {
    if (!state.loading && hash === '#reviews') {
      document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [state.loading, hash]);

  useEffect(() => {
    if (!notice) return undefined;
    const id = setTimeout(() => setNotice(''), 5000);
    return () => clearTimeout(id);
  }, [notice]);

  const openForm = () => {
    setWriting(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
  };

  const replaceItem = (updated) => setState((s) => ({ ...s, items: s.items.map((i) => (i.id === updated.id ? updated : i)) }));

  const { loading, error, items, summary, mine, page, pages, loadingMore } = state;
  const showForm = Boolean(user) && writing;

  return (
    <section className="reviews" id="reviews" aria-labelledby="reviews-title">
      <div className="head-center">
        <div className="kicker">Customer reviews</div>
        <h2 id="reviews-title">What people are saying</h2>
      </div>

      {notice && <div className="acc-notice acc-notice--ok reviews__notice" role="status">{notice}</div>}

      {error ? (
        <p className="reviews__error">{error.message}</p>
      ) : (
        <>
          <Summary summary={summary} onWrite={openForm} canWrite={Boolean(user)} hasReview={Boolean(mine)} loggedIn={Boolean(user)} />

          <div ref={formRef}>
            {showForm && (
              <ReviewForm
                key={mine?.id || 'new'}
                productId={productId}
                existing={mine}
                onCancel={() => setWriting(false)}
                onSaved={(text) => { setWriting(false); setNotice(text); load(1); }}
                onDeleted={() => { setWriting(false); setNotice('Your review was deleted.'); load(1); }}
              />
            )}
          </div>

          <div className="reviews__bar">
            <h3>{summary.count === 0 ? 'Reviews' : `${summary.count} ${summary.count === 1 ? 'review' : 'reviews'}`}</h3>
            {summary.count > 1 && (
              <label className="reviews__sort">
                Sort by
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="newest">Most recent</option>
                  <option value="highest">Highest rated</option>
                  <option value="lowest">Lowest rated</option>
                </select>
              </label>
            )}
          </div>

          {loading ? (
            <div className="reviews__skel" aria-busy="true"><span className="skeleton" /><span className="skeleton" /></div>
          ) : items.length === 0 ? (
            <div className="reviews__empty">
              <span aria-hidden="true"><Icon name="star" /></span>
              <strong>No reviews yet</strong>
              <p>Be the first to tell others what you think of this gift.</p>
            </div>
          ) : (
            <div className="reviews__list">
              {items.map((review) => (
                <ReviewItem
                  key={review.id}
                  review={review}
                  onEdit={openForm}
                  onChanged={replaceItem}
                  onRemoved={() => { setNotice('Review deleted.'); load(1); }}
                />
              ))}
              {page < pages && (
                <button className="btn btn--ghost reviews__more" type="button" onClick={() => load(page + 1)} disabled={loadingMore}>
                  {loadingMore ? 'Loading…' : 'Show more reviews'}
                </button>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}
