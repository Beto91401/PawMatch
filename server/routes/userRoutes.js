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
  getProfile,
  editProfile
} from "../controllers/userController.js";
import { authenticateToken } from '../middleware/authenticateToken.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      console.log('Multer storage destination function called'); // Log when this function is called
      cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
      console.log('Multer storage filename function called'); // Log when this function is called
      console.log('File received:', file.originalname); // Log the file name
      cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Routes
router.post("/login", login);
router.post("/getuse", login);
router.get("/current-user", getCurrentUser);
router.post('/signup', upload.single('dogPicture'), (req, res, next) => {
  console.log('Signup route hit'); // Log when the route is hit
  console.log('Fields:', req.body); // Log form fields
  console.log('File:', req.file); // Log the file
  next();
}, signup); // Ensure 'dogPicture' matches the form field name
router.get("/users", getUsers);
router.get("/adoption-users", getAdoptionUsers);
router.get("/breeding-users", getBreedingUsers);
router.get('/profile', authenticateToken, getProfile);
router.post('/edit-profile', authenticateToken, upload.single('dogPicture'), editProfile);


export default router;
