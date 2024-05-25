const express=require("express");
const bodyparser=require("body-parser");
const router = express.Router();
const Todo = require('../models/todo');
const mongoose = require('mongoose');

router.use(bodyparser());

/**
 * ******* swagger schema ********
 */
/**
 * @swagger
 *  components:
 *      schema:
 *          todo:
 *              type: object
 *              properties:
 *                    title:
 *                          type: string
 *                    completed:
 *                          type: boolean
 *                          default: false
 *          updatetodo:
 *              type: object
 *              properties:
 *                    title:
 *                          type: string
 *                    completed:
 *                          type: boolean
 */



/**
 * ******** to get all todos available***********
 */
/**
 * @swagger
 * /api/v1/todos:
 *  get:
 *      summary: To get all todos from mongoDB
 *      description: This api is used to fetch the data from mongoDb
 *      responses:
 *          200:
 *              description: this api is used to fetch the data from mongoDb
 *              content:
 *                  application/json:
 *                         schema:
 *                             type: array
 *                             items:
 *                                $ref: "#components/schema/todo"
 *
 */
router.get('/todos', async (req, res) => {
    try {
      const todos = await Todo.find();
      res.status(200).send(todos);
    } catch (err) {
      res.status(400).send(err);
    }
  });


// create todo

/**
 * @swagger
 * /api/v1/todos:
 *  post:
 *      summary: This api is  to create the todo from user
 *      description: This api is to store data to database.
 *      requestBody:
 *             required: true
 *             content:
 *                 application/json:
 *                      schema:
 *                          $ref: "#components/schema/todo"
 *      responses:
 *          200:
 *              description: todo created successfully
 *          500:
 *              description: failed
 *
 */


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

/**
 * ****** update the products ********
 */

/**
 * @swagger
 * /api/v1/todos/{id}:
 *  put:
 *      summary: To update todo form the user
 *      description: This api is used to update the data
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: todo id is required
 *            schema:
 *               type: string
 *      requestBody:
 *             required: true
 *             content:
 *                 application/json:
 *                      schema:
 *                          $ref: "#components/schema/updatetodo"
 *      responses:
 *          200:
 *              description: updated successfully
 *          500:
 *              description: failed
 *
 */



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

/**
 * @swagger
 * /api/v1/todos/{id}:
 *  delete:
 *      summary: This api is for delete todo
 *      description: This api is used to delete the data
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: todo id is required
 *            schema:
 *               type: string
 *      responses:
 *          200:
 *              description: deleted successfully
 *          500:
 *              description: todo not found
 *
 */

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