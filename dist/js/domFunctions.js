export const setPlaceholderText = () => {
  const input = document.getElementById("searchBar__text");
  input.placeholder =
    window.innerWidth < 400
      ? "City, State, Country"
      : "City, State, Country, or Zip Code";
};

export const addSpinner = (element) => {
  animateButton(element);
  setTimeout(animateButton, 1000, element);
};

const animateButton = (element) => {
  element.classList.toggle("none");
  element.nextElementSibling.classList.toggle("block");
  element.nextElementSibling.classList.toggle("none");
};

export const displayError = (headerMsg, srMsg) => {
  fadeDisplay();
  clearDisplay();
  displayCurrentConditions();
  displaySixDayForecast();
  updateWeatherLocationHeader(headerMsg);
  updateScreenReaderConfirmation(srMsg);
  setFocusOnSearch();
  fadeDisplay();
};

const toProperCase = (text) => {
  const words = text.split(" ");
  const properWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return properWords.join(" ");
};

const updateWeatherLocationHeader = (message, locationObj) => {
  const h2Location = document.getElementById("currentForecast__location");
  const h2Day = document.getElementById("currentForecast__date");
  const h2LastUpdate = document.getElementById("currentForecast__lastUpdate");
  if (typeof message === "object") {
    h2Location.textContent = locationObj.getName();
    const dateObj = new Date(message.current.last_updated);
    const lastUpdate = dateObj.toString();
    h2Day.textContent = `${lastUpdate.slice(0, 3)}, ${lastUpdate.slice(4, 15)}`;
    h2LastUpdate.textContent = `Last Update: ${lastUpdate.slice(15, 21)}`;
  } else {
    h2Location.textContent = message;
    h2Day.textContent = "";
    h2LastUpdate.textContent = "";
  }
};

export const updateScreenReaderConfirmation = (message) => {
  document.getElementById("confirmation").textContent = message;
};

export const updateDisplay = (weatherJson, locationObj) => {
  fadeDisplay();
  clearDisplay();
  const weatherClass = getWeatherClass(
    weatherJson.current.condition.code,
    weatherJson.current.is_day
  );
  setBGImage(weatherClass);
  const screenReaderWeather = buildScreenReaderWeather(
    weatherJson,
    locationObj
  );
  updateScreenReaderConfirmation(screenReaderWeather);
  updateWeatherLocationHeader(weatherJson, locationObj);
  displayCurrentConditions(weatherJson, locationObj.getUnit());
  displaySixDayForecast(weatherJson, locationObj.getUnit());
  setFocusOnSearch();
  fadeDisplay();
};

const fadeDisplay = () => {
  const cc = document.getElementById("currentForecast");
  cc.classList.toggle("zero-vis");
  cc.classList.toggle("fade-in");
  const sixDay = document.getElementById("dailyForecast");
  sixDay.classList.toggle("zero-vis");
  sixDay.classList.toggle("fade-in");
};

const clearDisplay = () => {
  const currentConditions = document.getElementById(
    "currentForecast__conditions"
  );
  deleteContents(currentConditions);
  const sixDayForecast = document.getElementById("dailyForecast__contents");
  deleteContents(sixDayForecast);
};

const deleteContents = (parentElement) => {
  let child = parentElement.lastElementChild;
  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }
};

const getWeatherClass = (code, isDay) => {
  let weatherClass;
  if (code !== 1000 && code !== 1003 && code !== 1006 && code !== 1009) {
    const weatherLookup = getWeatherLookup(code);
    weatherClass = weatherLookup;
  } else if (isDay === 0) {
    weatherClass = "night";
  } else {
    weatherClass = "clouds";
  }
  return weatherClass;
};

const getWeatherLookup = (code) => {
  const weatherCode = {
    1000: "clear",
    1003: "clouds",
    1006: "clouds",
    1009: "clouds",
    1030: "fog",
    1063: "rain",
    1066: "snow",
    1069: "snow",
    1072: "rain",
    1087: "rain",
    1114: "snow",
    1117: "snow",
    1135: "fog",
    1147: "fog",
    1150: "rain",
    1153: "rain",
    1168: "rain",
    1171: "rain",
    1180: "rain",
    1183: "rain",
    1186: "rain",
    1189: "rain",
    1192: "rain",
    1195: "rain",
    1198: "rain",
    1201: "rain",
    1204: "snow",
    1207: "snow",
    1210: "snow",
    1213: "snow",
    1216: "snow",
    1219: "snow",
    1222: "snow",
    1225: "snow",
    1237: "snow",
    1240: "rain",
    1243: "rain",
    1246: "rain",
    1249: "snow",
    1252: "snow",
    1255: "snow",
    1258: "snow",
    1261: "snow",
    1264: "snow",
    1273: "rain",
    1276: "rain",
    1279: "snow",
    1282: "snow",
  };
  const weatherLookup = weatherCode[code];
  return weatherLookup;
};

