export const logEventGA = (eventName, category = 'General', label = '') => {
  try {
    const consent = JSON.parse(localStorage.getItem('cookieConsentCosmetolog'));

    if (consent?.analytics && typeof window.gtag === 'function') {
      window.gtag('event', eventName, {
        event_category: category,
        event_label: label,
      });
    }
  } catch (error) {
    console.warn('logEventGA error:', error);
  }
};

export const logPageViewGA = (pathname = window.location.pathname) => {
  try {
    const consent = JSON.parse(localStorage.getItem('cookieConsentCosmetolog'));

    if (consent?.analytics && typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: pathname,
      });
    }
  } catch (error) {
    console.warn('GA page_view error:', error);
  }
};
