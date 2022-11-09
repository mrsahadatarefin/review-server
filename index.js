const express =require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors =require('cors');
const app = express();
const port = process.env.PORT||5000;
require('dotenv').config();


app.use(cors());
app.use(express.json());
console.log(process.env.DB_USER)
console.log(process.env.DB_PASSWORD)



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.w5yg5ut.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
try{
const serviceCollection =client.db('review').collection('services');
 const orderCollection = client.db("review").collection('order');

 app.post('/service', async(req,res)=>{
   const service = await req.body;
   console.log("service", service);

   const resultAll = await  serviceCollection.insertOne(service)
   res.json({data: resultAll, status: 200, message: "Service added successfully"});
})

 app.get('/services',async(req,res)=>{
    const query={}
    const limit = req.query?.limit || null; 
    console.log(limit)

    const cursor= serviceCollection.find(query, {limit: limit});
    const services =await cursor.toArray();
    res.send(services);
})
app.get('/service/:id',async(req,res)=>{
    const id = req.params.id;
    const query ={_id:ObjectId(id)};
    const service =await serviceCollection.findOne(query)
    res.send(service);
});




app.get('/orders', async(req,res)=>{
    let query ={};

    if(req.query.email){
        query ={
            email: req.query.email
        }
    }    

    const cursor = await orderCollection.find(query);
    const orders =await cursor.toArray();
    res.send({data: orders, status: 200, message: "User Order Data get success"});
})

app.get('/orders/:id',async(req,res)=>{
    const serviceId = await req.params.id;
    const query = {service: serviceId};
    let orders =await orderCollection.find(query)
    orders =await orders.toArray();
    res.send(orders);
});



app.post('/orders', async(req,res)=>{
   const order= req.body;
   const result = await orderCollection.insertOne(order);
   res.send(result);
})

app.patch('/orders/:id', async(req,res)=>{
const id = req.params.id;
const status =req.body.status
const query ={_id:ObjectId(id)}
const updatedDoc ={
    $set:{status}
}
const doc = await orderCollection.updateOne(query,updatedDoc);
res.send(doc)



})

app.delete('/orders/:id', async(req,res) =>{
const id = req.params.id;
const query ={_id:ObjectId(id)};
const deleteQuery = await orderCollection.deleteOne(query) ;
res.send(deleteQuery)


})
}

finally{}

}
run().catch(err=>console.error(err));



app.get('/',(req,res)=>{
    res.send('review server is running')
})

app.listen(port,()=>{
    console.log(`review server  funning on ${port}`)
})