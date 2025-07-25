import { useEffect, useState } from 'react';
import s from './CookieBannerPro.module.css';

const COOKIE_KEY = 'cookieConsentCosmetolog';
const EXPIRE_DAYS = 365;

const CookieBannerPro = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  useEffect(() => {
    const consent = JSON.parse(localStorage.getItem(COOKIE_KEY));
    if (!consent || isExpired(consent.timestamp)) {
      setShowBanner(true);
    }
  }, []);

  const isExpired = (timestamp) => {
    const now = new Date().getTime();
    const expireTime = EXPIRE_DAYS * 24 * 60 * 60 * 1000;
    return !timestamp || now - timestamp > expireTime;
  };

  const saveConsent = (consent) => {
    const data = {
      ...consent,
      timestamp: new Date().getTime(),
    };
    localStorage.setItem(COOKIE_KEY, JSON.stringify(data));
    setShowBanner(false);
  };

  const acceptAll = () => {
    saveConsent({ analytics: true, marketing: true });
  };

  const rejectAll = () => {
    saveConsent({ analytics: false, marketing: false });
  };

  const saveCustom = () => {
    saveConsent({ analytics: analyticsConsent, marketing: marketingConsent });
  };

  if (!showBanner) return null;

  return (
    <div className={s.overlay}>
      <div className={s.modal}>
        <h3 className={s.header}>Zgoda na pliki cookie</h3>
        <p className={s.text}>
          Używamy plików cookie do analizy ruchu, personalizacji i marketingu. Możesz zaakceptować wszystkie, odrzucić
          lub wybrać ustawienia.
        </p>

        <a href="/polityka-prywatnosci" className={s.link}>
          Zobacz politykę prywatności
        </a>

        <div className={s.checkboxGroup}>
          <label>
            <input type="checkbox" checked disabled /> Niezbędne (zawsze aktywne)
          </label>
          <label>
            <input type="checkbox" checked={analyticsConsent} onChange={(e) => setAnalyticsConsent(e.target.checked)} />
            Analityczne
          </label>
          <label>
            <input type="checkbox" checked={marketingConsent} onChange={(e) => setMarketingConsent(e.target.checked)} />
            Marketingowe
          </label>
        </div>

        <div className={s.buttonGroup}>
          <button className={s.accept} onClick={acceptAll}>
            Akceptuję wszystkie
          </button>
          <button className={s.reject} onClick={rejectAll}>
            Odrzuć wszystkie
          </button>
          <button className={s.settings} onClick={saveCustom}>
            Zapisz ustawienia
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBannerPro;
