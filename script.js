const searchForm = document.getElementById("searchForm");
const searchBar = document.getElementById("searchBar");
const info = document.getElementById("weatherInfo");
const celcBtn = document.getElementById("celcBtn");
const fahrBtn = document.getElementById("fahrBtn");

let currentTemperatureF = null; // Store the current temperature in Fahrenheit
let temperatureUnit = 'F'; // Default temperature unit

async function getWeatherInfo(location, searchBarval) {
  showLoader();
  
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=RUKSR6KHVPVYWBSNVXND9QMPA&contentType=json`;

  try {
    const init_response = await fetch(url, { mode: "cors" });
    const actual_response = await fetch(init_response.url, { mode: "cors" });
    const json = await actual_response.json();

    const day_info = json.days[0];
    const date = day_info.datetime;
    currentTemperatureF = day_info.temp; // Store the temperature in Fahrenheit
    const condition = day_info.conditions;
    const uvIndex = day_info.uvindex;
    const conditionIcon = day_info.icon; // Get the weather condition icon
    console.log(conditionIcon);

    updateWeatherInfo(searchBarval, date, currentTemperatureF, condition, uvIndex, conditionIcon);
  } catch (error) {
    console.error(error.message);
  } finally {
    hideLoader();
  }
}

function updateWeatherInfo(location, date, temperatureF, condition, uvIndex, conditionIcon) {
  const temperature = temperatureUnit === 'F' ? temperatureF : convert_toCelcius(temperatureF);
  const conditionImage = getConditionImage(conditionIcon);
  
  info.innerHTML = `
    <h3>Location: ${location}</h3>
    <h4>Date: ${date}</h4>
    <h4>Temperature: <span id="temperature">${temperature.toFixed(2)}°${temperatureUnit}</span></h4>
    <h4>Condition: ${condition}</h4>
    <img src="${conditionImage}" alt="${condition}" />
    <h4>UV Index: ${uvIndex}</h4>
  `;
}

function updateTemperatureDisplay() {
  const temperatureElement = document.getElementById("temperature");
  if (temperatureElement) {
    const temperature = temperatureUnit === 'F' ? currentTemperatureF : convert_toCelcius(currentTemperatureF);
    temperatureElement.innerHTML = `${temperature.toFixed(2)}°${temperatureUnit}`;
  }
}

function convert_toCelcius(temp_fahr) {
  return (temp_fahr - 32) * (5 / 9);
}

function convert_toFahr(temp_celc) {
  return (temp_celc * 9 / 5) + 32;
}

celcBtn.addEventListener("click", () => {
  if (temperatureUnit !== 'C') {
    temperatureUnit = 'C';
    updateTemperatureDisplay();
  }
});

fahrBtn.addEventListener("click", () => {
  if (temperatureUnit !== 'F') {
    temperatureUnit = 'F';
    updateTemperatureDisplay();
  }
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  getWeatherInfo(searchBar.value, searchBar.value);
  searchBar.value = "";
});

function showLoader() {
  info.innerHTML = `
    <div class="hourglassBackground">
      <div class="hourglassContainer">
        <div class="hourglassCurves"></div>
        <div class="hourglassCapTop"></div>
        <div class="hourglassGlassTop"></div>
        <div class="hourglassSand"></div>
        <div class="hourglassSandStream"></div>
        <div class="hourglassCapBottom"></div>
        <div class="hourglassGlass"></div>
      </div>
    </div>
  `;
}

function hideLoader() {
  // This function is kept in case you want to add any additional functionality when the loader hides
}

function getConditionImage(icon) {
  const iconMap = {
    'clear-day': 'icons/sun.gif',
    'clear-night': 'icons/clear_night.gif',
    'snow': 'icons/snow.gif',
    'rain': 'icons/rainy.gif',
    'sleet': 'icons/sleet.gif',
    'wind': 'icons/windy.gif',
    'fog': 'icons/fog.gif',
    'cloudy': 'https://path/to/cloudy.gif',
    'partly-cloudy-day': 'https://path/to/partly-cloudy-day.gif',
    'partly-cloudy-night': 'https://path/to/partly-cloudy-night.gif'
  };
  
  return iconMap[icon] || 'icons/default.gif';
}
