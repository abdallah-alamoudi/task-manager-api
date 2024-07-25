const mongoose = require("mongoose");
const connectionUrl = process.env.MONGODB_URL;
const connectToDb = async () => {
  await mongoose.connect(connectionUrl);
  console.log("connected to database successfully");
};

module.exports = connectToDb;
