async function queryWeather(location) {
  const response = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=642ff04962c74e13ade91014240305&q=${location}&aqi=no`,
    { mode: "cors" }
  );
  const weatherData = await response.json();
  console.log(weatherData);
  return weatherData;
}

function createElement({
  classlist,
  type = "div",
  parent = document.body,
  attributes = [],
} = {}) {
  const elem = document.createElement(type);
  classlist ? (elem.className = classlist) : null;
  attributes.length
    ? elem.setAttribute(attributes[0]?.name, attributes[0]?.value)
    : null;
  parent.appendChild(elem);
  return elem;
}

function autoCompleteSearch() {
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
    while (locationsList.firstChild) {
      locationsList.removeChild(locationsList.firstChild);
    }
    loadingIcon.classList.remove("hidden");
    const response = await fetch(
      `http://api.weatherapi.com/v1/search.json?key=642ff04962c74e13ade91014240305&q=${
        search.value || "undefined"
      }`,
      { mode: "cors" }
    );
    const locationData = await response.json();
    loadingIcon.classList.add("hidden");
    if (locationData.length) {
      locationData.forEach((location) => {
        const locationOption = createElement({
          type: "span",
          parent: locationsList,
        });
        locationOption.textContent = `${location.name}, ${
          location?.region ? `${location.region}, ` : ""
        }${location.country}`;
        locationOption.addEventListener("mousedown", () => {
          queryWeather(location.name);
        });
      });
    }
    return locationData;
  });
}
autoCompleteSearch();

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
