/**
 * Global configuration for running server will reside here
 * ALL DB configuration, S3, and other apis calling url
 * along with their host name and port should reside here.
 *
 * This app server will get started from server/app.json file when required parameters can be
 * altered based on environment.
 */
var config = {
  /**
   * server configuration
   */
  server: {
    port: process.env.PORT,
    networkCallTimeout: 30000,
  },
  base_url: process.env.BASE_URL,
  /**
   * DB configuration
   */
  mysql: {
    database_name: process.env.DBNAME,
    user_name: process.env.DBUSER_NAME,
    password: process.env.DBPASSWORD,
    host: process.env.DBHOST,
    port: process.env.DBPORT,
  },
  upload_folder: "uploads",
  upload_entities: {
    user_images: "/user_image/",
  },
};

module.exports = config;
