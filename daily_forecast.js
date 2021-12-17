var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var dailyForecastSchema = new Schema({
    data: [{ 
        city: String, 
        temp: String,
        date: String,
    }]
  });

  module.exports = mongoose.model('dailyForecast', dailyForecastSchema);