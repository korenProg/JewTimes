import { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Flame, 
  Star, 
  Scroll, 
  Moon, 
  Sunset, 
  Sunrise, 
  Info,
  X
} from 'lucide-react';
// יש להחליף את הנתיב בהתאם למבנה הפרויקט שלך
// import './Calendar.css'; 
import { useCalendarEvents } from '../../hooks/useCalendarEvents'; 
import './Calendar.css';

// --- Utility Functions (ללא שינוי מהותי) ---

const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const translateToHebrew = (text) => {
  if (!text) return '';
  const translations = {
    'Parashat': 'פרשת', 'Shabbat': 'שבת', 'Rosh Chodesh': 'ראש חודש', 'Chanukah': 'חנוכה',
    'Purim': 'פורים', 'Pesach': 'פסח', 'Shavuot': 'שבועות', 'Rosh Hashana': 'ראש השנה',
    'Yom Kippur': 'יום כיפור', 'Sukkot': 'סוכות', 'Simchat Torah': 'שמחת תורה',
    'Tu BiShvat': 'ט״ו בשבט', 'Lag BaOmer': 'ל״ג בעומר', 'Tish\'a B\'Av': 'תשעה באב',
    'candle lighting': 'הדלקת נרות', 'Havdalah': 'הבדלה', 'Mevarchim Chodesh': 'מברכים החודש',
    'fast': 'צום', 'of': 'של', 'israel': 'ישראל'
  };
  let result = text;
  for (const [eng, heb] of Object.entries(translations)) {
    result = result.replace(new RegExp(`\\b${eng}\\b`, 'gi'), heb);
  }
  return result;
};

