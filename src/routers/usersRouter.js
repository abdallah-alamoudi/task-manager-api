const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const { sendWelcomeEmail } = require("../emails/emailService");
router.get("/users/me", auth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
});

router.patch("/users/", auth, async (req, res) => {
  try {
    const user = req.user;
    const updatedFields = Object.keys(req.body);
    const allowedFields = ["username", "email", "password"];

    const isValidOperation = updatedFields.every((field) =>
      allowedFields.includes(field)
    );
    if (!isValidOperation) {
      return res
        .status(400)
        .send({ error: "some fields are not allowed to update" });
    }
    for (const field of updatedFields) {
      user[field] = req.body[field];
    }
    await user.save();
    res.send(user);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).send({ error: error.message });
    }
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await User.deleteOne({ _id: req.user.id });
    res.send(req.user);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
});
router.post("/users", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    const token = await user.generateAuth();
    await user.save();
    res.send({ user, token });
    sendWelcomeEmail(email, username);
  } catch (error) {
    if (error.name === "ValidationError" || error.code === 11000) {
      return res.status(400).send({ error: error.message });
    }
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
});
router.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuth();
    res.send({ user, token });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error.message });
  }
});
router.post("/users/logout", auth, (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    req.user.save();
    res.send("logged out successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
});
router.post("/users/logout/all", auth, (req, res) => {
  try {
    req.user.tokens = [];
    req.user.save();
    res.send("logged out successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
});
router.post(
  "/users/upload",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send({ error: "no files uploaded" });
      }
      req.user.avatar = req.file.buffer;
      await req.user.save();
      res.send(req.user.avatar.toString("base64"));
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Internal server error" });
    }
  },
  (err, req, res, next) => {
    res.status(400).send({ error: err.message });
  }
);
router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ error: "No user with this id" });
    }
    if (!user.avatar) {
      return res.status(404).send({ error: "this user has no avatar" });
    }
    res.set("Content-Type", "image/jpeg");
    res.send(user.avatar);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
});
router.delete("/users/avatar", auth, async (req, res) => {
  try {
    if (!req.user.avatar) {
      return res.status(404).send({ error: "No avatar to delete" });
    }
    req.user.avatar = undefined;
    await req.user.save();
    res.send("Avatar deleted successfully ");
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
});
module.exports = router;
