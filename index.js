const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.7dm94fg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const tasksCollection = client.db('myTask').collection('tasks')

        app.get('/tasks', async (req,res) =>{
            const query = {}
            const tasks = await tasksCollection.find(query).toArray();

            res.send(tasks);
        })

        app.post("/tasks", async (req, res) => {
            const task = req.body;
            const result = await tasksCollection.insertOne(task);
            res.send(result);
          });
    }
    finally{

    }

}


run().catch(console.log);

app.get("/", (req, res) => {
  res.send("tasks");
});

app.listen(port, () => {
  console.log(`Genius Task listening on port ${port}`);
});
