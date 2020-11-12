import fs from "fs";

global.ENVIRONMENT = "testing";
global.CONFIG = JSON.parse(fs.readFileSync(`./config.${global.ENVIRONMENT}.json`));

import karmaUpdater from "../src/karmaUpdater/test.js";
import karmaAndTopListRetriever from "../src/karmaAndTopListRetriever/test.js";

describe("karmaUpdater", function(){
  karmaUpdater(global.CONFIG.redisIp, global.CONFIG.redisPort);
});

describe("karmaAndTopListRetriever", function(){
  karmaAndTopListRetriever(global.CONFIG.redisIp, global.CONFIG.redisPort);
});