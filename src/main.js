const connectToDb = require("./db/connect");
const app = require("./app");
const port = process.env.PORT || 3000;
connectToDb().then(() => {
  app.listen(port, () => {
    console.log(`server is up on port ${port}`);
  });
});
