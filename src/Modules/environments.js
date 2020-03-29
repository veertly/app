export const getUrl = () => {
  return window.location.protocol + "//" + window.location.host;
};
export const isProd = () => process.env.REACT_APP_ENV === "PROD";
export const isStage = () => process.env.REACT_APP_ENV === "STAGE";
export const isDev = () => process.env.REACT_APP_ENV === "DEV";
