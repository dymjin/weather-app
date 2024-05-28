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

function initWeatherDOM(data) {
  const weatherDaysContainer = document.querySelector(
    ".weather-days-container"
  );
  while (weatherDaysContainer.firstChild) {
    weatherDaysContainer.removeChild(weatherDaysContainer.firstChild);
  }
  data.forecast.forecastday.forEach((forecastDay, index) => {
    addWeatherDetailsDOM({
      weatherData: data,
      index,
      date: new Date(forecastDay.date),
    });
  });
}

function addWeatherDetailsDOM({ weatherData = {}, index = 1 } = {}) {
  // console.log(weatherData);
  const dayData = weatherData.forecast.forecastday[index].day;
  const weatherDetails = (({
    mintemp_c,
    maxtemp_c,
    avgtemp_c,
    maxwind_kph,
    condition,
  }) => ({
    mintemp: {
      value: mintemp_c,
      text: "Min Temp",
    },
    maxtemp: {
      value: maxtemp_c,
      text: "Max Temp",
    },
    avgtemp: {
      value: avgtemp_c,
      text: "Avg Temp",
      icon: "temperature-quarter",
    },
    windspeed: { value: maxwind_kph, text: "Wind Speed" },
    condition: { value: condition.text, text: "Condition" },
  }))(dayData);
  // console.log(extractedData);

  // const date = new Date(weatherData.forecast.forecastday[index].date);
  // const days = [
  //   "Sunday",
  //   "Monday",
  //   "Tuesday",
  //   "Wednesday",
  //   "Thursday",
  //   "Friday",
  //   "Saturday",
  // ];
  const weatherDays = document.querySelector(".weather-days-container");

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
    console.log(prop);
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
    while (locationsList.firstChild) {
      locationsList.removeChild(locationsList.firstChild);
    }
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