const setBGImage = (weatherClass) => {
  document.documentElement.classList.add(weatherClass);
  document.documentElement.classList.forEach((img) => {
    if (img !== weatherClass) document.documentElement.classList.remove(img);
  });
};

const buildScreenReaderWeather = (weatherJson, locationObj) => {
  const location = locationObj.getName();
  const unit = locationObj.getUnit();
  const temp =
    unit === "metric"
      ? `${Math.round(Number(weatherJson.current.temp_c))}°Celsius`
      : `${Math.round(Number(weatherJson.current.temp_f))}°Fahrenheit`;
  return `${weatherJson.current.condition.text} and ${temp} in ${location}`;
};

const setFocusOnSearch = () => {
  document.getElementById("searchBar__text").focus();
};

const displayCurrentConditions = (weatherJson, unit) => {
  const ccArray = createCurrentConditionsDivs(weatherJson, unit);
  const ccContainer = document.getElementById("currentForecast__conditions");
  ccArray.forEach((cc) => {
    ccContainer.appendChild(cc);
  });
};

const createCurrentConditionsDivs = (weatherObj, unit) => {
  let icon,
    currentTemp,
    currentTempUnit,
    currentDesc,
    currentFeels,
    compareMaxTemp,
    currentMaxTemp,
    compareMinTemp,
    currentMinTemp,
    currentHumidity,
    currentWind;
  if (typeof weatherObj === "object") {
    const convWeatherObj = getConvWeatherObj(weatherObj, unit);
    icon = createMainIconDiv(
      weatherObj.current.condition.icon,
      weatherObj.current.condition.text
    );
    currentTemp = `${Math.round(Number(convWeatherObj.temp))}°`;
    currentTempUnit = convWeatherObj.tempUnit;
    currentDesc = toProperCase(weatherObj.current.condition.text);
    currentFeels = `Feels like ${Math.round(Number(convWeatherObj.feels))}°`;
    compareMaxTemp =
      Math.round(Number(convWeatherObj.temp)) >
      Math.round(Number(convWeatherObj.maxTemp))
        ? Math.round(Number(convWeatherObj.temp))
        : Math.round(Number(convWeatherObj.maxTemp));
    currentMaxTemp = `High ${compareMaxTemp}°`;
    compareMinTemp =
      Math.round(Number(convWeatherObj.temp)) <
      Math.round(Number(convWeatherObj.minTemp))
        ? Math.round(Number(convWeatherObj.temp))
        : Math.round(Number(convWeatherObj.minTemp));
    currentMinTemp = `Low ${compareMinTemp}°`;
    currentHumidity = `Humidity ${weatherObj.current.humidity}%`;
    currentWind = `Wind ${Math.round(Number(convWeatherObj.wind))}${
      convWeatherObj.windUnit
    }`;
  } else {
    icon = createMainIconDiv();
    currentTemp = "?";
    currentTempUnit = "";
    currentDesc = "No Weather Information";
    currentFeels = "Feels like -";
    currentMaxTemp = "High -";
    currentMinTemp = "Low -";
    currentHumidity = "Humidity -";
    currentWind = "Wind -";
  }
  const temp = createElem("div", "temp", currentTemp, currentTempUnit);
  const desc = createElem("div", "desc", currentDesc);
  const feels = createElem("div", "feels", currentFeels);
  const maxTemp = createElem("div", "maxtemp", currentMaxTemp);
  const minTemp = createElem("div", "mintemp", currentMinTemp);
  const humidity = createElem("div", "humidity", currentHumidity);
  const wind = createElem("div", "wind", currentWind);
  return [icon, temp, desc, feels, maxTemp, minTemp, humidity, wind];
};

const getConvWeatherObj = (weatherObj, unit) => {
  const convTemp =
    unit === "metric" ? weatherObj.current.temp_c : weatherObj.current.temp_f;
  const convTempUnit = unit === "metric" ? "C" : "F";
  const convFeels =
    unit === "metric"
      ? weatherObj.current.feelslike_c
      : weatherObj.current.feelslike_f;
  const convMaxTemp =
    unit === "metric"
      ? weatherObj.forecast.forecastday[0].day.maxtemp_c
      : weatherObj.forecast.forecastday[0].day.maxtemp_f;
  const convMinTemp =
    unit === "metric"
      ? weatherObj.forecast.forecastday[0].day.mintemp_c
      : weatherObj.forecast.forecastday[0].day.mintemp_f;
  const convWind =
    unit === "metric"
      ? Number(weatherObj.current.wind_mph) * 0.44704
      : weatherObj.current.wind_mph;
  const convWindUnit = unit === "metric" ? "m/s" : "mph";
  const convWeatherObj = {
    temp: convTemp,
    tempUnit: convTempUnit,
    feels: convFeels,
    maxTemp: convMaxTemp,
    minTemp: convMinTemp,
    wind: convWind,
    windUnit: convWindUnit,
  };
  return convWeatherObj;
};

