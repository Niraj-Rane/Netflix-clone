import React, { useEffect, useState } from 'react'
import './Player.css'
import back_arrow_icon from '../../assets/back_arrow_icon.png'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { tmdbUrl, tmdbFetchOptions } from '../../lib/tmdb'
import { db, auth } from '../../firebase'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { toast } from 'react-toastify'

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Title/mediaType may be passed as router state from TitleCards/MyList
  const movieTitle = location.state?.title || '';
  const mediaType = location.state?.mediaType || 'movie';

  const [apiData, setApiData] = useState({
    name: "",
    key: "",
    published_at: "",
    type: ""
  });

  const [adding, setAdding] = useState(false);
  const [videoStatus, setVideoStatus] = useState('loading'); // loading | ready | error

  useEffect(() => {
    setVideoStatus('loading');
    fetch(tmdbUrl(`${mediaType}/${id}/videos`, { language: 'en-US' }), tmdbFetchOptions)
      .then(response => {
        if (!response.ok) throw new Error(`Request failed (${response.status})`);
        return response.json();
      })
      .then(response => {
        const trailer = response.results?.[0];
        if (!trailer) throw new Error('No trailer available');
        setApiData(trailer);
        setVideoStatus('ready');
      })
      .catch(err => {
        console.error(err);
        setVideoStatus('error');
      });
  }, [id, mediaType]);

  const handleAddToList = async () => {
    const user = auth.currentUser;
    if (!user) {
      toast.error('Sign in to save to My List');
      return;
    }
    setAdding(true);
    try {
      await addDoc(collection(db, 'watchlist'), {
        uid: user.uid,
        movieId: id,
        title: movieTitle,
        mediaType,
        addedAt: serverTimestamp(),
      });
      toast.success('Added to My List!');
    } catch (err) {
      console.error(err);
      toast.error('Could not add to My List');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className='player'>
      <img src={back_arrow_icon} alt="Go back" onClick={() => { navigate(-1) }} />

      {videoStatus === 'loading' && (
        <div className="player-status">Loading trailer…</div>
      )}

      {videoStatus === 'error' && (
        <div className="player-status player-error">
          Couldn't load a trailer for this title.
        </div>
      )}

      {videoStatus === 'ready' && (
        <iframe
          src={`https://www.youtube.com/embed/${apiData.key}`}
          title='trailer'
          frameBorder='0'
          allowFullScreen
        ></iframe>
      )}

      <div className="player-info">
        <p>{apiData.published_at ? apiData.published_at.slice(0, 10) : ''}</p>
        <p>{movieTitle}</p>
        <p>{apiData.type}</p>
      </div>
      <button className="my-list-btn" onClick={handleAddToList} disabled={adding}>
        {adding ? 'Adding…' : '＋ Add to My List'}
      </button>
    </div>
  )
}

export default Player
