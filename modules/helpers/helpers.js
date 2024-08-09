"use strict";

let _ = require("lodash");
let crypto = require("crypto");
let encKey = "0PBj4oG8t9yKYzkf58aEcm1Dsv78XrSb";
/**
 * Check for null or undefined value of argument
 */
let undefinedOrNull = (arg) => typeof arg === "undefined" || arg === null;

let isEmpty = (arg) => _.isEmpty(arg);

let encData = (data) => {
  try {
    var cipher = crypto.createCipheriv("aes256", encKey);
    var encrypted = cipher.update(data, "utf8", "hex") + cipher.final("hex");
    return encrypted;
  } catch (e) {
    console.log(e);
    return data;
  }
};

let decData = (data) => {
  try {
    var decipher = crypto.createDecipheriv("aes256", encKey);
    var decrypted =
      decipher.update(data, "hex", "utf8") + decipher.final("utf8");
    return decrypted;
  } catch (e) {
    console.log(e);
    return data;
  }
};
module.exports = {
  undefinedOrNull: undefinedOrNull,
  encData: encData,
  decData: decData,
  isEmpty: isEmpty,
};
