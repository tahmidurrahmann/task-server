const express = require('express');
const app = express();
const port = process.env.PORT | 5000;
require('dotenv').config()
const cors = require('cors');

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://task:JxjMugs2cfCtl2qT@cluster0.glcj3l3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
        const taskCollection = client.db("task").collection("tasks");

        app.post("/task", async (req, res) => {
            const taskInfo = req.body;
            const result = await taskCollection.insertOne(taskInfo);
            res.send(result);
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Task management is running on port");
});

app.listen(port, () => {
    console.log(`Task management is running on port ${port}`);
});