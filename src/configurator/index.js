import configurator from "./configurator.js";

export default async () => {
  await configurator.connect(global.CONFIG.redisIp, global.CONFIG.redisPort);
  console.log("configurator connected to redis");
}