const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

const port = 80;

app.set('view engine', 'ejs');
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


let latitude, longitude;
const iconMappings = {
  "01d": "/images/weatherIcon/wi-day-sunny.svg",
  "01n": "/images/weatherIcon/wi-night-clear.svg",
  "02d": "/images/weatherIcon/wi-day-cloudy.svg",
  "02n": "/images/weatherIcon/wi-night-cloudy.svg",
  "03d": "/images/weatherIcon/wi-day-cloudy-high.svg",
  "03n": "/images/weatherIcon/wi-night-cloudy-high.svg",
  "04d": "/images/weatherIcon/wi-day-cloudy-windy.svg",
  "04n": '/images/weatherIcon/wi-night-cloudy-windy.svg',


  "10d": '/images/weatherIcon/wi-day-rain.svg'

  // Add more mappings for other weather conditions as needed
};

const api = ''
const apiKey = '3d14281cd63cbd6ab6b4ad2a4bd00fa2'; // Replace with your actual API key
const config = {
  params: {
     appid: '3d14281cd63cbd6ab6b4ad2a4bd00fa2' }
};



// Assuming location.js is using CommonJS syntax

app.get('/', (req, res) => {
  res.render('index', {
    temperature: undefined,
    weatherMain: undefined,
    weatherDescription: undefined
  });
});

app.post('/getLocation',  async (req, res) => {
  const { lat, long } = req.body;
  console.log('Latitude:', lat);
  console.log('Longitude:', long);

  // Now you can use lat and long for your API requests or other processing

  // Send a response back to the client if needed
  latitude = lat;
  longitude = long;
  res.send('Received location data');

});

/*
function getReverseGeocodingData(latitude, longitude, apiKey) {
  const apiUrl = 'https://api.openweathermap.org/data/2.5/forecast';

  // Send an HTTP POST request to the OpenWeatherMap API using axios
  axios.post(apiUrl, null, {
    params: {
      lat: latitude,
      lon: longitude,
      appid: apiKey
    }
  })
    .then(response => {
      const data = response.data;
      console.log('Reverse Geocoding Data:', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
// Call the function to initiate the request
getReverseGeocodingData();
*/

app.get("/weather", async (req, res) => {

  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric`, config);
    const temperature = response.data.list[0].main.temp;
    const weatherMain = response.data.list[0].weather[0].main;
    const weatherDescription = response.data.list[0].weather[0].description;
    const weatherIcon = response.data.list[0].weather[0].icon;
    const weatherDay = response.data;
    


    const responseCity = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat: latitude,
        lon: longitude,
        units: 'metric',
        appid: apiKey
      }

    });
    const weather = responseCity.data;


    const responseCountry = await axios.get(`http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=${5}`, config);
    // Check if the response has data
    
        const locationName = responseCountry.data[0];
        console.log("Country:", locationName);
  
    

    res.render("test.ejs", {
      temperature,
      weatherMain,
      weatherDescription,
      weather,
      weatherIcon,
      iconMappings,
      weatherDay,
      locationName
    });

    console.log('Temperature:', temperature);
    console.log('Weather:', weatherMain);
    console.log('Description:', weatherDescription);
    console.log("Icon: " + weatherIcon);
    console.log("temp: " + weatherDay.list[0].main.temp);



  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

/*
async function getCurrentWeather() {
  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat: latitude,
        lon: longitude,
        units: 'metric',
        appid: apiKey
      }
    });

   
    console.log("City Name: " + cityName);

    return { cityName };
  } catch (error) {
    console.error('Error in getCurrentWeather:', error.message);
    throw error;
  }
}
app.post("/post-location-current", async (req, res) => {
  try {
    const { cityName } = await getCurrentWeather();
    console.log("City Name in Route:", cityName);
    res.render("index.ejs", { cityName });
  } catch (error) {
    console.error('Error in route:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

*/
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});


