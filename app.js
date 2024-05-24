const express=require("express");
const app=express();
const cors = require('cors');
const dotenv = require("dotenv");
const mongoose=require("mongoose");
const swaggerJSDoc=require("swagger-jsdoc");
const swaggerUI=require("swagger-ui-express");

dotenv.config()
const todo_router = require('./routes/todo')
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json());

const options={
    definition:{
        openapi:"3.0.0",
        info:{
            title:"node js todo project",
            version:"1.0.0"
        },
        servers:[
            {
                url:`http://localhost:${port}`
            }
        ]
    },
        components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                in: "header",
                scheme: 'bearer',
                bearerFormat: 'JWT',
            }
        }
    },
    security: [{
        bearerAuth: []
    }],
    apis:["./routes/todo.js"]
}
const swaggerSpec=swaggerJSDoc(options);
app.use("/api-doc",swaggerUI.serve,swaggerUI.setup(swaggerSpec));


const mongoURL = process.env.NODE_ENV === 'test' ? `${process.env.TEST_DB_URL}/test_todos` : `${process.env.MONGO_URL}/${process.env.DB_NAME}`;

mongoose.connect(`${mongoURL}`);
  
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




const server = app.listen(port, () => {
    console.log(`server is running on port ${port}`);
  });

 module.exports = {server,app};