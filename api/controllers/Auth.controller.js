import User from "../models/User.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const signUp = async (req, res, next) => {
  const { username, password, email } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, password: hashedPassword, email });
  try {
    await newUser.save();
    res.status(201).json("user created successfully!");
  } catch (error) {
    next(error);
  }
};
export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });

    if (!validUser) return next(errorHandler(404, "User not found!"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials!"));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};
export const OAuth = async (req, res, next) => {
  try {
    const { email, name, photo } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const { password, ...rest } = user._doc;
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const username =
        name.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-4);
      const newUser = new User({
        password: hashedPassword,
        username,
        email,
        photo,
      });
      await newUser.save();
      const { password, ...rest } = newUser._doc;
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
export const SignOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User signed out!");
  } catch (error) {
    next(error);
  }
};
