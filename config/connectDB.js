import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const db = "mongodb://127.0.0.1:27017/replicaDB";

mongoose.connect(db)
  .then(() => {
    console.log("db connection established successfully !");
  })
  .catch((err) => {
    console.log("error connecting to database: " + err);
  });
