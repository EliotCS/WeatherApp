# Weather-App
A custom web-based weather application built with HTML, CSS, JavaScript, Leaflet.js, and Cloudflare Pages.

# JavaScript Weather App
A functional, responsive web application that provides real-time weather forecasts, interactive map coordinate lookup, dynamic unit conversion, and persistent local storage.

## About
I built this project to test and apply my growing JavaScript and web development skills. Rather than creating a basic static weather display, I challenged myself to solve real user-experience problems: integrating interactive map-click geocoding with Leaflet.js, fetching live data using the OpenWeather API, hosting the site on Cloudflare, and styling a modern glassmorphism UI.

## What I Learned
While building this project, I practiced:
* Working with `localStorage` to persist user settings, last searched locations, and temperature preferences across browser sessions
* Fetching, handling, and parsing asynchronous live data using the OpenWeather API
* Deploying and hosting a web application seamlessly using Cloudflare Pages
* Integrating Leaflet.js map event listeners (`e.latlng`) to fetch weather data by geographic coordinates whenever a user clicks the map
* Array manipulation and data slicing (`.slice(i * 8, (i + 1) * 8)`) using `Math.min()` and `Math.max()` to compute daily high and low temperatures from 3-hour forecast blocks
* Converting degree measurements into cardinal compass directions (`N`, `NE`, `E`, etc.) using modular arithmetic (`Math.round(deg / 45) % 8`)
* Designing a modern glassmorphism interface using CSS `backdrop-filter: blur(12px)`, custom gradients, and CSS animated toggle switches

## Features
* **Interactive Map Selection** — click anywhere on the interactive Leaflet map to instantly fetch weather data for those exact coordinates
* **City & State Search** — input any US city and state combination to geocode and fetch a 5-day weather forecast
* **Dynamic 5-Day Forecast** — displays calculated daily high/low temperatures, feels-like metrics, humidity, wind direction, and weather condition icons
* **Persistent Unit Toggle** — switch between Fahrenheit and Celsius instantly with automatic unit conversions recalculated on the fly
* **Local Storage Persistence** — saves your last searched location and temperature preference across page reloads
* **Glassmorphism UI** — features frosted-glass card elements and fully responsive layout adjustments for desktop and mobile devices

## Technologies Used
* HTML5
* CSS3 
* JavaScript 
* Leaflet.js 
* OpenWeather API
* Cloudflare Pages

## Purpose
This project is part of my journey mastering vanilla JavaScript and web development. Building a weather application allowed me to sharpen my problem-solving skills, work with third-party mapping APIs, handle complex asynchronous responses, and build a clean UI from scratch.

I plan to keep building and refining projects to sharpen my front-end development skills.

## Preview
![Weather App Screenshot](https://github.com/user-attachments/assets/d5d132fd-4634-4557-8868-05940ed7d3a0)

## Live Demo
[View the Weather App](https://eliotweatherapp.pages.dev/)
