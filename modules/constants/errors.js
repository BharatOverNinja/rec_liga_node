'use strict';

const ERRORS = {
    "WRONG_API_KEY": {
    	"code": "-1",
        "message": "Wrong api key provided."
    },
    "100-110": "App level",
    "API_KEY_INVALID": {
        "code": "-100",
        "message": "API key is missing or invalid. Try updating your application."
    },
    "INVALID_AUTH_TOKEN": {
        "code": "-101",
        "message": "Invalid auth token"
    },
    "DATABASE_ERROR": {
        "code": "-102",
        "message": "Internal database error."
    },
    "INTERNAL_SERVER_ERROR": {
        "code": "-103",
        "message": "Internal server error."
    },
    "SERVER_ERROR": {
        "code": "-103",
        "message": "Internal server error."
    },
};

module.exports = ERRORS;