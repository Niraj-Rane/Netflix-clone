import React, { useEffect, useState } from 'react'
import './MyList.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { db, auth } from '../../firebase'
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const MyList = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'watchlist'),
      where('uid', '==', user.uid)
    );

    // Real-time listener — updates instantly when items are added/removed
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(d => ({ docId: d.id, ...d.data() }));
      // Sort newest first client-side (avoids needing a composite Firestore index)
      items.sort((a, b) => {
        const aTime = a.addedAt?.toMillis?.() ?? 0;
        const bTime = b.addedAt?.toMillis?.() ?? 0;
        return bTime - aTime;
      });
      setWatchlist(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleRemove = async (docId, title) => {
    try {
      await deleteDoc(doc(db, 'watchlist', docId));
      toast.success(`"${title}" removed from My List`);
    } catch (err) {
      console.error(err);
      toast.error('Could not remove item');
    }
  };

  return (
    <div className='mylist'>
      <Navbar />
      <div className="mylist-content">
        <h1>My List</h1>
        {loading && <p className="mylist-status">Loading…</p>}
        {!loading && watchlist.length === 0 && (
          <p className="mylist-status">
            No saved movies yet. Hit <strong>＋</strong> on any card to add one!
          </p>
        )}
        <div className="mylist-grid">
          {watchlist.map((item) => (
            <div className="mylist-card" key={item.docId}>
              <Link to={`/player/${item.movieId}`} state={{ title: item.title }}>
                {item.poster
                  ? <img src={`https://image.tmdb.org/t/p/w500${item.poster}`} alt={item.title} />
                  : <div className="mylist-placeholder">{item.title}</div>
                }
                <p>{item.title}</p>
              </Link>
              <button
                className="mylist-remove"
                title="Remove from My List"
                onClick={() => handleRemove(item.docId, item.title)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default MyList
