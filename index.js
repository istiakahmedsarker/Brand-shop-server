const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express')
const cors = require('cors')
const app = express()
const port = 5000

// middleware
app.use(cors())
app.use(express.json())

// difnCf1ek8OgugV4
// gestiak08

const uri = "mongodb+srv://gestiak08:difnCf1ek8OgugV4@cluster0.7ke8psn.mongodb.net/?retryWrites=true&w=majority";

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
        const productCollection = client.db("productsDB").collection("products");

        // add products for productCollection
        app.post('/addProduct', async (req, res) => {
            const product = await req.body
            const result = await productCollection.insertOne(product)
            res.send(result)
        })
        // get all datas
        app.get("/allProducts", async (req, res) => {
            const result = await productCollection.find().toArray();
            res.send(result);
        });
        //  update data
        app.put("/updateProduct/:id", async (req, res) => {
            const id = req.params.id;
            const service = req.body;
            const result = await productCollection.updateOne(
                { _id: new ObjectId(id) }, // Find Data by query many time query type is "_id: id" Cheack on database
                {
                    $set: service, // Set updated Data
                },
                { upsert: true } // define work
            );
            res.send({ result });
        });





        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})