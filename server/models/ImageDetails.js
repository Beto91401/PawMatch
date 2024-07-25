import mongoose from "mongoose";

const imageDetailsSchema = new mongoose.Schema({
  image: String,
});

const ImageDetails = mongoose.model("ImageDetails", imageDetailsSchema);

export default ImageDetails;
