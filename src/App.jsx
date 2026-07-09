import React, { useEffect } from 'react'
import Home from './pages/Home/Home'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './pages/Login/Login'
import Player from './pages/Player/Player'
import MyList from './pages/MyList/MyList'
import TvShows from './pages/TvShows/TvShows'
import NewAndPopular from './pages/NewAndPopular/NewAndPopular'
import Languages from './pages/Languages/Languages'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        navigate('/');
      } else {
        navigate('/login');
      }
    })
  }, [])

  return (
    <div>
      <ToastContainer theme='dark' />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/player/:id' element={<Player />} />
        <Route path='/my-list' element={<MyList />} />
        <Route path='/tv-shows' element={<TvShows />} />
        <Route path='/new-popular' element={<NewAndPopular />} />
        <Route path='/languages' element={<Languages />} />
      </Routes>
    </div>
  )
}

export default App
