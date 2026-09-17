const SubmitInput = document.getElementById("getinputs");
const switchButton = document.getElementById("F-or-C-Switch");
let currentWeatherData = null;

let map, marker;
window.addEventListener("DOMContentLoaded", () => {

    map = L.map("map").setView([39.8283, -98.5795], 4);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap"
    }).addTo(map);

    map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        
        if (marker) map.removeLayer(marker);
        marker = L.marker([lat, lng]).addTo(map);

        getWeatherByCoords(lat, lng);
    });

    const savedState = localStorage.getItem("StateInput");
    const savedCity = localStorage.getItem("CityInput");
    const savedTemp = localStorage.getItem("TempType");

    if(savedTemp === "Celsius"){
        switchButton.checked = true;
    } else{
        switchButton.checked = false;
    }

    if (savedState && savedCity) {
        document.getElementById("state").value = savedState;
        document.getElementById("city").value = savedCity;
        getWeatherData(savedState, savedCity);
    }

    clock();
    setInterval(clock,1000);
});

SubmitInput.addEventListener("click", (event)=>{
    event.preventDefault();
    const city = document.getElementById("city").value;
    const state = document.getElementById("state").value;

    if(!city || !state){
        alert("Pleaase enter city and state")
        return;
    }
    localStorage.setItem("StateInput", state);
    localStorage.setItem("CityInput", city);
    getWeatherData(state,city);

    
});

switchButton.addEventListener("change", (ForC)=>{
    if (ForC.target.checked){
        localStorage.setItem("TempType", "Celsius");
    }
    else{
        localStorage.setItem("TempType", "Fahrenheit");

    }
    if(currentWeatherData){
        CreateWeatherCards(currentWeatherData); 
    }
    
});

async function getWeatherData(fstate,fcity) {
    try{
        //This checks for the entered City and state and checks if its valid or not 
        const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(fcity)},${fstate},US&limit=1&appid=${apiKey}`);
        const geoData = await geoRes.json();

        if (!geoData || geoData.length === 0) {
            throw new Error(`"${fcity}" does not exist in ${fstate}.`);
        }


        const { lat, lon } = geoData[0];

        if (map) {
            map.setView([lat, lon], 10); 
            if (marker) map.removeLayer(marker);
            marker = L.marker([lat, lon]).addTo(map);
        }

        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error("City not found. Please double check your spelling and state.");
        }

        console.log("API is successfully fetched")
        const WeatherAPI = await response.json();
        currentWeatherData = WeatherAPI;

        //Updates Chosen State and City
        const DisplayCurrentLoco = document.getElementById("DisplayLoco");
        DisplayCurrentLoco.textContent= fcity + ", "+ fstate;

        CreateWeatherCards(WeatherAPI);

    } 
    catch(error){
        console.error("Fetch Error:", error);
        alert(error.message || "Unable to fetch weather data. Please try again.");
    }


};

function CreateWeatherCards (ApiJSON){
    const carddiv = document.getElementById("Cards");
    carddiv.innerHTML = "";

    for(let i =0; i<5;i++){
        const apidata = ApiJSON.list[i *8];
        if(!apidata){
            console.log("Error Occur");
            break;
        };

        console.log(apidata);
        //Time
        let timeHTML = '';
        if(i===0){
            timeHTML = `<div id="CurrentTime">--:-- --</div>`;
        }
        else if(i===1){
             timeHTML = `<div class="card-day">Tomorrow</div>`;
        }
        else{
            const cardDate = new Date(apidata.dt * 1000);
            const dayName = cardDate.toLocaleDateString("en-US", { weekday: "long" });
            timeHTML = `<div class="card-day">${dayName}</div>`;
        }

        //temperature
        let temp = apidata.main.temp;
        let feelsLike = apidata.main.feels_like;
        const dayIntervals = ApiJSON.list.slice(i * 8, (i + 1) * 8)
        const mintemp = Math.min(...dayIntervals.map(item => item.main.temp_min));
        const maxtemp = Math.max(...dayIntervals.map(item => item.main.temp_max));
        
        const CaputuredTemp =  temperature(temp,feelsLike,mintemp,maxtemp);

        //gets wind speed/direction
        const speed = Math.round(apidata.wind.speed);
        const direction = getWindDirection(apidata.wind.deg);
        //Humidity
        const humidity = apidata.main.humidity;
        
        //Gets icon code and gets the icon image
        const iconCode = apidata.weather[0].icon;
        const updateIcon = `https://openweathermap.org/img/wn/${iconCode}@2x.png`

        //Weather Description 
        const description = apidata.weather[0].description;       

        //adds the html for api fetched days
        const CardHTML = 
        `<div class="weathercard">
            ${timeHTML}
            <div class="description">${description}</div>
            <div class="Weathericons">
                <div><img class="weather-icon" src="${updateIcon}" alt="Weather Icon"></div>
                <div class="temp">${CaputuredTemp.temp}</div>
            </div>
        <div class="humidity">Humidity: ${humidity}%</div>
        <div class="wind">Wind: ${speed} mph ${direction}</div>
        <div class="feel-like">Feels Like: ${CaputuredTemp.feelsLike}</div>
        <div class="maxtemp">Max Temp: ${CaputuredTemp.maxtemp}</div>
        <div class="mintemp">Min Temp: ${CaputuredTemp.mintemp}</div>
        </div>`;

        carddiv.insertAdjacentHTML("beforeend", CardHTML);
    }
    clock();

}


function getWindDirection(deg) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(deg / 45) % 8];
}

function clock (){
    let time = document.getElementById("CurrentTime");
    if (!time) return;
    const date = new Date();
    const minute = date.getMinutes().toString().padStart(2,0);
    let hour = date.getHours();

    let meridiems;
    if(hour >= 12){
        meridiems = "PM";
    }
    else{
        meridiems= "AM";
    }

    hour = hour % 12 || 12;
    time.textContent = `${hour}:${minute} ${meridiems}`;
};

function temperature (value,fvalue,Minimum ,Maximum){
    const ChosenTemp = localStorage.getItem("TempType");

    if(ChosenTemp === "Celsius"){
        const temp = Math.round(value-273.15) + "°C"
        const feelsLike = Math.round(fvalue-273.15) + "°"
        const mintemp = Math.round(Minimum-273.15) + "°"
        const maxtemp = Math.round(Maximum-273.15) + "°"

        return {temp, feelsLike,mintemp,maxtemp};

    } else{
        const temp = Math.round((value-273.15)* 9/5 + 32) + "°F";
        const feelsLike = Math.round((fvalue-273.15)* 9/5 + 32) + "°F";
        const mintemp = Math.round((Minimum-273.15)* 9/5 + 32) +"°";
        const maxtemp = Math.round((Maximum-273.15)* 9/5 + 32)+"°";;
        return {temp,feelsLike,mintemp ,maxtemp};
    }

};

async function getWeatherByCoords(lat, lon) {
    try {
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("Weather data not found.")
        };

        const WeatherAPI = await response.json();
        currentWeatherData = WeatherAPI;

        localStorage.setItem("savedLat", lat);
        localStorage.setItem("savedLon", lon);
        localStorage.setItem("CityInput", WeatherAPI.city.name);

        const DisplayCurrentLoco = document.getElementById("DisplayLoco");
        DisplayCurrentLoco.textContent = `${WeatherAPI.city.name}, ${WeatherAPI.city.country}`;

        CreateWeatherCards(WeatherAPI);
    } 
    catch (error) {
        console.error("Map Fetch Error:", error);
    }
}

