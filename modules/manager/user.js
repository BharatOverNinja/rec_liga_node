"use strict";

const { StoreRegistrationData } = require("../controllers/user");
let SprotsModel = require("../models/sports"),
  User = require("../models/user"),
  apiResponse = require("../helpers/apiResponse");

let SportsList = async (body, req, res) => {
  try {
    const sports_list = await SprotsModel.find({ status: 1 });
    return apiResponse.onSuccess(
      res,
      "Sports list fetcehd successfull.",
      200,
      true,
      sports_list
    );
  } catch (err) {
    console.log("err ", err);
  }
};

let storeRegistrationData = async (body, req, res) => {
  const { fullName, email, phoneNumber, profilePicture, selectedRole } =
    req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return apiResponse.onFail(res, "User already exist with this email", 400);
    }
    let newUser = new User({
      name: fullName,
      email,
      phone: phoneNumber,
      image: profilePicture,
      role: selectedRole,
    });
    await newUser.save();
    return apiResponse.onSuccess(
      res,
      "User registered successfully",
      200,
      true,
      newUser
    );
  } catch (err) {
    console.log("err ", err);
  }
};

let getCurrentUserDetails = async (body, req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return apiResponse.onFail(res, "User not found", 400);
    }
    return apiResponse.onSuccess(
      res,
      "User details fetched successfully",
      200,
      true,
      user,
    );
  } catch (err) {
    console.log("err ", err);
  }
};

module.exports = {
  SportsList: SportsList,
  storeRegistrationData: storeRegistrationData,
  getCurrentUserDetails: getCurrentUserDetails,
};
