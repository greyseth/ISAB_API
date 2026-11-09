const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  if (req.path.includes("/login")) return next();

  const authHeader = req.header["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({ error: "Invalid authorization token" });

  jwt.verify(token, process.env.TOKEN_SECRET, (err, tokenContents) => {
    if (err) return res.status(403).json({ error: err });
    req.id_user = tokenContents.id_user;
    next();
  });
};

module.exports = authenticateToken;
