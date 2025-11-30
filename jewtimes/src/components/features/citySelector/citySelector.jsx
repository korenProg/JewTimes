import { useState } from 'react';
import './CitySelector.css';

// רשימת ערים מרכזיות בישראל עם GeoNames ID
export const cities = [
  { id: 281184, name: 'ירושלים', region: 'מרכז', candleMinutes: 40 },
  { id: 293397, name: 'תל אביב', region: 'מרכז', candleMinutes: 18 },
  { id: 294801, name: 'חיפה', region: 'צפון', candleMinutes: 18 },
  { id: 294946, name: 'באר שבע', region: 'דרום', candleMinutes: 18 },
  { id: 294117, name: 'ראשון לציון', region: 'מרכז', candleMinutes: 18 },
  { id: 293308, name: 'פתח תקווה', region: 'מרכז', candleMinutes: 18 },
  { id: 294071, name: 'כפר סבא', region: 'מרכז', candleMinutes: 18 },
  { id: 293703, name: 'נתניה', region: 'מרכז', candleMinutes: 18 },
  { id: 294098, name: 'חולון', region: 'מרכז', candleMinutes: 18 },
  { id: 293825, name: 'בני ברק', region: 'מרכז', candleMinutes: 18 },
  { id: 294904, name: 'רמת גן', region: 'מרכז', candleMinutes: 18 },
  { id: 295629, name: 'אשדוד', region: 'דרום', candleMinutes: 18 },
  { id: 295530, name: 'אשקלון', region: 'דרום', candleMinutes: 18 },
  { id: 294751, name: 'נצרת', region: 'צפון', candleMinutes: 18 },
  { id: 294420, name: 'מודיעין', region: 'מרכז', candleMinutes: 22 },
  { id: 295277, name: 'בית שמש', region: 'מרכז', candleMinutes: 30 },
  { id: 293522, name: 'הרצליה', region: 'מרכז', candleMinutes: 18 },
  { id: 293619, name: 'כרמיאל', region: 'צפון', candleMinutes: 18 },
  { id: 294514, name: 'אילת', region: 'דרום', candleMinutes: 18 },
  { id: 294801, name: 'טבריה', region: 'צפון', candleMinutes: 18 },
  { id: 293067, name: 'צפת', region: 'צפון', candleMinutes: 18 }
];

const CitySelector = ({ selectedCity, onCityChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCities = cities.filter(city =>
    city.name.includes(searchTerm)
  );

  const handleCitySelect = (city) => {
    onCityChange(city);
    setIsOpen(false);
    setSearchTerm('');
  };

  const currentCity = cities.find(c => c.id === selectedCity) || cities[0];

  return (
    <div className="city-selector">
      <button 
        className="city-selector-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="city-icon">📍</span>
        <span className="city-name">{currentCity.name}</span>
        <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="city-dropdown">
          <div className="search-box">
            <input
              type="text"
              placeholder="חפש עיר..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="city-search-input"
            />
          </div>

          <div className="cities-list">
            {filteredCities.length > 0 ? (
              filteredCities.map(city => (
                <button
                  key={city.id}
                  className={`city-item ${city.id === selectedCity ? 'selected' : ''}`}
                  onClick={() => handleCitySelect(city)}
                >
                  <span className="city-item-name">{city.name}</span>
                  <span className="city-item-region">{city.region}</span>
                  {city.id === selectedCity && (
                    <span className="checkmark">✓</span>
                  )}
                </button>
              ))
            ) : (
              <div className="no-results">לא נמצאו ערים</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CitySelector;