// components/CookieBanner.jsx
import CookieConsent, { Cookies } from 'react-cookie-consent';
import { useEffect, useState } from 'react';

const CookieBanner = () => {
  const [showSettings, setShowSettings] = useState(false);

  const handleAccept = () => {
    Cookies.set('analytics', true, { expires: 365 });
  };

  const handleDecline = () => {
    Cookies.set('analytics', false, { expires: 365 });
  };

  return (
    <>
      <CookieConsent
        location="bottom"
        buttonText="Akceptuję wszystkie"
        declineButtonText="Odrzuć wszystkie"
        enableDeclineButton
        onAccept={handleAccept}
        onDecline={handleDecline}
        cookieName="myCookieConsent"
        style={{
          background: '#2B373B',
          fontSize: '14px',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '1rem',
          padding: '20px',
        }}
        buttonStyle={{
          background: '#4CAF50',
          color: 'white',
          fontSize: '13px',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
        }}
        declineButtonStyle={{
          background: '#f44336',
          color: 'white',
          fontSize: '13px',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
        }}
        extraCookieOptions={{ sameSite: 'Lax' }}
      >
        <div>
          <strong>Pliki cookie:</strong> Używamy plików cookie w celu analizy ruchu i poprawy działania strony. Możesz
          zaakceptować wszystkie lub odrzucić.
          <br />
          <a href="/polityka-prywatnosci" style={{ color: '#f0c040', textDecoration: 'underline' }}>
            Zobacz politykę prywatności
          </a>
        </div>

        <button
          onClick={() => setShowSettings(!showSettings)}
          style={{
            background: '#ff9800',
            color: '#000',
            padding: '10px 20px',
            fontSize: '13px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Ustawienia
        </button>
      </CookieConsent>

      {/* Налаштування (поки без реального керування) */}
      {showSettings && (
        <div
          style={{
            background: '#fff',
            color: '#000',
            padding: '20px',
            maxWidth: '600px',
            margin: '20px auto',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            fontSize: '14px',
          }}
        >
          <h3>Zarządzanie zgodami</h3>
          <p>
            W tym momencie używamy tylko podstawowych i analitycznych plików cookie. W przyszłości tutaj pojawi się
            możliwość precyzyjnego zarządzania zgodami.
          </p>
          <button
            onClick={() => setShowSettings(false)}
            style={{
              marginTop: '10px',
              background: '#2B373B',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Zamknij
          </button>
        </div>
      )}
    </>
  );
};

export default CookieBanner;
