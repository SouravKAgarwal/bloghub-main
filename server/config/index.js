import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL);

    console.log("DB Connected : " + connect.connection.host);
  } catch (error) {
    console.log("DB Error: " + error);
  }
};

export default dbConnection;
