import karmaUpdater from "../src/karmaUpdater/test.js";
import fs from "fs";

global.ENVIRONMENT = "testing";
global.CONFIG = JSON.parse(fs.readFileSync(`./config.${global.ENVIRONMENT}.json`));

describe("karmaUpdater", function(){
  karmaUpdater(global.CONFIG.redisIp, global.CONFIG.redisPort);
});