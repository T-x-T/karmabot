import fs from "fs";
import setupKarmaUpdater from "./src/karmaUpdater/index.js";
import setupKarmaRetriever from "./src/karmaRetriever/index.js";
import setupConfigurator from "./src/configurator/index.js";

global.ENVIRONMENT = process.env.NODE_ENV ? process.env.NODE_ENV : "staging";
global.CONFIG = JSON.parse(fs.readFileSync(`./config.${global.ENVIRONMENT}.json`));

import Discord from "discord.js";
const discordClient = new Discord.Client({
  partials: ['USER', 'REACTION', 'MESSAGE']
});
discordClient.login(global.CONFIG.botToken).then(async () => {
  console.log("discordClient logged in");
  await Promise.all([
    setupKarmaUpdater(discordClient),
    setupKarmaRetriever(discordClient),
    setupConfigurator(),
  ]);
  console.log("everything logged in, lets go!");
});