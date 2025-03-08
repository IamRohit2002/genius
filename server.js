require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const Image = require('./models/ImageModel');

const app = express();

// 🔹 Enable CORS
app.use(cors({ origin: '*' }));

// 🔹 Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 🔹 MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB Connection Failed:', err));

// 🔹 Multer Storage (TEMP FIX)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/tmp'); // 🔹 Store in temporary directory
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// 🔹 Image Upload API
app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const imageData = require('fs').readFileSync(`/tmp/${req.file.originalname}`, 'base64');

        const newImage = new Image({
            filename: title,
            description,
            contentType: req.file.mimetype,
            imageBase64: imageData
        });

        await newImage.save();
        res.status(200).json({ message: '✅ Image uploaded successfully' });
    } catch (err) {
        res.status(500).json({ error: '❌ Upload failed' });
    }
});

// 🔹 Fetch Images API
app.get('/api/images', async (req, res) => {
    try {
        const images = await Image.find({}).limit(10);
        res.json(images);
    } catch (err) {
        res.status(500).json({ error: '❌ Failed to fetch images' });
    }
});

// 🔹 Export for Vercel
module.exports = app;
