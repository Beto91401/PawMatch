import passport from "passport";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
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
    websiteChoice,
    dogPictureBase64,
  } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
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
      dogPicture: dogPictureBase64,
      websiteChoice,
    });

    await user.save();

    res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user" });
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
