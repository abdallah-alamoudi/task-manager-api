const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({ error: "provide an authorization header" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).send({ error: "Invalid token format" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id });

    const dbTokens = user.tokens.map((token) => token.token);
    if (!dbTokens.includes(token)) {
      return res.status(403).send({ error: "Invalid token" });
    }
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error(error);
    return res.status(403).send({ error: "forbidden" });
  }
};
module.exports = auth;
