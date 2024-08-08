let authManager = require("../../manager/User/auth");

let SportsList = (req, res, next) => {
    return authManager
        .SportsList(req.body, req, res);
}
module.exports = {
    SportsList: SportsList
};
