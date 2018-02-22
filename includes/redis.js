import client from "redis";
const redis_client = client.createClient({
  host: process.env.REDIS_URL
});

const redis = {
  get: async (key, default = null) => {
    let promise = new Promise((resolve, reject) => {
      client.get(key, (error, result) => {
        if (error) {
          reject(error);
        }
        if (result === null) {
          resolve(default);
        }
        resolve(result);
      });
    });
    return promise.catch(error => {
      console.log(error);
    });
  },
  getObject: async (key, default) => {
    return JSON.parse(await this.get(key, default));
  },
  set: async (key, data) => {
    client.set(key, data);
  },
  setObject: async (key, data) => {
    this.set(key, JSON.stringify(data));
  },
  getKeyFromMsg: (msg, identifier) => {
    return msg.message.channel.idea + identifier;
  }
};
export default redis;
