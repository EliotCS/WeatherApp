const SubmitInput = document.getElementById("getinputs");
const switchButton = document.getElementById("F-or-C-Switch");
let currentWeatherData = null;

window.addEventListener("DOMContentLoaded", () => {
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

function temperature (value,fvalue){
    const ChosenTemp = localStorage.getItem("TempType");
    const tempDisplay = document.getElementById("temp");
    const Feellike = document.getElementById("Feel-like");


    if(ChosenTemp === "Celsius"){
        const Celsius = Math.round(value-273.15);
        tempDisplay.textContent = Celsius + "°C";
        const fCelsius = Math.round(fvalue-273.15);
        Feellike.textContent ="Feels like "+  fCelsius + "°C"
    } else{
        const Fahrenheit = Math.round((value-273.15)* 9/5 + 32);
        tempDisplay.textContent = Fahrenheit + "°F"; 

        const fFahrenheit = Math.round((fvalue-273.15)* 9/5 + 32);
        Feellike.textContent = "Feels like "+ fFahrenheit + "°F"; 
    }

};

switchButton.addEventListener("change", (ForC)=>{
    if (ForC.target.checked){
        localStorage.setItem("TempType", "Celsius");
    }
    else{
        localStorage.setItem("TempType", "Fahrenheit");

    }
    if(currentWeatherData){
        temperature(currentWeatherData.main.temp, currentWeatherData.main.feels_like);
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

        //Grabs the weather api then fetches it
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${fcity},${fstate},US&appid=${apiKey}`;
        const response = await fetch(apiUrl);
        //checks if a error occur
        if (!response.ok) {
            throw new Error("City not found. Please double check your spelling and state.");
        }

        console.log("API is successfully fetched")
        const WeatherData = await response.json();
        currentWeatherData = WeatherData;

        //Updates Chosen State and City
        const DisplayCurrentLoco = document.getElementById("DisplayLoco");
        DisplayCurrentLoco.textContent= fcity + ", "+ fstate

        //Updates icons
        const iconCode = WeatherData.weather[0].icon;
        document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    
        //Updates temp and checks for C or F
        temperature(WeatherData.main.temp, WeatherData.main.feels_like);
        console.log(WeatherData);

        //updates current Humidity
        const currentHumidity = document.getElementById("currentHumidity");
        currentHumidity.textContent = "Humidity: " + WeatherData.main.humidity + "%";

        //updates current wind speed/direction
        currentWind
        const speed = Math.round(WeatherData.wind.speed);
        const direction = getWindDirection(WeatherData.wind.deg);
        const wind = document.getElementById("currentWind");
        wind.textContent = `Wind: ${speed} mph ${direction}`;

        //updates description of the current weather
        const description = document.getElementById("Description");
        description.textContent = WeatherData.weather[0].description;
    } 
    catch(error){
        console.error("Fetch Error:", error);
        alert(error.message || "Unable to fetch weather data. Please try again.");
    }


};


function getWindDirection(deg) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(deg / 45) % 8];
}


function clock (){
    let time = document.getElementById("CurrentTime");
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
    const Hours = hour.toString().padStart(1,0);
    time.textContent = Hours + ":"+ minute + " "+ meridiems;
};

function dayWeather(dayAPI){
    

}