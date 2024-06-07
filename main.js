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
  document.querySelector(
    ".header-title"
  ).textContent = `Weather.${weatherData.current.condition.text
    .toLowerCase()
    .replaceAll(" ", "_")}`;
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
    avghumidity,
    daily_chance_of_rain,
    totalprecip_in,
    totalprecip_mm,
  }) => ({
    mintemp: {
      value: mintemp_c,
      alt: mintemp_f,
      unit: ["°C", "°F"],
      text: "Min Temp",
      icon: "temperature-empty",
    },
    maxtemp: {
      value: maxtemp_c,
      alt: maxtemp_f,
      unit: ["°C", "°F"],
      text: "Max Temp",
      icon: "temperature-full",
    },
    avgtemp: {
      value: avgtemp_c,
      alt: avgtemp_f,
      unit: ["°C", "°F"],
      text: "Avg Temp",
      icon: "plus-minus",
    },
    windspeed: {
      value: maxwind_kph,
      alt: maxwind_mph,
      unit: ["kph", "mph"],
      text: "Wind Speed",
      icon: "wind",
    },
    condition: {
      value: condition.text,
      text: "Condition",
      icon: "meteor",
    },
    humidty: { value: avghumidity + "%", text: "Humidity", icon: "droplet" },
    rain_chance: {
      value: daily_chance_of_rain + "%",
      text: "Chance of rain",
      icon: "cloud-rain",
    },
    totalprecip: {
      value: totalprecip_mm,
      text: "Total precipitation",
      alt: totalprecip_in,
      unit: ["mm", "in"],
      icon: "ruler-vertical",
    },
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
  const weatherContent = document.querySelector(".weather-content");
  const weatherDays = document.querySelector(".weather-days-container");
  removeChildren(weatherDays);
  removeElement(document.querySelector(".location-header"));
  const locationHeader = createElement({
    classlist: "location-header",
    type: "h1",
    text: `${data.location.name}, ${data.location.country}`,
    parent: weatherContent,
  });
  weatherContent.insertBefore(
    locationHeader,
    document.querySelector(".weather-data-container")
  );
  removeElement(document.querySelector(".toggle-btns-container"));
  const toggleBtnsContainer = createElement({
    classlist: "toggle-btns-container",
    childElems: [
      {
        classlist: "metric-toggle-btn",
        type: "button",
        text: "Metric",
      },
      {
        classlist: "analog-toggle-btn",
        type: "button",
        text: "24:00",
      },
    ],
    parent: document.querySelector(".searchbar-wrapper"),
  });
  const metricToggle = document.querySelector(".metric-toggle-btn");
  const analogToggle = document.querySelector(".analog-toggle-btn");
  let metric = true,
    digital = true;
  removeElement(document.querySelector(".curr-weather-container"));
  addCurrWeatherDOM({ weatherData: data });
  analogToggle.addEventListener("click", () => {
    digital = digital ? false : true;
    analogToggle.textContent = digital ? "24:00" : "12 AM";
    const currTime = document.querySelector(".curr-weather-time");
    const currDataTime = new Date(data.location.localtime);
    if (!digital) {
      if (currDataTime.getHours() > 12) {
        currTime.textContent = `${currDataTime.getHours() - 12}:${
          currDataTime.getMinutes() < 10
            ? `0${currDataTime.getMinutes()}`
            : currDataTime.getMinutes()
        } PM`;
      } else {
        currTime.textContent = `${currDataTime.getHours()}:${
          currDataTime.getMinutes() < 10
            ? `0${currDataTime.getMinutes()}`
            : currDataTime.getMinutes()
        } AM`;
      }
    } else {
      currTime.textContent = `${
        currDataTime.getHours() < 10
          ? `0${currDataTime.getHours()}`
          : currDataTime.getHours()
      }:${
        currDataTime.getMinutes() < 10
          ? `0${currDataTime.getMinutes()}`
          : currDataTime.getMinutes()
      }`;
    }
  });
  metricToggle.addEventListener("click", () => {
    metric = metric ? false : true;
    metricToggle.textContent = metric ? "Metric" : "Imperial";
    const currTemp = document.querySelector(".curr-temp");
    const currPrecip = document.querySelector(".curr-precip");
    if (metric) {
      currPrecip.textContent = data.current.precip_mm + " mm";
      currTemp.textContent = data.current.temp_c + " °C";
    } else {
      currPrecip.textContent = data.current.precip_in + " in";
      currTemp.textContent = data.current.temp_f + " °F";
    }

    const weatherDays = document.querySelectorAll(".weather-day-container");
    weatherDays.forEach((day, index) => {
      const displayTempsContainer = document.querySelector(
        `.day-display-container[data="${index}"]>.day-display-temps-container`
      );
      if (metric) {
        const displayMaxtemp = displayTempsContainer.children[0];
        displayMaxtemp.textContent = `${data.forecast.forecastday[index].day.mintemp_c} °C`;
        const displayAvgtemp = displayTempsContainer.children[1];
        displayAvgtemp.textContent = `${data.forecast.forecastday[index].day.avgtemp_c} °C`;
        const displayMintemp = displayTempsContainer.children[2];
        displayMintemp.textContent = `${data.forecast.forecastday[index].day.maxtemp_c} °C`;
      } else {
        const displayMaxtemp = displayTempsContainer.children[0];
        displayMaxtemp.textContent = `${data.forecast.forecastday[index].day.mintemp_f} °F`;
        const displayAvgtemp = displayTempsContainer.children[1];
        displayAvgtemp.textContent = `${data.forecast.forecastday[index].day.avgtemp_f} °F`;
        const displayMintemp = displayTempsContainer.children[2];
        displayMintemp.textContent = `${data.forecast.forecastday[index].day.maxtemp_f} °F`;
      }
    });
    data.forecast.forecastday.forEach((day, index) => {
      const details = weatherDetailsHandler(data, index);
      Object.entries(details).forEach((prop, propIndex) => {
        if (prop[1]?.alt && !metric) {
          weatherDays[index].lastElementChild.lastElementChild.children[
            propIndex
          ].lastElementChild.textContent = `${prop[1].alt} ${prop[1].unit[1]}`;
        } else if (prop[1]?.alt) {
          weatherDays[index].lastElementChild.lastElementChild.children[
            propIndex
          ].lastElementChild.textContent = `${prop[1].value} ${prop[1].unit[0]}`;
        }
      });
    });
  });

  data.forecast.forecastday.forEach((day, index) => {
    const details = weatherDetailsHandler(data, index);
    addWeatherDetailsDOM({
      weatherDetails: details,
      date: new Date(data.forecast.forecastday[index].date),
      weatherData: data,
      index,
    });
  });
  const displayMoreDetails = document.querySelectorAll(
    ".day-display-more-details"
  );
  displayMoreDetails.forEach((icon) => {
    icon.addEventListener("click", () => {
      const detailsContainer = document.querySelector(
        `.day-details-container[data="${icon.getAttribute("data")}"]`
      );
      const dayContainer = document.querySelector(
        `.weather-day-container[data="${icon.getAttribute("data")}"]`
      );
      const dayContainersArr = document.querySelectorAll(
        ".weather-day-container"
      );
      const detailsContainersArr = document.querySelectorAll(
        ".day-details-container"
      );
      dayContainersArr.forEach((child) => {
        if (child !== dayContainer) {
          child.classList.remove("wide");
        }
      });
      detailsContainersArr.forEach((child) => {
        if (child !== detailsContainer) {
          child.classList.add("hidden");
        }
      });
      detailsContainer.classList.toggle("hidden");
      dayContainer.classList.toggle("wide");
      dayContainer.scrollIntoView({ block: "start", behavior: "smooth" });
    });
  });
}

function addCurrWeatherDOM({ weatherData = {} }) {
  // console.log(weatherData);
  const currDate = new Date(weatherData.location.localtime);
  const time = `${
    currDate.getHours() < 10 ? `0${currDate.getHours()}` : currDate.getHours()
  }:${
    currDate.getMinutes() < 10
      ? `0${currDate.getMinutes()}`
      : currDate.getMinutes()
  }`;
  const weatherDays = document.querySelector(".weather-days-container");
  const weatherDataContainer = document.querySelector(
    ".weather-data-container"
  );
  const currWeatherContainer = createElement({
    name: "curr-weather-container",
    classlist: "curr-weather-container",
    childElems: [
      {
        name: "curr-weather-title",
        classlist: "curr-weather-title",
        type: "h1",
        text: "Today's Weather",
      },
      {
        classlist: "curr-weather-items",
        childElems: [
          {
            classlist: "curr-weather-data",
            childElems: [
              {
                classlist: "curr-weather-condition-container",
                childElems: [
                  {
                    name: "curr-weather-condition-img",
                    classlist: "curr-weather-condition-img",
                    type: "img",
                    attributes: [
                      {
                        name: "src",
                        value: weatherData.current.condition.icon,
                      },
                    ],
                  },
                  {
                    name: "curr-weather-condition",
                    classlist: "curr-weather-condition",
                    text: weatherData.current.condition.text,
                  },
                ],
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
              {
                name: "curr-temp",
                classlist: "curr-temp",
                text: weatherData.current.temp_c + " °C",
              },
              {
                name: "curr-weather-time",
                classlist: "curr-weather-time",
                text: time,
              },
            ],
          },
          {
            classlist: "curr-weather-text",
            type: "p",
            text: "Lorem ipsum dolor sit a met. Lorem ipsum dolor sit a met. Lorem ipsum dolor sit a met. Lorem ipsum dolor sit a met. Lorem ipsum dolor sit a met. ",
          },
        ],
      },
    ],
    parent: document.querySelector(".weather-data-container"),
  });
  weatherDataContainer.insertBefore(currWeatherContainer, weatherDays);
}

function addWeatherDetailsDOM({
  weatherDetails = {},
  date = new Date(),
  weatherData = {},
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
  const dayContainer = createElement({
    classlist: "weather-day-container",
    type: "div",
    parent: weatherDays,
    attributes: [{ name: "data", value: index }],
    childElems: [
      {
        classlist: "day-display-title",
        type: "h1",
        text: days[date.getDay()],
      },
      {
        classlist: "day-display-more-details fa-solid fa-circle-info",
        type: "i",
        attributes: [{ name: "data", value: index }],
      },
      {
        classlist: "day-display-data",
        childElems: [
          {
            name: "display-details-container",
            classlist: "day-display-container",
            attributes: [{ name: "data", value: index }],
            childElems: [
              {
                classlist: "day-display-condition-container",
                childElems: [
                  {
                    classlist: "day-display-condition-img",
                    type: "img",
                    attributes: [
                      {
                        name: "src",
                        value:
                          weatherData.forecast.forecastday[index].day.condition
                            .icon,
                      },
                    ],
                  },
                  {
                    classlist: "day-display-condition-text",
                    text: weatherData.forecast.forecastday[index].day.condition
                      .text,
                  },
                ],
              },
              {
                classlist: "day-display-temps-container",
                childElems: [
                  {
                    classlist: "day-display-mintemp",
                    text:
                      weatherData.forecast.forecastday[index].day.mintemp_c +
                      " °C",
                    alt:
                      weatherData.forecast.forecastday[index].day.mintemp_f +
                      " °F",
                  },
                  {
                    classlist: "day-display-avgtemp",
                    text:
                      weatherData.forecast.forecastday[index].day.avgtemp_c +
                      " °C",
                    alt:
                      weatherData.forecast.forecastday[index].day.avgtemp_f +
                      " °F",
                  },
                  {
                    classlist: "day-display-maxtemp",
                    text:
                      weatherData.forecast.forecastday[index].day.maxtemp_c +
                      " °C",
                    alt:
                      weatherData.forecast.forecastday[index].day.maxtemp_f +
                      " °F",
                  },
                ],
              },
              {
                classlist: "day-display-rain-chance",
                text:
                  weatherData.forecast.forecastday[index].day
                    .daily_chance_of_rain + "% Rain coverage",
              },
            ],
          },
          {
            name: "elem-details-container",
            classlist: "day-details-container hidden",
            attributes: [{ name: "data", value: index }],
          },
        ],
      },
    ],
  });

  Object.entries(weatherDetails).forEach((prop) => {
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
        {
          name: "elem-value",
          classlist: propClassName,
          text: prop[1]?.unit
            ? `${prop[1].value} ${prop[1].unit[0]}`
            : prop[1].value,
        },
      ],
    });
  });
}

async function locationSearchHandler() {
  const search = document.getElementById("location-search");
  const locationsList = document.getElementById("locations");
  const loadingIcon = document.getElementById("location-loading");
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
          search.value = location.name;
          const weatherForecastData = await queryWeatherForecast(location.name);
          initWeatherDOM(await weatherForecastData);
        });
      }
    });
  }
  if (locationsList.children.length) {
    locationsList.style.display = "flex";
  } else {
    locationsList.style.display = "none";
  }
}

function initSearch() {
  const search = document.getElementById("location-search");
  const locationsList = document.getElementById("locations");
  locationsList.style.display = "none";
  search.addEventListener("blur", () => {
    locationsList.style.display = "none";
  });
  search.addEventListener("focus", () => {
    if (
      !document.getElementById("locations").firstChild &&
      search.value !== ""
    ) {
      locationSearchHandler();
    }
    if (locationsList.children.length) {
      locationsList.style.display = "flex";
    } else {
      locationsList.style.display = "none";
    }
  });
  search.addEventListener("input", () => {
    locationSearchHandler();
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
