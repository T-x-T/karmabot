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

  async getTotalKarmaHistory(since){
    const res = await redis.zrangebyscore("history:totalkarma", since, Date.now(), "WITHSCORES");
    const objects = [];
    for(let i = 0; i < res.length; i += 2){
      objects.push({
        timestamp: Number(res[i + 1]),
        karma: Number(res[i].split(":")[0])
      });
    }
    return objects;
  },

  async getUserKarmaHistory(since, userId){
    const res = await redis.zrangebyscore(`history:${userId}:userkarma`, since, Date.now(), "WITHSCORES");
    const objects = [];
    for(let i = 0; i < res.length; i += 2){
      objects.push({
        timestamp: Number(res[i + 1]),
        karma: Number(res[i].split(":")[0])
      });
    }
    return objects;
  },

  async getGuildKarmaHistory(since, guildId){
    const res = await redis.zrangebyscore(`history:${guildId}:guildkarma`, since, Date.now(), "WITHSCORES");
    const objects = [];
    for(let i = 0; i < res.length; i += 2) {
      objects.push({
        timestamp: Number(res[i + 1]),
        karma: Number(res[i].split(":")[0])
      });
    }
    return objects;
  },

  async getUserInGuildKarmaHistory(since, userId, guildId){
    const res = await redis.zrangebyscore(`history:${guildId}:${userId}:userkarma`, since, Date.now(), "WITHSCORES");
    const objects = [];
    for(let i = 0; i < res.length; i += 2) {
      objects.push({
        timestamp: Number(res[i + 1]),
        karma: Number(res[i].split(":")[0])
      });
    }
    return objects;
  },

  async getUserCountHistory(since){
    const res = await redis.zrangebyscore("history:usercount", since, Date.now(), "WITHSCORES");
    const objects = [];
    for(let i = 0; i < res.length; i += 2){
      objects.push({
        timestamp: Number(res[i + 1]),
        count: Number(res[i].split(":")[0])
      });
    }
    return objects;
  },

  async getGuildCountHistory(since){
    const res = await redis.zrangebyscore("history:guildcount", since, Date.now(), "WITHSCORES");
    const objects = [];
    for(let i = 0; i < res.length; i += 2){
      objects.push({
        timestamp: Number(res[i + 1]),
        count: Number(res[i].split(":")[0])
      });
    }
    return objects;
  }
}