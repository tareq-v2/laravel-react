
import React, { useState, useRef, useEffect, useContext } from 'react';
import { LanguageContext } from './src/context/LanguageContext';

const CountryLanguageDropdown = () => {
  const { language, changeLanguage } = useContext(LanguageContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const countries = [
    { code: 'US', name: 'English', flag: 'https://img.freepik.com/free-photo/flag-united-states-america_1401-253.jpg?t=st=1746366632~exp=1746370232~hmac=3538d88186d30237afbe868e12d58a5c62d1d623afcc691387513d402d7d06a4&w=996', lang: 'en' },
    { code: 'AM', name: 'Armenian', flag: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Flag_of_Armenia.svg', lang: 'ar' },
    { code: 'RU', name: 'Russian', flag: 'https://cdn.pixabay.com/photo/2013/07/13/14/17/russia-162400_1280.png', lang: 'rs' },
  ];

  const selectedCountry = countries.find(c => c.lang === language) || countries[0];

  const handleCountrySelect = (country) => {
    changeLanguage(country.lang);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && 
          !dropdownRef.current.contains(event.target) && 
          isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button 
        className="btn btn-transparent dropdown-toggle d-flex align-items-center gap-1"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Select language"
      >
        <img 
          src={selectedCountry.flag} 
          alt={selectedCountry.name} 
          width="20" 
          height="15" 
          className="border"
        />
        <span className="d-none d-sm-inline">{selectedCountry.name}</span>
      </button>

      <div 
        className={`dropdown-menu ${isOpen ? 'show' : ''}`} 
        style={{ minWidth: '200px' }}
      >
        {countries.map((country) => (
          <button
            key={country.code}
            className="dropdown-item d-flex align-items-center gap-3 py-2"
            onClick={() => handleCountrySelect(country)}
            onKeyDown={(e) => e.key === 'Enter' && handleCountrySelect(country)}
            role="option"
            aria-selected={country.lang === language}
            tabIndex={0}
          >
            <img 
              src={country.flag} 
              alt="" 
              width="20" 
              height="15" 
              className="border"
            />
            <div className="d-flex flex-column">
              <span className="fw-medium">{country.name}</span>
              <small className="text-muted text-uppercase">{country.code}</small>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CountryLanguageDropdown;