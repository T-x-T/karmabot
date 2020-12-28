import Redis from "ioredis";
let redis;

export default {
  connect(ip, port) {
    return new Promise((resolve, reject) => {
      redis = new Redis(port, ip);

      redis.once("ready", () => {
        console.log("historyRecorder connected to redis");
        resolve();
      });

      redis.once("error", e => {
        console.error("historyRecorder failed to connect to redis:", e);
        reject(e);
      });
    });
  },

  async getUserCount() {
    return await redis.scard("users"); 
  },

  async getGuildCount() {
    return await redis.scard("guilds");
  }
}