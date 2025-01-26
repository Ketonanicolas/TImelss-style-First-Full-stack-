const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('uploads'));  // Serve images from the 'uploads' folder
app.set('view engine', 'ejs');

// Set up multer storage for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Save files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname); // Rename file to avoid conflicts
  }
});
const upload = multer({ storage: storage });

// Connect to MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Harsh123@sql',
  database: 'product_management'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to database');
});

// Routes
app.get('/', (req, res) => {
  const query = 'SELECT * FROM products';
  db.query(query, (err, results) => {
    if (err) throw err;
    res.render('index', { products: results });
  });
});

app.get('/admin', (req, res) => {
  const query = 'SELECT * FROM products';
  db.query(query, (err, results) => {
    if (err) throw err;
    res.render('admin', { products: results });
  });
});

// Add a product (with image)
app.post('/add', upload.single('image'), (req, res) => {
  const { name, price, description } = req.body;
  const imagePath = '/uploads/' + req.file.filename; // Fixed path

  const query = 'INSERT INTO products (name, description, price, imagePath) VALUES (?, ?, ?, ?)';
  db.query(query, [name, description, price, imagePath], (err) => {
    if (err) throw err;
    res.redirect('/admin');
  });
});

// Delete a product
app.post('/delete/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM products WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) throw err;
    res.redirect('/admin');  // Redirect to homepage after deleting a product
  });
});

// About page route
app.get('/about', (req, res) => {
  res.render('about');
});

// Contact page route
app.get('/contact', (req, res) => {
  res.render('contact');
});

app.use('/Public', express.static(path.join(__dirname, 'Public')));


app.listen(3000, () => console.log('Server running on http://localhost:3000')); 