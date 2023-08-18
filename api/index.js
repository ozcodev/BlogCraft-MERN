const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const app = express();
//mongoose
const User = require('./models/user');
const Post = require('./models/post');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');

const cookieParser = require('cookie-parser');

const salt = bcrypt.genSaltSync(10);
const secret = 'R#3q2pV9bF5dL7hG1sY6jK4wD8nM0tZxXcCvB2mN3lK8jH4gT5fR7';

//upload image to main Page
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(cookieParser());
/* because we are using credentials
 we need to specified more info to 
 avoid errors of Cors */
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());

//connect to mOngoDb
mongoose.connect(
  'mongodb+srv://blog:mrjSg8jmadOtPnzK@cluster0.vdcdmwd.mongodb.net/?retryWrites=true&w=majority'
);

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  //Create User
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (error) {
    res.status(400).json(error);
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  //looking for the info in db
  const userDoc = await User.findOne({ username });
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    //log in JWT
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;

      //sending token as a cookie
      res.cookie('token', token).json({
        id: userDoc._id,
        username,
      });
      res.json(token);
    });

    //res.json()
  } else {
    res.status(400).json('wrong credentials ');
  }
});

//checking if user logged in
app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

//logout user
app.post('/logout', (req, res) => {
  res.cookie('token', '').json('ok');
});

//create post
app.post('/post', upload.single('file'), async (req, res) => {
  //uploading file and rename it + extension
  const { originalname, path } = req.file;
  const parts = originalname.split('.');
  const ext = parts[parts.length - 1];
  var newPath = path + '.' + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    //create post
    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });
    res.json(postDoc);
  });
});

app.get('/post', async (req, res) => {
  res.json(
    await Post.find()
      .populate('author', ['username'])
      .sort({
        createdAt: -1,
      })
      .limit(15)
  );
});

//Putting the updates of the the article
app.put('/post', upload.single('file'), async (req, res) => {
  let newPath = null;
  if (req.file) {
    //uploading file and rename it + extension
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    //update post
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json('you are not the author');
    }
    await postDoc.updateOne({
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover,
    });

    res.json(postDoc);
  });
});

//getting post from db to display it into postPage.
app.get('/post/:id', async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
});

app.listen(4040);

//monogo pass :mrjSg8jmadOtPnzK
//
