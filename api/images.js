const express = require('express');
const Image = require('../models/ImageModel');

const router = express.Router();

// Fetch Images API
router.get('/images', async (req, res) => {
    try {
        const images = await Image.find({}).limit(10); // Fetch only 10 images
        res.json(images);
    } catch (err) {
        res.status(500).json({ error: '❌ Failed to fetch images' });
    }
});

module.exports = router;
