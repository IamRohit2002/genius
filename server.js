require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const cors = require('cors'); // 🔹 Import CORS
const Image = require('./ImageModel');

const app = express();
const PORT = process.env.PORT || 3000;

// 🔹 Enable CORS (Allow requests from your frontend)
app.use(cors({
    origin: 'http://127.0.0.1:5500', // Allow only your frontend
    methods: ['GET', 'POST'], // Allowed methods
    allowedHeaders: ['Content-Type']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ Connected to MongoDB');
}).catch((err) => {
    console.error('❌ MongoDB Connection Failed:', err);
});

// Multer Storage Setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 🔹 Image Upload Route (Now allows CORS)
app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const image = new Image({
            filename: title,
            contentType: req.file.mimetype,
            imageBase64: req.file.buffer.toString('base64')
        });

        await image.save();
        console.log('✅ Image uploaded successfully');
        res.status(200).json({ message: 'Image uploaded successfully' });
    } catch (err) {
        console.error('❌ Error uploading image:', err);
        res.status(500).json({ error: 'Upload failed' });
    }
});

// 🔹 Fetch Images Route
app.get('/images', async (req, res) => {
    try {
        const images = await Image.find({});
        res.json(images);
    } catch (err) {
        console.error('❌ Error fetching images:', err);
        res.status(500).json({ error: 'Failed to fetch images' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
