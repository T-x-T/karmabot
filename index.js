import fs from "fs";
import Discord from "discord.js";
import setupKarmaUpdater from "./src/karmaUpdater/index.js";
import setupKarmaRetriever from "./src/karmaRetriever/index.js";
import setupConfigurator from "./src/configurator/index.js";
import setupDiscordGeneralCommands from "./src/discordGeneralCommands/discordGeneralCommands.js";
import setupApiWebserver from "./src/webApi/index.js";
import setupHistoryRecorder from "./src/historyRecorder/index.js";
import setupHistoryRetriever from "./src/historyRetriever/index.js";
import setupAuth from "./src/auth/index.js";

import {exec} from "child_process";


global.ENVIRONMENT = process.env.NODE_ENV ? process.env.NODE_ENV : "staging";
const config = JSON.parse(fs.readFileSync(`./config.${global.ENVIRONMENT}.json`));

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

setupApiWebserver(config.apiPort);

const discordClient = new Discord.Client({
  partials: ['USER', 'REACTION', 'MESSAGE']
});
discordClient.login(config.botToken).then(async () => {
  console.log("discordClient logged in");
  await Promise.all([
    setupKarmaUpdater(discordClient, config.redisIp, config.redisPort),
    setupKarmaRetriever(discordClient, config.botPrefix, config.redisIp, config.redisPort),
    setupConfigurator(discordClient, config.botPrefix, config.redisIp, config.redisPort),
    setupDiscordGeneralCommands(discordClient, config.botPrefix),
    setupHistoryRecorder(config.redisIp, config.redisPort),
    setupHistoryRetriever(config.redisIp, config.redisPort),
    setupAuth(config.clientId, config.clientSecret, config.redirectUri, config.baseUrl)
  ]);
  console.log("everything logged in, lets go!");
});