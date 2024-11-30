const express = require("express");
const cors = require("cors");
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r7awt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const coffeeCollection = client.db("coffeeDB").collection("Coffee");
    const usersCollection = client.db("usersDB").collection("Users")
   app.get("/addCoffee", async(req, res)=>{
    const cursor =  coffeeCollection.find();
    const result = await cursor.toArray()
    res.send(result)

   })
   app.get("/addCoffee/:id", async(req, res)=>{
    const id = req.params.id
    const query= {_id: new ObjectId(id)}
    const result = await coffeeCollection.findOne(query)
    res.send(result)
   })
   
    app.post("/addCoffee", async(req, res)=>{
      const newCoffee = req.body;
      console.log(newCoffee)
      const result = await coffeeCollection.insertOne(newCoffee)
      res.send(result)
   })
   app.post("/users", async(req, res)=>{
    const newUsers = req.body;
    const result = await usersCollection.insertOne(newUsers);
    res.send(result)
   })
   app.get("/users", async(req, res)=>{
    const cursor = usersCollection.find();
    const result = await cursor.toArray();
    res.send(result)
   })
   app.get("/users/:id", async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result =await usersCollection.findOne(query);
     res.send(result)
   })
   app.put("/addCoffee/:id", async(req, res)=>{
    const id = req.params.id;
    // const query = req.body;
    const filter = {_id: new ObjectId(id)}
    const options = {upsert: true};
    const updateCoffee = req.body
    const updateDoc = {
      $set: {
        name:updateCoffee.name,
        quantity: updateCoffee.quantity,
        supplier: updateCoffee.supplier,
        taste: updateCoffee.taste

      }
    }
    const result = await coffeeCollection.updateOne(filter,updateDoc,options)
    res.send(result)
   })
   app.delete("/addCoffee/:id", async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result= coffeeCollection.deleteOne(query)
        res.send(result)
   })
   

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res)=>{
    res.send("hello world")
})
app.listen(port,()=>{
    console.log(`app on running on port: ${port}`)
})
