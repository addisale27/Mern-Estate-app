import User from "../models/User.model.js";
import bcryptjs from "bcryptjs";
export const signUp = async (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, password: hashedPassword, email });
  try {
    await newUser.save();
    res.status(201).json("user created successfully!");
  } catch (error) {
    res.status(500).json(error.message);
  }
};
