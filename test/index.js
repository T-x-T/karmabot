import fs from "fs";

global.ENVIRONMENT = "testing";
global.CONFIG = JSON.parse(fs.readFileSync(`./config.${global.ENVIRONMENT}.json`));

import karmaUpdater from "../src/karmaUpdater/test.js";
import karmaRetriever from "../src/karmaRetriever/test.js";
import configurator from "../src/configurator/test.js";
import historyRetriever from "../src/historyRetriever/test.js";

describe("karmaUpdater", function(){
  karmaUpdater(global.CONFIG.redisIp, global.CONFIG.redisPort);
});

describe("karmaRetriever", function(){
  karmaRetriever(global.CONFIG.redisIp, global.CONFIG.redisPort);
});

describe("configurator", function(){
  configurator(global.CONFIG.redisIp, global.CONFIG.redisPort);
});

describe("historyRetriever", function(){
  historyRetriever(global.CONFIG.redisIp, global.CONFIG.redisPort);
})