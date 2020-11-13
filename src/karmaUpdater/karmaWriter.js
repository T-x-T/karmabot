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
    await redis.zincrby("userkarma", 1, userId);
  },

  async decrementKarma(userId) {
    await redis.zincrby("userkarma", -1, userId);
  },

  async addVoteTimestamp(userId) {
    await redis.rpush(`${userId}:votetimestamps`, Date.now());
  },

  async getVoteTimestamps(userId) {
    return await redis.lrange(`${userId}:votetimestamps`, 0, -1);
  },

  async incrementGuildKarmaOfUser(userId, guildId) {
    await redis.zincrby(`${guildId}:userkarma`, 1, userId);
  },

  async decrementGuildKarmaOfUser(userId, guildId) {
    await redis.zincrby(`${guildId}:userkarma`, -1, userId);
  },

  async incrementGuildTotalKarma(guildId) {
    await redis.zincrby(`guildkarma`, 1, guildId);
  },

  async decrementGuildTotalKarma(guildId) {
    await redis.zincrby(`guildkarma`, -1, guildId);
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