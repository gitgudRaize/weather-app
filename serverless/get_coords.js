const fetch = require("node-fetch");

const { WEATHER_API_KEY } = process.env;

exports.handler = async (event, context) => {
  const params = JSON.parse(event.body);
  const { entryText } = params;
  const url = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${entryText}`;
  const encodedUrl = encodeURI(url);
  try {
    const dataStream = await fetch(encodedUrl);
    const jsonData = await dataStream.json();
    return {
      statusCode: 200,
      body: JSON.stringify(jsonData),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 422,
      body: err.stack,
    };
  }
};
