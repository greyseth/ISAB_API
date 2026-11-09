function requireParams(params) {
  return (req, res, next) => {
    let missingParam = false;

    for (let i = 0; i < params.length; i++) {
      if (
        req.body[params[i]] === undefined ||
        req.body[params[i]] === null ||
        req.body[params[i]] === NaN
      ) {
        missingParam = true;
        res
          .status(400)
          .json({ error: `Missing required '${params[i]}' parameter` });
        break;
      }
    }

    if (!missingParam) next();
  };
}

module.exports = requireParams;
