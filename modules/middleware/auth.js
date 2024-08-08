'use strict';

let _                 = require('lodash'),
    helper            = require('../helpers/helpers'),
    error_handler 	  = require("../constants/errors"),
    config            = process.config.global_config;

let validateApiKey = (req, res, next) => {
    let api_key = req.get('x-auth-api-key');
    if(!api_key) { api_key = req.get("x_auth_api_key"); }
    if(req.url.indexOf("swagger") == -1 && ((req.headers.referer && req.headers.referer.indexOf("swagger") == -1) || !req.headers.referer)) {
        if (helper.undefinedOrNull(api_key) || api_key != process.env.API_KEY) {
            var response = {
                status: -1,
                message: error_handler["WRONG_API_KEY"]
            }
            res.json(response);
            return;
        } else {
            req.is_swagger_api = false;
        	next()
        }
    } else {
        if (helper.undefinedOrNull(api_key) || api_key != process.env.API_KEY) {
            var response = {
                status: -1,
                message: error_handler["WRONG_API_KEY"]
            }
            res.json(response);
            return;
        } else {
            req.is_swagger_api = true;
            next();
        }
    }
};

module.exports = {
    validateApiKey           : validateApiKey
};