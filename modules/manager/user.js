"use strict";

let SportsModel = require("../models/sports"),
  User = require("../models/user"),
  jwt = require("jsonwebtoken"),
  mongoose = require("mongoose"),
  apiResponse = require("../helpers/apiResponse");

let storeRegistrationData = async (req, res) => {
  const { full_name, email, phone, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return apiResponse.onError(
        res,
        "User already exists with this email",
        400
      );
    }

    let newUser = new User({
      full_name,
      email,
      phone,
      role,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    newUser.token = token;

    await newUser.save();

    return apiResponse.onSuccess(
      res,
      "User registered successfully",
      200,
      true,
      newUser
    );
  } catch (err) {
    console.error("Error in storeRegistrationData manager:", err);
    return apiResponse.onError(res, "Failed to register user", 500);
  }
};

let SportsList = async (res) => {
  try {
    const sports_list = await SportsModel.find({ status: 1 });
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

let getCurrentUserDetails = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    console.log("user", user);

    if (!user) {
      return apiResponse.onError(res, "User not found", 400);
    }
    return apiResponse.onSuccess(
      res,
      "User details fetched successfully",
      200,
      true,
      user
    );
  } catch (err) {
    console.log("Error fetching user details:", err);
    return apiResponse.onError(res, "An error occurred", 500);
  }
};

let updateUser = async (req, res) => {
  const {
    full_name,
    nick_name,
    email,
    phone,
    date_of_birth,
    city,
    sports,
    positions,
  } = req.body;
  const userId = req.params.userId;

  // Validate User ID
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return apiResponse.onError(res, "Invalid user ID", 400);
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return apiResponse.onError(res, "User not found", 404);
    }

    // Handle file upload
    let fileName = req.file
      ? `http://3.83.218.53/uploads/user/${req.file.filename}`
      : user.profile_picture;

    // Prepare updates
    const updates = {
      profile_picture: fileName,
      full_name,
      nick_name,
      email,
      phone,
      date_of_birth,
      city,
      sports,
      positions,
    };

    // Apply updates to user object
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        user[key] = value;
      }
    });

    await user.save();

    return apiResponse.onSuccess(
      res,
      "User updated successfully",
      200,
      true,
      user
    );
  } catch (err) {
    console.log("Error updating user: ", err);
    return apiResponse.onError(
      res,
      "An error occurred while updating the user.",
      500
    );
  }
};

let deleteAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);

    if (!user) {
      return apiResponse.onError(res, "User not found", 404, false);
    }

    return apiResponse.onSuccess(res, "User deleted successfully", 200, true);
  } catch (err) {
    console.log("Error deleting user: ", err);
    return apiResponse.onError(
      res,
      "An error occurred while deleting the user.",
      500,
      false
    );
  }
};

module.exports = {
  SportsList: SportsList,
  storeRegistrationData: storeRegistrationData,
  getCurrentUserDetails: getCurrentUserDetails,
  updateUser: updateUser,
  deleteAccount: deleteAccount,
};
