const express = require('express');
const router = express.Router();

const User = require('../models/User');
const auth = require('../middlewares/auth');
const Task = require('../models/Task');

router.use(auth.optionalVerification);

// Get all Tasks
router.get('/', async (req, res, next) => {
  try {
    let tasks = await Task.find({});
    let newTasks = tasks.map((task) => task.taskResponse());
    return res.status(200).json({ tasks: newTasks });
  } catch (error) {
    return res.status(401).json({ error: 'Task could not get' });
  }
});

// Get Single task
router.get('/:id', async (req, res, next) => {
  let taskId = req.params.id;
  try {
    let task = await Task.findById(taskId);
    return res.status(200).json({ task: await task.taskResponse() });
  } catch (error) {
    return res.status(401).json({ error: 'Task could not get task' });
  }
});

router.use(auth.verifyUser);

// Add task
router.post('/', async (req, res, next) => {
  try {
    req.body.task.author = req.user.id;
    let task = await Task.create(req.body.task);
    let user = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { task: task.id } },
      { new: true }
    );
    return res.status(200).json({ task: await task.taskResponse() });
  } catch (error) {
    return res.status(401).json({ error: 'Task could not create' });
  }
});

// Upadate task
router.put('/:id', async (req, res, next) => {
  let taskId = req.params.id;
  try {
    let task = await Task.findById(taskId);
    let authorId = task.author.toString();
    if (authorId == req.user.id) {
      let task = await Task.findByIdAndUpdate(taskId, req.body.task, {
        new: true,
      });
      return res.status(200).json({ task: await task.taskResponse() });
    } else {
      return res.status(403).json({ error: 'Only Auther can edit Task' });
    }
  } catch (error) {
    return res.status(401).json({ error: 'Could not update task' });
  }
});

// delete task
router.delete('/:id', async (req, res, next) => {
  let taskId = req.params.id;
  try {
    let task = await Task.findById(taskId);
    let authorId = task.author.toString();
    if (authorId == req.user.id) {
      let task = await Task.findByIdAndDelete(taskId);
      let user = await User.findByIdAndUpdate(
        authorId,
        { $pull: { tasks: taskId } },
        { new: true }
      );
      return res.status(200).json({ task: await task.taskResponse() });
    } else {
      return res.status(403).json({ error: 'Only Auther can Delete Task' });
    }
  } catch (error) {
    return res.status(401).json({ error: 'Could not delete task' });
  }
});
module.exports = router;
