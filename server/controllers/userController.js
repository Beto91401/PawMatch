import passport from "passport";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Message from '../models/Message.js';


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

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) return res.status(404).json({ message: "User not found." });
      res.json({ user });
  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
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


export const getUsersMessaged = async (req, res) => {
  console.log('hey this is get user messaged');
  try {
      const currentUserId = req.user.id;
      console.log(currentUserId);

      // Find all messages involving the current user
      const messages = await Message.find({
          $or: [
              { senderId: currentUserId },
              { receiverId: currentUserId }
          ]
      });

      // Collect all unique user IDs involved in the conversation
      const userIdsSet = new Set();
      messages.forEach(message => {
          if (message.senderId.toString() !== currentUserId) {
              userIdsSet.add(message.senderId.toString());
          }
          if (message.receiverId.toString() !== currentUserId) {
              userIdsSet.add(message.receiverId.toString());
          }
      });

      // Convert the set to an array
      const messagedUserIds = Array.from(userIdsSet);
      console.log('Messaged User IDs:', messagedUserIds);

      // Fetch user details for the messaged users
      const users = await User.find({ _id: { $in: messagedUserIds } }).select('-password'); // Exclude password field
      console.log(users);
      res.json(users);
  } catch (error) {
      console.error('Error fetching users messaged:', error);
      res.status(500).json({ message: 'Error fetching users messaged', error: error.message });
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


// Function to get the user's profile
export const getProfile = async (req, res) => {
  const userId = req.user.id;
  console.log(`Fetching profile for user ID: ${userId}`);
  try {
    const user = await User.findById(userId).select("-password"); // Exclude the password field
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: "User not found" });
    }
    console.log('User profile fetched successfully:', user);
    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Error fetching user profile", error: error.message });
  }
};

// Define the editProfile function
export const editProfile = async (req, res) => {
  const userId = req.user.id;
  const {
    username,
    email,
    dogType,
    dogAge,
    dogGender,
    dogName,
    coatLength,
    petFriendly,
    dogPersonality
  } = req.body;

  const dogPicture = req.file ? req.file.filename : null;

  console.log('Edit profile data received:', {
    username,
    email,
    dogType,
    dogAge,
    dogGender,
    dogName,
    coatLength,
    petFriendly,
    dogPersonality,
    dogPicture
  });

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.dogType = dogType || user.dogType;
    user.dogAge = dogAge || user.dogAge;
    user.dogGender = dogGender || user.dogGender;
    user.dogName = dogName || user.dogName;
    user.coatLength = coatLength || user.coatLength;
    user.petFriendly = petFriendly || user.petFriendly;
    user.dogPersonality = dogPersonality || user.dogPersonality;
    if (dogPicture) {
      user.dogPicture = dogPicture;
    }

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};