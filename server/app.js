import express from "express";
import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import messageRoutes from "./routes/messageRoutes.js"; // Add this line



// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


// Middleware
app.use(cors()); // Updated to use ES module import
app.use(express.json({ limit: "50mb" })); // Apply middleware here
app.use(express.urlencoded({ extended: true }));



// Serve static files
app.use(express.static(path.join(process.cwd(), "..", "public")));
app.use("/homepage", express.static(path.join(process.cwd(), "..", "homepage")));
app.use("/images", express.static(path.join(process.cwd(), "..", "images")));
app.use("/Adoption", express.static(path.join(process.cwd(), "..", "Adoption")));
app.use("/Breeding", express.static(path.join(process.cwd(), "..", "Breeding")));
app.use("/css", express.static(path.join(process.cwd(), "..", "css")));
app.use("/fonts", express.static(path.join(process.cwd(), "..", "fonts")));
app.use("/Message", express.static(path.join(process.cwd(), "..", "Message")));
app.use("/Profile", express.static(path.join(process.cwd(), "..", "Profile")));
app.use("/uploads", express.static(path.join(process.cwd(), "..", "uploads")));



// Routes
app.use("/api/users", userRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/messages", messageRoutes); // Add this line


// Serve HTML files
app.get("/Adoption", (req, res) => {
  res.sendFile(path.join(process.cwd(), "..", "Adoption", "AdoptionIndex.html"));
});

app.get("/Breeding", (req, res) => {
  res.sendFile(path.join(process.cwd(), "..", "Breeding", "BreedingIndex.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "..", "homepage", "index.html"));
});

// New route for profile
app.get("/Profile", (req, res) => {
  res.sendFile(path.join(process.cwd(), "..", "Profile", "ProfileIndex.html"));
});

// Database connection and server start
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

connectDb().then(() => {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});

/////For the video
