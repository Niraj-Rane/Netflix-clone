import React from 'react'
import './TvShows.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import TitleCards from '../../components/TitleCards/TitleCards'

const TvShows = () => {
  return (
    <div className='tv-shows'>
      <Navbar />
      <div className="tv-shows-content">
        <h1>TV Shows</h1>
        <TitleCards title="Popular TV Shows" mediaType="tv" category="popular" />
        <TitleCards title="Top Rated" mediaType="tv" category="top_rated" />
        <TitleCards title="Airing Today" mediaType="tv" category="airing_today" />
        <TitleCards title="Currently On The Air" mediaType="tv" category="on_the_air" />
      </div>
      <Footer />
    </div>
  )
}

export default TvShows
