const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middlewares/auth");
const { parseFilter, parsePagination, parseSort } = require("../queryHelpers");

router.get("/tasks", auth, async (req, res) => {
  try {
    // filtering
    const filter = parseFilter(req.user.id, req.query);
    // sorting
    const sortObj = parseSort(req.query);
    // pagination
    const { skip, limit, page } = parsePagination(req.query);

    const tasks = await Task.find(filter).limit(limit).skip(skip).sort(sortObj);
    const totalTasks = await Task.countDocuments(filter);
    res.send({ totalTasks, page, limit, tasks });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
});
router.get("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      author: req.user.id,
      _id: req.params.id,
    });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
});

router.post("/tasks", auth, async (req, res) => {
  try {
    const { description, completed } = req.body;
    const task = new Task({
      description,
      completed,
      author: req.user.id,
    });
    await task.save();
    res.send(task);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).send({ error: error.message });
    }
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "completed"];
    const isValidUpdate = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidUpdate) {
      return res.send({ error: "invalid updates" });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      author: req.user.id,
    });
    if (!task) {
      return res.status(404).send();
    }
    updates.forEach((field) => {
      task[field] = req.body[field];
    });
    await task.save();
    res.send(task);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).send({ error: error.message });
    }
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      author: req.user.id,
    });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
});

module.exports = router;
