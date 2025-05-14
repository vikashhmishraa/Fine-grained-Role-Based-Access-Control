import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { app } from "./app.js";

// Cofiguring ENV
dotenv.config({
  path: "./.env",
});

// Connecting MongoDB and Starting Server
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERROR : ", error);
      throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is Runing on Port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Failed !!! ", err);
  });
