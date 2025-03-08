require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB Connection Failed:', err));

// Import Routes
app.use('/api', require('./api/upload'));
app.use('/api', require('./api/images'));

// Export app for Vercel
module.exports = app;
