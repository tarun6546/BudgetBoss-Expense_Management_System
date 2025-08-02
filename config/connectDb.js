const mongoose = require('mongoose');
const colors = require('colors');
// const { default: mongoose } = require('mongoose');

const connectDb = async () => {
    try {
        console.log(process.env.MONGODB_URL)
        await mongoose.connect(process.env.MONGODB_URL);
        console.log(`Server running on ${mongoose.connection.host}`.bgBlue.white);
    }
    catch (error) {
        console.log(`${error}`.bgRed)
    }

}
module.exports = connectDb;