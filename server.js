import express from 'express';
import mysql from 'mysql2/promise';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Database configuration
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // replace with your MySQL username
  password: 'Harsh123@sql', // replace with your MySQL password
  database: 'product_management', // replace with your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test database connection
pool.getConnection()
  .then((connection) => {
    console.log('Database connected successfully');
    connection.release();
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });

// Routes

// Home page to display products
app.get('/', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [products] = await connection.execute(
      'SELECT id, name, description, price, imagePath IS NOT NULL AS hasImage FROM products'
    );
    res.render('index', { products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).render('error', { error: 'Error fetching products. Please try again later.' });
  } finally {
    if (connection) connection.release();
  }
});

// Fetch image for a product by ID
app.get('/image/:id', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT imagePath FROM products WHERE id = ?', [
      req.params.id,
    ]);
    if (rows.length > 0 && rows[0].imagePath) {
      res.contentType('image/jpeg');
      res.send(rows[0].imagePath);
    } else {
      res.status(404).send('Image not found');
    }
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).send('Error fetching image');
  } finally {
    if (connection) connection.release();
  }
});

// Admin page to manage products
app.get('/admin', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [products] = await connection.execute(
      'SELECT id, name, description, price, imagePath IS NOT NULL AS hasImage FROM products'
    );
    res.render('admin', { products });
  } catch (error) {
    console.error('Error fetching products for admin page:', error);
    res.status(500).render('error', { error: 'Error loading admin page. Please try again later.' });
  } finally {
    if (connection) connection.release();
  }
});

// Add a new product
app.post('/upload', upload.single('image'), async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { name, description, price } = req.body;

    if (!req.file) {
      throw new Error('No image uploaded');
    }

    const imageBuffer = req.file.buffer;

    await connection.execute(
      'INSERT INTO products (name, description, imagePath, price) VALUES (?, ?, ?, ?)',
      [name, description, imageBuffer, price]
    );

    res.redirect('/admin');
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).render('error', { error: 'Error uploading product: ' + error.message });
  } finally {
    if (connection) connection.release();
  }
});

// Delete a product by ID
app.post('/delete/:id', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.redirect('/admin');
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).render('error', { error: 'Error deleting product. Please try again later.' });
  } finally {
    if (connection) connection.release();
  }
});

// About page
app.get('/about', (req, res) => {
  res.render('about');
});

// Contact page
app.get('/contact', (req, res) => {
  res.render('contact');
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
