import fs from "fs";
import Discord from "discord.js";
import setupKarmaUpdater from "./src/karmaUpdater/index.js";
import setupKarmaRetriever from "./src/karmaRetriever/index.js";
import setupConfigurator from "./src/configurator/index.js";
import setupDiscordGeneralCommands from "./src/discordGeneralCommands/discordGeneralCommands.js";
import setupApiWebserver from "./src/webApi/index.js";
import setupHistoryRecorder from "./src/historyRecorder/index.js";

import {exec} from "child_process";


global.ENVIRONMENT = process.env.NODE_ENV ? process.env.NODE_ENV : "staging";
global.CONFIG = JSON.parse(fs.readFileSync(`./config.${global.ENVIRONMENT}.json`));

try{
  exec("npm run nuxt_start", (err, stdOut, stdErr) => {
    if(err) {
      console.log(err);
    } else {
      console.log("nuxt started");
    }
    if(stdOut) console.log("StdOut:", stdOut);
    if(stdErr) console.log("StdErr:",stdErr);
  });
}catch(e){
  console.log("Couldnt start nuxt:", e)
}
//exec("nuxt start -c nuxt.config.mjs -H 0.0.0.0 -p 4004")
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
    setupDiscordGeneralCommands(discordClient, global.CONFIG.botPrefix),
    setupHistoryRecorder(global.CONFIG.redisIp, global.CONFIG.redisPort)
  ]);
  console.log("everything logged in, lets go!");
});