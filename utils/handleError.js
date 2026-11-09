module.exports = function (res, err) {
  console.dir(err, { depth: null });
  res.status(500).json({
    error: Object.keys(err).length > 0 ? err : "Internal server error",
  });
};
