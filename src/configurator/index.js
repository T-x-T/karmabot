import configurator from "./configurator.js";
import discordConfigCommands from "./discordConfigCommands.js";
import configReaderWriter from "./configReaderWriter.js";

export default async (discordClient, botPrefix, redisIp, redisPort) => {
  await configReaderWriter.connect(redisIp, redisPort);
  await configurator.connect(configReaderWriter);
  console.log("configurator connected to redis");

  discordConfigCommands(discordClient, botPrefix);
}