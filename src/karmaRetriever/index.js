import karmaRetriever from "./karmaRetriever.js";

export default async () => {
  try{
    await karmaRetriever.connect(global.CONFIG.redisIp, global.CONFIG.redisPort);
    console.log("karmaRetriever connected to redis");
  }catch(e){
    console.log("karmaRetriever failed to connect to redis:", e);
  }
}