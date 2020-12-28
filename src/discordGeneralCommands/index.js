import infoReader from "./infoReader.js";
import discodGeneralCommands from "./discordGeneralCommands.js";

export default async (discordClient, discordPrefix, redisIp, redisPort) => {
  infoReader.connect(redisIp, redisPort);
  discodGeneralCommands(discordClient, discordPrefix, infoReader);
}