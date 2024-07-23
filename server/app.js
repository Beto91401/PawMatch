const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;

// Replace with your actual MongoDB Atlas connection string
const uri = 'mongodb+srv://lopezbeto305:Ag3ReYJzeNGL6Lr1@pawmatch.xmmc2zi.mongodb.net/?retryWrites=true&w=majority&appName=PawMatch';

// Connect to MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB Atlas');
});

// Define a schema
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
  dogPicture: String
});
require("./imageDetails");
const Images = mongoose.model("ImageDetails");

const User = mongoose.model('User', userSchema);

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'homepage' and 'images' directories
app.use('/homepage', express.static(path.join(__dirname, '../homepage')));
app.use('/images', express.static(path.join(__dirname, '../images')));
app.use('/Adoption', express.static(path.join(__dirname, '../Adoption')));
app.use('/Breeding', express.static(path.join(__dirname, '../Breeding')));
app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/fonts', express.static(path.join(__dirname, '../fonts')));
app.use('/Message', express.static(path.join(__dirname, '../Message')));
app.use('/Profile', express.static(path.join(__dirname, '../Profile')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(express.static(path.join(__dirname, '../')))



const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../uploads')); // Correct path to uploads directory
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });


// Route to handle user signup
app.post('/signup', upload.single('dogPicture'), async (req, res) => {
  const {
    username, email, password, dogType, dogAge, dogGender, dogName,
    coatLength, petFriendly, dogPersonality, websiteChoice
  } = req.body;

  const dogPictureFilename = req.file ? req.file.filename : null;

  const user = new User({
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
    dogPicture: dogPictureFilename // Assign the filename from the uploaded file
  });

  try {
    await user.save();
    console.log('User created:', user); // Log the saved user
    if (websiteChoice === 'adoption') {
      res.redirect('/Adoption');
    } else {
      res.redirect('/Breeding');
    }
  } catch (error) {
    console.error('Error creating user:', error); // Log errors
    res.status(500).send('Error creating user');
  }
});


// Route to serve AdoptionIndex.html at /adoption
app.get('/Adoption', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Adoption', 'AdoptionIndex.html'));
});

// Route to serve AdoptionIndex.html at /adoption
app.get('/Breeding', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Breeding', 'BreedingIndex.html'));
});

// Route to get all users (for verification purposes)
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).send('Error fetching users');
  }
});

// Route to handle GET requests to the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../homepage/index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

///////////////////////////////////////////



app.post("/upload-image", upload.single("image"), async (req, res) => {
  console.log(req.body);
  const iamgeName = req.file.filename;
  
  try {
    await Images.create({image: imageName });
    res.json({status:"ok"});
  } catch (error) {
    res.json({status:error});
  }

});


app.get("/get-image", async (req, res) => {
  try {
    Images.find({}).then(data=>{
      res.send({ status: "ok", data: data });
    });
  } catch (error) {
    res.json({ status: error });
  }
});


////// Getting data to appear on adoption cards.

app.get('/adoption-users', async (req, res) => {
  try {
    const users = await User.find({ websiteChoice: 'adoption' });
    res.json(users);
  } catch (error) {
    res.status(500).send('Error fetching adoption users');
  }
});
