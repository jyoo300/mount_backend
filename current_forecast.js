var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var currentForecastSchema = new Schema({
    city: String,
    temp: String
  });

  module.exports = mongoose.model('currentForecast', currentForecastSchema);
