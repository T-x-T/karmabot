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

  async getAllUserKarma(){
    const userKarma = await redis.zrange("userkarma", 0, -1, "WITHSCORES");
    let userKarmaObjects = [];
    for(let i = 0; i < userKarma.length; i += 2){
      userKarmaObjects.push({
        karma: Number(userKarma[i + 1]),
        userId: userKarma[i]
      });
    }
    return userKarmaObjects;
  },

  async getAllGuildKarma(){
    return await redis.zrange("guildkarma", 0, -1, "WITHSCORES");
  },

  async getAllUserKarmaInGuild(guildId){
    return await redis.zrange(`${guildId}:userkarma`, 0, -1, "WITHSCORES");
  },

  async getAllGuilds(){
    return await redis.lrange("guilds", 0, -1);
  },

  async writeUserKarmaHistory(historyObjects){
    const commands = historyObjects.map(historyObject => {
      return [
        "zadd", `history:${historyObject.userId}:userkarma`, historyObject.timestamp, historyObject.karma
      ]
    }); 
    console.log(commands)
    await redis.multi(commands).exec();
  }
}