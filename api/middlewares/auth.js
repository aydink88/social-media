const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const asyncUtil = require("./asyncUtil");

const isAuth = (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];
  console.log(token);

  if (token) {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) return res.status(401).json({ code: 401, message: "Session expired" });

      req.user = decoded.data;
    });
  }

  next();
};

module.exports = { isAuth: asyncUtil(isAuth) };
