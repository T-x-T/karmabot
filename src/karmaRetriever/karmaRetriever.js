let karmaReader, configReader;

export default {
  async connect(_karmaReader, _configReader){
    karmaReader = _karmaReader;
    configReader = _configReader;
  },

  async getTotalKarmaOfUser(userId){
    await throwIfUserDisabled(userId);
    let karma = await karmaReader.getTotalKarmaOfUser(userId);
    return parseKarma(karma);
  },

  async getTotalKarmaOfUserInGuild(userId, guildId){
    await Promise.all([throwIfUserDisabled(userId), throwIfUserDisabledGuild(userId, guildId), throwIfGuildDisabled(guildId)]);
    let karma = await karmaReader.getTotalKarmaOfUserInGuild(userId, guildId);
    return parseKarma(karma);
  },

  async getTotalKarmaOfGuild(guildId){
    await throwIfGuildDisabled(guildId);
    let karma = await karmaReader.getTotalKarmaOfGuild(guildId);
    return parseKarma(karma);
  },

  async getGuildKarmaOfAllGuildsOfUser(userId){
    await throwIfUserDisabled(userId);
    const guildsOfUser = await karmaReader.getGuildsOfUser(userId);
    const resWithDisabledGuilds = await Promise.all(guildsOfUser.map(async guildId => {
      if(!await configReader.isGuildDisabled(guildId) && !await configReader.isGuildDisabledInUser(userId, guildId)) return {
        guildkarma: await this.getTotalKarmaOfUserInGuild(userId, guildId),
        guildId: guildId
      }
    }));
    return resWithDisabledGuilds.filter(x => x);
  },

  async getTotalRankOfUser(userId){
    await throwIfUserDisabled(userId);
    let karma = await karmaReader.getTotalRankOfUser(userId);
    if(karma === null) throw new Error("user not found");
    karma = parseRankKarma(karma);
    return karma;
  },

  async getGuildRankOfUser(userId, guildId){
    await Promise.all([throwIfUserDisabled(userId), throwIfUserDisabledGuild(userId, guildId), throwIfGuildDisabled(guildId)]);
    let karma = await karmaReader.getGuildRankOfUser(userId, guildId);
    if(karma === null) throw new Error("user not found");
    karma = parseRankKarma(karma);
    return karma;
  },

  async getGuildRankOfAllGuildsOfUser(userId){
    await throwIfUserDisabled(userId);
    const guildsOfUser = await karmaReader.getGuildsOfUser(userId);
    const resWithDisabledGuilds = await Promise.all(guildsOfUser.map(async (guildId) => {
      if(!await configReader.isGuildDisabled(guildId) && !await configReader.isGuildDisabledInUser(userId, guildId)) return {
        guildRank: await this.getGuildRankOfUser(userId, guildId),
        guildId: guildId
      }
    }));
    return resWithDisabledGuilds.filter(x => x);
  },

  async getTotalGuildRankOfAllGuildsOfUser(userId) {
    await throwIfUserDisabled(userId);
    const guildsOfUser = await karmaReader.getGuildsOfUser(userId);
    const resWithDisabledGuilds = await Promise.all(guildsOfUser.map(async (guildId) => {
      if(!await configReader.isGuildDisabled(guildId) && !await configReader.isGuildDisabledInUser(userId, guildId)) return {
        guildRank: await this.getTotalGuildRankOfUser(userId, guildId),
        guildId: guildId
      }
    }));
    return resWithDisabledGuilds.filter(x => x);
  },

  async getTotalGuildRankOfUser(userId, guildId){
    await Promise.all([throwIfUserDisabled(userId), throwIfUserDisabledGuild(userId, guildId), throwIfGuildDisabled(guildId)]);
    let guildUsers = await karmaReader.getUsersOfGuild(guildId);
    let totalRanksOfGuildUsers = [];
    await Promise.all(guildUsers.map(async guildUser => {
      let rank = await this.getTotalRankOfUser(guildUser);
      totalRanksOfGuildUsers.push({user: guildUser, rank: rank});
    }));
    totalRanksOfGuildUsers.sort((a, b) => a.rank - b.rank);
    let rank = totalRanksOfGuildUsers.findIndex(entry => entry.user === userId) + 1;
    if(rank === 0) throw new Error("user not found");
    return rank;
  },

  async getTotalRankOfGuild(guildId) {
    await throwIfGuildDisabled(guildId);
    let karma = await karmaReader.getTotalRankOfGuild(guildId);
    if(karma === null) throw new Error("guild not found");
    karma = parseRankKarma(karma);
    return karma;
  },

  async getTopUsers(count){
    if(!count) return [];
    let res = await karmaReader.getTopUsers(count);
    if(res.length === 0) return [];
    let finalArray = [];
    for(let i = 0; i < res.length; i += 2){
      if(!await configReader.isUserDisabled(res[i])){
        finalArray.push({
          karma: parseKarma(res[i + 1]),
          userId: res[i]
        });
      }
    }

    //This while loop is necessary to extend the finalArray with more users if at least one user is disabled in res so we still get the desired count
    let offset = 1;
    while(finalArray.length < count){
      let res2 = await karmaReader.getTopUserByIndex(finalArray.length + 1 + offset);
      if(res2.length === 0) break;
      if(await configReader.isUserDisabled(res2[0])){
        offset++;
      }else{
        finalArray.push({
          karma: parseKarma(res2[1]),
          userId: res2[0]
        });
      }
    }

    return finalArray;
  },

  async getTopUsersOfGuild(count, guildId){
    if(!count) return [];
    await throwIfGuildDisabled(guildId);
    let res = await karmaReader.getTopUsersOfGuild(count, guildId);
    if(res.length === 0) return[];
    let finalArray = [];
    for(let i = 0; i < res.length; i += 2){
      if(!(await configReader.isUserDisabled(res[i]) || await configReader.isGuildDisabledInUser(res[i], guildId))){
        finalArray.push({
          karma: parseKarma(res[i + 1]),
          userId: res[i]
        });
      }
    }

    //This while loop is necessary to extend the finalArray with more users if at least one user is disabled in res so we still get the desired count
    let offset = 1;
    while(finalArray.length < count) {
      let res2 = await karmaReader.getTopUserOfGuildByIndex(finalArray.length + 1 + offset, guildId);
      if(res2.length === 0) break;
      if(await configReader.isUserDisabled(res2[0]) || await configReader.isGuildDisabledInUser(res2[0], guildId)) {
        offset++;
      } else {
        finalArray.push({
          karma: parseKarma(res2[1]),
          userId: res2[0]
        });
      }
    }

    return finalArray;
  },

  async getTopUsersOfGuildTotal(count, guildId){
    if(!count) return [];
    await throwIfGuildDisabled(guildId);

    let userIds = await karmaReader.getUsersOfGuild(guildId);
    
    let finalArray = [];
    await Promise.all(userIds.map(async userId => {
      if(await configReader.isUserDisabled(userId) || await configReader.isGuildDisabledInUser(userId, guildId)) return;
      let karma = await karmaReader.getTotalKarmaOfUser(userId);
      finalArray.push({
        karma: parseKarma(karma),
        userId: userId
      });
    }));
    
    finalArray.sort((a, b) => {
      if(a.karma !== b.karma){
        return b.karma - a.karma;
      }else{
        return Number(BigInt(b.userId) - BigInt(a.userId));
      }
    });
    finalArray = finalArray.slice(0, count);
    return finalArray;
  },

  async getTopGuilds(count){
    if(!count) return [];
    let res = await karmaReader.getTopGuilds(count);
    if(res.length === 0) return [];
    let finalArray = [];
    for(let i = 0; i < res.length; i += 2) {
      if(!await configReader.isGuildDisabled(res[i])) {
        finalArray.push({
          karma: parseKarma(res[i + 1]),
          guildId: res[i]
        });
      }
    }

    if(res.length < count) return finalArray;

    //This while loop is necessary to extend the finalArray with more guilds if at least one guild is disabled in res so we still get the desired count
    let offset = 1;
    while(finalArray.length < count) {
      let nextGuild = await karmaReader.getTopGuildByIndex(finalArray.length + offset + 1);
      if(nextGuild.length === 0) break;
      if(await configReader.isGuildDisabled(nextGuild[0])) {
        offset++;
      }else {
        finalArray.push({
          karma: parseKarma(nextGuild[1]),
          guildId: nextGuild[0]
        });
      }
    }

    return finalArray;
  }
}
function parseRankKarma(karma){
  return parseKarma(karma) + 1;
}

function parseKarma(karma){
  karma = Number.parseInt(karma);
  if(Number.isNaN(karma)) karma = 0;
  return karma;
}

async function throwIfUserDisabled(userId){
  if(await configReader.isUserDisabled(userId)) throw new Error("user is disabled");
}

async function throwIfUserDisabledGuild(userId, guildId){
  if(await configReader.isGuildDisabledInUser(userId, guildId)) throw new Error("user has disabled guild");
}

async function throwIfGuildDisabled(guildId){
  if(await configReader.isGuildDisabled(guildId)) throw new Error("guild is disabled");
}