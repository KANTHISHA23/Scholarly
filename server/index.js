const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      process.env.DOMAIN_URL,
    ],
    credentials: true,
  })
);
const uri = process.env.MONGODB_URL;

const verifyJWTToken = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).send({ message: 'unauthorized access' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'unauthorized access' });
    }
    req.user = decoded;
    next();
  });
};

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    console.log('MongoDB connected successfully');

    const db = client.db('scholarly');
    const usersCollection = db.collection('users');
    const scholarshipsCollection = db.collection('scholarships');
    const applicationsCollection = db.collection('applications');
    const reviewsCollection = db.collection('reviews');
    const wishlistsCollection = db.collection('wishlists');

    // middle for admin
    const verifyAdmin = async (req, res, next) => {
      const tokenEmail = req.user?.email;
      const query = { email: tokenEmail };
      const result = await usersCollection.findOne(query);
      if (!result) {
        return res.status(403).json({ message: 'Forbidden access denied' });
      }
      if (result.role === 'admin') {
        next();
      }
    };

    //? users api
    app.get('/users', verifyJWTToken, verifyAdmin, async (req, res) => {
      const { search = '', filter = '', limit = 0, page = 1 } = req.query;
      const skip = (page - 1) * limit;
      const query = {};
      if (search) {
        query.$or = [
          { displayName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }

      if (filter) {
        query.role = filter;
      }
      const totalUsers = await usersCollection.countDocuments();
      const result = await usersCollection
        .find(query)
        .limit(Number(limit))
        .skip(Number(skip))
        .toArray();
      res.status(200).json({ users: result, totalUsers });
    });

    app.get('/users/:email/role', verifyJWTToken, async (req, res) => {
      const email = req.params.email;

      try {
        const result = await usersCollection.findOne(
          { email: email },
          { projection: { role: 1 } }
        );

        // Always return an object with a default role if user is missing
        if (!result) {
          return res.status(200).send({ role: 'student' });
        }

        res.status(200).send({ role: result.role });
      } catch (error) {
        res.status(500).send({ message: 'Server error', role: 'student' });
      }
    });

    app.post('/users', async (req, res) => {
      const userInfo = req.body;
      userInfo.role = 'student';
      userInfo.createdAt = new Date().toISOString();
      const isExits = await usersCollection.findOne({ email: userInfo.email });
      if (isExits) {
        return res.json({ message: 'user already exits' });
      }
      const result = await usersCollection.insertOne(userInfo);
      res.status(201).json(result);
    });

    app.patch('/users/:id', verifyJWTToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updatedDoc = { $set: req.body };
      const result = await usersCollection.updateOne(query, updatedDoc);
      res.status(200).json(result);
    });

    // api for delete user
    app.delete('/users/:id', verifyJWTToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.status(200).json(result);
    });

    //? get JWT Token
    app.post('/getToken', async (req, res) => {
      const userInfo = req.body;
      const token = jwt.sign(userInfo, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      res
        .cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        .send({ success: true });
    });

    app.post('/logout', async (req, res) => {
      res
        .clearCookie('token', {
          maxAge: 0,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        .send({ success: true });
    });

    //? scholarships api
    app.get('/scholarships', async (req, res) => {
      const {
        limit = 6, // FIX 1: Change default from 0 to 6
        page = 1,
        schCat = '',
        subCat = '',
        state = '', // Change 'loc' to 'state' to match your frontend URL
        search = '',
        sort = '',
      } = req.query;

      // Ensure these are numbers for MongoDB math
      const limitNum = Number(limit);
      const pageNum = Number(page);
      const skip = (pageNum - 1) * limitNum;

      const query = {};

      // ... (Keep your existing regex filter logic here) ...
      // Ensure you use 'state' in your query logic if that's what's in the DB
      if (state) {
        query.state = { $regex: state, $options: 'i' };
      }

      // Backend: AllScholarships route
      const totalCount = await scholarshipsCollection.countDocuments(query);
      const result = await scholarshipsCollection
        .find(query)
        .sort(sortFilter)
        .skip(Number(skip))
        .limit(Number(limit))
        .toArray();

      // CHANGE THIS LINE
      res.status(200).json({ result, totalCount });
    });
    // api for scholarship details
    app.get('/scholarships/:id', verifyJWTToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      // Just find the single scholarship and send it directly
      const result = await scholarshipsCollection.findOne(query);

      if (!result) {
        return res.status(404).json({ message: 'Scholarship not found' });
      }

      res.status(200).json(result);
    });

    // api for scholarship add
    app.post(
      '/add-scholarships',
      verifyJWTToken,
      verifyAdmin,
      async (req, res) => {
        const scholarshipInfo = req.body;
        const result = await scholarshipsCollection.insertOne(scholarshipInfo);
        res.status(201).json(result);
      }
    );

    // api for scholarship edit
    app.patch(
      '/scholarships/:id',
      verifyJWTToken,
      verifyAdmin,
      async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const updatedDoc = { $set: req.body };
        const result = await scholarshipsCollection.updateOne(
          query,
          updatedDoc
        );
        res.status(200).json(result);
      }
    );

    // api for scholarship delete
    app.delete('/scholarships/:id', verifyJWTToken, async (req, res) => {
      const id = req.params.id;
      const { adminEmail } = req.query;
      const tokenEmail = req.user.email;
      const query = { _id: new ObjectId(id) };
      if (adminEmail !== tokenEmail) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Access denied. Email mismatch.',
        });
      }
      const result = await scholarshipsCollection.deleteOne(query);
      res.status(200).json(result);
    });

    //? Application api
    // api for get applications for admin
    app.get('/applications', verifyJWTToken, verifyAdmin, async (req, res) => {
      const { email } = req.query;
      const tokenEmail = req?.user?.email;
      if (email !== tokenEmail) {
        return res.status(403).json({ message: 'access forbidden' });
      }
      const result = await applicationsCollection
        .aggregate([
          {
            $addFields: {
              statusPriority: {
                $switch: {
                  branches: [
                    {
                      case: { $eq: ['$applicationStatus', 'pending'] },
                      then: 0,
                    },
                    {
                      case: { $eq: ['$applicationStatus', 'processing'] },
                      then: 1,
                    },
                    {
                      case: { $eq: ['$applicationStatus', 'completed'] },
                      then: 2,
                    },
                    {
                      case: { $eq: ['$applicationStatus', 'rejected'] },
                      then: 3,
                    },
                  ],
                  default: 99,
                },
              },
            },
          },
          { $sort: { statusPriority: 1 } },
        ])
        .toArray();

      res.status(200).json(result);
    });

    // api for get applications details
    app.get('/applications/:id', verifyJWTToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await applicationsCollection.findOne(query);
      res.status(200).json(result);
    });

    // api for update application details
    app.patch('/applications/:id', verifyJWTToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updatedDate = req.body;
      const updatedDoc = { $set: updatedDate };
      const result = await applicationsCollection.updateOne(query, updatedDoc);
      res.status(200).json(result);
    });

    // api for get applications by specific user
    app.get('/applications/:email/byUser', verifyJWTToken, async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };
      const result = await applicationsCollection.find(query).toArray();
      res.status(200).json(result);
    });

    // api for update application status
    app.patch(
      '/applications/:id',
      verifyJWTToken,
      verifyAdmin,
      async (req, res) => {
        const applicationStatus = req.body;
        const id = req.params.id;

        const query = { _id: new ObjectId(id) };
        const updatedDoc = { $set: applicationStatus };
        const result = await applicationsCollection.updateOne(
          query,
          updatedDoc
        );
        res.status(200).json(result);
      }
    );

    // api for application feedback
    app.patch(
      '/applications/feedback/:id',
      verifyJWTToken,
      verifyAdmin,
      async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const updatedDoc = { $set: req.body };
        const options = { upsert: true };
        const result = await applicationsCollection.updateOne(
          query,
          updatedDoc,
          options
        );
        res.status(200).json(result);
      }
    );

    // api for delete applicatoin
    app.delete('/applications/:id', verifyJWTToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id), applicationStatus: 'pending' };
      const result = await applicationsCollection.deleteOne(query);
      res.status(200).json(result);
    });

    //? Reviews api
    // api for get reviews
    app.get('/reviews', verifyJWTToken, verifyAdmin, async (req, res) => {
      const result = await reviewsCollection.find().toArray();
      res.status(200).json(result);
    });

    // api for get reviews by user
    app.get('/reviews/user/:email', verifyJWTToken, async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await reviewsCollection.find(query).toArray();
      res.status(200).json(result);
    });

    // api for review details
    app.get('/reviews/:id', verifyJWTToken, async (req, res) => {
      const id = req.params.id;
      const query = { scholarshipId: id };
      const result = await reviewsCollection.find(query).toArray();
      res.status(200).json(result);
    });

    // api for post reviews
    app.post('/reviews', verifyJWTToken, async (req, res) => {
      const reviewsInfo = req.body;
      const query = {
        email: reviewsInfo.email,
        scholarshipId: reviewsInfo.scholarshipId,
      };
      const updatedDoc = {
        $set: {
          ...reviewsInfo,
          updatedDate: new Date().toISOString(),
        },
        $setOnInsert: {
          createdAt: new Date().toISOString(),
        },
      };
      const options = { upsert: true };
      const result = await reviewsCollection.updateOne(
        query,
        updatedDoc,
        options
      );

      const ratingResult = await reviewsCollection
        .aggregate([
          {
            $match: { scholarshipId: reviewsInfo.scholarshipId },
          },
          {
            $group: {
              _id: '$scholarshipId',
              averageRating: { $avg: '$rating' },
              totalReview: { $sum: 1 },
            },
          },
        ])
        .toArray();

      if (ratingResult.length > 0) {
        const { averageRating, totalReview } = ratingResult[0];
        const roundedRating = Math.round(averageRating / 5) * 5;
        await scholarshipsCollection.updateOne(
          {
            _id: new ObjectId(reviewsInfo.scholarshipId),
          },
          {
            $set: {
              ratings: roundedRating,
              totalReview: totalReview,
            },
          }
        );
      }

      res.status(200).json(result);
    });

    // api for delete reviews
    app.delete('/reviews/:id', verifyJWTToken, async (req, res) => {
      const id = req.params.id;
      const result = await reviewsCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.status(200).json(result);
    });

    // wishlist api
    // api for get wishlists
    app.get('/wishlists', verifyJWTToken, async (req, res) => {
      try {
        const email = req.query.email;

        if (req.user.email !== email) {
          return res.status(403).send({ message: 'Forbidden access' });
        }

        const result = await wishlistsCollection
          .aggregate([
            { $match: { userEmail: email } },
            // Backend: app.get('/wishlists')
            {
              $addFields: {
                scholarshipObjectId: {
                  $cond: {
                    // Only convert if it is a valid 24-character hex string
                    if: {
                      $regexMatch: {
                        input: { $ifNull: ['$scholarshipId', ''] },
                        regex: /^[0-9a-fA-F]{24}$/,
                      },
                    },
                    then: { $toObjectId: '$scholarshipId' },
                    else: null,
                  },
                },
              },
            },
            // Filter out entries where the scholarship was not found or ID was invalid
            { $match: { scholarshipObjectId: { $ne: null } } },
            {
              $lookup: {
                from: 'scholarships',
                localField: 'scholarshipObjectId',
                foreignField: '_id',
                as: 'scholarshipDetails',
              },
            },
            { $unwind: '$scholarshipDetails' },
            {
              $project: {
                _id: 1,
                scholarshipId: 1,
                userEmail: 1,
                universityName: '$scholarshipDetails.universityName',
                scholarshipName: '$scholarshipDetails.scholarshipName',
                universityImage: '$scholarshipDetails.universityImage',
                scholarshipCategory: '$scholarshipDetails.scholarshipCategory',
                subjectCategory: '$scholarshipDetails.subjectCategory',
                // Updated to match your new fields
                state: '$scholarshipDetails.state',
                scholarshipAmount: '$scholarshipDetails.scholarshipAmount',
              },
            },
          ])
          .toArray();

        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error' });
      }
    });

    // api for get wishlist status
    app.get(
      '/wishlists/check/:scholarshipId',
      verifyJWTToken,
      async (req, res) => {
        const { scholarshipId } = req.params;
        const { email } = req.query;
        const result = await wishlistsCollection.findOne({
          scholarshipId,
          userEmail: email,
        });

        if (result) {
          // Document found
          res.send({ isSaved: true, id: result._id });
        } else {
          // Document NOT found - Return null ID
          res.send({ isSaved: false, id: null });
        }
      }
    );

    // api for delete wishlist
    app.delete('/wishlists/:id', verifyJWTToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await wishlistsCollection.deleteOne(query);
      res.status(200).json(result);
    });

    // api for add wishlist
    app.post('/wishlists', verifyJWTToken, async (req, res) => {
      const wishlistInfo = req.body;
      wishlistInfo.createdAt = new Date().toISOString();
      const query = {
        scholarshipId: wishlistInfo?.scholarshipId,
        userEmail: wishlistInfo?.userEmail,
      };
      const isExits = await wishlistsCollection.findOne(query);
      if (isExits) {
        return res
          .status(200)
          .json({ success: false, message: 'already in wishlist' });
      }
      const result = await wishlistsCollection.insertOne(wishlistInfo);
      res.status(201).json(result);
    });

    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Scholarly server is running!');
});

app.listen(port, () => {
  console.log(`Scholarly app listening on port ${port}`);
});
