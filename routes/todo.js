const express=require("express");
const bodyparser=require("body-parser");
const router = express.Router();
const Todo = require('../models/todo')

router.use(bodyparser());

// get all todos

router.get('/todos', async (req, res) => {
    try {
      const todos = await Todo.find();
      res.status(200).send(todos);
    } catch (err) {
      res.status(400).send(err);
    }
  });

module.exports=router;