import { useEffect } from 'react';

const useOneSignal = () => {
  useEffect(() => {
    if (!window.OneSignal) {
      const script = document.createElement('script');
      script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        window.OneSignalDeferred = window.OneSignalDeferred || [];
        window.OneSignalDeferred.push(async function (OneSignal) {
          await OneSignal.init({
            appId: import.meta.env.VITE_ONESIGNAL_APP_ID, // 🔁 змінна з .env
            notifyButton: { enable: true },
          });
        });
      };
    }
  }, []);
};

export default useOneSignal;
