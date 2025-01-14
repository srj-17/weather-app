const searchButton = document.querySelector("button");
const searchInputField = document.querySelector(".search-box-container input");
const container = document.querySelector(".container");
const loader = document.querySelector(".loader");

// param type = response object
async function processWeatherData(weatherData) {
    function getCurrentConditions(jsonData) {
        const currentConditions = jsonData.currentConditions;

        const resolvedAddress = jsonData.resolvedAddress;
        const conditions = currentConditions.conditions;
        const sunrise = currentConditions.sunrise;
        const sunset = currentConditions.sunset;
        // average temprature for the day
        const temperature = currentConditions.temp;
        const humidity = currentConditions.humidity;
        // percentage: how much of the sky is covered in cloud
        const cloudCover = currentConditions.cloudcover;
        // icon that shows the summary of a fixed time frame
        const weatherIcon = currentConditions.icon;

        return {
            icon: weatherIcon,
            resolvedAddress,
            "Weather Condition": conditions,
            Sunrise: sunrise,
            Sunset: sunset,
            Temperature: temperature,
            Humidity: humidity,
            "Cloud Cover (%)": cloudCover,
        };
    }

    function getTomorrowsForecasts(jsonData) {
        // today's data is at index 0, tomorrowsData at 1
        const tomorrowsData = jsonData.days.at(1);

        const resolvedAddress = jsonData.resolvedAddress;
        const conditions = tomorrowsData.conditions;
        const sunrise = tomorrowsData.sunrise;
        const sunset = tomorrowsData.sunset;
        const temperature = tomorrowsData.temp;
        const humidity = tomorrowsData.humidity;
        const cloudCover = tomorrowsData.cloudcover;
        const weatherIcon = tomorrowsData.icon;

        return {
            icon: weatherIcon,
            resolvedAddress,
            "Weather Condition": conditions,
            Sunrise: sunrise,
            Sunset: sunset,
            Temperature: temperature,
            Humidity: humidity,
            "Cloud Cover (%)": cloudCover,
        };
    }

    try {
        const jsonData = await weatherData.json();
        console.log(jsonData);
        const currentConditions = getCurrentConditions(jsonData);
        const tomorrowsConditions = getTomorrowsForecasts(jsonData);
        return {
            currentConditions: currentConditions,
            tomorrowsConditions: tomorrowsConditions,
        };
    } catch (e) {
        console.error(new Error("Error while processing the weather data"));
    }
}