// --- Main Component ---

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // --- אנימציה ---
  useEffect(() => {
    if (isAnimating) {
      const timeout = setTimeout(() => {
        setIsAnimating(false);
      }, 400); 
      return () => clearTimeout(timeout);
    }
  }, [isAnimating, currentDate]);

  const [selectedCity] = useState(() => {
    const saved = localStorage.getItem('selectedCity');
    return saved ? parseInt(saved) : 281184; 
  });

  const { events, loading, error } = useCalendarEvents(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    selectedCity
  );

  // --- Helpers ---
  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const dateKey = formatDateKey(date);
    setSelectedEvent(events[dateKey] || { dateKey, isEmpty: true }); 
  };
  
  const getEventIcon = (event) => {
    if (!event) return null;
    const name = event.name?.toLowerCase() || '';
    if (name.includes('parashat') || name.includes('shabbat')) return <Scroll size={14} style={{ color: '#d97706' }} />; 
    if (name.includes('rosh chodesh')) return <Moon size={14} style={{ color: '#60a5fa' }} />; 
    if (name.includes('havdalah')) return <Star size={14} style={{ color: '#9333ea' }} />; 
    if (name.includes('lighting')) return <Flame size={14} style={{ color: '#c05621' }} />;
    if (name.includes('chanukah') || name.includes('purim') || name.includes('pesach') || name.includes('sukkot') || name.includes('shavuot') || name.includes('yom kippur') || name.includes('rosh hashana')) return <Flame size={14} style={{ color: '#f97316' }} />; 
    return <Info size={14} style={{ color: '#6b7280' }} />;
  };

  const handleMonthChange = (direction) => {
      setIsAnimating(true); 
      setSelectedDate(null);
      setSelectedEvent(null);
      setTimeout(() => {
        setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + direction));
      }, 10);
  };


  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const allCells = [];
    const today = new Date();

    const totalCells = Math.ceil((daysInMonth + firstDay) / 7) * 7;

    // Empty cells start (שימוש בקלאסים)
    for (let i = 0; i < firstDay; i++) {
      allCells.push(<div key={`empty-start-${i}`} className="day-cell empty" />);
    }

    // Days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateKey = formatDateKey(date);
      const event = events[dateKey];
      
      const isToday = formatDateKey(today) === dateKey;
      const isSelected = selectedDate && formatDateKey(selectedDate) === dateKey;
      const isShabbat = date.getDay() === 6;

      // בניית הקלאסים
      let cellClasses = "day-cell";
      if (isShabbat) cellClasses += " shabbat-bg";
      if (isSelected) cellClasses += " selected";

      // חילוץ יום החודש העברי (כבר בגימטריה)
      const hebrewDayGematria = event?.hebrewDate?.split(' ')[0] || '';

      allCells.push(
        <div
          key={dateKey}
          onClick={() => handleDateClick(date)}
          className={cellClasses}
        >
          {/* Day Number Header: תאריך לועזי + תאריך עברי בגימטריה */}
          <div className="day-number-header">
            {/* תאריך לועזי */}
            <span className={`secular-day-num ${isToday ? 'today' : ''}`}>
              {day}
            </span>
            
            {/* תאריך עברי בגימטריה */}
            {event && event.hebrewDate && (
              <span className="hebrew-day-gematria">
                {hebrewDayGematria}
              </span>
            )}
          </div>

          {/* Events List in Cell */}
          <div className="cell-events-list">
            {event && event.name && ( 
              <>
                {/* Main Event Name */}
                <div className="main-event-pill">
                  {getEventIcon(event)}
                  <span>
                    {translateToHebrew(event.name.split(',')[0])} 
                  </span>
                </div>

                {/* Candles / Times Pills */}
                {event.candleLighting && (
                  <div className="time-pill candles">
                    <Flame size={10} />
                    <span>{event.candleLighting}</span>
                  </div>
                )}
                {event.havdalah && (
                  <div className="time-pill havdalah">
                    <Star size={10} />
                    <span>{event.havdalah}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      );
    }

    // Empty cells end
    while (allCells.length < totalCells) {
      allCells.push(<div key={`empty-end-${allCells.length}`} className="day-cell empty" />);
    }

    return allCells;
  };

  if (loading) return (
    <div className="calendar-page-container">
        <div className="calendar-main-area">
            <h1 style={{ padding: '2rem', textAlign: 'center' }}>טוען נתונים...</h1>
        </div>
    </div>
  );
  
  if (error) return (
    <div className="calendar-page-container">
        <div className="calendar-main-area">
            <h1 style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>שגיאה בטעינת הנתונים</h1>
        </div>
    </div>
  );

  return (
    <div className="calendar-page-container">
      
      {/* Main Calendar Area */}
      <div className="calendar-main-area">
        
        {/* Header */}
        <header className="calendar-header">
          <div className="calendar-header-title">
            <div className="calendar-icon-bg">
              <CalendarIcon size={24} />
            </div>
            <div>
              <h1 className="month-title">
                {currentDate.toLocaleString('he-IL', { month: 'long', year: 'numeric' })}
              </h1>
              <p className="month-subtitle">לוח שנה עברי-לועזי</p>
            </div>
          </div>

          <div className="calendar-nav">
            <button 
              onClick={() => handleMonthChange(1)} 
              className="nav-button">
                <ChevronRight size={20} />
            </button>
            <button 
              onClick={() => {
                const now = new Date();
                setCurrentDate(now);
                handleDateClick(now);
              }} 
              className="today-button">היום</button>
            <button 
              onClick={() => handleMonthChange(-1)} 
              className="nav-button">
                <ChevronLeft size={20} />
            </button>
          </div>
        </header>

        {/* Grid Header */}
        <div className="calendar-grid-header">
          {['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'].map((day, i) => (
            <div key={day} className={`calendar-day-name ${i === 6 ? 'shabbat' : ''}`}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid - עם אנימציה וקלאסים */}
        <div 
            key={`${currentDate.getFullYear()}-${currentDate.getMonth()}`}
            className={`calendar-grid-content ${isAnimating ? 'is-animating' : ''}`}
        >
          {renderCalendarGrid()}
        </div>
      </div>

      {/* Sidebar / Detail Panel */}
      <div className={`calendar-sidebar ${selectedEvent ? 'is-open' : ''}`}>
        {selectedEvent && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Sidebar Header */}
            <div className="sidebar-header">
              <div>
                <h2 className="sidebar-date-title">
                  {selectedDate?.toLocaleDateString('he-IL', { day: 'numeric', month: 'long' })}
                </h2>
                <p className="sidebar-date-subtitle">
                  {selectedDate?.toLocaleDateString('he-IL', { weekday: 'long' })} • {selectedEvent.hebrewDate || 'אין תאריך עברי'}
                </p>
              </div>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="sidebar-close-btn"
              >
                <X size={20} />
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="sidebar-content">
              
              {!selectedEvent.isEmpty && selectedEvent.name ? (
                <>
                  {/* Event Detail Card */}
                  <div className={`event-detail-card ${selectedEvent.type === 'holiday' ? 'holiday-type' : ''}`}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: selectedEvent.type === 'holiday' ? '#fde68a' : '#93c5fa', color: '#1f2937' }}>
                        {getEventIcon(selectedEvent)}
                      </div>
                      <h3>{translateToHebrew(selectedEvent.name)}</h3>
                    </div>
                    {selectedEvent.description && (
                      <p>{translateToHebrew(selectedEvent.description)}</p>
                    )}
                  </div>

                  {/* Times Section */}
                  {(selectedEvent.candleLighting || selectedEvent.havdalah) && (
                    <div className="daily-times-box">
                      <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', margin: 0 }}>זמני היום</h4>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {selectedEvent.candleLighting && (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ padding: '6px', backgroundColor: '#fed7aa', color: '#ea580c', borderRadius: '6px' }}><Flame size={18} /></div>
                              <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>כניסת שבת/חג</span>
                            </div>
                            <span style={{ fontSize: '18px', fontFamily: 'monospace', fontWeight: '500', color: '#1f2937', backgroundColor: '#f0f0f0', padding: '4px 8px', borderRadius: '4px' }}>{selectedEvent.candleLighting}</span>
                          </div>
                        )}
                        {selectedEvent.havdalah && (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ padding: '6px', backgroundColor: '#e0e7ff', color: '#4f46e5', borderRadius: '6px' }}><Star size={18} /></div>
                              <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>צאת שבת/חג</span>
                            </div>
                            <span style={{ fontSize: '18px', fontFamily: 'monospace', fontWeight: '500', color: '#1f2937', backgroundColor: '#f0f0f0', padding: '4px 8px', borderRadius: '4px' }}>{selectedEvent.havdalah}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.6 }}>
                  <div style={{ margin: '0 auto', backgroundColor: '#f0f0f0', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}><CalendarIcon size={30} style={{ color: '#6b7280' }} /></div>
                  <p style={{ color: '#6b7280' }}>אין אירועים מיוחדים בתאריך זה</p>
                </div>
              )}

              {/* General Daily Times */}
              <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '24px' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', margin: 0 }}>זמנים כלליים (משוער)</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                   <div style={{ backgroundColor: '#f0f0f0', padding: '12px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Sunrise size={20} style={{ color: '#fb923c', marginBottom: '4px' }} /><span style={{ fontSize: '10px', color: '#6b7280' }}>נץ החמה</span><span style={{ fontSize: '14px', fontWeight: '600' }}>06:15</span>
                   </div>
                   <div style={{ backgroundColor: '#f0f0f0', padding: '12px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Sunset size={20} style={{ color: '#60a5fa', marginBottom: '4px' }} /><span style={{ fontSize: '10px', color: '#6b7280' }}>שקיעה</span><span style={{ fontSize: '14px', fontWeight: '600' }}>17:40</span>
                   </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
      
      {/* Backdrop */}
      {selectedEvent && (
        <div 
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: 40, transition: 'opacity 0.3s' }}
          onClick={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

export default Calendar;