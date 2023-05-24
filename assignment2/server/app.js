const express = require('express');
const mongoose = require('mongoose');
// const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./authMiddleware');

require("dotenv").config();
const path = require('path');

const cors = require("cors");
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cors());

// const authMiddleware = require('./authMiddleware');

// Set up Multer for file uploads
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uniqueSuffix}${fileExtension}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);
  res.sendFile(filePath);
});
// Connect to MongoDB
mongoose.connect(process.env.MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Create Post schema and model
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  picture: String,
  likes: { type: Number, default: 0 },
  comments: [{ body: String, user: String }],
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String
});

const User = mongoose.model('User', userSchema);


const Post = mongoose.model('Post', postSchema);

// Create routes
app.use(express.json());

app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

app.post('/posts', upload.single('picture'), async (req, res) => {
  try {
    const { title, content } = req.body;
    const picture = req.file.filename;

    const post = new Post({ title, content, picture });
    await post.save();

    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

app.put('/posts/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { content },
      { new: true }
    );

    if (!updatedPost) {
      return res.sendStatus(404);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Error updating post content:', error);
    res.sendStatus(500);
  }
});

app.post('/posts/:postId/comments', async (req, res) => {
  try {
    const { body, user } = req.body;
    const postId = req.params.postId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.comments.push({ body, user });
    await post.save();

    res.status(201).json({ message: 'Comment added successfully' });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

app.post('/posts/:postId/like', async (req, res) => {
  try {
    const postId = req.params.postId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.likes += 1;
    await post.save();

    res.json({ message: 'Post liked successfully' });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ error: 'Failed to like post' });
  }
});

app.delete('/posts/:postId/comments/:commentId', async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.comments = post.comments.filter((comment) => comment._id.toString() !== commentId);
    await post.save();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

app.delete('/posts/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;

    await Post.findByIdAndDelete(postId);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});




const generateToken = (userId) => {
  const payload = {
    sub: userId
  };
  const secretKey = '123456789'; // Replace with your own secret key
  const options = {
    expiresIn: '1h'
  };
  return jwt.sign(payload, secretKey, options);
};

// Signup endpoint
app.post('/signup', async (req, res) => {
  const { username, email,password } = req.body;

  try {
    // Check if the username is already taken
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).json({ message: 'Username already taken' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
      email
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Generate and return JWT token
    const token = generateToken(savedUser._id);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (user) {
      // Compare hashed password
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (isPasswordMatch) {
        // Generate and return JWT token
        const token = generateToken(user._id);
        res.json({ token });
      } else {
        // Invalid password
        res.status(401).json({ message: 'Invalid username or password' });
      }
    } else {
      // Invalid username
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Protected Home endpoint
app.get('/home', authMiddleware, (req, res) => {
  const userId = req.user.sub;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const { username } = user;

      res.json({ username });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});