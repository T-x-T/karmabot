import fs from "fs";
import setupKarmaUpdater from "./src/karmaUpdater/index.js";
import setupKarmaRetriever from "./src/karmaRetriever/index.js";

global.ENVIRONMENT = process.env.NODE_ENV ? process.env.NODE_ENV : "staging";
global.CONFIG = JSON.parse(fs.readFileSync(`./config.${global.ENVIRONMENT}.json`));

import Discord from "discord.js";
const discordClient = new Discord.Client({
  partials: ['USER', 'REACTION', 'MESSAGE']
});
discordClient.login(global.CONFIG.botToken).then(() => {
  console.log("discordClient logged in");
  setupKarmaUpdater(discordClient);
  setupKarmaRetriever(discordClient);
});