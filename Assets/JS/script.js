// Define the API key for accessing weather data
const apiKey = '07224a58cc8eb8d71afe08b081bf3b96';

// Get references to HTML elements
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const searchHistory = document.getElementById('search-history');
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');

// Add event listener to the search form
searchForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent form submission
  const city = cityInput.value.trim(); // Get the value of the city input field
  if (city) {
    getWeather(city); // Call the getWeather function with the entered city
    cityInput.value = ''; // Clear the city input field
  }
});

// Function to fetch weather data for a given city
function getWeather(city) {
  // Fetch current weather data from the OpenWeatherMap API
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      displayCurrentWeather(data); // Display the current weather data
      addToSearchHistory(city); // Add the searched city to the search history
    })
    .catch(error => {
      console.log('Error:', error);
      currentWeather.innerHTML = 'Error retrieving weather data.'; // Display an error message
    });

  // Fetch forecast data from the OpenWeatherMap API
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      displayForecast(data); // Display the forecast data
    })
    .catch(error => {
      console.log('Error:', error);
      forecast.innerHTML = 'Error retrieving forecast data.'; // Display an error message
    });
}

// Function to display the current weather data
function displayCurrentWeather(data) {
  currentWeather.innerHTML = `
    <div class="weather-card">
      <h2>${data.name}</h2>
      <div class="date">${getCurrentDate()}</div>
      <img class="icon" src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="Weather Icon">
      <div class="temp">Temperature: ${data.main.temp}°C</div>
      <div class="humidity">Humidity: ${data.main.humidity}%</div>
      <div class="wind">Wind Speed: ${data.wind.speed} m/s</div>
    </div>
  `;
}

// Function to display the forecast data
function displayForecast(data) {
  forecast.innerHTML = '';
  for (let i = 0; i < data.list.length; i += 8) {
    const forecastData = data.list[i];
    const forecastCard = document.createElement('div');
    forecastCard.classList.add('weather-card');
    forecastCard.innerHTML = `
      <div class="date">${getFormattedDate(forecastData.dt)}</div>
      <img class="icon" src="http://openweathermap.org/img/w/${forecastData.weather[0].icon}.png" alt="Weather Icon">
      <div class="temp">Temperature: ${forecastData.main.temp}°C</div>
      <div class="humidity">Humidity: ${forecastData.main.humidity}%</div>
      <div class="wind">Wind Speed: ${forecastData.wind.speed} m/s</div>
    `;
    forecast.appendChild(forecastCard);
  }
}

// Function to add a searched city to the search history
function addToSearchHistory(city) {
  const searchItem = document.createElement('div');
  searchItem.textContent = city;
  searchItem.classList.add('search-item');
  searchItem.addEventListener('click', () => {
    getWeather(city); // Fetch weather data for the clicked search item
  });
  searchHistory.appendChild(searchItem);
}

// Function to get the current date in a formatted string
function getCurrentDate() {
  const date = new Date();
  return date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

// Function to get a formatted date from a timestamp
function getFormattedDate(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}
