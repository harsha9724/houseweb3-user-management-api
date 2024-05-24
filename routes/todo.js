const express=require("express");
const bodyparser=require("body-parser");
const router = express.Router();
const Todo = require('../models/todo');
const mongoose = require('mongoose');

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


// create todo

router.post('/todos', async (req, res) => {
    if(!req.body.title){
        res.status(400).send("Title is required");
        return
    }
    const todo = new Todo({
      title: req.body.title,
    });
    try {
      const savedTodo = await todo.save();
      res.status(201).send(savedTodo);
    } catch (err) {
      res.status(400).send(err?.message);
    }
  });


// update todo

router.put('/todos/:id', async (req, res) => {
    try {
        
        // check the valid formate of id
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).send('Invalid ID format');
        }

        // check the existence
        const todo = await Todo.findById(id);
        if(!todo) return res.status(400).send('Todo not found')

        // update todo
      const update_todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!update_todo) return res.status(404).send('To-Do not found');
      res.status(200).send(update_todo);
    } catch (err) {
      res.status(400).send(err);
    }
  });


// delete todo

router.delete('/todos/:id', async (req, res) => {
    try {
        // check the valid formate of id
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('Invalid ID format');
            }
        
        // check the existence
        const todo = await Todo.findById(id);
        if(!todo) return res.status(400).send('Todo not found')
      const delete_todo = await Todo.findByIdAndDelete(req.params.id);
      if (!delete_todo) return res.status(404).send('To-Do not found');
      res.status(200).send('To-Do deleted');
    } catch (err) {
      res.status(400).send(err);
    }
  });

module.exports=router;