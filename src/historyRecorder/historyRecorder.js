import karmaReaderWriter from "./karmaReaderWriter.js";

export default {
  async connect(redisIp, redisPort){
    await karmaReaderWriter.connect(redisIp, redisPort);
  },

  async executeTick(){
    await Promise.all([
      updateUserKarma(),
      updateGuildKarma(),
      updateUserKarmaInGuild(),
      updateTotalKarma()
    ]);
  }
}

async function updateUserKarma(){
  const userKarma = await karmaReaderWriter.getAllUserKarma();
  const historyObjects = userKarma.map(a => ({timestamp: Date.now(), karma: a.karma, userId: a.userId}));
  await karmaReaderWriter.writeUserKarmaHistory(historyObjects);
}

async function updateGuildKarma(){
  const guildKarma = await karmaReaderWriter.getAllGuildKarma();
  const historyObjects = guildKarma.map(a => ({timestamp: Date.now(), karma: a.karma, guildId: a.guildId}));
  await karmaReaderWriter.writeGuildKarmaHistory(historyObjects);
}

async function updateUserKarmaInGuild(){
  const karmaInGuildObjects = await karmaReaderWriter.getAllUserKarmaInAllGuilds();
  const historyObjects = karmaInGuildObjects.map(a => {
    a.timestamp = Date.now();
    return a;
  });
  await karmaReaderWriter.writeUserKarmaInGuildHistory(historyObjects);
}

async function updateTotalKarma(){
  const totalKarma = await karmaReaderWriter.getTotalKarma();
  const historyObject = {timestamp: Date.now(), karma: totalKarma};
  await karmaReaderWriter.writeTotalKarmaHistory(historyObject);
}