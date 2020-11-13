import assert from "assert";

import Redis from "ioredis";
let redis;

import karmaRetriever from "./karmaRetriever.js";

let srcUserId = "293029505457586176";
let targetUserId = "607502693514084352";
let guildId = "592303011947216896";

export default function(redisIp, redisPort){
  before("setup", function() {
    return new Promise(async (resolve, reject) => {
      await karmaRetriever.connect(redisIp, redisPort);
      console.log("\t[before] karmaUpdater connected");

      redis = new Redis(redisIp, redisPort);
      redis.once("ready", () => {
        console.log("\t[before] redis connected");
        resolve();
      });
      redis.once("error", e => {
        console.log(e);
        reject();
      });
    });
  });

  beforeEach("clear redis", async function() {
    await clearRedis();
  });

  after("clear redis after", async function() {
    await clearRedis();
  });

  async function clearRedis() {
    await redis.flushall();
  }

  
  describe("getTotalKarmaOfUser", function(){
    it("returns values -10 to 10 correctly", async function(){
      for(let i = -10; i <= 10; i++){
        await redis.zadd("userkarma", i, targetUserId);
        let res = await karmaRetriever.getTotalKarmaOfUser(targetUserId);
        assert.strictEqual(res, i);
      }
    });

    it("returns 0 if user has no karma", async function(){
      let res = await karmaRetriever.getTotalKarmaOfUser(targetUserId);
      assert.strictEqual(res, 0);
    });

    it("throws when targetUser is disabled", async function(){
      await redis.set(`${targetUserId}:config:disabled`, true);
      await redis.zadd("userkarma", 0, targetUserId);
      await assert.rejects(async () => await karmaRetriever.getTotalKarmaOfUser(targetUserId), new Error("user is disabled"));
    });
  });

  describe("getTotalKarmaOfUserInGuild", function() {
    it("returns values -10 to 10 correctly", async function() {
      for(let i = -10; i <= 10; i++) {
        await redis.zadd(`${guildId}:userkarma`, i, targetUserId);
        let res = await karmaRetriever.getTotalKarmaOfUserInGuild(targetUserId, guildId);
        assert.strictEqual(res, i);
      }
    });

    it("returns 0 if user has no karma", async function() {
      let res = await karmaRetriever.getTotalKarmaOfUserInGuild(targetUserId, guildId);
      assert.strictEqual(res, 0);
    });

    it("returns 0 when user has karma in another guild", async function(){
      await redis.zadd(`${guildId+1}:userkarma`, 1, targetUserId);
      let res = await karmaRetriever.getTotalKarmaOfUserInGuild(targetUserId, guildId);
      assert.strictEqual(res, 0);
    });

    it("throws when targetUser is disabled", async function() {
      await redis.set(`${targetUserId}:config:disabled`, true);
      await redis.zadd(`${guildId}:userkarma`, 0, targetUserId);
      await assert.rejects(async () => await karmaRetriever.getTotalKarmaOfUserInGuild(targetUserId, guildId), new Error("user is disabled"));
    });

    it("throws when guild is disabled in targetUsers config", async function() {
      await redis.sadd(`${targetUserId}:config:disabledguilds`, guildId);
      await redis.zadd(`${guildId}:userkarma`, 0, targetUserId);
      await assert.rejects(async () => await karmaRetriever.getTotalKarmaOfUserInGuild(targetUserId, guildId), new Error("guild is disabled in user"));
    });
  });

  describe("getTotalKarmaOfGuild", function(){
    it("returns values -10 to 10 correctly", async function() {
      for(let i = -10; i <= 10; i++) {
        await redis.zadd("guildkarma", i, guildId);
        let res = await karmaRetriever.getTotalKarmaOfGuild(guildId);
        assert.strictEqual(res, i);
      }
    });

    it("returns 0 if guild has no karma", async function() {
      let res = await karmaRetriever.getTotalKarmaOfGuild(guildId);
      assert.strictEqual(res, 0);
    });

    it("throws when guild is disabled", async function(){
      await redis.set(`${guildId}:config:disabled`, true);
      await redis.zadd("guildkarma", 0, guildId);
      await assert.rejects(async () => await karmaRetriever.getTotalKarmaOfGuild(guildId), new Error("guild is disabled"));
    });
  });
}