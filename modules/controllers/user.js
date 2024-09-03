let userManager = require("../manager/user");

let storeRegistrationData = (req, res) => {
  return userManager.storeRegistrationData(req.body, req, res);
};

let SportsList = (req, res) => {
  return userManager.SportsList(req.body, req, res);
};

let getCurrentUserDetails = (req, res) => {
  return userManager.getCurrentUserDetails(req, res);
};

let updateUser = (req, res) => {
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
