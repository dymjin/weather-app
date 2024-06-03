async function queryWeatherCurrent(location) {
  const response = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=642ff04962c74e13ade91014240305&q=${location}&aqi=no`,
    { mode: "cors" }
  );
  const weatherData = await response.json();
  return weatherData;
}

async function queryWeatherForecast(location) {
  const response = await fetch(
    `http://api.weatherapi.com/v1/forecast.json?key=642ff04962c74e13ade91014240305&q=${location}&days=3&aqi=no&alerts=no`,
    { mode: "cors" }
  );
  const weatherData = await response.json();
  return weatherData;
}

function createElement({
  classlist,
  type = "div",
  parent = document.body,
  attributes = [],
  childElems = [],
  text = "",
  name = "",
} = {}) {
  const elem = document.createElement(type);
  classlist ? (elem.className = classlist) : null;
  attributes.length
    ? attributes.forEach((attr) => {
        elem.setAttribute(attr?.name, attr?.value);
      })
    : null;
  parent.appendChild(elem);
  text ? (elem.textContent = text) : null;
  if (childElems) {
    childElems.forEach((child) => {
      const childElem = createElement(child);
      elem.appendChild(childElem);
    });
  }
  return elem;
}

function weatherDetailsHandler(data, index) {
  const dayData = data.forecast.forecastday[index].day;
  const weatherDetails = (({
    mintemp_c,
    mintemp_f,
    maxtemp_c,
    maxtemp_f,
    avgtemp_c,
    avgtemp_f,
    maxwind_kph,
    maxwind_mph,
    condition,
  }) => ({
    mintemp: {
      value: mintemp_c,
      alt: mintemp_f,
      text: "Min Temp",
    },
    maxtemp: {
      value: maxtemp_c,
      alt: maxtemp_f,
      text: "Max Temp",
    },
    avgtemp: {
      value: avgtemp_c,
      alt: avgtemp_f,
      text: "Avg Temp",
      icon: "temperature-quarter",
    },
    windspeed: { value: maxwind_kph, alt: maxwind_mph, text: "Wind Speed" },
    condition: { value: condition.text, text: "Condition" },
  }))(dayData);
  return weatherDetails;
}

function removeElement(elem) {
  if (elem) {
    elem.parentElement.removeChild(elem);
  }
}

function removeChildren(container) {
  if (container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }
}

function initWeatherDOM(data) {
  const weatherDays = document.querySelector(".weather-days-container");
  removeChildren(weatherDays);
  removeElement(document.querySelector(".metric-toggle-btn"));
  const metricToggle = createElement({
    name: "metric-toggle",
    classlist: "metric-toggle-btn",
    type: "button",
    text: "Metric",
    parent: weatherDays.parentElement,
  });
  let metric = true;
  removeElement(document.querySelector(".curr-weather-container"));
  addCurrWeatherDOM({ weatherData: data });
  metricToggle.addEventListener("click", () => {
    metric = metric ? false : true;
    metricToggle.textContent = metric ? "Metric" : "Imperial";
    removeChildren(weatherDays);
    const currTemp = document.querySelector(".curr-temp");
    const currPrecip = document.querySelector(".curr-precip");
    if (metric) {
      currPrecip.textContent = data.current.precip_mm + " mm";
      currTemp.textContent = data.current.temp_c + " °C";
    } else {
      currPrecip.textContent = data.current.precip_in + " in";
      currTemp.textContent = data.current.temp_f + " °F";
    }
    data.forecast.forecastday.forEach((day, index) => {
      const details = weatherDetailsHandler(data, index);
      Object.entries(details).forEach((prop) => {
        const val = prop[1].value;
        const alt = prop[1].alt;
        if (!metric) {
          prop[1].value = alt;
          prop[1].alt = val;
        } else {
          prop[1].value = val;
          prop[1].alt = alt;
        }
      });
      addWeatherDetailsDOM({
        weatherDetails: details,
        date: new Date(data.forecast.forecastday[index].date),
        index,
      });
    });
  });
  data.forecast.forecastday.forEach((day, index) => {
    const details = weatherDetailsHandler(data, index);
    addWeatherDetailsDOM({
      weatherDetails: details,
      date: new Date(data.forecast.forecastday[index].date),
      index,
    });
  });
}

