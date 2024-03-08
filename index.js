const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT | 5000;
require('dotenv').config()
const cors = require('cors');

app.use(cors());
app.use(express.json());


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

        app.get("/task", async (req, res) => {
            const result = await taskCollection.find().toArray();
            res.send(result);
        })

        app.delete("/task/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await taskCollection.deleteOne(query);
            res.send(result);
        })

        app.get("task/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await taskCollection.findOne(query);
            res.send(result);
        })

        app.put("/tasks/:id", async (req, res) => {
            const status = "completed";
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: status,
                },
            };
            const result = await taskCollection.updateOne(filter, updateDoc, options);
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