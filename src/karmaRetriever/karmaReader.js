import Redis from "ioredis";
let redis;

export default {
  connect(ip, port) {
    return new Promise((resolve, reject) => {
      redis = new Redis(port, ip);

      redis.once("ready", () => {
        resolve();
      });

      redis.once("error", e => {
        reject(e);
      });
    });
  },

  async getTotalKarmaOfUser(userId){
    return await redis.zscore("userkarma", userId);
  },

  async getTotalKarmaOfUserInGuild(userId, guildId){
    return await redis.zscore(`${guildId}:userkarma`, userId);
  },

  async getTotalKarmaOfGuild(guildId){
    return await redis.zscore(`guildkarma`, guildId);
  }
}