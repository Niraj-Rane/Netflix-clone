import React from 'react'
import './NewAndPopular.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import TitleCards from '../../components/TitleCards/TitleCards'

const NewAndPopular = () => {
  return (
    <div className='new-popular'>
      <Navbar />
      <div className="new-popular-content">
        <h1>New &amp; Popular</h1>
        <TitleCards title="New Releases" mediaType="movie" category="now_playing" />
        <TitleCards title="Coming Soon" mediaType="movie" category="upcoming" />
        <TitleCards title="Trending Now" mediaType="movie" category="popular" />
        <TitleCards title="New & Popular TV" mediaType="tv" category="airing_today" />
      </div>
      <Footer />
    </div>
  )
}

export default NewAndPopular
