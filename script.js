const search = document.querySelector("#search");
const temperature_display = document.querySelector("#temperature");
const more_info = document.querySelector("#more-info");
const weather_description = document.querySelector("#weather-info #description");
const humidity_display = document.querySelector("#humidity .value");
const windspeed_display = document.querySelector("#wind-speed .value");
const weather_image = document.querySelector("#weather-info img");

const APIkey = "94f1669a653bbbdef562f87b96174ae9";

search.addEventListener("click", () => {
    const city = document.querySelector("input").value;
    updateWeatherInfo(city);
});

document.addEventListener("keydown", event => {
    if(event.key === "Enter") search.click();
});

async function updateWeatherInfo(city) {
    try {
        document.querySelector("#weather-info").style.display = "block";
        temperature_display.style.display = "block";
        more_info.style.display = "flex";
        
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=metric`);
        
        if(!response.ok) {
            if(response.status === 404) {
                weather_image.src = "./images/404-error.png";
                temperature_display.style.display = "none";
                more_info.style.display = "none";
                weather_description.textContent = "Location Not Found!";
            }
            throw new Error("network response not ok!");
        }
        
        const data = await response.json();
        document.querySelector("#weather-info").style.display = "block";

        const isNight = data.sys.sunset - (Date.now() / 1000) < 0;
        weather_image.src = getWeatherImage(data.weather[0].id, isNight);

        humidity_display.textContent = `${data.main.humidity}%`;
        windspeed_display.textContent = `${Math.round(data.wind.speed * 3.6)}Km/h`;
        temperature_display.innerHTML = `${Math.round(data.main.temp)}<span>°C</span>`;
        weather_description.textContent = data.weather[0].description;
    }
    catch(error) {
        console.error(error);
    }
}

function getWeatherImage(weatherId, isNight) {
    switch(true) {
        case (weatherId > 800):
            return isNight? "./images/cloudy-night.png" : "./images/cloudy-day.png"
        case(weatherId === 800):
            return isNight? "./images/moon.png" : "./images/sun.png";
        case(weatherId >= 700):
            return "./images/wind.png";
        case(weatherId >= 600):
            return "./images/snowfall.png";
        case(weatherId >= 300):
            return "./images/rain.png";
        default:
            return "./images/thunder-storm.png";
    }
}
