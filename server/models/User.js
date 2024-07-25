import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  dogType: String,
  dogAge: Number,
  dogGender: String,
  dogName: String,
  coatLength: String,
  petFriendly: String,
  dogPersonality: String,
  dogPicture: String,
  websiteChoice: String,
});

const User = mongoose.model("User", userSchema);
export default User;
