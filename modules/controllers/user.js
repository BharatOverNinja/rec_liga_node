let userManager = require("../manager/user");

let SportsList = (req, res, next) => {
  return userManager.SportsList(req.body, req, res);
};

let storeRegistrationData = (req, res, next) => {
  return userManager.storeRegistrationData(req.body, req, res);
};

let getCurrentUserDetails = (req, res, next) => {
  return userManager.getCurrentUserDetails(req.body, req, res);
}

module.exports = {
  SportsList: SportsList,
  storeRegistrationData: storeRegistrationData,
  getCurrentUserDetails: getCurrentUserDetails,
};
