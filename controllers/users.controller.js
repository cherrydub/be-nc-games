const { fetchUsers } = require("../models/users.model");

exports.getUsers = (req, res) => {
  fetchUsers().then((allUsers) => {
    res.status(200).send({ users: allUsers });
  });
};
