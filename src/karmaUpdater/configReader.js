import Redis from "ioredis";
let redis;

export default{
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

  async isUserDisabled(userId){
    return await redis.get(`${userId}:config:disabled`) === "true" ? true : false;
  },

  async isGuildDisabledInUser(userId, guildId){
    return await redis.sismember(`${userId}:config:disabledguilds`, guildId) === 1 ? true : false;
  },

  async getGuildUpvoteEmoji(guildId){
    return await redis.get(`${guildId}:config:upvoteemojiid`);
  },

  async getGuildDownvoteEmoji(guildId) {
    return await redis.get(`${guildId}:config:downvoteemojiid`);
  }
}