import login from "./reactionCollector.js";
import {connect} from "./karmaUpdater.js";

export default async () => {
  let token = global.CONFIG.botToken;
  login(token);
  
  try{
    await connect(global.CONFIG.redisIp, global.CONFIG.redisPort);
    console.log("Redis connected");
  }catch(e){
    console.error("Redis couldnt connect:", e);
  }
};