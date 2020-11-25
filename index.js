import fs from "fs";
import Discord from "discord.js";
import setupKarmaUpdater from "./src/karmaUpdater/index.js";
import setupKarmaRetriever from "./src/karmaRetriever/index.js";
import setupConfigurator from "./src/configurator/index.js";
import setupDiscordGeneralCommands from "./src/discordGeneralCommands/discordGeneralCommands.js";
import setupApiWebserver from "./src/webApi/index.js";

import {exec} from "child_process";


global.ENVIRONMENT = process.env.NODE_ENV ? process.env.NODE_ENV : "staging";
global.CONFIG = JSON.parse(fs.readFileSync(`./config.${global.ENVIRONMENT}.json`));

exec("npm run nuxt_start");
setupApiWebserver(global.CONFIG.apiPort);

const discordClient = new Discord.Client({
  partials: ['USER', 'REACTION', 'MESSAGE']
});
discordClient.login(global.CONFIG.botToken).then(async () => {
  console.log("discordClient logged in");
  await Promise.all([
    setupKarmaUpdater(discordClient),
    setupKarmaRetriever(discordClient),
    setupConfigurator(discordClient),
    setupDiscordGeneralCommands(discordClient, global.CONFIG.botPrefix)
  ]);
  console.log("everything logged in, lets go!");
});