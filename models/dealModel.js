const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  name: String,
  price: Number,
  imageBase64: String,        // store base64 string here
  description: String,
  isDealOfTheDay: { type: Boolean, default: false },
  dealEndTime: Date
});

module.exports = mongoose.model('deal', dealSchema);
