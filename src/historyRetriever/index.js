import setupWebApi from "./webApi.js";
import historyReader from "./historyReader.js";
import configReader from "./configReader.js";
import historyRetriever from "./historyRetriever.js";

export default async (redisIp, redisPort) => {
  await Promise.all([
    historyReader.connect(redisIp, redisPort),
    configReader.connect(redisIp, redisPort)
  ]);
  
  historyRetriever.connect(historyReader, configReader);
  setupWebApi(historyRetriever);
}