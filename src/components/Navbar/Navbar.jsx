import React, { useEffect, useRef, useState } from 'react'
import './Navbar.css'
import logo from '../../assets/logo.png'
import search_icon from '../../assets/search_icon.svg'
import bell_icon from '../../assets/bell_icon.svg'
import profile_img from '../../assets/profile_img.png'
import caret_icon from '../../assets/caret_icon.svg'
import { logout } from '../../firebase'
import { Link, useNavigate } from 'react-router-dom'
import { TMDB_Access_Key } from '../../config'

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${TMDB_Access_Key}`
  }
};

const Navbar = () => {

  const navRef = useRef();
  const searchWrapRef = useRef();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searchStatus, setSearchStatus] = useState('idle'); // idle | loading | ready | error
  const debounceRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 80) {
        navRef.current.classList.add('nav-dark');
      } else {
        navRef.current.classList.remove('nav-dark');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the results dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setResults([]);
        setSearchStatus('idle');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setResults([]);
      setSearchStatus('idle');
      return;
    }

    setSearchStatus('loading');
    debounceRef.current = setTimeout(() => {
      fetch(`/api/tmdb/search/movie?query=${encodeURIComponent(value)}&language=en-US&page=1`, options)
        .then(res => {
          if (!res.ok) throw new Error('search failed');
          return res.json();
        })
        .then(data => {
          setResults((data.results || []).slice(0, 8));
          setSearchStatus('ready');
        })
        .catch(err => {
          console.error(err);
          setSearchStatus('error');
        });
    }, 400);
  };

  const goToResult = (movie) => {
    setSearchOpen(false);
    setQuery('');
    setResults([]);
    setSearchStatus('idle');
    navigate(`/player/${movie.id}`, { state: { title: movie.title || movie.original_title, mediaType: 'movie' } });
  };

  const openSearch = () => {
    setSearchOpen(true);
  };

  return (
    <div ref={navRef} className='navbar'>
      <div className="navbar-left">
        <Link to="/"><img src={logo} alt="Netflix" /></Link>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/tv-shows">TV Shows</Link></li>
          <li><Link to="/">Movies</Link></li>
          <li><Link to="/new-popular">New &amp; Popular</Link></li>
          <li><Link to="/my-list">My List</Link></li>
          <li><Link to="/languages">Browse by Languages</Link></li>
        </ul>
      </div>
      <div className="navbar-right">
        <div className="navbar-search" ref={searchWrapRef}>
          <img
            src={search_icon}
            alt="Search"
            className='icons'
            onClick={openSearch}
          />
          {searchOpen && (
            <div className="search-box">
              <input
                type="text"
                autoFocus
                placeholder="Titles..."
                value={query}
                onChange={handleSearchChange}
              />
              {query.trim() && (
                <div className="search-results">
                  {searchStatus === 'loading' && <p className="search-status">Searching…</p>}
                  {searchStatus === 'error' && <p className="search-status">Something went wrong.</p>}
                  {searchStatus === 'ready' && results.length === 0 && (
                    <p className="search-status">No matches for "{query}".</p>
                  )}
                  {searchStatus === 'ready' && results.map((movie) => (
                    <div
                      key={movie.id}
                      className="search-result-item"
                      onClick={() => goToResult(movie)}
                    >
                      {movie.poster_path
                        ? <img src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} alt={movie.title} />
                        : <div className="search-result-noimg" />
                      }
                      <div>
                        <p className="search-result-title">{movie.title || movie.original_title}</p>
                        <p className="search-result-year">
                          {movie.release_date ? movie.release_date.slice(0, 4) : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <p>Children</p>
        <img src={bell_icon} alt="Notifications" className='icons' />
        <div className="navbar-profile">
          <img src={profile_img} alt="Profile" className='profile' />
          <img src={caret_icon} alt="" />
          <div className="dropdown">
            <p onClick={() => { logout() }}>Sign Out of Netflix</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
