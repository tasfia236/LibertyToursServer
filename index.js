const express = require('express')
const cors = require('cors')
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 8000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wxwisw2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
        await client.connect();

        const tourspotCollection = client.db('tourspotsDB').collection('tourspots');

        app.get('/tourspots', async (req, res) => {
            const cursor = tourspotCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/tourspots', async (req, res) => {
            const newSpot = req.body;
            console.log('new spot', newSpot);
            const result = await tourspotCollection.insertOne(newSpot);
            res.send(result);
        })

        app.delete('/tourspots/:id', async (req, res) => {
            const id = req.params.id;
            const quary = {_id: new ObjectId(id)}
            const result = await tourspotCollection.deleteOne(quary);
            res.send(result);
        })

        app.update('/tourspots/:id', async (req, res) => {
            
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged... You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //  await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Travelling Spots!!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})