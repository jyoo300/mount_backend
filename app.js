const express = require('express')
const fetch = require('cross-fetch');
const jwt = require('jsonwebtoken');
const app = express()
const port = 3000

const apiKey = 'ec33717c6f582d70e3fa175d0adb8d43';

const currentForecast = require('./current_forecast');
const dailyForecast = require('./daily_forecast');

app.use(express.json());

function createToken() {
  const username = 'Username';
  const password = 'Password';
  const accessToken = jwt.sign(username, password);
  return accessToken.slice(0, 20);
}

function authenticateToken(token) {
  if(token.length == 20) {
    return true;
  }
  return false;

}

app.get('/get_current/:zip_code', (req, res) => {
  let accessToken = createToken();

  if(authenticateToken(accessToken)) {
    // assume that zip code is valid
    let zipCode = req.params.zip_code;
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&units=imperial&appid=${apiKey}`;
  
    let currentWeather = currentForecast();
  
    async function fetchCurrent(url) {
      await fetch(url)
          .then((res) => res.json())
          .then(data => {
            currentWeather.name = data.name;
            currentWeather.temp = data.main.temp;
        });
    }
  
    fetchCurrent(currentUrl);
  }
  else {
    console.log('Invalid token.')
  }


})


app.get('/get_daily/:zip_code', (req, res) => {
  let accessToken = createToken();

  if(authenticateToken(accessToken)) {
    let zipCode = req.params.zip_code;
    const dailyUrl = `https://api.openweathermap.org/data/2.5/forecast?zip=${zipCode}&units=imperial&appid=${apiKey}`;
  
    let dailyWeather = currentForecast();
    dailyWeather.data = [];
  
    async function fetchDaily(url, dailyWeather) {
      let weatherData;
      await fetch(url)
          .then((res) => res.json())
          .then(data => {
            weatherData = data
        })
        .catch(err => {
            console.log('error');
         });
  
  
      for(let i = 0; i <= weatherData.list.length; i++) {
        if(weatherData.list[i].dt_txt.substring(11) == '12:00:00') {
          dailyWeather.data.push({city: weatherData.city.name, temp: weatherData.list[i].main.temp, date: weatherData.list[i].dt_txt})
        }
      }
  
    }
   
    fetchDaily(dailyUrl, dailyWeather);
  }
  else {
    console.log('Invalid token.')
  }

})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})