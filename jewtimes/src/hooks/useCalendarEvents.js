import { useState, useEffect } from 'react';

/**
 * Hook לשליפת אירועי לוח שנה (חגים ושבתות) מ-Hebcal API
 * @param {number} year - השנה הגרגוריאנית
 * @param {number} month - החודש (0-11)
 * @param {number} geonameid - מזהה העיר
 */
export const useCalendarEvents = (year, month, geonameid = 294071) => {
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);

      try {
        // מחשבים תאריך התחלה וסיום של החודש
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);

        // פורמט YYYY-MM-DD
        const formatDate = (date) => {
          return date.toISOString().split('T')[0];
        };

        const start = formatDate(startDate);
        const end = formatDate(endDate);

        // קריאה ל-API
        const response = await fetch(
          `https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&min=on&mod=on&nx=on&year=${year}&month=x&ss=on&mf=on&c=on&geo=geoname&geonameid=${geonameid}&M=on&s=on&start=${start}&end=${end}&lg=he`
        );

        if (!response.ok) {
          throw new Error('שגיאה בטעינת נתוני לוח השנה');
        }

        const data = await response.json();

        // ארגון האירועים לפי תאריך
        const eventsMap = {};

        data.items.forEach(item => {
          const date = item.date;
          const category = item.category;

          // יצירת אובייקט אירוע
          let eventType = 'other';
          let eventData = {
            name: item.hebrew || item.title,
            description: item.title,
            hebrewDate: item.hdate,
            category: category
          };

          // זיהוי סוג האירוע
          if (category === 'candles') {
            // הדלקת נרות
            if (!eventsMap[date]) eventsMap[date] = {};
            eventsMap[date].candleLighting = item.title.match(/\d{2}:\d{2}/)?.[0];
          } else if (category === 'havdalah') {
            // הבדלה
            if (!eventsMap[date]) eventsMap[date] = {};
            eventsMap[date].havdalah = item.title.match(/\d{2}:\d{2}/)?.[0];
          } else if (category === 'parashat') {
            // פרשת שבוע
            eventType = 'shabbat';
            eventData.name = item.hebrew || item.title;
            eventData.description = `שבת קודש - ${item.hebrew || item.title}`;
            
            if (!eventsMap[date]) {
              eventsMap[date] = { type: eventType, ...eventData };
            } else {
              eventsMap[date] = { ...eventsMap[date], type: eventType, ...eventData };
            }
          } else if (category === 'holiday' || category === 'roshchodesh') {
            // חגים וראש חודש
            eventType = 'holiday';
            eventData.description = item.memo || item.hebrew || item.title;
            
            if (!eventsMap[date] || eventsMap[date].type !== 'shabbat') {
              eventsMap[date] = { type: eventType, ...eventData };
            } else {
              // אם יש גם שבת וגם חג באותו יום
              eventsMap[date] = {
                ...eventsMap[date],
                holidayName: eventData.name,
                isHolidayAndShabbat: true
              };
            }
          }
        });

        // מיזוג זמני הדלקת נרות והבדלה עם השבתות
        Object.keys(eventsMap).forEach(date => {
          const event = eventsMap[date];
          
          // אם יש הדלקת נרות, זה כנראה ערב שבת
          if (event.candleLighting && !event.type) {
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            const nextDayKey = formatDate(nextDay);
            
            if (eventsMap[nextDayKey]?.type === 'shabbat') {
              eventsMap[nextDayKey].candleLighting = event.candleLighting;
            }
          }
        });

        // ניקוי אירועים שהם רק זמנים בלי תוכן
        const cleanEvents = {};
        Object.keys(eventsMap).forEach(date => {
          if (eventsMap[date].type) {
            cleanEvents[date] = eventsMap[date];
          }
        });

        setEvents(cleanEvents);
      } catch (err) {
        console.error('Error fetching calendar events:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [year, month, geonameid]);

  return { events, loading, error };
};

export default useCalendarEvents;