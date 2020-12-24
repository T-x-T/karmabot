import setupWebApi from "./webApi.js";
import historyReader from "./historyReader.js";
import configReader from "./configReader.js";
import historyRetriever from "./historyRetriever.js";
import discordFetcher from "./discordFetcher.js";

export default async (redisIp, redisPort, discordClient) => {
  await Promise.all([
    historyReader.connect(redisIp, redisPort),
    configReader.connect(redisIp, redisPort)
  ]);
  
  discordFetcher.connect(discordClient);
  historyRetriever.connect(historyReader, configReader);
  setupWebApi(historyRetriever, discordFetcher);
}