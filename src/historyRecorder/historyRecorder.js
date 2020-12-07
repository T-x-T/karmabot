import karmaReaderWriter from "./karmaReaderWriter.js";

export default {
  async connect(redisIp, redisPort){
    await karmaReaderWriter.connect(redisIp, redisPort);
    updateUserKarma()
  },

  async executeTick(){
    await Promise.all([
      updateUserKarma(),
      updateGuildKarma(),
      updateUserKarmaInGuild()
    ]);
  }
}

async function updateUserKarma(){
  const userKarma = await karmaReaderWriter.getAllUserKarma();
  let historyObjects = userKarma.map(a => ({timestamp: Date.now(), karma: a.karma, userId: a.userId}));
  await karmaReaderWriter.writeUserKarmaHistory(historyObjects);
}

async function updateGuildKarma(){

}

async function updateUserKarmaInGuild(){

}