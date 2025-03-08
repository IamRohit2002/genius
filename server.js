const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const Image = require('./ImageModel'); // Load the image model

const app = express();
const PORT = 3000;

// Middleware to parse request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect('mongodb+srv://kalyaniarote211:QYsrIG9f3YRaC2Z8@cluster0.pxdac.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/newsupdate', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Failed to connect to MongoDB', err);
});

// Multer Storage Setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Image Upload Route
app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
        const { title, description } = req.body;
        const image = new Image({
            filename: title,
            contentType: req.file.mimetype,
            imageBase64: req.file.buffer.toString('base64')
        });

        await image.save();
        console.log('Image uploaded successfully');
        res.status(200).send('Image uploaded successfully');
    } catch (err) {
        console.error('Error uploading image', err);
        res.status(500).send('Upload failed');
    }
});

// Fetch Images Route
app.get('/images', async (req, res) => {
    try {
        const images = await Image.find({});
        res.json(images);
    } catch (err) {
        console.error('Error fetching images', err);
        res.status(500).send('Failed to fetch images');
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
