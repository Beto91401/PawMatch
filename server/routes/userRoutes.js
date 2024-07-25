import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

import {
  signup,
  getUsers,
  getAdoptionUsers,
  getBreedingUsers,
  login,
  getCurrentUser,
} from "../controllers/userController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Routes
router.post("/login", login);
router.post("/getuse", login);
router.get("/current-user", getCurrentUser);
router.post("/signup", signup);
router.get("/users", getUsers);
router.get("/adoption-users", getAdoptionUsers);
router.get("/breeding-users", getBreedingUsers);

export default router;
