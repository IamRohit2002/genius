const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const Image = require('./ImageModel');

const app = express();

// Enable CORS for frontend
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection (Ensure MongoDB Atlas is used)
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

// Image Upload Route
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

// Fetch Images Route
app.get('/api/images', async (req, res) => {
    try {
        const images = await Image.find({});
        res.json(images);
    } catch (err) {
        console.error('❌ Error fetching images:', err);
        res.status(500).json({ error: 'Failed to fetch images' });
    }
});

// Export the app for Vercel (VERY IMPORTANT!)
module.exports = app;
