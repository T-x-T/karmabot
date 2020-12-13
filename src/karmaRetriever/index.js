import karmaRetriever from "./karmaRetriever.js";
import discordRetrievalCommands from "./discordRetrievalCommands.js";
import discordFetcher from "./discordFetcher.js";
import karmaReader from "./karmaReader.js";
import configReader from "./configReader.js";

export default async (discordClient, botPrefix, redisIp, redisPort) => {
  try{
    await karmaReader.connect(redisIp, redisPort);
    await configReader.connect(redisIp, redisPort);
    await karmaRetriever.connect(karmaReader, configReader);
    console.log("karmaRetriever connected to redis");
    
    discordRetrievalCommands(discordClient, botPrefix);
    discordFetcher.connect(discordClient);
  }catch(e){
    console.log("karmaRetriever failed to connect to redis:", e);
  }
}