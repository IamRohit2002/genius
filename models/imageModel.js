const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    filename: String,
    description: String,
    contentType: String,
    imageBase64: String,
    createdAt: { type: Date, default: Date.now }
});

const Image = mongoose.model('Image', imageSchema);
module.exports = Image;
