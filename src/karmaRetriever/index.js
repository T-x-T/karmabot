import karmaRetriever from "./karmaRetriever.js";
import discordRetrievalCommands from "./discordRetrievalCommands.js";
import discordFetcher from "./discordFetcher.js";

export default async (discordClient) => {
  try{
    await karmaRetriever.connect(global.CONFIG.redisIp, global.CONFIG.redisPort);
    console.log("karmaRetriever connected to redis");
    
    discordRetrievalCommands(discordClient, global.CONFIG.botPrefix);
    discordFetcher.connect(discordClient);
  }catch(e){
    console.log("karmaRetriever failed to connect to redis:", e);
  }
}