'use strict';

class AccessDeniedError extends Error {
    constructor (message, extra) {
        super();
        Error.captureStackTrace(this, this.constructor);
        this.name = 'AccessDenied';
        this.message = message || 'Access Denied.';
        this.json = {
            message: this.message,
            status: -1
        };
        this.status = 403;
        if (extra) {
            this.extra = extra;
        }
    }
}

module.exports = AccessDeniedError;
