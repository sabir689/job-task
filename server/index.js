const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require("dotenv").config();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lyyi68r.mongodb.net/?retryWrites=true&w=majority`;

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
        const taskCollection = client.db("task-management").collection("addTask");

app.post("/api/addTask", async (req, res) => {
    const addTask= req.body;
    const result = await taskCollection.insertOne(addTask);
    res.send(result);
  });

  app.get("/api/addTask", async (req, res) => {
    const cursor = taskCollection.find();
    const result = await cursor.toArray();
    res.send(result);
  });
  app.delete("/api/addTask/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await taskCollection.deleteOne(query);
    res.send(result);
  });


  app.put("/api/addTask/:id", async (req, res) => {
    const id = req.params.id;
    const updatedTask = req.body;

    try {
        const filter = { _id: new ObjectId(id) };
        const update = {
            $set: {
                taskTitle: updatedTask.taskTitle,
                taskPriority: updatedTask.taskPriority,
                taskDescription: updatedTask.taskDescription,
                deadline: updatedTask.deadline,
                // Add other fields you want to update
            },
        };

        const result = await taskCollection.updateOne(filter, update);

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task updated successfully' });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});




















    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get("/", (req, res) => {
    res.send("Here is ur all the task");
  });
  
  app.listen(port, () => {
    console.log(`Task are running on :${port}`);
  });

  