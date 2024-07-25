import ImageDetails from "../models/ImageDetails.js"; // Use ES module import

export const uploadImage = async (req, res) => {
  const imageName = req.file.filename;

  try {
    await ImageDetails.create({ image: imageName });
    res.json({ status: "ok" });
  } catch (error) {
    res.json({ status: error });
  }
};

export const getImages = async (req, res) => {
  try {
    const images = await ImageDetails.find({});
    res.send({ status: "ok", data: images });
  } catch (error) {
    res.json({ status: error });
  }
};
