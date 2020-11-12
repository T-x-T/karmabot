import login from "./reactionCollector.js";
import {connect} from "./karmaUpdater.js";

export default async () => {
  let token = global.CONFIG.botToken;
  login(token);
  
  try{
    await connect(global.CONFIG.redisIp, global.CONFIG.redisPort);
    console.log("karmaUpdater connected to redis");
  }catch(e){
    console.error("karmaUpdater failed to connect to redis:", e);
  }
};