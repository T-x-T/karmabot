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

  async disableUser(userId) {
    return await redis.set(`${userId}:config:disabled`, true);
  },

  async enableUser(userId) {
    return await redis.set(`${userId}:config:disabled`, false);
  },

  async disableGuildinUser(userId, guildId) {
    return await redis.sadd(`${userId}:config:disabledguilds`, guildId);
  },

  async enableGuildInUser(userId, guildId) {
    return await redis.srem(`${userId}:config:disabledguilds`, guildId);
  },

  async disableGuild(guildId) {
    return await redis.set(`${guildId}:config:disabled`, true);
  },

  async enableGuild(guildId) {
    return await redis.set(`${guildId}:config:disabled`, false);
  },

  async setUpvoteEmoji(guildId, emojiId) {
    return await redis.set(`${guildId}:config:upvoteemojiid`, emojiId);
  },

  async setDownvoteEmoji(guildId, emojiId) {
    return await redis.set(`${guildId}:config:downvoteemojiid`, emojiId);
  },

  async deleteGuild(guildId){
    await redis.srem("guilds", guildId);
    const keysOfGuild = await redis.keys(guildId + ":*");
    await Promise.all(keysOfGuild.map(async (key) => {
      await redis.del(key);
    }));
  }
}