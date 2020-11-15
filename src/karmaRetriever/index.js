import karmaRetriever from "./karmaRetriever.js";
import discordRetrievalCommands from "./discordRetrievalCommands.js";

export default async (discordClient) => {
  try{
    await karmaRetriever.connect(global.CONFIG.redisIp, global.CONFIG.redisPort);
    console.log("karmaRetriever connected to redis");
    
    discordRetrievalCommands(discordClient, global.CONFIG.botPrefix);
  }catch(e){
    console.log("karmaRetriever failed to connect to redis:", e);
  }
}