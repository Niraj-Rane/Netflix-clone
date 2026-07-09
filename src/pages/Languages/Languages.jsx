import React, { useState } from 'react'
import './Languages.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import TitleCards from '../../components/TitleCards/TitleCards'

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'ko', label: 'Korean' },
  { code: 'ja', label: 'Japanese' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'te', label: 'Telugu' },
  { code: 'ta', label: 'Tamil' },
];

const Languages = () => {
  const [selected, setSelected] = useState('en');

  return (
    <div className='languages'>
      <Navbar />
      <div className="languages-content">
        <h1>Browse by Language</h1>
        <div className="language-picker">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              className={`language-pill ${selected === lang.code ? 'active' : ''}`}
              onClick={() => setSelected(lang.code)}
            >
              {lang.label}
            </button>
          ))}
        </div>

        <TitleCards
          key={selected}
          title={`Popular in ${LANGUAGES.find(l => l.code === selected)?.label}`}
          mediaType="movie"
          endpointOverride={`discover/movie?with_original_language=${selected}&sort_by=popularity.desc`}
        />
      </div>
      <Footer />
    </div>
  )
}

export default Languages
