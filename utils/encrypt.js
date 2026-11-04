const bcrypt = require("bcrypt");

function encryptPassword(password, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return callback(err);

    bcrypt.hash(password, salt, (err, hash) => callback(err, hash));
  });
}

function comparePassword(plainPass, hashword, callback) {
  bcrypt.comparePassword(plainPass, hashword, (err, isPasswordMatch) => {
    return err == null ? callback(null, isPasswordMatch) : callback(err);
  });
}

module.exports = { encryptPassword, comparePassword };
