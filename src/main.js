const express = require("express");
const path = require("path");
// Loading dev.env vars
// require("dotenv").config({
//   path: path.resolve(__dirname, "../config/dev.env"),
// });

const usersRouter = require("./routers/usersRouter");
const taskRouter = require("./routers/tasksRouter");
const connectToDb = require("./db/connect");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(usersRouter);
app.use(taskRouter);

connectToDb().then(() => {
  app.listen(3000, () => {
    console.log("server is up on port 3000");
  });
});
