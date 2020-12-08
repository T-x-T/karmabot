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
    const guildKarma = await redis.zrange("guildkarma", 0, -1, "WITHSCORES");
    let guildKarmaObjects = [];
    for(let i = 0; i < guildKarma.length; i += 2){
      guildKarmaObjects.push({
        karma: Number(guildKarma[i + 1]),
        guildId: guildKarma[i]
      });
    }
    return guildKarmaObjects;
  },

  async getAllUserKarmaInGuild(guildId){
    return await redis.zrange(`${guildId}:userkarma`, 0, -1, "WITHSCORES");
  },

  async getTotalKarma(){
    const allGuilds = await this.getAllGuildKarma();
    let totalKarma = 0;
    allGuilds.forEach(guild => totalKarma += guild.karma);
    return totalKarma;
  },

  async getAllGuilds(){
    return await redis.lrange("guilds", 0, -1);
  },

  async writeUserKarmaHistory(historyObjects){
    const commands = historyObjects.map(historyObject => {
      return [
        //Needs timestamp in value as well, so we dont get any duplicate values
        "zadd", `history:${historyObject.userId}:userkarma`, historyObject.timestamp, `${historyObject.karma}:${historyObject.timestamp}`
      ];
    });
    await redis.multi(commands).exec();
  },

  async writeGuildKarmaHistory(historyObjects){
    const commands = historyObjects.map(historyObject => {
      return [
        //Needs timestamp in value as well, so we dont get any duplicate values
        "zadd", `history:${historyObject.guildId}:guildkarma`, historyObject.timestamp, `${historyObject.karma}:${historyObject.timestamp}`
      ];
    });
    await redis.multi(commands).exec();
  },

  async writeTotalKarmaHistory(historyObject){
    await redis.zadd("history:totalkarma", historyObject.timestamp, `${historyObject.karma}:${Date.now()}`);
  }
}