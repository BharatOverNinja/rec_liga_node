"use strict";

let _ = require("lodash"),
  config = process.config.global_config,
  multer = require("multer"),
  fs = require("fs-promise");
const path = require("path");
const BadRequestError = require("../errors/badRequestError");

const mime_type = {
  "application/vnd.ms-excel": "csv",
  "application/json": "json",
  "text/csv": "csv",
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/gif": "gif",
};

let userProfilePicture = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(
        null,
        config.upload_folder + config.upload_entities.user_profile_image_folder
      );
    },
    filename: function (req, file, callback) {
      let fileName =
        Date.now() +
        Math.round(Math.random() * 10000) +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1];
      callback(null, fileName);
    },
  }),
});

let uploadVocationImage = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(
        null,
        config.upload_folder + config.upload_entities.vocation_image_folder
      );
    },
    filename: function (req, file, callback) {
      let fileName =
        Date.now() +
        Math.round(Math.random() * 10000) +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1];
      callback(null, fileName);
    },
  }),
});

let uploadCountryPicture = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(
        null,
        config.upload_folder + config.upload_entities.country_image_folder
      );
    },
    filename: function (req, file, callback) {
      let fileName =
        Date.now() +
        Math.round(Math.random() * 10000) +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1];
      callback(null, fileName);
    },
  }),
});

let uploadPostImage = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(
        null,
        config.upload_folder + config.upload_entities.post_image_folder
      );
    },
    filename: function (req, file, callback) {
      let fileName =
        Date.now() +
        Math.round(Math.random() * 10000) +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1];
      callback(null, fileName);
    },
  }),
});

let uploadSubVocationImage = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(
        null,
        config.upload_folder + config.upload_entities.sub_vocation_image_folder
      );
    },
    filename: function (req, file, callback) {
      let fileName =
        Date.now() +
        Math.round(Math.random() * 10000) +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1];
      callback(null, fileName);
    },
  }),
});

let uploadReceiverImage = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, config.upload_folder + config.upload_entities.user_images);
    },
    filename: function (req, file, callback) {
      let fileName =
        Date.now() +
        Math.round(Math.random() * 10000) +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1];
      callback(null, fileName);
    },
  }),
});

let uploadHrKycDocuments = multer({
  // mutiple files pdf and jpg/jpeg/png
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(
        null,
        config.upload_folder + config.upload_entities.hr_kyc_documents_folder
      );
    },
    filename: function (req, file, callback) {
      let fileName =
        Date.now() +
        Math.round(Math.random() * 10000) +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1];
      callback(null, fileName);
    },
  }),
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg" && ext !== ".pdf") {
      return callback(
        new BadRequestError("Please upload a valid image or pdf file")
      );
    }
    callback(null, true);
  },
}).fields([
  { name: "GST", maxCount: 1 },
  { name: "PAN", maxCount: 1 },
]);

let uploadCompnayProfilePicture = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(
        null,
        config.upload_folder + config.upload_entities.compnay_image_folder
      );
    },
    filename: function (req, file, callback) {
      let fileName =
        Date.now() +
        Math.round(Math.random() * 10000) +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1];
      callback(null, fileName);
    },
  }),
});

let uploadSliderImage = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(
        null,
        config.upload_folder + config.upload_entities.slider_image_folder
      );
    },
    filename: function (req, file, callback) {
      let fileName =
        Date.now() +
        Math.round(Math.random() * 10000) +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1];
      callback(null, fileName);
    },
  }),
});

let uploadAdminImage = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(
        null,
        config.upload_folder + config.upload_entities.admin_image_folder
      );
    },
    filename: function (req, file, callback) {
      let fileName =
        Date.now() +
        Math.round(Math.random() * 10000) +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1];
      callback(null, fileName);
    },
  }),
});

let uploadProfileImage = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(
        null,
        config.upload_folder + config.upload_entities.profile_image_folder
      );
    },
    filename: function (req, file, callback) {
      let fileName =
        Date.now() +
        Math.round(Math.random() * 10000) +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1];
      callback(null, fileName);
    },
  }),
});

let uploadCategoryImage = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(
        null,
        config.upload_folder + config.upload_entities.category_image_folder
      );
    },
    filename: function (req, file, callback) {
      let fileName =
        Date.now() +
        Math.round(Math.random() * 10000) +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1];
      callback(null, fileName);
    },
  }),
});

let uploadPropertyImage = multer({
  // mutiple files pdf and jpg/jpeg/png
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(
        null,
        config.upload_folder + config.upload_entities.property_image_folder
      );
    },
    filename: function (req, file, callback) {
      let fileName =
        Date.now() +
        Math.round(Math.random() * 10000) +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1];
      callback(null, fileName);
    },
  }),
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg" && ext !== ".pdf") {
      return callback(
        new BadRequestError("Please upload a valid image or pdf file")
      );
    }
    callback(null, true);
  },
}).fields([
  { name: "property_image", maxCount: 10 }
]);

let uploadAssetsImage = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(
        null,
        config.upload_folder + config.upload_entities.assets_image_folder
      );
    },
    filename: function (req, file, callback) {
      let fileName =
        Date.now() +
        Math.round(Math.random() * 10000) +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1];
      callback(null, fileName);
    },
  }),
});

let uploadNewsImage = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(
        null,
        config.upload_folder + config.upload_entities.news_image_folder
      );
    },
    filename: function (req, file, callback) {
      let fileName =
        Date.now() +
        Math.round(Math.random() * 10000) +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1];
      callback(null, fileName);
    },
  }),
});

let uploadUpcomingServiceIconImage = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(
        null,
        config.upload_folder + config.upload_entities.upcoming_service_icon_image_folder
      );
    },
    filename: function (req, file, callback) {
      let fileName =
        Date.now() +
        Math.round(Math.random() * 10000) +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1];
      callback(null, fileName);
    },
  }),
});

let uploadNotificationImage = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(
        null,
        config.upload_folder + config.upload_entities.notification_image_folder
      );
    },
    filename: function (req, file, callback) {
      let fileName =
        Date.now() +
        Math.round(Math.random() * 10000) +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1];
      callback(null, fileName);
    },
  }),
});

module.exports = {
  userProfilePicture: userProfilePicture,
  uploadReceiverImage: uploadReceiverImage,
  uploadVocationImage: uploadVocationImage,
  uploadSubVocationImage: uploadSubVocationImage,
  uploadHrKycDocuments: uploadHrKycDocuments,
  uploadCountryPicture: uploadCountryPicture,
  uploadPostImage: uploadPostImage,
  uploadCompnayProfilePicture: uploadCompnayProfilePicture,
  uploadSliderImage:uploadSliderImage,
  uploadAdminImage:uploadAdminImage,
  uploadProfileImage:uploadProfileImage,
  uploadCategoryImage: uploadCategoryImage,
  uploadPropertyImage: uploadPropertyImage,
  uploadAssetsImage: uploadAssetsImage,
  uploadNewsImage:uploadNewsImage,
  uploadUpcomingServiceIconImage: uploadUpcomingServiceIconImage,
  uploadNotificationImage:uploadNotificationImage,
};
