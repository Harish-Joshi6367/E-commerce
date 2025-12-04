const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: { type: String, enum: ['grocery','cosmetics'], required: true },
  quantity: { type: Number, default: 0 },
  image: String
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
