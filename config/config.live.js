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
    port: 4001,
    networkCallTimeout: 30000,
  },
  /**
   * DB configuration
   */
  mongodb: {
    database_name: "dormhub",
    host: "mongodb://localhost",
    port: 27017,
  },
  upload_folder: "uploads",
  upload_entities: {
    temperory_upload_location: "/temp/",
    hospital_logo_folder: "/user_image/",
  },
  registration_server_base_url: "http://localhost:3001",
};

module.exports = appConfig;
