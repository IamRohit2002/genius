// ImageModel.js
const mongoose = require('mongoose');

// Define the schema for storing images
const imageSchema = new mongoose.Schema({
    filename: String,
    contentType: String,
    imageBase64: String
});

// Create a model using the schema
const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
