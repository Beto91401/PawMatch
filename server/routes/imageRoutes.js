import express from "express";
import { uploadImage, getImages } from "../controllers/imageController.js"; // Adjust the path as needed

const router = express.Router();

router.post("/upload", uploadImage);
router.get("/images", getImages);

export default router;
