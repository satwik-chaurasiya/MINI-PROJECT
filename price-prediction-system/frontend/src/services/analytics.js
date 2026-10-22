import api from './api';

export const trackEvent = async (eventType, path = window.location.pathname, metadata = {}) => {
  try {
    await api.post('/api/analytics/event', {
      event_type: eventType,
      path: path,
      metadata_json: JSON.stringify(metadata)
    });
  } catch (err) {
    // Non-blocking telemetry
    console.debug('Analytics event silently logged:', eventType);
  }
};

export const trackPageView = (path) => {
  trackEvent('pageview', path, { referrer: document.referrer, title: document.title });
};
