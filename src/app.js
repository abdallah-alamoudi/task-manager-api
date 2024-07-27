const path = require("path");
console.log(process.env.MONGODB_URL);
const express = require("express");
const usersRouter = require("./routers/usersRouter");
const taskRouter = require("./routers/tasksRouter");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(usersRouter);
app.use(taskRouter);

module.exports = app;
