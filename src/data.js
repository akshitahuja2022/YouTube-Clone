export const API_KEY = "AIzaSyD3J04_hLugBPMM-q6g2m2NksEKOGlFn-Q";

export const value_converter = (value) => {
  if (value >= 1000000) {
    return Math.floor(value / 1000000) + "M";
  } else if (value >= 1000) {
    return Math.floor(value / 1000) + "K";
  } else {
    return value;
  }
};
