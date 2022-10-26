const isDefaultCity = localStorage.getItem('isDefaultCity') || 'Minsk';

//NOW
const nowCity = document.getElementsByClassName('now_city');
const nowTemperature = document.getElementsByClassName('now_temperature');
const nowWeather = document.getElementsByClassName('now_weather_icon');

const newCity = document.querySelector('input');
const checkCity = document.querySelector('button');
const addCityToLocation = document.getElementById('add_city');
const isCurrentCity = document.getElementsByClassName('now_city');
const isAddedLocationsList = document.getElementById('location_list');
let isCitiesFromAddedLocations = document.getElementsByClassName('city_added_location_container');
let deleteCity = document.getElementsByClassName('delete_added_locations_item');

//FORECAST
const isAddedForecastItems = document.getElementById('forecast_items')
const isForecastCity = document.getElementById('forecast_city')
const isForecastDate = document.getElementsByClassName('forecast_date');
const isForecastTime = document.getElementsByClassName('forecast_time');
const isForecastTemperature = document.getElementsByClassName('forecast_temperature');
const isForecastWeather = document.getElementsByClassName('forecast_weather');
const isForecastFeelsLike = document.getElementsByClassName('forecast_feels_like');
const isForecastIcon = document.getElementsByClassName('forecast_icon');

//UPDATE
const currentTemperature = document.querySelector('.current_temperature');
const detailsCurrentCity = document.querySelector('.details_current_city');
const currentFeelsLike = document.querySelector('.current_feels_like');
const currentWeather = document.querySelector('.current_weather');
const currentSunrise = document.querySelector('.current_sunrise');
const currentSunset = document.querySelector('.current_sunset');

const serverUrl = 'https://api.openweathermap.org/data/2.5/forecast';
const apiKey = 'c042b358dfb2f9bc9ab03afabd70d69d';

addCityToLocation.addEventListener('click', addCity);
checkCity.addEventListener('click', () => showCity(newCity.value));

function changeCityTab(evt, cityName) {
    let i;
    let tabContent;
    let tabLinks;
    tabContent = document.getElementsByClassName("tab_content");
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }
    tabLinks = document.getElementsByClassName("tab_links");
    for (i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "flex";
    evt.currentTarget.className += " active";
}

function showCity(city) {
    const url = `${serverUrl}?q=${city}&appid=${apiKey}&cnt=6`;
    const response = fetch(url);
    const promise = response.then((response) => response.json());
    promise.then((result) => changeNowCity(result.city.name));
    promise.then((result) => changeNowTemperature(result.list[0].main.temp));
    promise.then((result) => changeNowWeatherIcon(result.list[0].weather[0].icon));
    // ADD Details
    // promise.then((result) => updateDetailsCurrentCity(result.city.name));
    // promise.then((result) => updateDetailsCurrentTemperature(result.list[0].main.temp));
    promise.then((result) => updateDetailsCurrentFeelsLike(result.list[0].main.feels_like));
    promise.then((result) => updateDetailsCurrentWeather(result.list[0].weather[0].description));
    promise.then((result) => updateDetailsCurrentSunrise(result.city.sunrise))
    promise.then((result) => updateDetailsCurrentSunset(result.city.sunset));
    // ADD Forecast
    // promise.then((result) => updateForecastCity(result.city.name));
    isAddedForecastItems.innerHTML = '';

    for (let index = 0; index < 6; index++) {
        isAddedForecastItems.insertAdjacentHTML('afterbegin',
            `<li>
                            <div class="forecast_container_items">
                                <ul>
                                    <li class="forecast_container_item" style="margin-bottom: 30px">
                                        <div class="forecast_date">-</div>
                                        <div class="forecast_time">-</div>
                                    </li>
                                    <li class="forecast_container_item">
                                        <div class="forecast_temperature">Temperature: -<span>&deg</span></div>
                                        <div class="forecast_weather">-</div>
                                    </li>
                                    <li class="forecast_container_item">
                                        <div class="forecast_feels_like">Feels like: -<span>&deg</span></div>
                                        <div class="forecast_icon"><img style="width: 31px">-</div>
                                    </li>
                                </ul>
                            </div>
                        </li>`);
        promise.then((result) => updateForecastDateAndTime(result.list[index].dt, index));
        promise.then((result) => updateForecastTemperature(result.list[index].main.temp, index));
        promise.then((result) => updateForecastFeelsLike(result.list[index].main.feels_like, index));
        promise.then((result) => updateForecastWeatherMain(result.list[index].weather[0].main, index));
        promise.then((result) => updateForecastWeatherIcon(result.list[index].weather[0].icon, index));
    }
    newCity.value = '';
    event.preventDefault();
}

