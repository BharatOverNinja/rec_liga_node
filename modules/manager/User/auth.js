"use strict";

let helper = require("../../helpers/helpers"),
  SportsModel = require("../../models/Sports"),
  config = require('../../../config/config'),
  apiResponse = require("../../helpers/apiResponse");

const { v4: uuidv4 } = require("uuid");


let generateAuthToken = async (phone) => {
  return uuidv4();
};

let SportsList = async (body,req, res) => {
    try {
        let sports_list = await SportsModel.findAll({})
        
        return apiResponse.onSuccess(
            res,
            "Sports List fetched successfull.",
            200,
            true,
            {sports_list : sports_list}
        );
    } catch(err) {
        console.log("err ", err)
    }
}

module.exports = {
    SportsList: SportsList
};
