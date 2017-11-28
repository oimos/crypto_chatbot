const express = require('express');
const line = require('@line/bot-sdk');
const fetch = require('isomorphic-fetch');

const config = {
  channelAccessToken: process.env.TOKEN,
  channelSecret: process.env.SECRET
};

const app = express();
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((errormsg) => {
        return client.replyMessage(event.replyToken, {
          type: 'text',
          text: errorMsg
        });
      });
});

const client = new line.Client(config);

const getCurrency = (text) => {
  return new Promise((resolve, reject) => {
    fetch('https://api.coinmarketcap.com/v1/ticker/' + text + '/?convert=JPY', {
      mode: 'no-cors'
    }).then((res) => {
      return res.json();
    }).then((json) => {
      resolve(json[0].price_jpy);
    }).catch(() => {
      reject('There is not such a coin!');
    })
  });
};

const handleEvent = (event) => {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }
  getCurrency(event.message.text).then((mess) => {
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: mess
    });
  }).catch((errorMsg) => {
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: errorMsg
    });
  });
}

app.listen(3000);