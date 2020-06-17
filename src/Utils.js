import moment from "moment";

export const nearestMinutes = (interval, someMoment) => {
  const roundedMinutes =
    Math.round(someMoment.clone().minute() / interval) * interval;
  return someMoment.clone().minute(roundedMinutes).second(0);
};

export const nearest15min = () => nearestMinutes(15, moment.utc());

export const SMALL_PLAYER_INITIAL_HEIGHT = Math.floor(
  0.33 * window.innerHeight
);
export const SMALL_PLAYER_INITIAL_WIDTH =
  (SMALL_PLAYER_INITIAL_HEIGHT * 14) / 9;
export const TOPBAR_HEIGHT = 64;
