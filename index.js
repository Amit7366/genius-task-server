const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.7dm94fg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const tasksCollection = client.db("myTask").collection("tasks");
    const usersCollection = client.db("myTask").collection("users");

    app.get("/tasks", async (req, res) => {
      const id = req.query.uid;
      const query = { taskUser: id };
      const tasks = await tasksCollection.find(query).toArray();

      res.send(tasks);
    });
    app.get("/completed/tasks", async (req, res) => {
        const id = req.query.uid;
      const query = { taskStatus: true,taskUser: id };
      const tasks = await tasksCollection.find(query).toArray();

      res.send(tasks);
    });

    app.post("/tasks", async (req, res) => {
      const task = req.body;
      const result = await tasksCollection.insertOne(task);
      res.send(result);
    });

    app.put("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const taskStatus = req.query.status;
      let updatedStatus = false;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      if (taskStatus === "true") {
        updatedStatus = false;
      } else {
        updatedStatus = true;
      }
      const updatedDoc = {
        $set: {
          taskStatus: updatedStatus,
        },
      };
      const result = await tasksCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    app.delete("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await tasksCollection.deleteOne(filter);
      res.send(result);
    });

    app.put("/comment/:id", async (req, res) => {
      const id = req.params.id;
      const comment = req.query.comment;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          comment: comment,
        },
      };
      const result = await tasksCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    /**
     * User API
     *
     * */

    app.post("/users", async (req, res) => {
      const user = req.body;

      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await usersCollection.count(query);
      res.send({ feedback: result });
    });
  } finally {
  }
}

run().catch(console.log);

app.get("/", (req, res) => {
  res.send("tasks");
});

app.listen(port, () => {
  console.log(`Genius Task listening on port ${port}`);
});
