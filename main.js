async function queryWeather(location) {
  //   const response = await fetch(
  //     "http://api.weatherapi.com/v1/current.json?key=642ff04962c74e13ade91014240305&q=London&aqi=no",
  //     { mode: "cors" }
  //   );
  //   const weatherData = await response.json();
  //   return weatherData;
  // const processedWeatherData = {
  //   name: weatherData.location.name,
  //   temp_c: weatherData.current.temp_c,
  //   temp_f: weatherData.current.temp_f,
  //   wind_kph: weatherData.current.wind_kph,
  //   wind_mph: weatherData.current.wind_mph,
  //   wind_dir: weatherData.current.wind_dir,
  //   humidity: weatherData.current.humidity,
  //   condition: weatherData.current.condition.text,
  //   localTime: weatherData.location.localTime
  // };
  // return processedWeatherData;
}

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

const slider = document.getElementById("gradient");
slider.addEventListener("input", () => {
  // changeBGColor(
  //   new Date(
  //     `${new Date().getFullYear()}T${
  //       slider.value < 10 ? `0${slider.value}` : slider.value
  //     }:00`
  //   )
  // );
  // rotateSun(
  //   new Date(
  //     `${new Date().getFullYear()}T${
  //       slider.value < 10 ? `0${slider.value}` : slider.value
  //     }:00`
  //   )
  // );
});

// rotateSun(new Date());
// changeBGColor(new Date());
