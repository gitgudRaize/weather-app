export const setLocationObject = (locationObj, coordsObj) => {
  const { lat, lon, name, unit } = coordsObj;
  locationObj.setLat(lat);
  locationObj.setLon(lon);
  locationObj.setName(name);
  if (unit) {
    locationObj.setUnit(unit);
  }
};

export const getHomeLocation = () => {
  return localStorage.getItem("defaultWeatherLocation");
};

export const getCoordsFromApi = async (entryText) => {
  // const url = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${entryText}`;
  // const encodedUrl = encodeURI(url);
  // try {
  //   const dataStream = await fetch(encodedUrl);
  //   const jsonData = dataStream.json();
  //   return jsonData;
  // } catch (err) {
  //   console.error(err);
  //   return err;
  // }

  const urlDataObj = {
    text: entryText,
  };
  try {
    const dataStream = await fetch("./.netlify/functions/get_coords", {
      method: "POST",
      body: JSON.stringify(urlDataObj),
    });
    const jsonData = await dataStream.json();
    return jsonData;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const getWeatherFromCoords = async (locationObj) => {
  // const lat = locationObj.getLat();
  // const lon = locationObj.getLon();
  // const url = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${lat},${lon}&days=7`;
  // try {
  //   const weatherStream = await fetch(url);
  //   const weatherJson = await weatherStream.json();
  //   return weatherJson;
  // } catch (err) {
  //   console.error(err);
  //   return err;
  // }

  const urlDataObj = {
    lat: locationObj.getLat(),
    lon: locationObj.getLon(),
  };
  try {
    const weatherStream = await fetch("./.netlify/functions/get_weather", {
      method: "POST",
      body: JSON.stringify(urlDataObj),
    });
    const weatherJson = await weatherStream.json();
    return weatherJson;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const cleanText = (text) => {
  const regex = / {2,}/g;
  const entryText = text.replaceAll(regex, " ").trim();
  return entryText;
};
