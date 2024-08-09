"use strict";

let SprotsModel = require("../models/sports"),
  apiResponse = require("../helpers/apiResponse");

let SportsList = async (body,req, res) => {
    try {
      const sports_list = await SprotsModel.find({ status: 1 });
      return apiResponse.onSuccess(
        res,
        "Sports list fetcehd successfull.",
        200,
        true,
        sports_list
      );
    }catch(err) {
        console.log("err ", err)
        
    }
}
module.exports = {
  SportsList:SportsList
};
