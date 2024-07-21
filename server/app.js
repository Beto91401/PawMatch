const express = require('express');
const mongoose = require('mongoose');
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
  password: String
});

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

// Route to handle user signup
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  console.log('Received data:', req.body); // Log received data
  const user = new User({ username, email, password });
  try {
    await user.save();
    console.log('User created:', user); // Log the saved user
    res.status(201).send('User created');
  } catch (error) {
    console.error('Error creating user:', error); // Log errors
    res.status(500).send('Error creating user');
  }
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
