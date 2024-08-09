"use strict";

const HTTP_STATUS = require("./modules/constants/httpStatus");
let auth = require("./modules/middleware/auth");

module.exports = (app) => {
  /*    app.use((req,res,next) => {
        console.log(req.url,req.body,req.headers);
        next();
    });*/

  //Authentication layer
  app.use(auth.validateRequest);

  app.use("/api/registration", require("./modules/routes/authentication.js"));

  /**
   * Throw 404 for all other routes.
   */
  app.use((req, res, next) => {
    console.log("req", req.url, req.headers);

    /**
     * Header sent will be false if none of the above routes matched.
     */
    if (res._headerSent) {
      return next();
    }

    /**
     *  Else, throw 404
     */
    res
      .status(HTTP_STATUS.NOT_FOUND)
      .json({ error: "This route doesn't exist" });
  });
};
