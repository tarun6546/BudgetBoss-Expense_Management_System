const mongoose = require('mongoose');
const colors = require('colors');
require('dotenv').config();
// const { default: mongoose } = require('mongoose');

const connectDb = async () => {
    try {
        console.log(process.env.MONGODB_URL)
        await mongoose.connect("mongodb+srv://tarunvarshney2112:Tarun21122003@cluster0.sz0k6ac.mongodb.net/expanseApp?retryWrites=true&w=majority&appName=Cluster0");
        console.log(`Server running on ${mongoose.connection.host}`.bgBlue.white);
    }
    catch (error) {
        console.log(`${error}`.bgRed)
    }

}
module.exports = connectDb;