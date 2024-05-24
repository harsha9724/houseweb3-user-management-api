const express=require("express");
const app=express();
const cors = require('cors');
const dotenv = require("dotenv");
dotenv.config()


app.use(cors())
app.use(express.json());



app.get("*", (req, res) => {
    res.status(404).send("404 PAGE NOT FOUND")
})

const port = process.env.PORT || 5000

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
 })