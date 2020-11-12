import karmaRetriever from "./karmaRetriever.js";

export default async () => {
  try{
    await karmaRetriever.connect(global.CONFIG.redisIp, global.CONFIG.redisPort);
    console.log("karmaAndTopListRetriever connected to redis");
  }catch(e){
    console.log("karmaAndTopListRetriever failed to connect to redis:", e);
  }
}