exports.handlePSQL400s = (err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ msg: "404 Not Found" });
  }
  if (err.code === "22P02") {
    res.status(400).send({ msg: "400 Bad Request, choose valid ID" });
  }

  if (err.code === "42703" || err.code === "23502") {
    res.status(400).send({ msg: `400 Bad Request: psql: ${err.code}` });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  const { status, msg } = err;
  if (status && msg) {
    res.status(status).send({ msg });
  } else {
    next(err);
  }
};

exports.handle500Statuses = (err, req, res, next) => {
  res.status(500).send({ msg: "Sorry, server error" });
};
