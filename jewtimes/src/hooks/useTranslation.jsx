import { useState, useEffect } from 'react';

// מטמון גלובלי בזיכרון (לא localStorage)
const translationCache = {};

export const useTranslation = (text, targetLang = 'he') => {
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!text || text.trim() === '') {
      setTranslatedText('');
      return;
    }

    // בדיקה אם התרגום כבר קיים במטמון
    const cacheKey = `${text}_${targetLang}`;
    if (translationCache[cacheKey]) {
      setTranslatedText(translationCache[cacheKey]);
      return;
    }

    const translateText = async () => {
      setLoading(true);
      setError(null);

      try {
        // שימוש ב-MyMemory Translation API (חינמי)
        const response = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
        );

        if (!response.ok) {
          throw new Error('Translation API failed');
        }

        const data = await response.json();
        
        if (data.responseStatus === 200 && data.responseData) {
          const translated = data.responseData.translatedText;
          translationCache[cacheKey] = translated;
          setTranslatedText(translated);
        } else {
          // אם התרגום נכשל, נשתמש בטקסט המקורי
          setTranslatedText(text);
        }
      } catch (err) {
        console.error('Translation error:', err);
        setError(err.message);
        // במקרה של שגיאה, נשתמש בטקסט המקורי
        setTranslatedText(text);
      } finally {
        setLoading(false);
      }
    };

    // דיליי קטן למניעת יותר מדי קריאות API
    const timeoutId = setTimeout(translateText, 300);

    return () => clearTimeout(timeoutId);
  }, [text, targetLang]);

  return { translatedText, loading, error };
};

// Hook נוסף לתרגום מרובה טקסטים בבת אחת
export const useBatchTranslation = (texts, targetLang = 'he') => {
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!texts || texts.length === 0) return;

    const translateBatch = async () => {
      setLoading(true);
      const newTranslations = {};

      for (const text of texts) {
        const cacheKey = `${text}_${targetLang}`;
        
        // בדוק קודם במטמון
        if (translationCache[cacheKey]) {
          newTranslations[text] = translationCache[cacheKey];
          continue;
        }

        try {
          const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
          );
          const data = await response.json();
          
          if (data.responseStatus === 200 && data.responseData) {
            const translated = data.responseData.translatedText;
            translationCache[cacheKey] = translated;
            newTranslations[text] = translated;
          } else {
            newTranslations[text] = text;
          }
          
          // המתנה קצרה בין קריאות
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (err) {
          console.error('Translation error:', err);
          newTranslations[text] = text;
        }
      }

      setTranslations(newTranslations);
      setLoading(false);
    };

    translateBatch();
  }, [texts, targetLang]);

  return { translations, loading };
};