const createMainIconDiv = (iconUrl, altText) => {
  const iconDiv = createElem("div", "icon");
  iconDiv.id = "currentForecast__icon";
  let mainIcon;
  if (typeof iconUrl === "string") {
    mainIcon = document.createElement("img");
    const icon = iconUrl.slice(35);
    mainIcon.src = `//cdn.weatherapi.com/weather/128x128/${icon}`;
    mainIcon.src = iconUrl;
    mainIcon.title = altText;
    mainIcon.width = window.innerWidth < 768 ? "96" : "160";
    mainIcon.height = window.innerWidth < 768 ? "96" : "160";
  } else {
    mainIcon = document.createElement("i");
    mainIcon.classList.add("fa-regular", "fa-circle-question");
  }
  iconDiv.appendChild(mainIcon);
  return iconDiv;
};

const createElem = (elemType, divClassName, divText, unit) => {
  const div = document.createElement(elemType);
  div.className = divClassName;
  if (divText) {
    div.textContent = divText;
  }
  if (divClassName === "temp") {
    const unitDiv = document.createElement("div");
    unitDiv.classList.add("unit");
    unitDiv.textContent = unit;
    div.appendChild(unitDiv);
  }
  return div;
};

const displaySixDayForecast = (weatherJson, unit) => {
  for (let i = 1; i <= 6; i++) {
    let dfArray;
    if (typeof weatherJson === "object") {
      dfArray = createDailyForecastDivs(
        weatherJson.forecast.forecastday[i],
        unit
      );
    } else {
      dfArray = createDailyForecastDivs();
    }
    const dayDiv = createElem("div", "forecastDay");
    dfArray.forEach((el) => {
      dayDiv.appendChild(el);
    });
    const dailyForecastContainer = document.getElementById(
      "dailyForecast__contents"
    );
    dailyForecastContainer.appendChild(dayDiv);
  }
};

const createDailyForecastDivs = (dailyWeather, unit) => {
  let dayText, dayAbbreviationText, dayIcon, maxTemp, minTemp;
  if (typeof dailyWeather === "object") {
    dayText = getDayText(dailyWeather.date);
    dayAbbreviationText = dayText.slice(0, 3).toUpperCase();
    dayIcon = createDailyForecastIcon(
      dailyWeather.day.condition.icon,
      dailyWeather.day.condition.text
    );
    maxTemp =
      unit === "metric"
        ? `${Math.round(Number(dailyWeather.day.maxtemp_c))}°`
        : `${Math.round(Number(dailyWeather.day.maxtemp_f))}°`;
    minTemp =
      unit === "metric"
        ? `${Math.round(Number(dailyWeather.day.mintemp_c))}°`
        : `${Math.round(Number(dailyWeather.day.mintemp_f))}°`;
  } else {
    dayAbbreviationText = "-";
    dayIcon = createDailyForecastIcon();
    maxTemp = "-";
    minTemp = "-";
  }
  const dayAbbreviation = createElem(
    "p",
    "dayAbbreviation",
    dayAbbreviationText
  );
  dayAbbreviation.role = "heading";
  dayAbbreviation.ariaLabel = `${dayText}`;
  const dayHigh = createElem("p", "dayHigh", maxTemp);
  const dayLow = createElem("p", "dayLow", minTemp);
  return [dayAbbreviation, dayIcon, dayHigh, dayLow];
};

const getDayText = (date) => {
  const dateObj = new Date(date);
  const dateString = dateObj.toDateString();
  return dateString;
};

const createDailyForecastIcon = (iconUrl, altText) => {
  let dayIcon;
  if (typeof iconUrl === "string") {
    dayIcon = document.createElement("img");
    const icon = iconUrl.slice(35);
    dayIcon.src = `//cdn.weatherapi.com/weather/128x128/${icon}`;
    dayIcon.alt = altText;
    dayIcon.width = window.innerWidth < 768 ? "48" : "80";
    dayIcon.height = window.innerWidth < 768 ? "48" : "80";
  } else {
    dayIcon = document.createElement("i");
    dayIcon.classList.add(
      "fa-regular",
      "fa-circle-question",
      "forecastDay__errorIcon"
    );
  }
  return dayIcon;
};