//NOW
function changeNowCity(city) {
    nowCity[0].textContent = city;
    detailsCurrentCity.textContent = city; //add
    isForecastCity.textContent = city; //add
}

function changeNowTemperature(temp) {
    nowTemperature[0].innerHTML = `${Math.round(temp - 273.15)}<span>&deg</span>`;
    temp = Math.round(temp - 273.15);
    currentTemperature.innerHTML = temp;
}

function changeNowWeatherIcon(icon) {
    nowWeather[0].innerHTML = `<img style="width: 150px;" src="./icon_img/${icon}.png">`;
}

function updateDetailsCurrentFeelsLike(item) {
    item = Math.round(item - 273.15);
    currentFeelsLike.textContent = item;
}

function updateDetailsCurrentWeather(item) {
    item = item[0].toUpperCase() + item.slice(1);
    currentWeather.textContent = item;
}

function updateDetailsCurrentSunrise(item) {
    const sunrise = new Date(item * 1000);
    let hours = sunrise.getHours();
    if (hours < 10) {
        hours = '0' + String(hours);
    }
    let minutes = sunrise.getMinutes();
    if (minutes < 10) {
        minutes = '0' + String(minutes);
    }
    currentSunrise.textContent = ` ${hours}:${minutes}`;
}

function updateDetailsCurrentSunset(item) {
    const sunset = new Date(item * 1000);
    let hours = sunset.getHours();
    if (hours < 10) {
        hours = '0' + String(hours);
    }
    let minutes = sunset.getMinutes();
    if (minutes < 10) {
        minutes = '0' + String(minutes);
    }
    currentSunset.textContent = ` ${hours}:${minutes}`;
}

function updateForecastDateAndTime(date, index) {
    const isDate = new Date(date * 1000);
    const TIME = isDate.toUTCString().substr(-12, 5); // время
    const DAY = isDate.toUTCString().substr(-24, 6); // день
    isForecastTime[index].textContent = TIME;
    isForecastDate[index].textContent = DAY;
}

function updateForecastTemperature(temp, index) {
    isForecastTemperature[index].innerHTML = `Temperature: ${Math.round(temp - 273.15)}<span>&deg</span>`;
}

function updateForecastFeelsLike(feelsLike, index) {
    isForecastFeelsLike[index].innerHTML = `Feels like: ${Math.round(feelsLike - 273.15)}<span>&deg</span>`;
}

function updateForecastWeatherMain(main, index) {
    isForecastWeather[index].textContent = main;
}

function updateForecastWeatherIcon(icon, index) {
    isForecastIcon[index].innerHTML = `<img style="width: 40px;" src="./icon_img/${icon}.png">`;
}

//RENDER
function addCity() {
    const isCityToAdd = isCurrentCity[0].textContent;

    for (let i = 0; i < localStorage.length; i++) {
        let city = localStorage.key(i);
        if (city === isCityToAdd) return;
    }
    isAddedLocationsList.insertAdjacentHTML('afterbegin',
        `<li class="added_location_container_item">
            <div class="city_added_location_container">${isCityToAdd}</div>
            <div class="delete_added_locations_item">&#10007</div>
        </li>`);
    localStorage.setItem(isCityToAdd, isCityToAdd);
    renderElements()
}

function render() {
    for (let i = 0; i < localStorage.length; i++) {
        let city = localStorage.key(i);
        if (city === 'isDefaultCity') continue;
        isAddedLocationsList.insertAdjacentHTML('afterbegin',
            `<li class="added_location_container_item">
            <div class="city_added_location_container">${city}</div>
            <div class="delete_added_locations_item">&#10007</div>
        </li>`);
    }
    renderElements()
}

function renderElements() {
    isCitiesFromAddedLocations = document.getElementsByClassName('city_added_location_container');
    for (let city of isCitiesFromAddedLocations) {
        city.addEventListener('click', () => seeCity(city.textContent));
    }
    deleteCity = document.getElementsByClassName('delete_added_locations_item');
    for (let city of deleteCity) {
        city.addEventListener('click', () => showDelete(city));
    }
}

function seeCity(city) {
    nowCity[0].textContent = city || isDefaultCity;
    localStorage.setItem('isDefaultCity', city);
    showCity(city);
}

function showDelete(item) {
    item.parentElement.remove();
    localStorage.removeItem(item.previousElementSibling.textContent)
}

render();

seeCity(isDefaultCity);
