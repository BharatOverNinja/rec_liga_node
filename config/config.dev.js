/**
 * Global configuration for running server will reside here
 * ALL DB configuration, S3, and other apis calling url
 * along with their host name and port should reside here.
 *
 * This app server will get started from server/app.json file when required parameters can be
 * altered based on environment.
 */
var appConfig = {
  /**
   * server configuration
   */
  server: {
    port: 5001,
    networkCallTimeout: 30000,
  },
  /**
   * DB configuration
   */
  mongodb: {
    connection_string:
      "mongodb+srv://over1ninja:<password>@recliga.v33og.mongodb.net/?retryWrites=true&w=majority&appName=RecLiga",
  },
  upload_folder: "uploads",
  upload_entities: {
    temperory_upload_location: "/temp/",
    insurance_attachment_folder: "/insurance_attachment/",
  },
  request_origin: "localhost",
};

module.exports = appConfig;
