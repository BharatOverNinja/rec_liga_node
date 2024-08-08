"use strict";

/**
 * Middleware to intercept success and error reponses.
 */
let _ = require("lodash");

/**
 * Custom errors
 */
let BadRequestError = require("../errors/badRequestError"),
  AccessDeniedError = require("../errors/accessDeniedError"),
  UnauthorizedError = require("../errors/unauthorizedError"),
  EntityNotFoundError = require("../errors/entityNotFoundError");

const HTTP_STATUS = require("../constants/httpStatus");
const AUTH_LENGTH = 8;

/**
 * Listens to success of the response.
 * This should be the first middleware for the request.
 */
let onSuccess = (req, res, next) => {
  req._startTime = Date.now();

  /**
   * res.end is the method which is called at the end of the request.
   * We overwrite this method with our own so that we can intercept the final response for logging.
   */
  let end = res.end;
  res.end = (chunk, encoding) => {
    /**
     * Restore the original end function
     */
    res.end = end;
    /**
     * Call the original end function
     */
    res.end(chunk, encoding);
  };

  return next();
};

/**
 * Handles error responses.
 */
let onError = (err, req, res, next) => {
  //console.log('Inside error listener.',err);

  // if (err.message === "Only images are allowed") {
  //   res.status(500).json({
  //     status: "error",
  //     message: "Only images are allowed",
  //   });

  res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR);

  /**
   * Handle known errors first.
   */
  if (
    err instanceof AccessDeniedError ||
    err instanceof BadRequestError ||
    err instanceof UnauthorizedError ||
    err instanceof EntityNotFoundError
  ) {
    res.json(err.json);

    return next();
  }

  /**
   * Handle internal server errors.
   */
  let response = {
    message: "Internal server error.",
    status: -1,
  };
  res.json(response);

  return next(err);
};

module.exports = {
  onSuccess: onSuccess,
  onError: onError,
};
