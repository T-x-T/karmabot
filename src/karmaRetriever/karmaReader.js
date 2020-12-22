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
    return await redis.zscore("guildkarma", guildId);
  },

  async getTotalRankOfUser(userId){
    return await redis.zrevrank("userkarma", userId);
  },

  async getGuildRankOfUser(userId, guildId){
    return await redis.zrevrank(`${guildId}:userkarma`, userId);
  },

  async getUsersOfGuild(guildId){
    return await redis.smembers(`${guildId}:users`);
  },

  async getTotalRankOfGuild(guildId) {
    return await redis.zrevrank("guildkarma", guildId);
  },

  async getTopUsers(count){
    return await redis.zrevrange("userkarma", 0, count - 1, "WITHSCORES");
  },

  async getTopUserByIndex(index){
    return await redis.zrevrange("userkarma", index - 1, index - 1, "WITHSCORES");
  },

  async getTopUsersOfGuild(count, guildId){
    return await redis.zrevrange(`${guildId}:userkarma`, 0, count -1, "WITHSCORES");
  },

  async getTopUserOfGuildByIndex(index, guildId) {
    return await redis.zrevrange(`${guildId}:userkarma`, index - 1, index - 1, "WITHSCORES");
  },

  async getTopGuilds(count){
    return await redis.zrevrange("guildkarma", 0, count - 1, "WITHSCORES");
  },

  async getTopGuildByIndex(index){
    return await redis.zrevrange("guildkarma", index - 1, index - 1, "WITHSCORES");
  },

  async getGuildsOfUser(userId){
    const guilds = await redis.smembers("guilds");
    const guildsFilter = await Promise.all(guilds.map(async guildId => await redis.sismember(`${guildId}:users`, userId)));
    let guildsOfUser = [];
    for(let i = 0; i < guilds.length; i++){
      if(guildsFilter[i] === 1) guildsOfUser.push(guilds[i]);
    }
    return guildsOfUser;
  }
}