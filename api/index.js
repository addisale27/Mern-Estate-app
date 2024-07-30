import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/User.route.js";
import authRouter from "./routes/Auth.route.js";
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
app.use(express.json());
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
//middleware for handling the error
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error!";
  return res.status(statusCode).json({
    message,
    success: false,
    statusCode,
  });
});
