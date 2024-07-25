const express = require("express");
const path = require("path");
const port = process.env.PORT;
// Loading dev.env vars
require("dotenv").config({
  path: path.resolve(__dirname, "../config/dev.env"),
});

const usersRouter = require("./routers/usersRouter");
const taskRouter = require("./routers/tasksRouter");
const connectToDb = require("./db/connect");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(usersRouter);
app.use(taskRouter);

connectToDb().then(() => {
  app.listen(port, () => {
    console.log(`server is up on port ${port}`);
  });
});
