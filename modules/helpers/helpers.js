'use strict';

let _= require('lodash');
/**
 * Check for null or undefined value of argument
 */
let undefinedOrNull = arg =>  (typeof arg === 'undefined' || arg === null)

let isEmpty = arg =>  _.isEmpty(arg);

/**
 * sanitize a string containing a JSON object
 *
 * @param sanitizeObject - object to be sanitized
 * @param sanitizeDefault - default object, in case the sanitizeObject is incorrect. for instance [], {}
 *
 * @return sanitized object
 */
let sanitize = (sanitizeObject, sanitizeDefault) => {

    if (sanitizeObject == null || typeof (sanitizeObject) === 'undefined' || sanitizeObject === '') {
        sanitizeObject = JSON.stringify(sanitizeDefault);
    }

    try {
        sanitizeObject = JSON.parse(sanitizeObject);
    } catch (e) {
        sanitizeObject = sanitizeDefault;
    }

    return sanitizeObject;
};

/**
 * sanitize a JSON object
 */
let sanitizeJSON = (sanitizeObject, sanitizeDefault) => {
    if (sanitizeObject == null || typeof (sanitizeObject) === 'undefined' || sanitizeObject === '') {
        sanitizeObject = sanitizeDefault;
    }

    return sanitizeObject;
};

/**
 * sanitize a JSON as string
 */
let sanitizeJSONAsString = (sanitizeObject, sanitizeDefault) => {
    if (sanitizeObject == null || typeof (sanitizeObject) === 'undefined' || sanitizeObject === '') {
        sanitizeObject = sanitizeDefault;
    }

    try {
        return JSON.stringify(sanitizeObject);
    } catch(e) {
        return JSON.stringify(sanitizeDefault);
    }
};

let generateIdNew = (idString)=> {
    var temp = idString;
    try {
        temp = parseInt(idString.match(/\/\d+/g)[0].match(/\d/g).join("")) + 1;
    } catch (e) {
        temp = 1;
    }

    return temp.toString();
}

let getUniqueTimeStamp = (value, padding) => {

    padding = padding && !isNaN(padding) ? padding : 2;

    padding = padding && !isNaN(padding) ? padding : 2;

    var idstr = String.fromCharCode(Math.floor((Math.random() * 25) + 65));
    do {
        var ascicode = Math.floor((Math.random() * 42) + 48);
        if (ascicode < 58 || ascicode > 64) {
            idstr += String.fromCharCode(ascicode);
        }
    } while (idstr.length < padding);

    return (idstr);
}
let getUniqueTransactionId = async () => {
    return (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2);
    
        
}
let capitalize = (value) => {
    if (!value) return null;
    return value.charAt(0).toUpperCase() + value.slice(1);
}

module.exports = {
    undefinedOrNull : undefinedOrNull,
    isEmpty         : isEmpty,
    sanitize        : sanitize,
    sanitizeJSON    : sanitizeJSON,
    sanitizeJSONAsString : sanitizeJSONAsString,
    getUniqueTimeStamp : getUniqueTimeStamp,
    generateIdNew   : generateIdNew,
    getUniqueTransactionId:getUniqueTransactionId
};
