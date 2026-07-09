import React, { useEffect, useState } from 'react'
import './Player.css'
import back_arrow_icon from '../../assets/back_arrow_icon.png'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { TMDB_Access_Key } from '../../config'
import { db, auth } from '../../firebase'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { toast } from 'react-toastify'

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Title may be passed as router state from TitleCards
  const movieTitle = location.state?.title || '';

  const [apiData, setApiData] = useState({
    name: "",
    key: "",
    published_at: "",
    type: ""
  });

  const [adding, setAdding] = useState(false);

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_Access_Key}`
    }
  };

  useEffect(() => {
    fetch(`/api/tmdb/movie/${id}/videos?language=en-US`, options)
      .then(response => response.json())
      .then(response => setApiData(response.results[0]))
      .catch(err => console.error(err));
  }, [id]);

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
      <iframe
        src={`https://www.youtube.com/embed/${apiData.key}`}
        title='trailer'
        frameBorder='0'
        allowFullScreen
      ></iframe>
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
