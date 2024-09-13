"use strict";

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const controller = require("../controllers/chat");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "uploads/user/";
    // Check if the directory exists, if not, create it
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
}).single("group_image");

// Define the route for creating a group chat
router.post("/create_group_chat/:userId", (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(400).json({ message: "Image upload failed: " + err });
    }
    controller.createGroupChat(req, res);
  });
});

router.get("/get_user_active_groups/:userId", controller.getUserActiveGroups);
router.delete("/delete_group_chat", controller.deleteGroupChat);
router.delete("/delete_message", controller.deleteMessage);
router.post("/join_chat/:userId", controller.joinChat);
router.delete("/remove_user", controller.removeUserFromChat);

module.exports = router;
