const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  image: {type: String},
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  category: {type: String},
});

module.exports = mongoose.model("Food", foodSchema);
