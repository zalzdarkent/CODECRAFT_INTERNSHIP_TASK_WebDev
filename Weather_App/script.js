// API Configuration
const API_KEY = 'bd5e378503939ddaee76f12ad7a97608'; // Replace with your API key from OpenWeatherMap
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const loading = document.getElementById('loading');
const weatherContent = document.getElementById('weatherContent');
const errorMessage = document.getElementById('errorMessage');
const retryBtn = document.getElementById('retryBtn');

// Weather data elements
const cityName = document.getElementById('cityName');
const weatherDesc = document.getElementById('weatherDesc');
const temperature = document.getElementById('temperature');
const weatherIcon = document.getElementById('weatherIcon');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const pressure = document.getElementById('pressure');
const visibility = document.getElementById('visibility');
const uvIndex = document.getElementById('uvIndex');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const tempMin = document.getElementById('tempMin');
const tempMax = document.getElementById('tempMax');
const errorText = document.getElementById('errorText');

// Weather icon mapping
const weatherIcons = {
    '01d': '☀️', // clear sky day
    '01n': '🌙', // clear sky night
    '02d': '⛅', // few clouds day
    '02n': '☁️', // few clouds night
    '03d': '☁️', // scattered clouds
    '03n': '☁️',
    '04d': '☁️', // broken clouds
    '04n': '☁️',
    '09d': '🌧️', // shower rain
    '09n': '🌧️',
    '10d': '🌦️', // rain day
    '10n': '🌧️', // rain night
    '11d': '⛈️', // thunderstorm
    '11n': '⛈️',
    '13d': '❄️', // snow
    '13n': '❄️',
    '50d': '🌫️', // mist
    '50n': '🌫️'
};

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
locationBtn.addEventListener('click', handleLocationRequest);
retryBtn.addEventListener('click', handleRetry);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    showDemo();
});

// Show loading state
function showLoading() {
    loading.style.display = 'block';
    weatherContent.style.display = 'none';
    errorMessage.style.display = 'none';
}

// Show weather content
function showWeatherContent() {
    loading.style.display = 'none';
    weatherContent.style.display = 'block';
    errorMessage.style.display = 'none';
}

// Show error message
function showError(message) {
    loading.style.display = 'none';
    weatherContent.style.display = 'none';
    errorMessage.style.display = 'block';
    errorText.textContent = message;
}

// Handle search button click
async function handleSearch() {
    const city = cityInput.value.trim();
    if (!city) {
        showError('Please enter a city name first.');
        return;
    }
    
    await fetchWeatherByCity(city);
}

// Handle location button click
async function handleLocationRequest() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser.');
        return;
    }

    showLoading();
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            await fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
            let message = 'Unable to access your location.';
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    message = 'Location access denied. Please allow location access to use this feature.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    message = 'Location information is unavailable.';
                    break;
                case error.TIMEOUT:
                    message = 'Location request timed out.';
                    break;
            }
            showError(message);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
        }
    );
}

// Handle retry button click
function handleRetry() {
    const city = cityInput.value.trim();
    if (city) {
        handleSearch();
    } else {
        showDemo();
    }
}

// Fetch weather by city name
async function fetchWeatherByCity(city) {
    showLoading();
    
    try {
        // If no API key, show demo data
        if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
            setTimeout(() => {
                displayDemoWeather(city);
            }, 1500);
            return;
        }

        const response = await fetch(
            `${API_BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=en`
        );
        
        if (!response.ok) {
            throw new Error(response.status === 404 ? 'City not found.' : 'Failed to fetch weather data.');
        }
        
        const data = await response.json();
        displayWeatherData(data);
        
    } catch (error) {
        console.error('Error fetching weather:', error);
        showError(error.message || 'An error occurred while fetching weather data.');
    }
}

// Fetch weather by coordinates
async function fetchWeatherByCoords(lat, lon) {
    try {
        // If no API key, show demo data
        if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
            setTimeout(() => {
                displayDemoWeather('Your Location');
            }, 1500);
            return;
        }

        const response = await fetch(
            `${API_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=en`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch weather data for your location.');
        }
        
        const data = await response.json();
        displayWeatherData(data);
        
    } catch (error) {
        console.error('Error fetching weather:', error);
        showError(error.message || 'An error occurred while fetching weather data.');
    }
}

// Display weather data
function displayWeatherData(data) {
    try {
        // Main weather info
        cityName.textContent = data.name + ', ' + data.sys.country;
        weatherDesc.textContent = data.weather[0].description;
        temperature.textContent = Math.round(data.main.temp) + '°C';
        
        // Weather icon
        const iconCode = data.weather[0].icon;
        weatherIcon.textContent = weatherIcons[iconCode] || '🌤️';
        
        // Details
        feelsLike.textContent = Math.round(data.main.feels_like) + '°C';
        humidity.textContent = data.main.humidity + '%';
        windSpeed.textContent = Math.round(data.wind.speed * 3.6) + ' km/h'; // Convert m/s to km/h
        pressure.textContent = data.main.pressure + ' hPa';
        visibility.textContent = data.visibility ? Math.round(data.visibility / 1000) + ' km' : 'N/A';
        uvIndex.textContent = 'N/A'; // UV index requires separate API call
        
        // Sun times
        const sunriseTime = new Date(data.sys.sunrise * 1000);
        const sunsetTime = new Date(data.sys.sunset * 1000);
        sunrise.textContent = sunriseTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        sunset.textContent = sunsetTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        // Temperature range
        tempMin.textContent = Math.round(data.main.temp_min) + '°C';
        tempMax.textContent = Math.round(data.main.temp_max) + '°C';
        
        showWeatherContent();
        
    } catch (error) {
        console.error('Error displaying weather data:', error);
        showError('An error occurred while displaying weather data.');
    }
}

// Display demo weather data
function displayDemoWeather(cityName = 'Jakarta') {
    const demoData = {
        name: cityName,
        sys: { country: 'ID' },
        weather: [{ description: 'partly cloudy', icon: '02d' }],
        main: {
            temp: 28,
            feels_like: 31,
            humidity: 65,
            pressure: 1013,
            temp_min: 25,
            temp_max: 32
        },
        wind: { speed: 1.5 },
        visibility: 10000,
        sys: {
            sunrise: Math.floor(Date.now() / 1000) - 3600 * 6, // 6 hours ago
            sunset: Math.floor(Date.now() / 1000) + 3600 * 6,  // 6 hours from now
            country: 'ID'
        }
    };
    
    displayWeatherData(demoData);
}

// Show demo on initial load
function showDemo() {
    setTimeout(() => {
        displayDemoWeather();
    }, 1000);
}

// Format time
function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// Convert wind direction
function getWindDirection(degrees) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
}

// Show notification (for demo purposes)
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#e17055' : '#00b894'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Show API key notice
if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
    setTimeout(() => {
        showNotification('Demo mode: For real-time weather data, add your API key from OpenWeatherMap in script.js', 'info');
    }, 2000);
}
