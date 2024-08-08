'use strict';

class EntityNotFound extends Error {
    constructor (message, extra) {
        super();
        Error.captureStackTrace(this, this.constructor);
        this.name = 'Not Found';
        this.message = message || 'Not Found.';
        this.json = {
            message: this.message,
            status: -1
        };
        this.status = 404;
        if (extra) {
            this.extra = extra;
        }
    }
}

module.exports = EntityNotFound;