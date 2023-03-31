const endpoints = require("../endpoints.json");

exports.getApi = (req, res) => {
  res.send(endpoints);
};