function addCurrWeatherDOM({ weatherData = {} }) {
  console.log(weatherData);
  const currDate = new Date(weatherData.location.localtime);
  const time = `${
    currDate.getHours() < 10 ? `0${currDate.getHours()}` : currDate.getHours()
  }:${
    currDate.getMinutes() < 10
      ? `0${currDate.getMinutes()}`
      : currDate.getMinutes()
  }`;
  // console.log(time);
  const weatherDays = document.querySelector(".weather-days-container");
  const pageWrapper = document.querySelector(".page-wrapper");
  const currWeatherContainer = createElement({
    // const dayTitle = createElement({
    //   classlist: "day-title",
    //   type: "h1",
    //   parent: dayContainer,
    // });
    // const conditionIcon = createElement({
    //   classlist: "day-display-condition-img",
    //   type: "img",
    //   attributes: [{ name: "src", value: dayData.condition.icon }],
    //   parent: dayContainer,
    // });
    // const conditionText = createElement({
    //   classlist: "day-display-condition-text",
    //   parent: dayContainer,
    // });
    // conditionText.textContent = dayData.condition.text;
    // const tempsContainer = createElement({
    //   classlist: "day-display-temp-container",
    //   parent: dayContainer,
    // });
    // const currTemp = createElement({
    //   classlist: "day-display-hourly-temp",
    //   parent: dayContainer,
    // });
    // currTemp.textContent = `${weatherData.current.temp_c}°C`;
    // const minmaxTemp = createElement({
    //   classlist: "day-display-minxmax-temp",
    //   parent: tempsContainer,
    // });
    // minmaxTemp.textContent = `${dayData.mintemp_c}°C / ${dayData.maxtemp_c}°C`;
    // const rainContainer = createElement({
    //   classlist: "day-display-rain-container",
    //   parent: dayContainer,
    // });
    // const rainIcon = createElement({
    //   classlist: "fa-solid fa-cloud-rain rain-icon",
    //   parent: rainContainer,
    // });
    // const rainChance = createElement({
    //   classlist: "day-display-rain-chance",
    //   parent: rainContainer,
    // });
    // rainChance.textContent = `${dayData.daily_chance_of_rain}%`;
    // dayTitle.textContent = days[date.getDay()];
    name: "curr-weather-container",
    classlist: "curr-weather-container",
    childElems: [
      {
        name: "curr-weather-title",
        classlist: "curr-weather-title",
        text: "Current Weather",
      },
      { name: "curr-weather-time", classlist: "curr-weather-time", text: time },
      {
        name: "curr-weather-condition-img",
        classlist: "curr-weather-condition-img",
        type: "img",
        attributes: [
          { name: "src", value: weatherData.current.condition.icon },
        ],
      },
      {
        name: "curr-weather-condition",
        classlist: "curr-weather-condition",
        text: weatherData.current.condition.text,
      },
      {
        name: "curr-temp",
        classlist: "curr-temp",
        text: weatherData.current.temp_c + "°C",
      },
      {
        name: "curr-humidity",
        classlist: "curr-humidity",
        text: `${weatherData.current.humidity}%`,
      },
      {
        name: "curr-precip",
        classlist: "curr-precip",
        text: `${weatherData.current.precip_mm} mm`,
      },
    ],
    parent: document.querySelector(".page-wrapper"),
  });
  pageWrapper.insertBefore(currWeatherContainer, weatherDays);
}

function addWeatherDetailsDOM({
  weatherDetails = {},
  date = new Date(),
  index = 1,
} = {}) {
  // console.log(weatherDetails);
  const weatherDays = document.querySelector(".weather-days-container");
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  // const dayTitle = createElement({
  //   classlist: "day-title",
  //   type: "h1",
  //   parent: dayContainer,
  // });
  // const conditionIcon = createElement({
  //   classlist: "day-display-condition-img",
  //   type: "img",
  //   attributes: [{ name: "src", value: dayData.condition.icon }],
  //   parent: dayContainer,
  // });
  // const conditionText = createElement({
  //   classlist: "day-display-condition-text",
  //   parent: dayContainer,
  // });
  // conditionText.textContent = dayData.condition.text;
  // const tempsContainer = createElement({
  //   classlist: "day-display-temp-container",
  //   parent: dayContainer,
  // });
  // const currTemp = createElement({
  //   classlist: "day-display-hourly-temp",
  //   parent: dayContainer,
  // });
  // currTemp.textContent = `${weatherData.current.temp_c}°C`;
  // const minmaxTemp = createElement({
  //   classlist: "day-display-minxmax-temp",
  //   parent: tempsContainer,
  // });
  // minmaxTemp.textContent = `${dayData.mintemp_c}°C / ${dayData.maxtemp_c}°C`;
  // const rainContainer = createElement({
  //   classlist: "day-display-rain-container",
  //   parent: dayContainer,
  // });
  // const rainIcon = createElement({
  //   classlist: "fa-solid fa-cloud-rain rain-icon",
  //   parent: rainContainer,
  // });
  // const rainChance = createElement({
  //   classlist: "day-display-rain-chance",
  //   parent: rainContainer,
  // });
  // rainChance.textContent = `${dayData.daily_chance_of_rain}%`;
  // dayTitle.textContent = days[date.getDay()];
  const dayContainer = createElement({
    classlist: "weather-day-container",
    type: "div",
    parent: weatherDays,
    attributes: [{ name: "data", value: index }],
    childElems: [
      {
        name: "display-details-container",
        classlist: "day-display-container",
        attributes: [{ name: "data", value: index }],
        childElems: [
          { name: "display-title", type: "h1", text: days[date.getDay()] },
        ],
      },
      {
        name: "elem-details-container",
        classlist: "day-details-container hidden",
        attributes: [{ name: "data", value: index }],
      },
    ],
  });
  dayContainer.addEventListener("click", () => {
    dayContainer.lastElementChild.toggle("hidden");
  });
  Object.entries(weatherDetails).forEach((prop) => {
    // console.log(prop);
    const propClassName = prop[0].toLowerCase();
    const elemContainer = createElement({
      name: "elem-container",
      classlist: `${propClassName}-container`,
      parent: document.querySelector(`.day-details-container[data="${index}"]`),
      childElems: [
        {
          name: "elem-title-wrapper",
          classlist: `${propClassName}-title-wrapper`,
          childElems: [
            {
              name: "elem-icon",
              classlist: `${propClassName}-icon fa-solid fa-${prop[1].icon}`,
              type: "i",
            },
            {
              name: "elem-title",
              classlist: `${propClassName}-title`,
              text: prop[1].text,
            },
          ],
        },
        { name: "elem-value", classlist: propClassName, text: prop[1].value },
      ],
    });
  });
}