async function getWeatherData(location) {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=Q6RAL35G5A9TH796NG49ZSSBQ`;
    try {
        const weatherData = await fetch(url);
        // throw error if error code is not in range (200 - 299)
        if (!weatherData.ok) {
            throw new Error(`Response status: ${weatherData.status}`);
        }
        const processedWeatherData = await processWeatherData(weatherData);
        return processedWeatherData;
    } catch (e) {
        console.error(
            new Error(`Error while fetching the weather data: ${e.message}`),
        );
    }
}

function displayWeatherData(location) {
    function displayTodaysWeather(conditions) {
        const weatherDataDiv = document.querySelector(".weather-data");
        const todayWeatherConditions = document.createElement("div");
        todayWeatherConditions.classList.toggle("today-weather-conditions");

        const todayWeatherHeader = document.createElement("div");
        todayWeatherHeader.classList.toggle("today-weather-header");
        todayWeatherHeader.textContent = `Weather Today`;
        todayWeatherConditions.appendChild(todayWeatherHeader);

        const todayWeatherInfo = document.createElement("div");
        todayWeatherInfo.classList.toggle("today-weather-info");

        for (const condition in conditions) {
            // we don't show the name "icon", only its value
            if (condition === "icon") {
                const conditionContainer = document.createElement("li");
                conditionContainer.classList.toggle("condition-container");

                const weatherIcon = document.createElement("img");
                weatherIcon.classList.toggle("weather-icon");
                weatherIcon.src = `img/${conditions[condition]}.svg`;

                conditionContainer.appendChild(weatherIcon);
                todayWeatherInfo.appendChild(conditionContainer);
            }

            if (condition !== "resolvedAddress" && condition !== "icon") {
                const conditionContainer = document.createElement("li");
                conditionContainer.classList.toggle("condition-container");

                const conditionItem = document.createElement("div");
                conditionItem.classList.toggle("condition");
                conditionItem.textContent = `${condition}`;

                conditionValue = document.createElement("div");
                conditionValue.classList.toggle("condition-value");
                conditionValue.textContent = `${conditions[condition]}`;

                conditionContainer.appendChild(conditionItem);
                conditionContainer.appendChild(conditionValue);
                todayWeatherInfo.appendChild(conditionContainer);
            }
        }

        todayWeatherConditions.appendChild(todayWeatherInfo);
        weatherDataDiv.appendChild(todayWeatherConditions);
    }

    function displayTomorrowsForecast(conditions) {
        const weatherDataDiv = document.querySelector(".weather-data");
        const tomorrowWeatherConditions = document.createElement("div");
        tomorrowWeatherConditions.classList.toggle(
            "tomorrow-weather-conditions",
        );

        const tomorrowWeatherHeader = document.createElement("div");
        tomorrowWeatherHeader.classList.toggle("tomorrow-weather-header");
        tomorrowWeatherHeader.textContent = `Forecasted Weather Tommrow`;
        tomorrowWeatherConditions.appendChild(tomorrowWeatherHeader);

        const tomorrowWeatherInfo = document.createElement("div");
        tomorrowWeatherInfo.classList.toggle("tomorrow-weather-info");

        for (const condition in conditions) {
            // we don't show the name "icon", only its value
            if (condition === "icon") {
                const conditionContainer = document.createElement("li");
                conditionContainer.classList.toggle("condition-container");

                const weatherIcon = document.createElement("img");
                weatherIcon.classList.toggle("weather-icon");
                weatherIcon.src = `img/${conditions[condition]}.svg`;

                conditionContainer.appendChild(weatherIcon);
                tomorrowWeatherInfo.appendChild(conditionContainer);
            }

            if (condition !== "resolvedAddress" && condition !== "icon") {
                const conditionContainer = document.createElement("li");
                conditionContainer.classList.toggle("condition-container");

                const conditionItem = document.createElement("div");
                conditionItem.classList.toggle("condition");
                conditionItem.textContent = `${condition}`;

                conditionValue = document.createElement("div");
                conditionValue.classList.toggle("condition-value");
                conditionValue.textContent = `${conditions[condition]}`;

                conditionContainer.appendChild(conditionItem);
                conditionContainer.appendChild(conditionValue);
                tomorrowWeatherInfo.appendChild(conditionContainer);
            }
        }

        tomorrowWeatherConditions.appendChild(tomorrowWeatherInfo);
        weatherDataDiv.appendChild(tomorrowWeatherConditions);
    }

    // set text and background colors with the given weatherdata
    function setPageColors(weatherData) {
        const whiteText = "#FFF";
        const blackText = "#222";
        const colors = {
            "clear-day": ["hsl(200, 70%, 60%)", `${blackText}`],
            "clear-night": ["hsl(230, 30%, 20%)", `${whiteText}`],
            cloudy: ["hsl(220, 10%, 50%)", `${whiteText}`],
            fog: ["hsl(210, 5%, 75%)", `${blackText}`],
            hail: ["hsl(200, 50%, 70%)", `${blackText}`],
            "partly-cloudy-day": ["hsl(200, 60%, 65%)", `${blackText}`],
            "partly-cloudy-night": ["hsl(230, 40%, 30%)", `${whiteText}`],
            "rain-snow-showers-day": ["hsl(210, 40%, 60%)", `${whiteText}`],
            "rain-snow-showers-night": ["hsl(230, 30%, 25%)", `${whiteText}`],
            "rain-snow": ["hsl(220, 30%, 55%)", `${whiteText}`],
            rain: ["hsl(210, 50%, 60%)", `${blackText}`],
            "showers-day": ["hsl(210, 50%, 65%)", `${blackText}`],
            "showers-night": ["hsl(230, 40%, 30%)", `${whiteText}`],
            sleet: ["hsl(220, 20%, 65%)", `${whiteText}`],
            "snow-showers-day": ["hsl(220, 30%, 85%)", `${blackText}`],
            "snow-showers-night": ["hsl(230, 20%, 40%)", `${whiteText}`],
            snow: ["hsl(220, 20%, 90%)", `${blackText}`],
            "thunder-rain": ["hsl(210, 60%, 40%)", `${blackText}`],
            "thunder-showers-day": ["hsl(210, 60%, 55%)", `${blackText}`],
            "thunder-showers-night": ["hsl(230, 50%, 25%)", `${whiteText}`],
            thunder: ["hsl(240, 60%, 35%)", `${whiteText}`],
            wind: ["hsl(200, 10%, 75%)", `${blackText}`],
        };
        const conditionsToday = weatherData.currentConditions.icon;
        const colorTemperatureToday = colors[conditionsToday].at(0);
        const textColorToday = colors[conditionsToday].at(1);
        const conditionsTomorrow = weatherData.tomorrowsConditions.icon;
        const colorTemperatureTomorrow = colors[conditionsTomorrow].at(0);
        const textColorTomorrow = colors[conditionsTomorrow].at(1);
        const body = document.querySelector("body");
        const todayWeatherConditions = document.querySelector(
            ".today-weather-conditions",
        );
        const tomorrowWeatherConditions = document.querySelector(
            ".tomorrow-weather-conditions",
        );
        const weatherLocation = document.querySelector(".weather-location");

        // change the background based on what the weather conditions (weather icons)
        // are from today to tomorrow
        body.style.background = `linear-gradient(to right, ${colorTemperatureToday}, ${colorTemperatureTomorrow})`;
        todayWeatherConditions.style.color = `${textColorToday}`;
        tomorrowWeatherConditions.style.color = `${textColorTomorrow}`;

        // also color everything that come in the left side based on today's colors
        weatherLocation.style.color = `${textColorToday}`;
    }

    function toggleLoader() {
        loader.classList.toggle("visible");
    }

    toggleLoader();
    getWeatherData(location)
        .then(function (weatherData) {
            toggleLoader();
            const prevWeatherData = document.querySelector(
                ".weather-data-container",
            );

            if (prevWeatherData) {
                container.removeChild(prevWeatherData);
            }

            const weatherDataContainer = document.createElement("div");
            weatherDataContainer.classList.toggle("weather-data-container");
            container.appendChild(weatherDataContainer);

            const weatherLocation = document.createElement("div");
            weatherLocation.classList.toggle("weather-location");
            weatherLocation.textContent = `${weatherData.currentConditions.resolvedAddress}`;
            weatherDataContainer.appendChild(weatherLocation);

            const weatherDataDiv = document.createElement("div");
            weatherDataDiv.classList.toggle("weather-data");
            weatherDataContainer.appendChild(weatherDataDiv);

            displayTodaysWeather(weatherData.currentConditions);
            displayTomorrowsForecast(weatherData.tomorrowsConditions);

            setPageColors(weatherData);
        })
        .catch((error) => {
            console.error(new Error(error.message));
            const weatherDataContainer = document.querySelector(
                ".weather-data-container",
            );
            console.log("this ran");
            weatherDataContainer.textContent =
                "Could not find the weather for the given location";
            weatherDataContainer.style.color = "#fff";
        });
}

searchButton.addEventListener("click", (event) => {
    event.preventDefault();
    const searchedLocation = searchInputField.value || "kathmandu";
    displayWeatherData(searchedLocation);
});
