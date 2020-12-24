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

  async getTotalKarmaHistory(since) {
    const res = await redis.zrangebyscore("history:totalkarma", since, Date.now(), "WITHSCORES");
    const objects = [];
    for(let i = 0; i < res.length; i += 2) {
      objects.push({
        timestamp: Number(res[i + 1]),
        karma: Number(res[i].split(":")[0])
      });
    }
    return objects;
  },

  async getUserKarmaHistory(since, userId) {
    const res = await redis.zrangebyscore(`history:${userId}:userkarma`, since, Date.now(), "WITHSCORES");
    const objects = [];
    for(let i = 0; i < res.length; i += 2) {
      objects.push({
        timestamp: Number(res[i + 1]),
        karma: Number(res[i].split(":")[0])
      });
    }
    return objects;
  },

  async getGuildKarmaHistory(since, guildId) {
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

  async getUserInGuildKarmaHistory(since, userId, guildId) {
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

  async getUserCountHistory(since) {
    const res = await redis.zrangebyscore("history:usercount", since, Date.now(), "WITHSCORES");
    const objects = [];
    for(let i = 0; i < res.length; i += 2) {
      objects.push({
        timestamp: Number(res[i + 1]),
        count: Number(res[i].split(":")[0])
      });
    }
    return objects;
  },

  async getGuildCountHistory(since) {
    const res = await redis.zrangebyscore("history:guildcount", since, Date.now(), "WITHSCORES");
    const objects = [];
    for(let i = 0; i < res.length; i += 2) {
      objects.push({
        timestamp: Number(res[i + 1]),
        count: Number(res[i].split(":")[0])
      });
    }
    return objects;
  },

  async getGuildsOfUser(userId) {
    const guilds = await redis.smembers("guilds");
    const guildsFilter = await Promise.all(guilds.map(async guildId => await redis.sismember(`${guildId}:users`, userId)));
    let guildsOfUser = [];
    for(let i = 0; i < guilds.length; i++) {
      if(guildsFilter[i] === 1) guildsOfUser.push(guilds[i]);
    }
    return guildsOfUser;
  }
}