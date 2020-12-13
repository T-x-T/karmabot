import reactionCollector from "./reactionCollector.js";
import {connect} from "./karmaUpdater.js";
import karmaWriter from "./karmaWriter.js";
import configReader from "./configReader.js";

export default async (discordClient, redisIp, redisPort) => {
  try {
    reactionCollector(discordClient);
    await karmaWriter.connect(redisIp, redisPort);
    await configReader.connect(redisIp, redisPort);
    
    await connect(karmaWriter, configReader);
    console.log("karmaUpdater connected");
  } catch(e) {
    console.error("karmaUpdater failed to connect:", e);
  }
};