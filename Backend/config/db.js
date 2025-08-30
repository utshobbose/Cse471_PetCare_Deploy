require('dotenv').config()
const mongoose = require('mongoose');

const mongoString = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.gsbt9xg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const connectDB = () => {
    mongoose.connect(mongoString);
    const database = mongoose.connection;

    database.on('error', (error) => {
        console.error('MongoDB connection error',error);
    });

    database.once('connected', () => {
        console.log('MongoDB connected');
    });
};

module.exports = connectDB;
