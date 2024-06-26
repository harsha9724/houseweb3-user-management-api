const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express')
const Todo = require('../models/todo');
const dotenv = require("dotenv");
dotenv.config()
const app = express();
const todo_router = require('../routes/todo')
app.use(express.json());
app.use('/api/v1', todo_router);

beforeAll(async () => {
  const dbUrl = process.env.TEST_DB_URL;
  console.log('TEST_DB_URL:', dbUrl); // Print the TEST_DB_URL for debugging
  if (!dbUrl) {
    throw new Error("Environment variable TEST_DB_URL is not set");
  }
  await mongoose.connect(dbUrl);
});

afterAll(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
  await mongoose.disconnect();
  await mongoose.disconnect();
});

describe('Todo API', () => {
  describe('GET /api/v1/todos', () => {
    it('should get all todos', async () => {
      const res = await request(app).get('/api/v1/todos');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBe(0);
    });
  });

  describe('POST /api/v1/todos', () => {
    it('should create a new todo', async () => {
      const res = await request(app)
        .post('/api/v1/todos')
        .send({ title: 'Test todo' });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('title', 'Test todo');
      expect(res.body).toHaveProperty('completed', false);
    });

    it('should return 400 if title is missing', async () => {
      const res = await request(app).post('/api/v1/todos').send({});
      expect(res.statusCode).toEqual(400);
      expect(res.text).toBe('Title is required');
    });
  });

  describe('PUT /api/v1/todos/:id', () => {
    it('should update a todo by the given id', async () => {
      const todo = new Todo({
        title: 'Test todo',
      });
      await todo.save();

      const res = await request(app)
        .put(`/api/v1/todos/${todo.id}`)
        .send({ title: 'Updated todo', completed: true });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('title', 'Updated todo');
      expect(res.body).toHaveProperty('completed', true);
    });

    it('should return 400 for invalid ObjectId', async () => {
      const res = await request(app)
        .put('/api/v1/todos/invalidObjectId')
        .send({ title: 'Updated todo', completed: true });
      expect(res.statusCode).toEqual(400);
      expect(res.text).toBe('Invalid ID format');
    });

    it('should return 400 if todo not found', async () => {
      const validObjectId =new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/v1/todos/${validObjectId}`)
        .send({ title: 'Updated todo', completed: true });
      expect(res.statusCode).toEqual(400);
      expect(res.text).toBe('Todo not found');
    });
  });

  describe('DELETE /api/v1/todos/:id', () => {
    it('should delete a todo by the given id', async () => {
      const todo = new Todo({
        title: 'Test todo',
      });
      await todo.save();

      const res = await request(app).delete(`/api/v1/todos/${todo.id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.text).toBe('To-Do deleted');
    });

    it('should return 400 for invalid ObjectId', async () => {
      const res = await request(app).delete('/api/v1/todos/invalidObjectId');
      expect(res.statusCode).toEqual(400);
      expect(res.text).toBe('Invalid ID format');
    });

    it('should return 400 if todo not found', async () => {
      const validObjectId =new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/api/v1/todos/${validObjectId}`);
      expect(res.statusCode).toEqual(400);
      expect(res.text).toBe('Todo not found');
    });
  });
});
