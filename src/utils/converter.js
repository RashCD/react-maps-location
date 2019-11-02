export const convertCelsius = kelvinTemp => {
  if (typeof kelvinTemp === 'number') {
    return Math.round(kelvinTemp - 273.15);
  }
  console.log('convertCelsius params is wrong types');
};
