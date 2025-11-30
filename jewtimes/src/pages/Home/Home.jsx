import { useState, useEffect } from "react";
import "./Home.css";
import { useShabbatTimes, useHolidays } from "../../hooks";
import CitySelector, { cities } from "../../components/features/citySelector/citySelector";
import { useNavigate } from "react-router-dom"; // הוסף את זה

const Home = () => {
  const navigate = useNavigate(); // הוסף את זה
  
  // ניהול העיר הנבחרת - שמירה ב-localStorage
  const [selectedCity, setSelectedCity] = useState(() => {
    const saved = localStorage.getItem('selectedCity');
    return saved ? parseInt(saved) : 294071; // כפר סבא כברירת מחדל
  });

  // שמירת העיר ב-localStorage כשהיא משתנה
  useEffect(() => {
    localStorage.setItem('selectedCity', selectedCity.toString());
  }, [selectedCity]);

  // מציאת פרטי העיר הנוכחית
  const currentCityData = cities.find(c => c.id === selectedCity) || cities[0];
  
  // שימוש ב-hooks עם העיר הנבחרת ודקות הדלקת נרות המתאימות
  const { shabbatData, loading: shabbatLoading, error: shabbatError } = useShabbatTimes(
    selectedCity, 
    currentCityData.candleMinutes
  );
  const { holidays, nextHoliday, loading: holidaysLoading, error: holidaysError } = useHolidays(
    2025, 
    selectedCity
  );

  const handleCityChange = (city) => {
    setSelectedCity(city.id);
  };

  // טיפול במצבי loading
  if (shabbatLoading || holidaysLoading) {
    return (
      <div className="home">
        <div className="home-header">
          <h1 className="home-title">זמנים יהודיים</h1>
          <p className="home-subtitle">טוען נתונים...</p>
        </div>
      </div>
    );
  }

  // טיפול בשגיאות
  if (shabbatError || holidaysError) {
    return (
      <div className="home">
        <div className="home-header">
          <h1 className="home-title">זמנים יהודיים</h1>
          <p className="home-subtitle" style={{ color: 'red' }}>
            שגיאה בטעינת הנתונים: {shabbatError || holidaysError}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="home-header">
        <h1 className="home-title">זמנים יהודיים</h1>
        <p className="home-subtitle">כל המידע על זמני תפילה, פרשיות וחגים במקום אחד</p>
        
        {/* בורר עיר */}
        <CitySelector 
          selectedCity={selectedCity}
          onCityChange={handleCityChange}
        />
      </div>

      <div className="cards-container">
        {/* Holiday Card */}
        {nextHoliday && (
          <div className="time-card holiday-card">
            <div className="card-icon">📅</div>
            <h2 className="card-title">החג הקרוב</h2>
            
            <div className="card-content">
              <h3 className="holiday-name">{nextHoliday.name}</h3>
              
              <div className="countdown">
                <span className="countdown-number">{nextHoliday.daysUntil}</span>
                <span className="countdown-label">ימים</span>
              </div>

              <div className="dates-info">
                <div className="date-row">
                  <span className="date-label">תאריך עברי:</span>
                  <span className="date-value">{nextHoliday.hebrewDate}</span>
                </div>
                <div className="date-row">
                  <span className="date-label">תאריך לועזי:</span>
                  <span className="date-value">{nextHoliday.gregorianDate}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Shabbat Card */}
        {shabbatData && (
          <div className="time-card shabbat-card">
            <div className="card-icon">🕯️</div>
            <h2 className="card-title">שבת הקרובה</h2>
            
            <div className="card-content">
              <h3 className="parasha-name">{shabbatData.parasha}</h3>
              
              <div className="shabbat-date">{shabbatData.date}</div>

              <div className="shabbat-times">
                <div className="time-row candles">
                  <div className="time-icon">🕯️</div>
                  <div className="time-info">
                    <span className="time-label">הדלקת נרות</span>
                    <span className="time-value">{shabbatData.candleLighting}</span>
                  </div>
                </div>

                <div className="time-divider"></div>

                <div className="time-row havdalah">
                  <div className="time-icon">⭐</div>
                  <div className="time-info">
                    <span className="time-label">צאת השבת</span>
                    <span className="time-value">{shabbatData.havdalah}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calendar Card - עכשיו כפתור שמוביל לעמוד נפרד */}
        <div 
          className="time-card calendar-card clickable-card"
          onClick={() => navigate('/calendar')}
        >
          <div className="card-icon">📆</div>
          <h2 className="card-title">לוח שנה עברי</h2>
          
          <div className="card-content">
            <div className="calendar-preview">
              <p className="calendar-description">
                לוח שנה מלא עם תאריכים עברים ולועזיים, חגים ומועדים
              </p>
              <div className="calendar-features">
                <div className="feature-item">
                  <span className="feature-icon">📅</span>
                  <span>תאריכים עברים</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🎉</span>
                  <span>חגים ומועדים</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🕯️</span>
                  <span>שבתות ומנוחה</span>
                </div>
              </div>
              <div className="open-calendar-btn">
                <span>פתח לוח שנה</span>
                <span className="arrow">←</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;