"use strict";
const app = require("express")();
const path = require("path");
const express_static = require("express-static");
const request = require("request");
const key = "e4b5f5d3042c07fc";

// train the neural net
let brain = new (require("brain")).NeuralNetwork();
const training = [
  {input: [2, 0, 3, 5, 8, 14], output: [1]},
  {input: [1, 10, 5, 11, 12, 18], output: [1]},
  {input: [2, 10, 5, 11, 14, 20], output: [1]},
  {input: [12, 10, 5, 11, 14, 20], output: [1]},
  {input: [12, 10, 20, 25, 14, 20], output: [1]},
  {input: [2, 10, 5, 11, 14, 20], output: [1]},
  {input: [1, 1, 8, 16, 0.1, 0.9], output: [1]},
  {input: [2, -5, 10, 11, 14, 20], output: [1]},
  {input: [2, -5, 10, 11, 3, 5], output: [1]},
  {input: [1, 0, 10, 11, 3, 5], output: [1]},
  {input: [2, 25, 15, 20, 15, 20], output: [1]},

  {input: [1, 20, 10, 15, 2, 5], output: [0.5]},

  {input: [3, 20, 0, 0, 3, 5], output: [0]},
  {input: [1, 50, 5, 8, 3, 5], output: [0]},
  {input: [2, 30, 0, 0, 3, 5], output: [0]},
  {input: [3, 30, 0, 0, 3, 5], output: [0]},
  {input: [5, 60, 0, 0, 3, 5], output: [0]},
  {input: [12, 30, 5, 0, 3, 5], output: [0]},
  {input: [3, 30, 0, 0, 3, 5], output: [0]},
];
brain.train(training);
console.log("=> NN trained.")

// fetch weather information for the current coords
app.get("/run/:lat/:lng", (req, res) => {
  let lat = req.params.lat;
  let lng = req.params.lng;

  // fetch the weather at the given coords
  next_day(lat, lng, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      // run through the neural net, and respond
      let perc = brain.run(data)[0];
      console.log(`${lat}, ${lng} -> ${perc * 100}%`);
      res.send({
        percent: perc,
        label: get_label_for_perc(perc)
      });
    }
  });

});

// static asset handling
app.use(express_static(path.join(__dirname, '../public')))


// given a percentage match, return a nice label
function get_label_for_perc(perc) {
  if (0 < perc && perc < 0.5) {
    return "School will be open."
  } else if (0.5 < perc && perc < 0.8) {
    return "A possible delay."
  } else {
    return "Snow Day is imminent!!!"
  }
}

// retreive the weather for the next day
function next_day(lat, lng, callback) {
  request({
    url: `http://api.wunderground.com/api/${key}/forecast/q/${lat},${lng}.json`,
    method: "GET",
    headers: {'content-type': 'application/json'}
  }, (err, resp, data) => {
    let json = JSON.parse(data);

    if (err) {
      callback(err);
    } else if (json.response && json.response.error) {
      callback({
        error: "Hmm, are you sure you live here???"
      });
    } else {
      // the conditions for the previous day
      let now = (new Date()).getDate()
      let day = json.forecast.simpleforecast.forecastday.find((i) => {
        return i.date.day === now + 1 // look for tomorrow
      });

      // feed the data into brain
      callback(null, [
        (new Date()).getMonth()+1, // month of the year
        parseInt(day.low.fahrenheit), // average low temp
        day.avewind.mph, // average wind speed
        day.maxwind.mph, // max wind speed
        day.snow_day["in"], // snow for the day in inches
        day.snow_allday["in"] // snow for the 24 hours of the day in inches
      ]);
    }
  });
}



const  port = process.env.PORT || 5000
app.listen(port);
console.log(`=> Listening on ${port}...`);
