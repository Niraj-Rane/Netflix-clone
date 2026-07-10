import React, { useEffect, useRef, useState } from 'react'
import './TitleCards.css'
import { Link } from 'react-router-dom'
import { tmdbUrl, tmdbFetchOptions } from '../../lib/tmdb'
import { db, auth } from '../../firebase'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { toast } from 'react-toastify'

/**
 * Reusable row of movie/TV cards.
 *
 * mediaType: 'movie' | 'tv' — determines TMDB field names (title vs name)
 *   and default endpoint prefix.
 * category: a TMDB list endpoint, e.g. 'popular', 'top_rated', 'upcoming',
 *   'now_playing' (movie) or 'popular', 'top_rated', 'on_the_air',
 *   'airing_today' (tv). Ignored if endpointOverride is given.
 * endpointOverride: full path after /api/tmdb/ for custom queries
 *   (e.g. discover with a language filter). Use this instead of category
 *   when you need query params TMDB's simple list endpoints don't support.
 */
const TitleCards = ({ title, mediaType = 'movie', category = 'popular', endpointOverride }) => {

  const [apiData, setApiData] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [savingId, setSavingId] = useState(null);
  const cardsRef = useRef();

  const handleWheel = (event) => {
    event.preventDefault();
    cardsRef.current.scrollLeft += event.deltaY;
  }

  const load = () => {
    setStatus('loading');
    const basePath = endpointOverride || `${mediaType}/${category}`;
    fetch(tmdbUrl(basePath, { language: 'en-US', page: '1' }), tmdbFetchOptions)
      .then(response => {
        if (!response.ok) throw new Error(`TMDB request failed (${response.status})`);
        return response.json();
      })
      .then(response => {
        setApiData(response.results || []);
        setStatus('ready');
      })
      .catch(err => {
        console.error(err);
        setStatus('error');
      });
  };

  useEffect(() => {
    load();
    const ref = cardsRef.current;
    ref?.addEventListener('wheel', handleWheel);
    return () => ref?.removeEventListener('wheel', handleWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaType, category, endpointOverride]);

  const displayName = (card) => mediaType === 'tv'
    ? (card.name || card.original_name)
    : (card.title || card.original_title);

  const handleBookmark = async (e, card) => {
    e.preventDefault();
    e.stopPropagation();

    const user = auth.currentUser;
    if (!user) {
      toast.error('Sign in to save to My List');
      return;
    }
    setSavingId(card.id);
    try {
      await addDoc(collection(db, 'watchlist'), {
        uid: user.uid,
        movieId: String(card.id),
        title: displayName(card),
        poster: card.backdrop_path,
        mediaType,
        addedAt: serverTimestamp(),
      });
      toast.success(`"${displayName(card)}" added to My List!`);
    } catch (err) {
      console.error(err);
      toast.error('Could not save to My List');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className='title-cards'>
      <h2>{title ? title : "Popular on Netflix"}</h2>

      {status === 'loading' && (
        <div className="title-cards-status">Loading titles…</div>
      )}

      {status === 'error' && (
        <div className="title-cards-status title-cards-error">
          Couldn't load titles right now.
          <button className="retry-btn" onClick={load}>Retry</button>
        </div>
      )}

      {status === 'ready' && (
        <div className="card-list" ref={cardsRef}>
          {apiData.map((card) => (
            <Link
              to={`/player/${card.id}`}
              state={{ title: displayName(card), mediaType }}
              className="card"
              key={card.id}
            >
              {card.backdrop_path ? (
                <img src={`https://image.tmdb.org/t/p/w500${card.backdrop_path}`} alt={displayName(card)} />
              ) : (
                <div className="card-no-image">{displayName(card)}</div>
              )}
              <p>{displayName(card)}</p>
              <button
                className="card-bookmark"
                title="Add to My List"
                disabled={savingId === card.id}
                onClick={(e) => handleBookmark(e, card)}
              >
                {savingId === card.id ? '…' : '＋'}
              </button>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default TitleCards
