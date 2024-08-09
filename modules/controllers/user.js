let userManager = require("../manager/user");

let SportsList = (req, res, next) => {
  return userManager
    .SportsList(req.body, req, res);
}

module.exports = {
  SportsList: SportsList
};
