const jwt = require("jsonwebtoken");

function generateToken(idUser) {
  return jwt.sign({ id_user: idUser }, process.env.TOKEN_SECRET, {
    expiresIn: "30d",
  });
}

module.exports = generateToken;
