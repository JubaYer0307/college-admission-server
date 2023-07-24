const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Password}@cluster0.ec8hxwt.mongodb.net/?retryWrites=true&w=majority`;

async function run() {
  try {
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    client.connect();
    const collegesCollection = client.db('collegeDB').collection('college');
    const admissionCollection = client.db('collegeDB').collection('admissionCollege');

    app.get('/collegegallery', (req, res) => {
      res.send(require('./data/collegegallery.json'));
    });

    app.get('/college', (req, res) => {
      res.send(require('./data/college.json'));
    });
    app.get('/collegeDetails', (req, res) => {
      res.send(require('./data/collegeDetails.json'));
    });
    app.get('/admission', (req, res) => {
      res.send(require('./data/admission.json'));
    });

  
    app.get('/admissionCollege', async (req, res) => {
      const result = await admissionCollection.find().toArray();
      res.send(result);
    });

    

    

    app.get('/addacollege', async (req, res) => {
      const result = await collegesCollection.find().toArray();
      res.send(result);
    });

    app.get('/addacollege/:id', async (req, res) => {
      const { id } = req.params;
      const college = await collegesCollection.findOne({ _id: new ObjectId(id) });
      res.json(college);
    });

    app.get('/mycolleges', async (req, res) => {
      const { email } = req.query;
      let query = {};
      if (email) {
        query = { sellerEmail: email };
      }
      const result = await collegesCollection.find(query).toArray();
      res.send(result);
    });


    app.post('/admissionCollege', async (req, res) => {
      const newAdmission = req.body;
      console.log('Received new admission:', newAdmission);
      const result = await admissionCollection.insertOne(newAdmission);
      res.json({ insertedId: result.insertedId });
    });


   

   

    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  } finally {
    // Uncomment this line if you decide to close the connection when the server stops
    // await client.close();
  }
}

run().catch(console.error);

app.get('/', (req, res) => {
  res.send('SIMPLE CRUD IS RUNNING');
});

app.listen(port, () => {
  console.log(`SIMPLE CRUD is running on port ${port}`);
});
