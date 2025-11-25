import { useState } from "react";
import "./Home.css";

const Home = () => {
  const [showCalendar, setShowCalendar] = useState(false);

  // Sample data - you'll replace this with real API data later
  const nextHoliday = {
    name: "חנוכה",
    hebrewDate: "כ״ה כסלו",
    gregorianDate: "25 דצמבר 2024",
    daysUntil: 31
  };

  const shabbat = {
    parasha: "פרשת וַיֵּצֵא",
    candleLighting: "16:15",
    havdalah: "17:30",
    date: "29 נובמבר 2024"
  };

  const holidays = [
    { name: "חנוכה", date: "כ״ה כסלו", gregorian: "25 דצמבר" },
    { name: "פורים", date: "י״ד אדר", gregorian: "14 מרץ" },
    { name: "פסח", date: "ט״ו ניסן", gregorian: "13 אפריל" },
    { name: "שבועות", date: "ו׳ סיוון", gregorian: "2 יוני" },
    { name: "ראש השנה", date: "א׳ תשרי", gregorian: "23 ספטמבר" },
    { name: "יום כיפור", date: "י׳ תשרי", gregorian: "2 אוקטובר" },
    { name: "סוכות", date: "ט״ו תשרי", gregorian: "7 אוקטובר" },
  ];

  return (
    <div className="home">
      <div className="home-header">
        <h1 className="home-title">זמנים יהודיים</h1>
        <p className="home-subtitle">כל המידע על זמני תפילה, פרשיות וחגים במקום אחד</p>
      </div>

      <div className="cards-container">
        {/* Holiday Card */}
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

        {/* Shabbat Card */}
        <div className="time-card shabbat-card">
          <div className="card-icon">🕯️</div>
          <h2 className="card-title">שבת הקרובה</h2>
          
          <div className="card-content">
            <h3 className="parasha-name">{shabbat.parasha}</h3>
            
            <div className="shabbat-date">{shabbat.date}</div>

            <div className="shabbat-times">
              <div className="time-row candles">
                <div className="time-icon">🕯️</div>
                <div className="time-info">
                  <span className="time-label">הדלקת נרות</span>
                  <span className="time-value">{shabbat.candleLighting}</span>
                </div>
              </div>

              <div className="time-divider"></div>

              <div className="time-row havdalah">
                <div className="time-icon">⭐</div>
                <div className="time-info">
                  <span className="time-label">צאת השבת</span>
                  <span className="time-value">{shabbat.havdalah}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Card */}
        <div className="time-card calendar-card">
          <div className="card-icon">📆</div>
          <h2 className="card-title">לוח חגים</h2>
          
          <div className="card-content">
            {!showCalendar ? (
              <div className="calendar-preview">
                <p className="calendar-description">
                  צפו בלוח השנה המלא עם כל החגים והמועדים
                </p>
                <button 
                  className="open-calendar-btn"
                  onClick={() => setShowCalendar(true)}
                >
                  פתח לוח שנה
                </button>
              </div>
            ) : (
              <div className="calendar-view">
                <div className="calendar-header">
                  <h3>חגים ומועדים תשפ״ה</h3>
                  <button 
                    className="close-calendar-btn"
                    onClick={() => setShowCalendar(false)}
                  >
                    ✕
                  </button>
                </div>
                
                <div className="holidays-list">
                  {holidays.map((holiday, index) => (
                    <div key={index} className="holiday-item">
                      <div className="holiday-item-icon">🎉</div>
                      <div className="holiday-item-info">
                        <span className="holiday-item-name">{holiday.name}</span>
                        <span className="holiday-item-date">
                          {holiday.date} • {holiday.gregorian}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;