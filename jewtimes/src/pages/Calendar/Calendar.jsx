import { useState, useEffect } from 'react';
import { useCalendarEvents } from '../../hooks/useCalendarEvents';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  const [selectedCity] = useState(() => {
    const saved = localStorage.getItem('selectedCity');
    return saved ? parseInt(saved) : 294071;
  });

  const { events, loading, error } = useCalendarEvents(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    selectedCity
  );

  const translateToHebrew = (text) => {
    if (!text) return '';
    
    const translations = {
      'Parashat': 'פרשת',
      'Shabbat': 'שבת',
      'Rosh Chodesh': 'ראש חודש',
      'Chanukah': 'חנוכה',
      'Purim': 'פורים',
      'Pesach': 'פסח',
      'Shavuot': 'שבועות',
      'Rosh Hashana': 'ראש השנה',
      'Yom Kippur': 'יום כיפור',
      'Sukkot': 'סוכות',
      'Shmini Atzeret': 'שמיני עצרת',
      'Simchat Torah': 'שמחת תורה',
      'Tu BiShvat': 'ט״ו בשבט',
      'Lag BaOmer': 'ל״ג בעומר',
      'Tish\'a B\'Av': 'תשעה באב',
      'Shabbat Shekalim': 'שבת שקלים',
      'Shabbat Zachor': 'שבת זכור',
      'Shabbat Parah': 'שבת פרה',
      'Shabbat HaChodesh': 'שבת החודש',
      'Shabbat HaGadol': 'שבת הגדול',
      'Shabbat Chazon': 'שבת חזון',
      'Shabbat Nachamu': 'שבת נחמו',
      'Shabbat Shuva': 'שבת שובה',
      'candle lighting': 'הדלקת נרות',
      'Havdalah': 'הבדלה'
    };

    let result = text;
    for (const [eng, heb] of Object.entries(translations)) {
      result = result.replace(new RegExp(eng, 'gi'), heb);
    }
    return result;
  };

  const getHebrewMonth = (month) => {
    const hebrewMonths = [
      'טבת', 'שבט', 'אדר', 'ניסן', 'אייר', 'סיון',
      'תמוז', 'אב', 'אלול', 'תשרי', 'חשוון', 'כסלו'
    ];
    return hebrewMonths[month];
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthNames = [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
  ];

  const weekDays = ['ש', 'ו', 'ה', 'ד', 'ג', 'ב', 'א'];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    setSelectedDate(null);
    setSelectedEvent(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    setSelectedDate(null);
    setSelectedEvent(null);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
    const dateKey = formatDateKey(today);
    if (events[dateKey]) {
      setSelectedEvent(events[dateKey]);
    }
  };

  const formatDateKey = (date) => {
    return date.toISOString().split('T')[0];
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const dateKey = formatDateKey(date);
    setSelectedEvent(events[dateKey] || null);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const today = new Date();

    // Adjust for RTL: Sunday (0) should be on the right
    const rtlFirstDay = (6 - firstDay + 7) % 7;
    
    for (let i = 0; i < rtlFirstDay; i++) {
      days.push(<div key={`empty-${i}`} style={{ background: 'transparent' }}></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateKey = formatDateKey(date);
      const event = events[dateKey];
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      const isWeekend = date.getDay() === 5 || date.getDay() === 6;
      const isFriday = date.getDay() === 5;
      const isSaturday = date.getDay() === 6;
      const hasCandleLighting = isFriday && event?.candleLighting;
      const hasHavdalah = isSaturday && event?.havdalah;

      let dayStyle = {
        aspectRatio: '1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        background: '#f8f9fa',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        padding: '0.4rem 0.2rem',
        position: 'relative',
        minHeight: '80px',
        border: '1px solid #e9ecef'
      };

      if (isToday) {
        dayStyle.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        dayStyle.color = 'white';
        dayStyle.fontWeight = '700';
        dayStyle.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
        dayStyle.border = '2px solid #667eea';
      } else if (isSelected) {
        dayStyle.background = '#1e56a0';
        dayStyle.color = 'white';
        dayStyle.transform = 'scale(1.03)';
        dayStyle.boxShadow = '0 2px 8px rgba(30, 86, 160, 0.3)';
        dayStyle.border = '2px solid #1e56a0';
      } else if (event?.type === 'shabbat' || isSaturday) {
        dayStyle.background = 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)';
        dayStyle.border = '2px solid #9c27b0';
        dayStyle.fontWeight = '600';
      } else if (event?.type === 'holiday') {
        dayStyle.background = 'linear-gradient(135deg, #fff9c4 0%, #fff59d 100%)';
        dayStyle.border = '2px solid #fbc02d';
        dayStyle.fontWeight = '600';
      } else if (isWeekend) {
        dayStyle.background = '#fef5f5';
      }

      days.push(
        <div
          key={day}
          style={dayStyle}
          onClick={() => handleDateClick(date)}
          onMouseEnter={(e) => {
            if (!isToday && !isSelected) {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected) {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '';
            }
          }}
        >
          <div style={{ 
            fontSize: '1rem', 
            fontWeight: isToday || isSelected ? '700' : '600',
            marginBottom: '0.3rem',
            marginTop: '0.1rem'
          }}>
            {day}
          </div>
          
          {event && (
            <div style={{ 
              fontSize: '0.7rem', 
              textAlign: 'center',
              fontWeight: '500',
              lineHeight: '1.2',
              maxWidth: '95%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              opacity: 0.9
            }}>
              {translateToHebrew(event.name.split(' ').slice(0, 2).join(' '))}
            </div>
          )}
          
          {hasCandleLighting && (
            <div style={{
              marginTop: 'auto',
              fontSize: '0.65rem',
              fontWeight: '600',
              background: 'rgba(255,255,255,0.9)',
              padding: '2px 4px',
              borderRadius: '4px',
              color: '#764ba2',
              display: 'flex',
              alignItems: 'center',
              gap: '2px'
            }}>
              <span>🕯️</span>
              <span>{event.candleLighting}</span>
            </div>
          )}
          
          {hasHavdalah && (
            <div style={{
              marginTop: 'auto',
              fontSize: '0.65rem',
              fontWeight: '600',
              background: 'rgba(255,255,255,0.9)',
              padding: '2px 4px',
              borderRadius: '4px',
              color: '#764ba2',
              display: 'flex',
              alignItems: 'center',
              gap: '2px'
            }}>
              <span>⭐</span>
              <span>{event.havdalah}</span>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '1.5rem',
        fontFamily: "'Noto Sans Hebrew', sans-serif"
      }}>
        טוען לוח שנה...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        color: 'white',
        fontSize: '1.2rem',
        fontFamily: "'Noto Sans Hebrew', sans-serif",
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
        <div>שגיאה בטעינת לוח השנה</div>
        <div style={{ fontSize: '1rem', marginTop: '0.5rem', opacity: 0.8 }}>{error}</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '1.5rem',
      direction: 'rtl',
      fontFamily: "'Noto Sans Hebrew', sans-serif",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
      
      <div style={{
        maxWidth: '1000px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: selectedEvent ? '2fr 1fr' : '1fr',
        gap: '1.2rem',
        alignItems: 'start'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          height: 'fit-content'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '1rem',
            paddingBottom: '1rem',
            borderBottom: '2px solid #f0f0f0'
          }}>
            <h1 style={{
              fontSize: '1.6rem',
              fontWeight: '700',
              color: '#1E56A0',
              margin: 0
            }}>
              לוח שנה עברי
            </h1>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <button
              onClick={nextMonth}
              style={{
                background: '#f8f9fa',
                border: '1px solid #e9ecef',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                fontWeight: '600'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#667eea';
                e.target.style.color = 'white';
                e.target.style.borderColor = '#667eea';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#f8f9fa';
                e.target.style.color = 'inherit';
                e.target.style.borderColor = '#e9ecef';
              }}
            >
              ←
            </button>

            <div style={{ textAlign: 'center' }}>
              <h2 style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                color: '#1E56A0',
                marginBottom: '0.2rem'
              }}>
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <p style={{
                fontSize: '0.85rem',
                color: '#667eea',
                fontWeight: '600',
                margin: 0
              }}>
                {getHebrewMonth(currentDate.getMonth())} תשפ״ה
              </p>
            </div>

            <button
              onClick={previousMonth}
              style={{
                background: '#f8f9fa',
                border: '1px solid #e9ecef',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                fontWeight: '600'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#667eea';
                e.target.style.color = 'white';
                e.target.style.borderColor = '#667eea';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#f8f9fa';
                e.target.style.color = 'inherit';
                e.target.style.borderColor = '#e9ecef';
              }}
            >
              →
            </button>
          </div>

          <button
            onClick={goToToday}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '0.65rem 1.2rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '1rem',
              width: '100%',
              fontFamily: "'Noto Sans Hebrew', sans-serif",
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
            }}
          >
            חזור להיום
          </button>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '0.3rem',
            marginBottom: '0.5rem'
          }}>
            {weekDays.map((day, index) => (
              <div
                key={day}
                style={{
                  textAlign: 'center',
                  fontWeight: '700',
                  color: index <= 1 ? '#9c27b0' : '#666',
                  padding: '0.4rem',
                  fontSize: '0.8rem'
                }}
              >
                {day}
              </div>
            ))}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '0.3rem'
          }}>
            {renderCalendar()}
          </div>

          <div style={{
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid #f0f0f0',
            display: 'flex',
            gap: '0.8rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            fontSize: '0.8rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <div style={{ width: '14px', height: '14px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '3px' }}></div>
              <span>היום</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <div style={{ width: '14px', height: '14px', background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)', borderRadius: '3px', border: '1px solid #9c27b0' }}></div>
              <span>שבת</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <div style={{ width: '14px', height: '14px', background: 'linear-gradient(135deg, #fff9c4 0%, #fff59d 100%)', borderRadius: '3px', border: '1px solid #fbc02d' }}></div>
              <span>חג</span>
            </div>
          </div>
        </div>

        {selectedEvent && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            height: 'fit-content',
            position: 'sticky',
            top: '1.5rem',
            animation: 'slideInRight 0.3s ease'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.2rem'
            }}>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: '700',
                color: selectedEvent.type === 'holiday' ? '#fbc02d' : '#9c27b0',
                margin: 0
              }}>
                {translateToHebrew(selectedEvent.name)}
              </h3>
              <button
                onClick={() => {
                  setSelectedEvent(null);
                  setSelectedDate(null);
                }}
                style={{
                  background: '#f0f0f0',
                  border: 'none',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  color: '#666'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#e0e0e0';
                  e.target.style.color = '#333';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#f0f0f0';
                  e.target.style.color = '#666';
                }}
              >
                ✕
              </button>
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${selectedEvent.type === 'holiday' ? '#fff9c4' : '#f3e5f5'} 0%, ${selectedEvent.type === 'holiday' ? '#fff59d' : '#e1bee7'} 100%)`,
              padding: '1.2rem',
              borderRadius: '12px',
              border: `2px solid ${selectedEvent.type === 'holiday' ? '#fbc02d' : '#9c27b0'}`,
              marginBottom: '1.2rem',
              textAlign: 'center'
            }}>
              <p style={{ 
                fontSize: '1rem', 
                fontWeight: '600', 
                marginBottom: '0.3rem',
                color: '#333'
              }}>
                {selectedDate?.toLocaleDateString('he-IL', { weekday: 'long' })}
              </p>
              <p style={{ 
                fontSize: '0.9rem', 
                color: '#555',
                margin: 0
              }}>
                {selectedEvent.hebrewDate}
              </p>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem'
            }}>
              <div style={{
                background: '#f8f9fa',
                padding: '0.9rem',
                borderRadius: '8px'
              }}>
                <h4 style={{
                  fontSize: '0.8rem',
                  color: '#666',
                  marginBottom: '0.4rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  תיאור
                </h4>
                <p style={{
                  fontSize: '0.95rem',
                  color: '#1E56A0',
                  fontWeight: '600',
                  margin: 0,
                  lineHeight: '1.4'
                }}>
                  {translateToHebrew(selectedEvent.description)}
                </p>
              </div>

              {selectedEvent.type === 'shabbat' && (
                <>
                  {selectedEvent.candleLighting && (
                    <div style={{
                      background: '#f8f9fa',
                      padding: '0.9rem',
                      borderRadius: '8px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h4 style={{
                            fontSize: '0.8rem',
                            color: '#666',
                            marginBottom: '0.3rem',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            הדלקת נרות
                          </h4>
                          <p style={{
                            fontSize: '1.4rem',
                            color: '#9c27b0',
                            fontWeight: '700',
                            margin: 0
                          }}>
                            {selectedEvent.candleLighting}
                          </p>
                        </div>
                        <span style={{ fontSize: '1.8rem' }}>🕯️</span>
                      </div>
                    </div>
                  )}

                  {selectedEvent.havdalah && (
                    <div style={{
                      background: '#f8f9fa',
                      padding: '0.9rem',
                      borderRadius: '8px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h4 style={{
                            fontSize: '0.8rem',
                            color: '#666',
                            marginBottom: '0.3rem',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            הבדלה
                          </h4>
                          <p style={{
                            fontSize: '1.4rem',
                            color: '#9c27b0',
                            fontWeight: '700',
                            margin: 0
                          }}>
                            {selectedEvent.havdalah}
                          </p>
                        </div>
                        <span style={{ fontSize: '1.8rem' }}>⭐</span>
                      </div>
                    </div>
                  )}

                  {selectedEvent.isHolidayAndShabbat && (
                    <div style={{
                      background: 'linear-gradient(135deg, #fff9c4 0%, #fff59d 100%)',
                      padding: '0.9rem',
                      borderRadius: '8px',
                      border: '2px solid #fbc02d'
                    }}>
                      <h4 style={{
                        fontSize: '0.8rem',
                        color: '#666',
                        marginBottom: '0.4rem',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        שבת וחג ביחד
                      </h4>
                      <p style={{
                        fontSize: '0.95rem',
                        color: '#f57c00',
                        fontWeight: '600',
                        margin: 0
                      }}>
                        {translateToHebrew(selectedEvent.holidayName)}
                      </p>
                    </div>
                  )}
                </>
              )}

              {selectedEvent.type === 'holiday' && (
                <div style={{
                  background: '#f8f9fa',
                  padding: '0.9rem',
                  borderRadius: '8px'
                }}>
                  <h4 style={{
                    fontSize: '0.8rem',
                    color: '#666',
                    marginBottom: '0.4rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    סוג החג
                  </h4>
                  <p style={{
                    fontSize: '0.9rem',
                    color: '#666',
                    margin: 0
                  }}>
                    {selectedEvent.category === 'roshchodesh' ? 'ראש חודש' : 'חג'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;