const express = require('express')
const app = express()
const port = process.env.PORT || 5000
var cors = require('cors')

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://abdshakaet:hdDdpPHruXEDQWtx@cluster0.bnqcs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    // Connect to the "insertDB" database and access its "haiku" collection
    const database = client.db("MangoDB");
    const haiku = database.collection("mangoUser");


    app.put("/user/:id", async (req, res) => {
      const idx = req.params.id;
      const data = req.body; // Corrected from `res.body` to `req.body`
    
      const filter = { _id: new ObjectId(idx) };
      const options = { upsert: true };
    
      const updateData = {
        $set: {
          name: data.name,
          email: data.email,
        },
      };
    
        const result = await haiku.updateOne(filter, updateData, options);
  
        res.send(result)
    
       
    });


   app.get("/user",async(req,res)=>{
    const cursor = haiku.find();
    let result= await cursor.toArray()
    res.send(result)
   })

   app.get("/user/:id",async(req,res)=>{

    let idx= req.params.id

    const query = { _id :new ObjectId(idx) };

    const result = await haiku.findOne(query);
    res.send(result)

   })

 
  
    app.post("/user",async(req,res)=>{

      let userData=req.body
      console.log(userData)
      const result = await haiku.insertOne(userData);
      res.send(result)
    })

    app.delete("/user/:id",async(req,res)=>{
      let idx= req.params.id
      const query = { _id: new ObjectId(idx) };
      const result = await haiku.deleteOne(query);
      res.send(result)
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})