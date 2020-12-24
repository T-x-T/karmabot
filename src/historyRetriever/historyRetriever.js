let historyReader, configReader;

export default {
  async connect(_historyReader, _configReader) {
    historyReader = _historyReader;
    configReader = _configReader;
  },

  async getTotalKarmaHistory(hoursInPast) {
    const history = await historyReader.getTotalKarmaHistory(Date.now() - (hoursInPast * 60 * 60 * 1000));
    const hisotryObjects = history.map(a => {
      return {
        timestamp: a.timestamp,
        karma: a.karma
      };
    });
    return hisotryObjects;
  },

  async getUserKarmaHistory(hoursInPast, userId) {
    await throwIfUserDisabled(userId);
    const history = await historyReader.getUserKarmaHistory(Date.now() - (hoursInPast * 60 * 60 * 1000), userId);
    const hisotryObjects = history.map(a => {
      return {
        userId: userId,
        timestamp: a.timestamp,
        karma: a.karma
      };
    });
    return hisotryObjects;
  },

  async getGuildKarmaHistory(hoursInPast, guildId) {
    await throwIfGuildDisabled(guildId);
    const history = await historyReader.getGuildKarmaHistory(Date.now() - (hoursInPast * 60 * 60 * 1000), guildId);
    const hisotryObjects = history.map(a => {
      return {
        guildId: guildId,
        timestamp: a.timestamp,
        karma: a.karma
      };
    });
    return hisotryObjects;
  },

  async getUserInGuildKarmaHistory(hoursInPast, userId, guildId) {
    await Promise.all([throwIfUserDisabled(userId), throwIfGuildDisabled(guildId), throwIfUserDisabledGuild(userId, guildId)]);
    const history = await historyReader.getUserInGuildKarmaHistory(Date.now() - (hoursInPast * 60 * 60 * 1000), userId, guildId);
    const hisotryObjects = history.map(a => {
      return {
        userId: userId,
        guildId: guildId,
        timestamp: a.timestamp,
        karma: a.karma
      };
    });
    return hisotryObjects;
  },

  async getGuildKarmaOfAllGuildsOfUserHistory(hoursInPast, userId){
    await throwIfUserDisabled(userId);
    const guildsOfUser = await historyReader.getGuildsOfUser(userId);
    const resWithDisabledGuilds = await Promise.all(guildsOfUser.map(async (guildId) => {
      if(!await configReader.isGuildDisabled(guildId) && !await configReader.isGuildDisabledInUser(userId, guildId)) return {
        guildkarmaHistory: await this.getUserInGuildKarmaHistory(hoursInPast, userId, guildId),
        guildId: guildId
      }
    }));
    return resWithDisabledGuilds.filter(x => x && x.guildkarmaHistory.length > 0);
  },
  
  async getUserCountHistory(hoursInPast) {
    const history = await historyReader.getUserCountHistory(Date.now() - (hoursInPast * 60 * 60 * 1000));
    const hisotryObjects = history.map(a => {
      return {
        timestamp: a.timestamp,
        count: a.count
      };
    });
    return hisotryObjects;
  },

  async getGuildCountHistory(hoursInPast) {
    const history = await historyReader.getGuildCountHistory(Date.now() - (hoursInPast * 60 * 60 * 1000));
    const hisotryObjects = history.map(a => {
      return {
        timestamp: a.timestamp,
        count: a.count
      };
    });
    return hisotryObjects;
  }
}

async function throwIfUserDisabled(userId) {
  if(await configReader.isUserDisabled(userId)) throw new Error("user is disabled");
}

async function throwIfUserDisabledGuild(userId, guildId) {
  if(await configReader.isGuildDisabledInUser(userId, guildId)) throw new Error("user has disabled guild");
}

async function throwIfGuildDisabled(guildId) {
  if(await configReader.isGuildDisabled(guildId)) throw new Error("guild is disabled");
}