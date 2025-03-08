const express = require('express');
const multer = require('multer');
const Image = require('../models/ImageModel');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload Image API
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const newImage = new Image({
            filename: title,
            description,
            contentType: req.file.mimetype,
            imageBase64: req.file.buffer.toString('base64')
        });

        await newImage.save();
        res.status(200).json({ message: '✅ Image uploaded successfully' });
    } catch (err) {
        res.status(500).json({ error: '❌ Upload failed' });
    }
});

module.exports = router;
