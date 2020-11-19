import configurator from "./configurator.js";
import discordConfigCommands from "./discordConfigCommands.js";

export default async (discordClient) => {
  await configurator.connect(global.CONFIG.redisIp, global.CONFIG.redisPort);
  console.log("configurator connected to redis");

  discordConfigCommands(discordClient, global.CONFIG.botPrefix);
}