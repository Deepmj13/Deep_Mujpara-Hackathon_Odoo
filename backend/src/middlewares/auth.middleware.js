const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  const token = this.req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  try {
    req.uesr = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.sendStatus(403);
  }
};
