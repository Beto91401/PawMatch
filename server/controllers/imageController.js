import ImageDetails from "../models/ImageDetails.js"; // Use ES module import

export const uploadImage = async (req, res) => {
  const imageName = req.file.filename;
  console.log('uploadImage controller hit'); // Log when the controller is hit

  try {
    console.log('File details:', req.file); // Log the file details

    await ImageDetails.create({ image: imageName });
    res.json({ status: "ok" });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.json({ status: error });
  }
};

export const getImages = async (req, res) => {
  try {
    const images = await ImageDetails.find({});
    res.send({ status: "ok", data: images });
  } catch (error) {
    console.error('Error retrieving images:', error);
    res.json({ status: error });
  }
};
