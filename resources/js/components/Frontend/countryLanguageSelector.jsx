import React, { useState, useRef, useEffect } from 'react';

const CountryLanguageDropdown = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const countries = [
    { code: 'US', name: 'English', flag: 'https://img.freepik.com/free-photo/flag-united-states-america_1401-253.jpg?t=st=1746366632~exp=1746370232~hmac=3538d88186d30237afbe868e12d58a5c62d1d623afcc691387513d402d7d06a4&w=996', lang: 'en' },
    { code: 'FR', name: 'Armanian', flag: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Flag_of_Armenia.svg', lang: 'AR' },
    { code: 'DE', name: 'Russian', flag: 'https://cdn.pixabay.com/photo/2013/07/13/14/17/russia-162400_1280.png', lang: 'RS' },

  ];

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    console.log('Selected country:', country);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && 
          !dropdownRef.current.contains(event.target) && 
          isOpen) {
        setIsOpen(false);
      }
    };

    // Add when dropdown is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="dropdown" onClick={() => setIsOpen(!isOpen)} ref={dropdownRef}>
      <button 
        className="btn btn-transparent dropdown-toggle d-flex align-items-center gap-1"
        type="button"
        id="countryDropdown"
        aria-expanded={isOpen}
      >
        <span className="fs-5">
          {selectedCountry ? <img src={selectedCountry.flag } alt="" width="20" height="20" /> : <img src={countries[0].flag} alt="" width="20" height="20" />}
        </span>
        <span>
          {selectedCountry ? selectedCountry.name : countries[0].name || 'Select Language'}
        </span>
      </button>

      <div 
        className={`dropdown-menu ${isOpen ? 'show' : ''}`} 
        aria-labelledby="countryDropdown"
        style={{ minWidth: '200px' }}
      >
        {countries.map((country) => (
          <button
            key={country.code}
            className="dropdown-item d-flex align-items-center gap-3 py-2"
            onClick={() => handleCountrySelect(country)}
            onKeyPress={(e) => e.key === 'Enter' && handleCountrySelect(country)}
            role="option"
            tabIndex={0}
          >
            <span className="fs-4">
                <img src={country.flag} alt="" width="20" height="20" />
            </span>
            <div className="d-flex flex-column">
              <span className="fw-medium">{country.name}</span>
              <small className="text-muted text-uppercase">{country.code}</small>
            </div>
          </button>
        ))}
      </div>

      <style>{`
        .dropdown-toggle::after {
          vertical-align: middle;
        }
        .dropdown-item:focus {
          background-color: #f8f9fa;
        }
        .fs-4 {
          width: 32px;
        }
        .dropdown-menu {
          max-height: 300px;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
};

export default CountryLanguageDropdown;