const API_KEY = "b55e2180d1903b459d72a0fa636c2003";
const fetchDataBtn = document.getElementById("fetch-data-btn");
const hideContainer = document.getElementById("first-container");
const handleError = document.querySelector(".error");

fetchDataBtn.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(fetchWeatherData, showError);
});

async function fetchWeatherData(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    displayWeatherData(data, lat, lon);
    hideContainer.style.display = "none";
  } catch (error) {
    console.error(error);
    handleError.innerHTML = `<h3>Error fetching the weather data</h3>`;
  }
}

function showError(error) {
  console.error(error);
  handleError.innerHTML = `<h3>User denied the location access</h3>`;
}

function displayWeatherData(data, lat, lon) {
  const kelvinToCelsius = Math.floor(data.main.temp - 273.15);
  const weatherContainer = document.getElementById("weather-container");

  weatherContainer.innerHTML = `
    <div class="main-container">
      <h2>Welcome To The Weather App</h2>
      <p>Here is your current location:</p>
      <div class="latlong">
        <p class="details">Lat: ${lat}</p>
        <p class="details">Long: ${lon}</p>
      </div>
      <div class="map">
        <iframe src="https://maps.google.com/maps?q=${lat},${lon}&z=15&output=embed" width="600" height="300" frameborder="0"></iframe>
      </div>
      
      <div class="footer-container">
        <div class="footer-container-div"><h2>Your Weather Data</h2> </div>
        <div class="param">
          <p class="details">Location: ${data.name}</p>
        <p class="details">Wind Speed: ${data.wind.speed} km/h</p>
        <p class="details">Humidity: ${data.main.humidity}%</p>
        <p class="details">Pressure: ${data.main.pressure} atm</p>
        <p class="details">Wind Direction: ${getDirection(data.wind.deg)}</p>
        <p class="details">Description: ${data.weather[0].description}</p>
        <p class="details">Feels like: ${kelvinToCelsius}°C</p>
        </div>
      </div>
    </div>
  `;
}

function getDirection(degree) {
  const directions = [
    "North", "North-Northeast", "North East", "East-North East",
    "East", "East-South East", "South East", "South-South East",
    "South", "South-South West", "South West", "West-South West",
    "West", "West-North West", "North West", "North-North West"
  ];
  const index = Math.floor((degree + 11.25) / 22.5);
  return directions[index % 16];
}
