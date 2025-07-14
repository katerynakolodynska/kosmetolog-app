import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useOneSignal = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdmin) return;

    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(function (OneSignal) {
      OneSignal.init({
        appId: import.meta.env.VITE_ONESIGNAL_APP_ID,
        notifyButton: {
          enable: true,
        },
      });
    });
  }, [isAdmin]);
};

export default useOneSignal;
