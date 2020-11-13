import fs from "fs";
import setupKarmaUpdater from "./src/karmaUpdater/index.js";
import setupKarmaRetriever from "./src/karmaRetriever/index.js";

global.ENVIRONMENT = process.env.NODE_ENV ? process.env.NODE_ENV : "staging";
global.CONFIG = JSON.parse(fs.readFileSync(`./config.${global.ENVIRONMENT}.json`));

setupKarmaUpdater();
setupKarmaRetriever();