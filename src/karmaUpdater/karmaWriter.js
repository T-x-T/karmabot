import Redis from "ioredis";
let redis;

export default{
  connect(ip, port){
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

  async incrementKarma(userId) {
    await redis.incr(`${userId}:karma`);
  },

  async decrementKarma(userId) {
    await redis.decr(`${userId}:karma`);
  },

  async addVoteTimestamp(userId) {
    await redis.rpush(`${userId}:votetimestamps`, Date.now());
  },

  async getVoteTimestamps(userId) {
    return await redis.lrange(`${userId}:votetimestamps`, 0, -1);
  },

  async incrementGuildKarmaOfUser(userId, guildId) {
    await redis.incr(`${guildId}:${userId}:karma`);
  },

  async decrementGuildKarmaOfUser(userId, guildId) {
    await redis.decr(`${guildId}:${userId}:karma`);
  },

  async incrementGuildTotalKarma(guildId) {
    await redis.incr(`${guildId}:karma`);
  },

  async decrementGuildTotalKarma(guildId) {
    await redis.decr(`${guildId}:karma`);
  },

  async addUserToGuildUserListIfNotPresent(userId, guildId) {
    await redis.sadd(`${guildId}:users`, userId);
  },

  async addToUsersIfNotPresent(userId) {
    await redis.sadd("users", userId);
  },

  async addToGuildIfNotPresent(guildId){
    await redis.sadd("guilds", guildId);
  }
};