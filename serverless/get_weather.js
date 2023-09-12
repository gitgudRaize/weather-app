const fetch = require("node-fetch");

const { WEATHER_API_KEY } = params.env;

exports.handler = async (event, context) => {
  const params = JSON.parse(event.body);
  const { lat, lon } = params;
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${lat},${lon}&days=7`;
  try {
    const weatherStream = await fetch(url);
    const weatherJson = await weatherStream.json();
    return {
      statusCode: 200,
      body: JSON.stringify(weatherJson),
    };
  } catch (err) {
    return {
      statusCode: 422,
      body: err.stack,
    };
  }
};
