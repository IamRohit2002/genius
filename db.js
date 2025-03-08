const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://kalyaniarote211:QYsrIG9f3YRaC2Z8@cluster0.pxdac.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/newsupdate')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));

