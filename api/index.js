import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@real-state.t2tpfhs.mongodb.net/?retryWrites=true&w=majority&appName=Real-state`
  )
  .then(() => {
    console.log(`connected to mongodb`);
  })
  .catch(() => {
    console.log(err);
  });

// use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled

const app = express();
const port = 3000;
//QE8RxdBYx7yhmtaw
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
