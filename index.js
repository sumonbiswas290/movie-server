const express = require('express')
const dotenv = require('dotenv');
dotenv.config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')

const port = process.env.PORT || 5000;
const app = express()

// middlewere
app.use(cors()) 
app.use(express.json())

const uri = `mongodb+srv://${process.env.User_name}:${process.env.User_pass}@cluster0.scszv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const movieCollection = client.db('movieBd').collection('movie');

    // post
    app.post('/movie', async(req, res) => {
        const movie = req.body;
        console.log("new movie", movie);
        const result = await movieCollection.insertOne(movie);
        res.send(result);
    })
    // get
    app.get('/movie', async(req, res) => {
        const cursor = movieCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    // get id 
    app.get('/movie/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await movieCollection.findOne(query)
        res.send(result);
    })

    // put
    app.put('/movie/:id', async(req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id)}
      const options = {upsert: true};
      const updateMovies = req.body;
      const movie = {
        $set: {
          photo: updateMovies.photo,
          genre: updateMovies.genre,
          title: updateMovies.title,
          time: updateMovies.time,
          date: updateMovies.date,
          rating: updateMovies.rating,
          summary: updateMovies.summary,
        }
      }
      const result = await movieCollection.updateOne(filter, movie , options);
      res.send(result);
    })

    // Delete 
    app.delete('/movie/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await movieCollection.deleteOne(query);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Simple movie server is running")
})

app.listen(port, () => {
    console.log(`simple movie server on port: ${port}`)
})