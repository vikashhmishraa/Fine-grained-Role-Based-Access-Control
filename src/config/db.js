import mongoose from "mongoose";
import { DB_NAME } from "../config/constants.js";

const connectDB = async () => {
  try {
    const connectionString = `${process.env.MONGODB_URI}/${DB_NAME}`;
    console.log(`Connecting to: ${connectionString}`);

    const ConnectionInstance = await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(
      `\n MongoDB Successfully Connected! | DB Host: ${ConnectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("MongoDB Connection Error!!!", error);
    process.exit(1);
  }
};


export default connectDB;
