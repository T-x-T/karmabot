import login from "./reactionCollector.js";
import {connect} from "./karmaUpdater.js";

export default async (discordClient) => {
  login(discordClient);
  
  try{
    await connect(global.CONFIG.redisIp, global.CONFIG.redisPort);
    console.log("karmaUpdater connected to redis");
  }catch(e){
    console.error("karmaUpdater failed to connect to redis:", e);
  }
};