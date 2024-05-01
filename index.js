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
        const countryCollection = client.db('tourspotsDB').collection('countries');

        app.get('/tourspots', async (req, res) => {
            const cursor = tourspotCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/tourspots/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: new ObjectId(id) }
            const result = await tourspotCollection.findOne(quary);
            res.send(result);
        })


        app.post('/tourspots', async (req, res) => {
            const newSpot = req.body;
            console.log('new spot', newSpot);
            const result = await tourspotCollection.insertOne(newSpot);
            res.send(result);
        })

        app.get('/mylist/:email', async (req, res) => {
            console.log(req.params.email);
            const result = await tourspotCollection.find({ user_email: req.params.email }).toArray();
            res.send(result);
        })

            app.get('/singlecountyspots/:country', async (req, res) => {
                console.log(req.params.country);
                const result = await tourspotCollection.find({country_Name : req.params.country }).toArray();
                res.send(result);
                console.log(result);
            })

            app.get('/country', async (req, res) => {
                const cursor = countryCollection.find();
                const result = await cursor.toArray();
                res.send(result);
            })

            app.get('/country/:id', async (req, res) => {
                const id = req.params.id;
                console.log(id);
                const quary = { _id: new ObjectId(id) }
                const result = await countryCollection.findOne(quary);
                res.send(result);
            })
        

        app.put('/tourspots/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updateSpots = req.body
            const spots = {
                $set: {
                    image: updateSpots.image,
                    tourists_spot_name: updateSpots.tourists_spot_name,
                    country_Name: updateSpots.country_Name,
                    average_cost: updateSpots.average_cost,
                    location: updateSpots.location,
                    description: updateSpots.description,
                    travel_time: updateSpots.travel_time,
                    seasonality: updateSpots.seasonality,
                    totaVisitorsPerYear: updateSpots.totaVisitorsPerYear
                }
            }
            const result = await tourspotCollection.updateOne(filter, spots, options);
            res.send(result);
        });

        app.delete('/tourspots/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: new ObjectId(id) }
            const result = await tourspotCollection.deleteOne(quary);
            res.send(result);
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