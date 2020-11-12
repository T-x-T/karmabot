import configReader from "./configReader.js";
import karmaReader from "./karmaReader.js";

export default {
  async connect(redisIp, redisPort){
    await karmaReader.connect(redisIp, redisPort);
    await configReader.connect(redisIp, redisPort);
  },

  async getTotalKarmaOfUser(userId){
    let karma = await karmaReader.getTotalKarmaOfUser(userId);
    if(await configReader.isUserDisabled(userId)) throw new Error("user is disabled");
    return parseKarma(karma);
  },

  async getTotalKarmaOfUserInGuild(userId, guildId){
    let karma = await karmaReader.getTotalKarmaOfUserInGuild(userId, guildId);
    if(await configReader.isUserDisabled(userId)) throw new Error("user is disabled");
    if(await configReader.isGuildDisabledInUser(userId, guildId)) throw new Error("guild is disabled in user")
    return parseKarma(karma);
  },

  async getTotalKarmaOfGuild(guildId){
    let karma = await karmaReader.getTotalKarmaOfGuild(guildId);
    if(await configReader.isGuildDisabled(guildId)) throw new Error("guild is disabled");
    return parseKarma(karma);
  }
}

function parseKarma(karma){
  karma = Number.parseInt(karma);
  if(Number.isNaN(karma)) karma = 0;
  return karma;
}