import React, { useEffect, useRef, useState } from 'react'
import './TitleCards.css'
import { Link } from 'react-router-dom'
import { TMDB_Access_Key } from '../../config'
import { db, auth } from '../../firebase'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { toast } from 'react-toastify'

const TitleCards = ({ title, category }) => {

  const [apiData, setApiData] = useState([]);
  const [savingId, setSavingId] = useState(null);
  const cardsRef = useRef();

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_Access_Key}`
    }
  };

  const handleWheel = (event) => {
    event.preventDefault();
    cardsRef.current.scrollLeft += event.deltaY;
  }

  useEffect(() => {
    fetch(`/api/tmdb/movie/${category ? category : "now_playing"}?language=en-US&page=1`, options)
      .then(response => response.json())
      .then(response => setApiData(response.results))
      .catch(err => console.error(err));

    const ref = cardsRef.current;
    ref.addEventListener('wheel', handleWheel);
    return () => ref.removeEventListener('wheel', handleWheel);
  }, []);

  const handleBookmark = async (e, card) => {
    // Stop the click from navigating to the player
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
        title: card.original_title,
        poster: card.backdrop_path,
        addedAt: serverTimestamp(),
      });
      toast.success(`"${card.original_title}" added to My List!`);
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
      <div className="card-list" ref={cardsRef}>
        {apiData.map((card, index) => (
          <Link
            to={`/player/${card.id}`}
            state={{ title: card.original_title }}
            className="card"
            key={index}
          >
            <img src={`https://image.tmdb.org/t/p/w500` + card.backdrop_path} alt={card.original_title} />
            <p>{card.original_title}</p>
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
    </div>
  )
}

export default TitleCards
