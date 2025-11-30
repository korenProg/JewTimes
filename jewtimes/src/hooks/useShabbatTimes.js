import { useState, useEffect } from 'react';

/**
 * Hook לקבלת זמני שבת הקרובה
 * @param {number} geonameid - מזהה GeoNames של העיר (כפר סבא: 294071)
 * @param {number} candleLightingMinutes - דקות לפני שקיעה (ברירת מחדל: 18)
 * @param {number} havdalahMinutes - דקות אחרי שקיעה (ברירת מחדל: 50)
 */
export const useShabbatTimes = (geonameid = 294071, candleLightingMinutes = 18, havdalahMinutes = 50) => {
  const [shabbatData, setShabbatData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShabbatTimes = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          cfg: 'json',
          geonameid: geonameid,
          M: 'on', // תאריכים עבריים
          b: candleLightingMinutes,
          m: havdalahMinutes,
          lg: 'he' // שפה עברית
        });

        const response = await fetch(`https://www.hebcal.com/shabbat?${params}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch Shabbat times');
        }

        const data = await response.json();
        
        // עיבוד הנתונים
        const candleLighting = data.items.find(item => item.category === 'candles');
        const havdalah = data.items.find(item => item.category === 'havdalah');
        const parasha = data.items.find(item => item.category === 'parashat');

        setShabbatData({
          parasha: parasha?.hebrew || parasha?.title || 'לא זמין',
          candleLighting: candleLighting ? new Date(candleLighting.date).toLocaleTimeString('he-IL', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }) : 'לא זמין',
          havdalah: havdalah ? new Date(havdalah.date).toLocaleTimeString('he-IL', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }) : 'לא זמין',
          date: candleLighting ? new Date(candleLighting.date).toLocaleDateString('he-IL', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }) : 'לא זמין',
          hebrewDate: candleLighting?.hebrew || 'לא זמין',
          location: data.location?.title || 'לא זמין',
          rawData: data
        });

      } catch (err) {
        setError(err.message);
        console.error('Error fetching Shabbat times:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchShabbatTimes();
  }, [geonameid, candleLightingMinutes, havdalahMinutes]);

  return { shabbatData, loading, error };
};