import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, assetUrl, initials, timeAgo } from '../../api.js';
import { ErrorBox, Loading, Pagination, useFetch } from '../../components/common.jsx';
import Icon from '../../components/Icon.jsx';
import { Reply } from '../../components/Reviews.jsx';
import { Stars } from '../../components/Stars.jsx';

function ReviewCard({ review, onMessage, onChanged }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const send = async (event) => {
    event.preventDefault();
    setError('');
    if (!text.trim()) return setError('Please write a reply.');
    setBusy(true);
    try {
      await api.post(`/reviews/${review.id}/replies`, { message: text });
      setText('');
      onMessage('Your reply was posted.');
      onChanged();
      window.dispatchEvent(new Event('reviews-changed'));
    } catch (e) {
      setError(e.errors?.message || e.message);
    } finally {
      setBusy(false);
    }
  };

  const deleteReply = async (reply) => {
    if (!window.confirm('Delete this reply?')) return;
    try {
      await api.delete(`/reviews/${review.id}/replies/${reply.id}`);
      onMessage('Reply deleted.');
      onChanged();
      window.dispatchEvent(new Event('reviews-changed'));
    } catch (e) {
      onMessage(e.message);
    }
  };

  const deleteReview = async () => {
    if (!window.confirm('Delete this review? This cannot be undone.')) return;
    try {
      await api.delete(`/reviews/${review.id}`);
      onMessage('Review deleted.');
      onChanged();
      window.dispatchEvent(new Event('reviews-changed'));
    } catch (e) {
      onMessage(e.message);
    }
  };

  return (
    <article className={`arev ${review.hasTeamReply ? '' : 'arev--needs'}`}>
      <header className="arev__top">
        <Link className="arev__product" to={`/product/${review.product?.id}#reviews`}>
          <span className="arev__thumb">
            {review.product?.image ? <img src={assetUrl(review.product.image)} alt="" /> : <Icon name="box" />}
          </span>
          <span>
            <strong>{review.product?.name || 'Removed product'}</strong>
            <small>View on store <Icon name="external" /></small>
          </span>
        </Link>
        {review.hasTeamReply ? <span className="pill2 pill2--completed">Replied</span> : <span className="pill2 pill2--pending">Needs reply</span>}
      </header>

      <div className="arev__who">
        <span className="review__avatar">{initials(review.author)}</span>
        <div>
          <strong>{review.author}</strong>
          <small>{review.email}</small>
        </div>
        {review.verified && <span className="tag tag--ok"><Icon name="check" width={3} /> Verified purchase</span>}
        <div className="arev__rating">
          <Stars value={review.rating} size={17} />
          <time dateTime={review.createdAt}>{timeAgo(review.createdAt)}</time>
        </div>
      </div>

      <p className="review__text">{review.comment}</p>

      {review.replies.length > 0 && (
        <ul className="replies">
          {review.replies.map((reply) => (
            <Reply key={reply.id} reply={reply} canDelete onDelete={deleteReply} />
          ))}
        </ul>
      )}

      <form className="replyform arev__form" onSubmit={send} noValidate>
        <textarea
          rows="2"
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 600))}
          placeholder="Reply as the GiftNest team…"
          aria-label={`Reply to ${review.author}`}
        />
        {error && <span className="fld__error" role="alert">{error}</span>}
        <div className="replyform__row">
          <small>{text.length} / 600</small>
          <button className="linkbtn linkbtn--danger" type="button" onClick={deleteReview}>Delete review</button>
          <button className="btn btn--small" type="submit" disabled={busy}>{busy ? 'Sending…' : 'Send reply'}</button>
        </div>
      </form>
    </article>
  );
}

export default function AdminReviews() {
  const [filter, setFilter] = useState('all');
  const [rating, setRating] = useState('');
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState('');

  const { data, error, loading, reload } = useFetch(
    () => api.get(`/admin/reviews?page=${page}${filter === 'needs-reply' ? '&filter=needs-reply' : ''}${rating ? `&rating=${rating}` : ''}`),
    [page, filter, rating],
  );

  if (!data && loading) return <Loading />;
  if (error) return <ErrorBox error={error} />;
  const { items, stats } = data;

  const tabs = [
    { key: 'all', label: 'All reviews', count: stats.total },
    { key: 'needs-reply', label: 'Needs reply', count: stats.unanswered },
  ];

  return (
    <div className="adm-page">
      <header className="pagehead">
        <div>
          <h1>Reviews</h1>
          <p>Read what customers say about your products and reply to them.</p>
        </div>
        <div className="pagehead__stat">
          <span>Average rating</span>
          <strong className="pagehead__rating">{stats.total ? stats.average.toFixed(1) : '–'} <Stars value={stats.average} size={18} /></strong>
        </div>
      </header>

      {message && <div className="notice" role="status">{message}</div>}

      <div className="rfilters">
        <div className="tabs" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={filter === tab.key}
              className={`tabs__tab ${filter === tab.key ? 'is-active' : ''}`}
              onClick={() => { setFilter(tab.key); setPage(1); }}
            >
              {tab.label} <span>{tab.count}</span>
            </button>
          ))}
        </div>
        <label className="rfilters__select">
          Rating
          <select value={rating} onChange={(e) => { setRating(e.target.value); setPage(1); }}>
            <option value="">All ratings</option>
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} {n === 1 ? 'star' : 'stars'}</option>)}
          </select>
        </label>
      </div>

      {items.length === 0 ? (
        <div className="tablecard">
          <div className="tablecard__empty">
            <strong>{filter === 'needs-reply' ? 'You are all caught up' : 'No reviews yet'}</strong>
            <span>{filter === 'needs-reply' ? 'Every review has a reply from the team.' : 'Customer reviews will appear here as they come in.'}</span>
          </div>
        </div>
      ) : (
        <div className="arev__list">
          {items.map((review) => (
            <ReviewCard key={review.id} review={review} onMessage={setMessage} onChanged={reload} />
          ))}
        </div>
      )}

      <Pagination page={data.page} pages={data.pages} onChange={setPage} />
    </div>
  );
}
