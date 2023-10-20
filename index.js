const { MongoClient, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://gestiak08:difnCf1ek8OgugV4@cluster0.7ke8psn.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        const productCollection = client.db("productsDB").collection("products");

        app.post('/addProduct', async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.send(result);
        });

        app.get("/allProducts", async (req, res) => {
            const result = await productCollection.find().toArray();
            res.send(result);
        });

        app.put("/updateProduct/:id", async (req, res) => {
            const id = req.params.id;
            const product = req.body;

            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    name: product.name,
                    brandName: product.brandName,
                    type: product.type,
                    img: product.img,
                    price: product.price,
                    shortDescription: product.shortDescription,
                    rating: product.rating,
                }
            };
            const result = await productCollection.findOneAndUpdate(filter, updateDoc, { upsert: true, returnDocument: 'after' });
            res.send(result);
        });

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensure that the client will close when you finish/error
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
