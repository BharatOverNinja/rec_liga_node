let UserModel = require("../models/User");
const { messaging } = require('../../app');

const sendFirebaseNotification = async (v_title, t_message, v_image_path = '', type, i_news_id, news) => {
  const { messaging } = require('../../app');

  let activeUsersList = await UserModel.findAll({
    where: {e_status : 'Active'},
    raw: true
  });

  let device_tokens = activeUsersList?.map(user => user?.v_device_token)?.filter(deviceToken => deviceToken !== null && deviceToken !== undefined && deviceToken !== '');

  let uniqueDeviceTokens = new Set(device_tokens);

  let uniqueDeviceTokensArray = Array.from(uniqueDeviceTokens);

  if(uniqueDeviceTokensArray?.length > 0) {
    let message = {
      "tokens": uniqueDeviceTokensArray,
      "notification": {
        "title": v_title,
        "body": t_message,
      },
      "data" : {
        "i_news_id" : i_news_id ? JSON.stringify(i_news_id) : "",
        "news_detail" : news ? JSON.stringify(news) : ""
      }
    };

    if(type == 'News') {
      message.notification.body = message.notification.title,
      message.notification.title = ''
    } else {
      delete message.data
    }
    
    if (v_image_path) {
      message.notification.image = v_image_path;
    }
  
    console.log(message)

    messaging.sendMulticast(message)
      .then((response) => {
        // Response is an object with results for each token
        response.responses.forEach((result, index) => {
          if (result.error) {
            console.error(`Failed to send notification to token ${message.tokens[index]}:`, result.error);
          } else {
            console.log(`Successfully sent notification to token ${message.tokens[index]}`);
          }
        });
      })
      .catch((error) => {
        console.error('Error sending notification:', error);
      }); 
  }
};

module.exports = {
  sendFirebaseNotification,
};
