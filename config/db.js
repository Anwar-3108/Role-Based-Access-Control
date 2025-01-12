const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log(
      `Database Connected`
    );
  } catch (error) {
    console.log("Error While Connecting Database, Error: " + error);
    process.exit(1);
  }
};

module.exports = dbConnect;
