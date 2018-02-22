const client = require("redis");
const redis_client = client.createClient({
  host: process.env.REDIS_URL
});

const get = async (key, defaultValue) => {
  if (typeof defaultValue === "undefined") {
    const defaultValue = null;
  }
  let promise = new Promise((resolve, reject) => {
    redis_client.get(key, (error, result) => {
      if (error) {
        reject(error);
      }
      if (result === null || result === "null") {
        resolve(defaultValue);
      } else {
        resolve(result);
      }
    });
  });
  return await promise.catch(error => {
    console.log(error);
  });
};

const getObject = async (key, defaultValue) => {
  if (typeof defaultValue !== null) {
    defaultValue = JSON.stringify(defaultValue);
  }
  const result = await self.get(key, defaultValue);
  return JSON.parse(result);
};

const set = async (key, data) => {
  redis_client.set(key, data);
};

const setObject = async (key, data) => {
  redis_client.set(key, JSON.stringify(data));
};

const getKeyFromMsg = (msg, identifier) => {
  return msg.message.channel.idea + identifier;
};

const deleteKey = async key => {
  redis_client.del(key);
};

const self = (module.exports = {
  client: client,
  get: get,
  set: set,
  delete: deleteKey,
  getObject: getObject,
  setObject: setObject,
  getKeyFromMsg: getKeyFromMsg
});
