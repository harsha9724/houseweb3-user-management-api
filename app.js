const express=require("express");
const app=express();
const cors = require('cors');
const dotenv = require("dotenv");
const mongoose=require("mongoose");
dotenv.config()
const todo_router = require('./routes/todo')

app.use(cors())
app.use(express.json());

const mangoURL = process.env.MANGO_URL

mongoose.connect(`${mangoURL}/todos`);
  
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    console.log('Connected to MongoDB');
  });

app.get('/',(req,res)=>{
    res.send("Server running successfully")
})

app.use('/api/v1',todo_router)

app.get("*", (req, res) => {
    res.status(404).send("404 PAGE NOT FOUND")
})

const port = process.env.PORT || 5000

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
 })