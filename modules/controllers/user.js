let userManager = require("../manager/user");

let storeRegistrationData = (req, res, next) => {
  return userManager.storeRegistrationData(req.body, req, res);
};

let SportsList = (req, res, next) => {
  return userManager.SportsList(req.body, req, res);
};

let getCurrentUserDetails = (req, res, next) => {
  return userManager.getCurrentUserDetails(req, res);
};

let updateUser = (req, res, next) => {
  return userManager.updateUser(req, res);
};

let deleteAccount = (req, res) => {
  return userManager.deleteAccount(req, res);
};

module.exports = {
  storeRegistrationData,
  SportsList,
  getCurrentUserDetails,
  updateUser,
  deleteAccount,
};
