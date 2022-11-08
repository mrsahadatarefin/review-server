const express =require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
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
 
app.get('/services',async(req,res)=>{

    const query={}
    const cursor= serviceCollection.find(query);
    const services =await cursor.toArray();
    res.send(services);
})
}
finally{

}


}
run().catch(err=>console.error(err));



app.get('/',(req,res)=>{
    res.send('review server is running')
})

app.listen(port,()=>{
    console.log(`review server  funning on ${port}`)
})