function initSearch() {
  const search = document.getElementById("location-search");
  const locationsList = document.getElementById("locations");
  const loadingIcon = document.getElementById("location-loading");
  search.addEventListener("blur", () => {
    locationsList.style.display = "none";
  });
  search.addEventListener("focus", () => {
    locationsList.style.display = "flex";
  });
  search.addEventListener("input", async () => {
    loadingIcon.classList.remove("hidden");
    const response = await fetch(
      `http://api.weatherapi.com/v1/search.json?key=642ff04962c74e13ade91014240305&q=${
        search.value || "undefined"
      }`,
      { mode: "cors" }
    );
    const locationData = await response.json();
    removeChildren(locationsList);
    loadingIcon.classList.add("hidden");
    if (locationData.length) {
      locationData.forEach((location) => {
        if (
          location.name
            .toLowerCase()
            .replaceAll(" ", "")
            .match(search.value.toLowerCase().replaceAll(" ", ""))
        ) {
          const locationOption = createElement({
            type: "span",
            parent: locationsList,
          });
          locationOption.textContent = `${location.name}, ${
            location?.region ? `${location.region}, ` : ""
          }${location.country}`;

          locationOption.addEventListener("mousedown", async () => {
            // console.log(location);
            search.value = location.name;
            const weatherForecastData = await queryWeatherForecast(
              location.name
            );
            initWeatherDOM(await weatherForecastData);
          });
        }
      });
    }
  });
}
initSearch();

function timeToRGB(time = new Date()) {
  const timeInRGB = Math.round(
    time.getHours() < 12
      ? time.getHours() * (255 / 12)
      : (24 - time.getHours()) * (255 / 12)
  );
  return timeInRGB;
}

function timeToDeg(time = new Date()) {
  const timeInDeg = time.getHours() * 15;
  return timeInDeg;
}

function rotateSun(time = new Date()) {
  const timeInDeg = timeToDeg(time);
  document.getElementById(
    "sun-icon"
  ).style.transform = `rotate(${timeInDeg}deg) translateY(50px)`;
}

function tempToColor() {}

function changeBGColor(time) {
  const timeInRGB = timeToRGB(time);
  document.querySelector(
    "html"
  ).style.background = `radial-gradient(circle at top, rgb(255, ${
    timeInRGB * 2
  }, 0), transparent),
   radial-gradient(circle  at bottom, rgb(0,${timeInRGB}, 255), transparent) rgb(${
    timeInRGB * 2
  }, 0, ${255 - timeInRGB})`;
}

function changeTempColor(temp = 0) {
  // const colorInDeg = 255 / 100;
  // const tempInRGB = temp * colorInDeg;
  // document.querySelector(
  //   "html"
  // ).style.background = `radial-gradient(ellipse at top, rgb(255, 255, 0), transparent), radial-gradient(ellipse at bottom, blue, transparent) black`;
  // `radial-gradient(ellipse at top, rgb(255, ${Math.round(
  //   tempInRGB / 2
  // )}, 0), transparent), radial-gradient(ellipse at bottom, blue, transparent) black`;
}

// const slider = document.getElementById("gradient");
// slider.addEventListener("input", () => {
//   // changeBGColor(
//   //   new Date(
//   //     `${new Date().getFullYear()}T${
//   //       slider.value < 10 ? `0${slider.value}` : slider.value
//   //     }:00`
//   //   )
//   // );
//   // rotateSun(
//   //   new Date(
//   //     `${new Date().getFullYear()}T${
//   //       slider.value < 10 ? `0${slider.value}` : slider.value
//   //     }:00`
//   //   )
//   // );
// });

// rotateSun(new Date());
// changeBGColor(new Date());
