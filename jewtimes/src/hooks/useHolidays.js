import { useState, useEffect } from 'react';

// מיפוי חודשים עבריים מאנגלית לעברית
const hebrewMonthsMap = {
  'Nisan': 'ניסן',
  'Iyyar': 'אייר',
  'Sivan': 'סיוון',
  'Tamuz': 'תמוז',
  'Av': 'אב',
  'Elul': 'אלול',
  'Tishrei': 'תשרי',
  'Cheshvan': 'חשוון',
  'Kislev': 'כסלו',
  'Tevet': 'טבת',
  'Shvat': 'שבט',
  'Adar': 'אדר',
  'Adar I': 'אדר א׳',
  'Adar II': 'אדר ב׳'
};

// המרת מספר לגימטריה עברית
const numberToHebrewGematria = (num) => {
  const ones = ['', 'א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ז׳', 'ח׳', 'ט׳'];
  const tens = ['', 'י׳', 'כ׳', 'ל׳', 'מ׳', 'נ׳', 'ס׳', 'ע׳', 'פ׳', 'צ׳'];
  const hundreds = ['', 'ק׳', 'ר׳', 'ש׳', 'ת׳'];
  
  if (num === 15) return 'ט״ו'; // טו במקום יה
  if (num === 16) return 'ט״ז'; // טז במקום יו
  
  let result = '';
  const h = Math.floor(num / 100);
  const t = Math.floor((num % 100) / 10);
  const o = num % 10;
  
  if (h > 0) result += hundreds[h];
  if (t > 0) result += tens[t];
  if (o > 0) result += ones[o];
  
  // הוספת גרש או גרשיים
  if (result.length > 2) {
    // אם יש יותר מאות אחת, נוסיף גרשיים לפני האות האחרונה
    result = result.slice(0, -2) + '״' + result.slice(-2);
  }
  
  return result;
};

// פונקציה להמרת תאריך עברי לעברית
const convertHebrewDate = (hdate) => {
  if (!hdate) return 'לא זמין';
  
  // חילוץ המספר מהתאריך (לדוגמה: "25 Kislev" -> 25)
  const match = hdate.match(/^(\d+)/);
  if (match) {
    const dayNumber = parseInt(match[1]);
    const hebrewDay = numberToHebrewGematria(dayNumber);
    
    let hebrewDate = hdate.replace(/^\d+/, hebrewDay);
    
    // החלפת שמות החודשים מאנגלית לעברית
    Object.keys(hebrewMonthsMap).forEach(englishMonth => {
      hebrewDate = hebrewDate.replace(englishMonth, hebrewMonthsMap[englishMonth]);
    });
    
    return hebrewDate;
  }
  
  return hdate;
};

/**
 * Hook לקבלת חגים ומועדים
 * @param {number} year - שנה לועזית (ברירת מחדל: שנה נוכחית)
 * @param {number} geonameid - מזהה GeoNames (אופציונלי, לזמני כניסת חגים)
 */
export const useHolidays = (year = new Date().getFullYear(), geonameid = null) => {
  const [holidays, setHolidays] = useState([]);
  const [nextHoliday, setNextHoliday] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          v: '1',
          cfg: 'json',
          year: year,
          month: 'x', // כל השנה
          maj: 'on', // חגים גדולים
          min: 'on', // חגים קטנים
          mod: 'on', // ימים מיוחדים מודרניים
          nx: 'on', // ראש חודש
          ss: 'on', // פרשת השבוע
          M: 'on', // תאריכים עבריים
          lg: 'he' // שפה עברית
        });

        if (geonameid) {
          params.append('c', 'on'); // הוסף זמני הדלקת נרות
          params.append('geo', 'geoname');
          params.append('geonameid', geonameid);
        }

        const response = await fetch(`https://www.hebcal.com/hebcal?${params}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch holidays');
        }

        const data = await response.json();
        
        // סינון רק חגים (לא פרשות או ראש חודש)
        const holidayItems = data.items.filter(item => 
          item.category === 'holiday' || 
          item.category === 'roshchodesh' ||
          item.category === 'major' ||
          item.category === 'minor'
        );

        // המרה לפורמט נוח
        const formattedHolidays = holidayItems.map(holiday => ({
          name: holiday.hebrew || holiday.title,
          englishName: holiday.title,
          hebrewDate: convertHebrewDate(holiday.hdate),
          gregorianDate: new Date(holiday.date).toLocaleDateString('he-IL', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }),
          date: new Date(holiday.date),
          category: holiday.category,
          link: holiday.link,
          memo: holiday.memo
        }));

        // מיון לפי תאריך
        formattedHolidays.sort((a, b) => a.date - b.date);

        setHolidays(formattedHolidays);

        // מציאת החג הקרוב הבא
        const now = new Date();
        const upcoming = formattedHolidays.find(holiday => holiday.date > now);
        
        if (upcoming) {
          const daysUntil = Math.ceil((upcoming.date - now) / (1000 * 60 * 60 * 24));
          setNextHoliday({
            ...upcoming,
            daysUntil
          });
        }

      } catch (err) {
        setError(err.message);
        console.error('Error fetching holidays:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();
  }, [year, geonameid]);

  return { holidays, nextHoliday, loading, error };
};