const bcrypt = require("bcrypt");

function encryptPassword(password, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return callback(err);

    bcrypt.hash(password, salt, (err, hash) => callback(err, hash));
  });
}

async function comparePassword(plainPass, hashword, callback) {
  try {
    const isPasswordMatch = await bcrypt.compare(plainPass, hashword);
    callback(null, isPasswordMatch);
  } catch (err) {
    callback(err);
  }
}

module.exports = { encryptPassword, comparePassword };
