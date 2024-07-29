import passport from "passport";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt with email:', email); // Log email
  console.log('Password provided:', password); // Log password

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email); // Log user not found
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password does not match for email:', email); // Log password mismatch
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        websiteChoice: user.websiteChoice,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCurrentUser = (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ loggedIn: true, user: req.user });
  } else {
    res.json({ loggedIn: false });
  }
};

export const signup = async (req, res) => {
  const {
      username,
      email,
      password,
      dogType,
      dogAge,
      dogGender,
      dogName,
      coatLength,
      petFriendly,
      dogPersonality,
      websiteChoice
  } = req.body;

  const dogPicture = req.file ? req.file.filename : null;

  console.log('Received data:', req.body); // Log received fields
  console.log('Received file:', req.file); // Log received file
  try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ message: "User with this email already exists." });
      }

      if (!password) {
          return res.status(400).json({ message: "Password is required" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
          username,
          email,
          password: hashedPassword,
          dogType,
          dogAge,
          dogGender,
          dogName,
          coatLength,
          petFriendly,
          dogPersonality,
          dogPicture,
          websiteChoice,
      });

      await user.save();

      res.status(201).json({ message: "User created successfully." });
  } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Error creating user", error: error.message });
  }
};


export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).send("Error fetching users");
  }
};

export const getAdoptionUsers = async (req, res) => {
  try {
    const users = await User.find({ websiteChoice: "adoption" });
    res.json(users);
  } catch (error) {
    console.error("Error fetching adoption users:", error);
    res.status(500).send("Error fetching adoption users");
  }
};

export const getBreedingUsers = async (req, res) => {
  try {
    const users = await User.find({ websiteChoice: "breeding" });
    res.json(users);
  } catch (error) {
    res.status(500).send("Error fetching breeding users");
  }
};
