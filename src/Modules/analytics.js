const isProduction = Boolean(
  window.location.hostname.includes("app.veertly.com")
);

export const trackEvent = (event, data) => {
  if (isProduction) {
    window.analytics.track(event, data);
  }
};

export const trackPage = (page) => {
  if (isProduction) {
    window.analytics.page(page);
  }
};

export const trackIdentify = (id, data) => {
  if (isProduction) {
    window.analytics.identify(id, data);
  }
};
