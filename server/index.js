import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

/* =======================
   MIDDLEWARE
======================= */
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      process.env.DOMAIN_URL, // Firebase URL
    ],
    credentials: true,
  })
);

/* =======================
   MONGODB (CACHED)
======================= */
const uri = process.env.MONGODB_URL;

let cachedClient = null;
let cachedDb = null;

async function getDB() {
  if (cachedDb) return cachedDb;

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  await client.connect();
  console.log('✅ MongoDB Atlas connected');

  cachedClient = client;
  cachedDb = client.db('scholarly');

  return cachedDb;
}

/* =======================
   AUTH MIDDLEWARE
======================= */
const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' });
    req.user = decoded;
    next();
  });
};

/* =======================
   ROUTES
======================= */

// Root test
app.get('/', (req, res) => {
  res.send('Scholarly server is running!');
});

/* -------- AUTH -------- */
app.post('/jwt', async (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' });

  res
    .cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    })
    .send({ success: true });
});

app.post('/logout', (req, res) => {
  res
    .clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    })
    .send({ success: true });
});

/* -------- USERS -------- */
app.post('/users', async (req, res) => {
  const db = await getDB();
  const usersCollection = db.collection('users');

  const user = req.body;
  const existing = await usersCollection.findOne({ email: user.email });
  if (existing) return res.send({ message: 'User already exists' });

  const result = await usersCollection.insertOne(user);
  res.send(result);
});

/* -------- SCHOLARSHIPS -------- */
app.get('/scholarships', async (req, res) => {
  try {
    const db = await getDB();
    const scholarshipsCollection = db.collection('scholarships');

    const { state = '', page = 1, limit = 6 } = req.query;

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 6;
    const skip = (pageNum - 1) * limitNum;

    const query = {};

    if (state.trim()) {
      query.state = { $regex: state, $options: 'i' };
    }

    const total = await scholarshipsCollection.countDocuments(query);

    const scholarships = await scholarshipsCollection
      .find(query)
      .skip(skip)
      .limit(limitNum)
      .toArray();

    res.status(200).json({
      success: true,
      data: scholarships,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
      },
    });
  } catch (error) {
    console.error('❌ Scholarships API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch scholarships',
    });
  }
});


app.get('/scholarships/:id', async (req, res) => {
  const db = await getDB();
  const scholarshipsCollection = db.collection('scholarships');

  const id = req.params.id;
  const result = await scholarshipsCollection.findOne({
    _id: new ObjectId(id),
  });
  res.send(result);
});

/* -------- APPLICATIONS -------- */
app.post('/applications', verifyToken, async (req, res) => {
  const db = await getDB();
  const applicationsCollection = db.collection('applications');

  const application = req.body;
  const result = await applicationsCollection.insertOne(application);
  res.send(result);
});

app.get('/applications', verifyToken, async (req, res) => {
  const db = await getDB();
  const applicationsCollection = db.collection('applications');

  const email = req.query.email;
  const result = await applicationsCollection.find({ email }).toArray();
  res.send(result);
});

/* -------- REVIEWS -------- */
app.post('/reviews', verifyToken, async (req, res) => {
  const db = await getDB();
  const reviewsCollection = db.collection('reviews');

  const review = req.body;
  const result = await reviewsCollection.insertOne(review);
  res.send(result);
});

app.get('/reviews/:id', async (req, res) => {
  const db = await getDB();
  const reviewsCollection = db.collection('reviews');

  const id = req.params.id;
  const result = await reviewsCollection.find({ scholarshipId: id }).toArray();
  res.send(result);
});

/* -------- WISHLIST -------- */
app.post('/wishlist', verifyToken, async (req, res) => {
  const db = await getDB();
  const wishlistCollection = db.collection('wishlists');

  const item = req.body;
  const result = await wishlistCollection.insertOne(item);
  res.send(result);
});

app.get('/wishlist', verifyToken, async (req, res) => {
  const db = await getDB();
  const wishlistCollection = db.collection('wishlists');

  const email = req.query.email;
  const result = await wishlistCollection.find({ email }).toArray();
  res.send(result);
});

/* =======================
   SERVER
======================= */
app.listen(port, () => {
  console.log(`🚀 Scholarly server running on port ${port}`);
});
