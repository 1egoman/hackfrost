"use strict";
const app = require("express")();
const path = require("path");
const express_static = require("express-static");
const request = require("request");
const key = "e4b5f5d3042c07fc";



// fetch weather information for the current coords
app.get("/prop/:lat/:lng", (req, res) => {
  let lat = req.params.lat;
  let lng = req.params.lng;
  next_day(lat, lng)

  res.send(`bla ${req.params.lat}`)
});

// static asset handling
app.use(express_static(path.join(__dirname, '../public')))

// retreive the weather for the next day
let next_day = (lat, lng) => {
  request({
    url: `http://api.wunderground.com/api/${key}/forecast/q/${lat},${lng}.json`,
    method: "GET",
    headers: {'content-type': 'application/json'}
  }, (err, resp, data) => {
    let json = JSON.parse(data);

    // the conditions for the previous day
    let now = (new Date()).getDate()
    day = json.forecast.simpleforecast.forecastday.find((i) => {
      return i.date.day === now + 1 // look for tomorrow
    });

    // feed the data into brain
    let day_nn = [
      parseInt(day.low.fahrenheit), // average low temp
      day.avewind.mph, // average wind speed
      day.maxwind.mph, // max wind speed
      day.snow_day["in"], // snow for the day in inches
      day.snow_allday["in"] // snow for the 24 hours of the day in inches
    ];
  });
}



app.listen(process.env.PORT || 5000);
