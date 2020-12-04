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
      await assert.rejects(async () => await karmaRetriever.getTotalKarmaOfUserInGuild(targetUserId, guildId), new Error("user has disabled guild"));
    });

    it("throws if guild is disabled", async function() {
      await redis.set(`${guildId}:config:disabled`, true);
      await redis.zadd(`${guildId}:userkarma`, 0, targetUserId);
      await assert.rejects(async () => await karmaRetriever.getTotalKarmaOfUserInGuild(targetUserId, guildId), new Error("guild is disabled"));
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

  describe("getTotalRankOfUser", function(){
    it("returns correct rank", async function(){
      await redis.zadd("userkarma", 10, targetUserId);
      await redis.zadd("userkarma", -10, targetUserId+1);
      await redis.zadd("userkarma", 6, targetUserId+2);
      await redis.zadd("userkarma", 0, targetUserId+3);
      await redis.zadd("userkarma", 0, targetUserId+4);

      let res1 = await karmaRetriever.getTotalRankOfUser(targetUserId);
      assert.strictEqual(res1, 1);

      let res2 = await karmaRetriever.getTotalRankOfUser(targetUserId+1);
      assert.strictEqual(res2, 5);
    });

    it("returns 1 with single user in db", async function(){
      await redis.zadd("userkarma", 0, targetUserId);
      let res = await karmaRetriever.getTotalRankOfUser(targetUserId);
      assert.strictEqual(res, 1);
    });

    it("throws when user doesnt exist", async function(){
      await redis.zadd("userkarma", 0, targetUserId);
      await assert.rejects(async () => await karmaRetriever.getTotalRankOfUser(targetUserId + 1), new Error("user not found"));
    });

    it("throws when user is disabled", async function(){
      await redis.zadd("userkarma", 0, targetUserId);
      await redis.set(`${targetUserId}:config:disabled`, true);
      await assert.rejects(async () => await karmaRetriever.getTotalRankOfUser(targetUserId), new Error("user is disabled"));
    });
  });

  describe("getGuildRankOfUser", function(){
    it("returns correct rank with only one guild", async function() {
      await redis.zadd(`${guildId}:userkarma`, 10, targetUserId);
      await redis.zadd(`${guildId}:userkarma`, -10, targetUserId + 1);
      await redis.zadd(`${guildId}:userkarma`, 6, targetUserId + 2);
      await redis.zadd(`${guildId}:userkarma`, 0, targetUserId + 3);
      await redis.zadd(`${guildId}:userkarma`, 0, targetUserId + 4);

      let res1 = await karmaRetriever.getGuildRankOfUser(targetUserId, guildId);
      assert.strictEqual(res1, 1);

      let res2 = await karmaRetriever.getGuildRankOfUser(targetUserId + 1, guildId);
      assert.strictEqual(res2, 5);
    });

    it("returns 1 with single user in db", async function() {
      await redis.zadd(`${guildId}:userkarma`, 0, targetUserId);
      let res = await karmaRetriever.getGuildRankOfUser(targetUserId, guildId);
      assert.strictEqual(res, 1);
    });

    it("returns 1 with one member in guild and another in a different guild", async function(){
      await redis.zadd(`${guildId}:userkarma`, 0, targetUserId);
      await redis.zadd(`${guildId + 1}:userkarma`, 10, targetUserId + 1);

      let res = await karmaRetriever.getGuildRankOfUser(targetUserId, guildId);
      assert.strictEqual(res, 1);
    });

    it("returns correct rank when user also has karma in different guild", async function(){
      await redis.zadd(`${guildId}:userkarma`, -10, targetUserId);
      await redis.zadd(`${guildId}:userkarma`, 6, targetUserId + 2);
      await redis.zadd(`${guildId}:userkarma`, 0, targetUserId + 3);
      await redis.zadd(`${guildId + 1}:userkarma`, 10, targetUserId);
      await redis.zadd(`${guildId + 1}:userkarma`, 100, targetUserId + 4);

      let res = await karmaRetriever.getGuildRankOfUser(targetUserId, guildId);
      assert.strictEqual(res, 3);
    });

    it("throws when user doesnt exist", async function() {
      await redis.zadd(`${guildId}:userkarma`, 0, targetUserId);
      await assert.rejects(async () => karmaRetriever.getGuildRankOfUser(targetUserId + 1, guildId), new Error("user not found"));
    });

    it("throws when user is disabled", async function() {
      await redis.zadd(`${guildId}:userkarma`, -10, targetUserId);
      await redis.set(`${targetUserId}:config:disabled`, true);
      await assert.rejects(async () => await karmaRetriever.getGuildRankOfUser(targetUserId, guildId), new Error("user is disabled"));
    });

    it("throws if guild is disabled in user", async function(){
      await redis.zadd(`${guildId}:userkarma`, -10, targetUserId);
      await redis.sadd(`${targetUserId}:config:disabledguilds`, guildId);
      await assert.rejects(async () => await karmaRetriever.getGuildRankOfUser(targetUserId, guildId), new Error("user has disabled guild"));
    });

    it("throws if guild is disabled", async function() {
      await redis.zadd(`${guildId}:userkarma`, -10, targetUserId);
      await redis.set(`${guildId}:config:disabled`, true);
      await assert.rejects(async () => await karmaRetriever.getGuildRankOfUser(targetUserId, guildId), new Error("guild is disabled"));
    });
  });

  describe("getTotalGuildRankOfUser", function(){
    it("returns correct rank with only one guild", async function() {
      await redis.zadd("userkarma", 12, targetUserId);
      await redis.sadd(`${guildId}:users`, targetUserId);
      await redis.zadd("userkarma", 50, targetUserId + 1);
      await redis.sadd(`${guildId}:users`, targetUserId + 1);
      await redis.zadd("userkarma", 0, targetUserId + 2);
      await redis.sadd(`${guildId}:users`, targetUserId + 2);
      await redis.zadd("userkarma", -12, targetUserId + 3);
      await redis.sadd(`${guildId}:users`, targetUserId + 3);

      let res1 = await karmaRetriever.getTotalGuildRankOfUser(targetUserId, guildId);
      assert.strictEqual(res1, 2);

      let res2 = await karmaRetriever.getTotalGuildRankOfUser(targetUserId + 2, guildId);
      assert.strictEqual(res2, 3);
    });

    it("returns 1 with single user in db", async function() {
      await redis.zadd("userkarma", 12, targetUserId);
      await redis.sadd(`${guildId}:users`, targetUserId);
      let res = await karmaRetriever.getTotalGuildRankOfUser(targetUserId, guildId);
      assert.strictEqual(res, 1);
    });

    it("returns 1 with one member in guild and another in a different guild", async function() {
      await redis.zadd("userkarma", 12, targetUserId);
      await redis.sadd(`${guildId}:users`, targetUserId);
      await redis.zadd("userkarma", 123, targetUserId + 1);
      await redis.sadd(`${guildId + 1}:users`, targetUserId + 1);

      let res = await karmaRetriever.getTotalGuildRankOfUser(targetUserId, guildId);
      assert.strictEqual(res, 1);
    });

    it("throws when user doesnt exist", async function() {
      await redis.zadd("userkarma", 12, targetUserId);
      await redis.sadd(`${guildId}:users`, targetUserId);
      await assert.rejects(async () => karmaRetriever.getTotalGuildRankOfUser(targetUserId + 1, guildId), new Error("user not found"));
    });

    it("returns correct rank with two guilds", async function() {
      await redis.zadd("userkarma", 12, targetUserId);
      await redis.sadd(`${guildId}:users`, targetUserId);
      await redis.zadd("userkarma", 50, targetUserId + 1);
      await redis.sadd(`${guildId}:users`, targetUserId + 1);
      await redis.zadd("userkarma", 0, targetUserId + 2);
      await redis.sadd(`${guildId}:users`, targetUserId + 2);
      await redis.zadd("userkarma", -12, targetUserId + 3);
      await redis.sadd(`${guildId}:users`, targetUserId + 3);

      await redis.sadd(`${guildId + 1}:users`, targetUserId);
      await redis.sadd(`${guildId + 1}:users`, targetUserId + 3);
      await redis.zadd("userkarma", 10000, targetUserId + 4);
      await redis.sadd(`${guildId + 1}:users`, targetUserId + 4);

      let res1 = await karmaRetriever.getTotalGuildRankOfUser(targetUserId, guildId);
      assert.strictEqual(res1, 2);

      let res2 = await karmaRetriever.getTotalGuildRankOfUser(targetUserId + 2, guildId);
      assert.strictEqual(res2, 3);
    });

    it("throws when user is disabled", async function() {
      await redis.zadd("userkarma", 12, targetUserId);
      await redis.sadd(`${guildId}:users`, targetUserId);
      await redis.set(`${targetUserId}:config:disabled`, true);
      await assert.rejects(async () => await karmaRetriever.getTotalGuildRankOfUser(targetUserId, guildId), new Error("user is disabled"));
    });

    it("throws if guild is disabled in user", async function() {
      await redis.zadd("userkarma", 12, targetUserId);
      await redis.sadd(`${guildId}:users`, targetUserId);
      await redis.sadd(`${targetUserId}:config:disabledguilds`, guildId);
      await assert.rejects(async () => await karmaRetriever.getTotalGuildRankOfUser(targetUserId, guildId), new Error("user has disabled guild"));
    });

    it("throws if guild is disabled", async function() {
      await redis.zadd("userkarma", 12, targetUserId);
      await redis.sadd(`${guildId}:users`, targetUserId);
      await redis.set(`${guildId}:config:disabled`, true);
      await assert.rejects(async () => await karmaRetriever.getTotalGuildRankOfUser(targetUserId, guildId), new Error("guild is disabled"));
    });
  });

  describe("getTotalGuildRank", function(){
    it("returns correct rank", async function() {
      await redis.zadd("guildkarma", 10, guildId);
      await redis.zadd("guildkarma", -10, guildId + 1);
      await redis.zadd("guildkarma", 6, guildId + 2);
      await redis.zadd("guildkarma", 0, guildId + 3);
      await redis.zadd("guildkarma", 0, guildId + 4);

      let res1 = await karmaRetriever.getTotalRankOfGuild(guildId);
      assert.strictEqual(res1, 1);

      let res2 = await karmaRetriever.getTotalRankOfGuild(guildId + 1);
      assert.strictEqual(res2, 5);
    });

    it("returns 1 with single guild in db", async function() {
      await redis.zadd("guildkarma", 0, guildId);
      let res = await karmaRetriever.getTotalRankOfGuild(guildId);
      assert.strictEqual(res, 1);
    });

    it("throws when guild doesnt exist", async function() {
      await redis.zadd("guildkarma", 0, guildId);
      await assert.rejects(async () => karmaRetriever.getTotalRankOfGuild(guildId + 1), new Error("guild not found"));
    });

    it("throws if guild is disabled", async function() {
      await redis.zadd("guildkarma", 0, guildId);
      await redis.set(`${guildId}:config:disabled`, true);
      await assert.rejects(async () => await karmaRetriever.getTotalRankOfGuild(guildId), new Error("guild is disabled"));
    });
  });

  describe("getTopUsers", function(){
    it("returns array with 3 entries when count is 3", async function(){
      await redis.zadd("userkarma", 10, targetUserId);
      await redis.zadd("userkarma", -10, targetUserId + 1);
      await redis.zadd("userkarma", 6, targetUserId + 2);
      await redis.zadd("userkarma", 0, targetUserId + 3);
      await redis.zadd("userkarma", 0, targetUserId + 4);
      let res = await karmaRetriever.getTopUsers(3);
      assert.strictEqual(res.length, 3);
    });

    it("returns array sorted descending by karma with userIds", async function() {
      await redis.zadd("userkarma", 10, targetUserId);
      await redis.zadd("userkarma", -10, targetUserId + 1);
      await redis.zadd("userkarma", 6, targetUserId + 2);
      await redis.zadd("userkarma", 0, targetUserId + 3);
      await redis.zadd("userkarma", 0, targetUserId + 4);
      let res = await karmaRetriever.getTopUsers(3);
      assert.strictEqual(res[0].karma, 10);
      assert.strictEqual(res[0].userId, targetUserId);
      assert.strictEqual(res[1].karma, 6);
      assert.strictEqual(res[2].karma, 0);
    });

    it("returns user with higher userId first when there are multiple userIds with the same karma", async function(){
      await redis.zadd("userkarma", 10, targetUserId);
      await redis.zadd("userkarma", -10, targetUserId + 1);
      await redis.zadd("userkarma", 6, targetUserId + 2);
      await redis.zadd("userkarma", 0, targetUserId + 3);
      await redis.zadd("userkarma", 0, targetUserId + 4);
      let res = await karmaRetriever.getTopUsers(3);
      assert.strictEqual(res[2].userId, targetUserId + 4);
    });

    it("returns an empty array when there are no users", async function(){
      let res = await karmaRetriever.getTopUsers(3);
      assert.strictEqual(res.length, 0);
    });

    it("removes single disabled users from output and gets the next user on the top list", async function(){
      await redis.zadd("userkarma", 10, targetUserId);
      await redis.zadd("userkarma", -10, targetUserId + 1);
      await redis.zadd("userkarma", 6, targetUserId + 2);
      await redis.zadd("userkarma", 0, targetUserId + 3);
      await redis.zadd("userkarma", 0, targetUserId + 4);
      await redis.set(`${targetUserId + 4}:config:disabled`, true);
      let res = await karmaRetriever.getTopUsers(3);
      assert.strictEqual(res[2].userId, targetUserId + 3);
    });

    it("handles 3 disabled users", async function(){
      await redis.zadd("userkarma", 10, targetUserId);
      await redis.zadd("userkarma", -10, targetUserId + 1);
      await redis.zadd("userkarma", 6, targetUserId + 2);
      await redis.zadd("userkarma", 0, targetUserId + 3);
      await redis.zadd("userkarma", 0, targetUserId + 4);
      await redis.set(`${targetUserId}:config:disabled`, true);
      await redis.set(`${targetUserId + 3}:config:disabled`, true);
      await redis.set(`${targetUserId + 4}:config:disabled`, true);
      let res = await karmaRetriever.getTopUsers(3);
      assert.strictEqual(res[0].userId, targetUserId + 2);
      assert.strictEqual(res[1].userId, targetUserId + 1);
    });

    it("returns empty array with count 0", async function(){
      await redis.zadd("userkarma", 10, targetUserId);
      await redis.zadd("userkarma", -10, targetUserId + 1);
      let res = await karmaRetriever.getTopUsers(0);
      assert.strictEqual(res.length, 0);
    });

    it("returns all users when count is larger them number of total users", async function(){
      await redis.zadd("userkarma", 10, targetUserId);
      await redis.zadd("userkarma", -10, targetUserId + 1);
      await redis.zadd("userkarma", 6, targetUserId + 2);
      await redis.zadd("userkarma", 0, targetUserId + 3);
      await redis.zadd("userkarma", 0, targetUserId + 4);
      let res = await karmaRetriever.getTopUsers(10);
      assert.strictEqual(res.length, 5);
    });
  });

  describe("getTopUsersOfGuild", async function(){
    it("returns array with 3 entries when count is 3", async function() {
      await redis.zadd(`${guildId}:userkarma`, 10, targetUserId);
      await redis.zadd(`${guildId}:userkarma`, -10, targetUserId + 1);
      await redis.zadd(`${guildId}:userkarma`, 6, targetUserId + 2);
      await redis.zadd(`${guildId}:userkarma`, 0, targetUserId + 3);
      await redis.zadd(`${guildId}:userkarma`, 0, targetUserId + 4);
      let res = await karmaRetriever.getTopUsersOfGuild(3, guildId);
      assert.strictEqual(res.length, 3);
    });

    it("returns array sorted descending by karma with userIds", async function() {
      await redis.zadd(`${guildId}:userkarma`, 10, targetUserId);
      await redis.zadd(`${guildId}:userkarma`, -10, targetUserId + 1);
      await redis.zadd(`${guildId}:userkarma`, 6, targetUserId + 2);
      await redis.zadd(`${guildId}:userkarma`, 0, targetUserId + 3);
      await redis.zadd(`${guildId}:userkarma`, 0, targetUserId + 4);
      let res = await karmaRetriever.getTopUsersOfGuild(3, guildId);
      assert.strictEqual(res[0].karma, 10);
      assert.strictEqual(res[0].userId, targetUserId);
      assert.strictEqual(res[1].karma, 6);
      assert.strictEqual(res[2].karma, 0);
    });

    it("returns user with higher userId first when there are multiple userIds with the same karma", async function() {
      await redis.zadd(`${guildId}:userkarma`, 10, targetUserId);
      await redis.zadd(`${guildId}:userkarma`, -10, targetUserId + 1);
      await redis.zadd(`${guildId}:userkarma`, 6, targetUserId + 2);
      await redis.zadd(`${guildId}:userkarma`, 0, targetUserId + 3);
      await redis.zadd(`${guildId}:userkarma`, 0, targetUserId + 4);
      let res = await karmaRetriever.getTopUsersOfGuild(3, guildId);
      assert.strictEqual(res[2].userId, targetUserId + 4);
    });

    it("returns an empty array when there are no users", async function() {
      let res = await karmaRetriever.getTopUsersOfGuild(3, guildId);
      assert.strictEqual(res.length, 0);
    });

    it("removes single disabled users from output and gets the next user on the top list", async function() {
      await redis.zadd(`${guildId}:userkarma`, 10, targetUserId);
      await redis.zadd(`${guildId}:userkarma`, -10, targetUserId + 1);
      await redis.zadd(`${guildId}:userkarma`, 6, targetUserId + 2);
      await redis.zadd(`${guildId}:userkarma`, 0, targetUserId + 3);
      await redis.zadd(`${guildId}:userkarma`, 0, targetUserId + 4);
      await redis.set(`${targetUserId + 4}:config:disabled`, true);
      let res = await karmaRetriever.getTopUsersOfGuild(3, guildId);
      assert.strictEqual(res[2].userId, targetUserId + 3);
    });

    it("handles 3 disabled users", async function() {
      await redis.zadd(`${guildId}:userkarma`, 10, targetUserId);
      await redis.zadd(`${guildId}:userkarma`, -10, targetUserId + 1);
      await redis.zadd(`${guildId}:userkarma`, 6, targetUserId + 2);
      await redis.zadd(`${guildId}:userkarma`, 0, targetUserId + 3);
      await redis.zadd(`${guildId}:userkarma`, 0, targetUserId + 4);
      await redis.set(`${targetUserId}:config:disabled`, true);
      await redis.set(`${targetUserId + 3}:config:disabled`, true);
      await redis.set(`${targetUserId + 4}:config:disabled`, true);
      let res = await karmaRetriever.getTopUsersOfGuild(3, guildId);
      assert.strictEqual(res[0].userId, targetUserId + 2);
      assert.strictEqual(res[1].userId, targetUserId + 1);
    });

    it("returns empty array with count 0", async function() {
      await redis.zadd(`${guildId}:userkarma`, 10, targetUserId);
      await redis.zadd(`${guildId}:userkarma`, -10, targetUserId + 1);
      let res = await karmaRetriever.getTopUsersOfGuild(0, guildId);
      assert.strictEqual(res.length, 0);
    });

    it("returns all users when count is larger them number of total users", async function() {
      await redis.zadd(`${guildId}:userkarma`, 10, targetUserId);
      await redis.zadd(`${guildId}:userkarma`, -10, targetUserId + 1);
      await redis.zadd(`${guildId}:userkarma`, 6, targetUserId + 2);
      await redis.zadd(`${guildId}:userkarma`, 0, targetUserId + 3);
      await redis.zadd(`${guildId}:userkarma`, 0, targetUserId + 4);
      let res = await karmaRetriever.getTopUsersOfGuild(10, guildId);
      assert.strictEqual(res.length, 5);
    });

    it("ignores karma in other guilds", async function(){
      await redis.zadd(`${guildId + 1}:userkarma`, 10, targetUserId);
      await redis.zadd(`${guildId + 1}:userkarma`, -10, targetUserId + 1);
      await redis.zadd(`${guildId + 2}:userkarma`, 6, targetUserId);
      
      await redis.zadd(`${guildId}:userkarma`, 10, targetUserId);
      await redis.zadd(`${guildId}:userkarma`, -10, targetUserId + 1);
      await redis.zadd(`${guildId}:userkarma`, 6, targetUserId + 2);
      await redis.zadd(`${guildId}:userkarma`, 0, targetUserId + 3);
      await redis.zadd(`${guildId}:userkarma`, 0, targetUserId + 4);
      let res = await karmaRetriever.getTopUsersOfGuild(3, guildId);
      assert.strictEqual(res.length, 3);
      assert.strictEqual(res[0].karma, 10);
    });

    it("removes user that disabled guild from output", async function(){
      await redis.zadd(`${guildId}:userkarma`, 10, targetUserId);
      await redis.zadd(`${guildId}:userkarma`, -10, targetUserId + 1);
      await redis.zadd(`${guildId}:userkarma`, 6, targetUserId + 2);
      await redis.zadd(`${guildId}:userkarma`, 0, targetUserId + 3);
      await redis.zadd(`${guildId}:userkarma`, 0, targetUserId + 4);
      await redis.sadd(`${targetUserId + 4}:config:disabledguilds`, guildId);
      let res = await karmaRetriever.getTopUsersOfGuild(3, guildId);
      assert.strictEqual(res[2].userId, targetUserId + 3);
    });

    it("removes 2 users who are disabled and 2 different users who disabled guild from output", async function(){
      await redis.zadd(`${guildId}:userkarma`, 10, targetUserId);
      await redis.zadd(`${guildId}:userkarma`, -10, targetUserId + 1);
      await redis.zadd(`${guildId}:userkarma`, 6, targetUserId + 2);
      await redis.zadd(`${guildId}:userkarma`, 0, targetUserId + 3);
      await redis.zadd(`${guildId}:userkarma`, 0, targetUserId + 4);
      await redis.sadd(`${targetUserId + 1}:config:disabledguilds`, guildId);
      await redis.sadd(`${targetUserId + 3}:config:disabledguilds`, guildId);
      await redis.set(`${targetUserId + 2}:config:disabled`, true);
      await redis.set(`${targetUserId + 4}:config:disabled`, true);
      let res = await karmaRetriever.getTopUsersOfGuild(3, guildId);
      assert.strictEqual(res[0].userId, targetUserId);
      assert.strictEqual(res.length, 1);
    });

    it("throws when guild is disabled", async function(){
      await redis.zadd(`${guildId}:userkarma`, 10, targetUserId);
      await redis.zadd(`${guildId}:userkarma`, -10, targetUserId + 1);
      await redis.set(`${guildId}:config:disabled`, true);
      await assert.rejects(async () => await karmaRetriever.getTopUsersOfGuild(3, guildId), new Error("guild is disabled"));
    });
  });

  describe("getTopUsersOfGuildTotal", function(){
    it("returns array with 3 entries when count is 3", async function() {
      await redis.zadd("userkarma", 10, targetUserId);
      await redis.sadd(`${guildId}:users`, targetUserId);
      await redis.zadd("userkarma", -10, targetUserId + 1);
      await redis.sadd(`${guildId}:users`, targetUserId + 1);
      await redis.zadd("userkarma", 6, targetUserId + 2);
      await redis.sadd(`${guildId}:users`, targetUserId + 2);
      await redis.zadd("userkarma", 0, targetUserId + 3);
      await redis.sadd(`${guildId}:users`, targetUserId + 3);
      await redis.zadd("userkarma", 0, targetUserId + 4);
      await redis.sadd(`${guildId}:users`, targetUserId + 4);
      let res = await karmaRetriever.getTopUsersOfGuildTotal(3, guildId);
      assert.strictEqual(res.length, 3);
    });

    it("returns array sorted descending by karma with userIds", async function() {
      await redis.zadd("userkarma", 10, targetUserId);
      await redis.sadd(`${guildId}:users`, targetUserId);
      await redis.zadd("userkarma", -10, targetUserId + 1);
      await redis.sadd(`${guildId}:users`, targetUserId + 1);
      await redis.zadd("userkarma", 6, targetUserId + 2);
      await redis.sadd(`${guildId}:users`, targetUserId + 2);
      await redis.zadd("userkarma", 0, targetUserId + 3);
      await redis.sadd(`${guildId}:users`, targetUserId + 3);
      await redis.zadd("userkarma", 0, targetUserId + 4);
      await redis.sadd(`${guildId}:users`, targetUserId + 4);
      let res = await karmaRetriever.getTopUsersOfGuildTotal(3, guildId);
      assert.strictEqual(res[0].karma, 10);
      assert.strictEqual(res[0].userId, targetUserId);
      assert.strictEqual(res[1].karma, 6);
      assert.strictEqual(res[2].karma, 0);
    });

    it("returns user with higher userId first when there are multiple userIds with the same karma", async function() {
      await redis.zadd("userkarma", 10, targetUserId);
      await redis.sadd(`${guildId}:users`, targetUserId);
      await redis.zadd("userkarma", -10, targetUserId + 1);
      await redis.sadd(`${guildId}:users`, targetUserId + 1);
      await redis.zadd("userkarma", 6, targetUserId + 2);
      await redis.sadd(`${guildId}:users`, targetUserId + 2);
      await redis.zadd("userkarma", 0, targetUserId + 3);
      await redis.sadd(`${guildId}:users`, targetUserId + 3);
      await redis.zadd("userkarma", 0, targetUserId + 4);
      await redis.sadd(`${guildId}:users`, targetUserId + 4);
      let res = await karmaRetriever.getTopUsersOfGuildTotal(3, guildId);
      assert.strictEqual(res[2].userId, targetUserId + 4);
    });

    it("returns an empty array when there are no users", async function() {
      let res = await karmaRetriever.getTopUsersOfGuildTotal(3, guildId);
      assert.strictEqual(res.length, 0);
    });

    it("removes single disabled users from output and gets the next user on the top list", async function() {
      await redis.zadd("userkarma", 10, targetUserId);
      await redis.sadd(`${guildId}:users`, targetUserId);
      await redis.zadd("userkarma", -10, targetUserId + 1);
      await redis.sadd(`${guildId}:users`, targetUserId + 1);
      await redis.zadd("userkarma", 6, targetUserId + 2);
      await redis.sadd(`${guildId}:users`, targetUserId + 2);
      await redis.zadd("userkarma", 0, targetUserId + 3);
      await redis.sadd(`${guildId}:users`, targetUserId + 3);
      await redis.zadd("userkarma", 0, targetUserId + 4);
      await redis.sadd(`${guildId}:users`, targetUserId + 4);
      await redis.set(`${targetUserId + 4}:config:disabled`, true);
      let res = await karmaRetriever.getTopUsersOfGuildTotal(3, guildId);
      assert.strictEqual(res[2].userId, targetUserId + 3);
    });

    it("handles 3 disabled users", async function() {
      await redis.zadd("userkarma", 10, targetUserId);
      await redis.sadd(`${guildId}:users`, targetUserId);
      await redis.zadd("userkarma", -10, targetUserId + 1);
      await redis.sadd(`${guildId}:users`, targetUserId + 1);
      await redis.zadd("userkarma", 6, targetUserId + 2);
      await redis.sadd(`${guildId}:users`, targetUserId + 2);
      await redis.zadd("userkarma", 0, targetUserId + 3);
      await redis.sadd(`${guildId}:users`, targetUserId + 3);
      await redis.zadd("userkarma", 0, targetUserId + 4);
      await redis.sadd(`${guildId}:users`, targetUserId + 4);
      await redis.set(`${targetUserId}:config:disabled`, true);
      await redis.set(`${targetUserId + 3}:config:disabled`, true);
      await redis.set(`${targetUserId + 4}:config:disabled`, true);
      let res = await karmaRetriever.getTopUsersOfGuildTotal(3, guildId);
      assert.strictEqual(res[0].userId, targetUserId + 2);
      assert.strictEqual(res[1].userId, targetUserId + 1);
    });

    it("returns empty array with count 0", async function() {
      await redis.zadd("userkarma", 10, targetUserId);
      await redis.sadd(`${guildId}:users`, targetUserId);
      await redis.zadd("userkarma", -10, targetUserId + 1);
      await redis.sadd(`${guildId}:users`, targetUserId + 1);
      let res = await karmaRetriever.getTopUsersOfGuildTotal(0, guildId);
      assert.strictEqual(res.length, 0);
    });

    it("returns all users when count is larger them number of total users", async function() {
      await redis.zadd("userkarma", 10, targetUserId);
      await redis.sadd(`${guildId}:users`, targetUserId);
      await redis.zadd("userkarma", -10, targetUserId + 1);
      await redis.sadd(`${guildId}:users`, targetUserId + 1);
      await redis.zadd("userkarma", 6, targetUserId + 2);
      await redis.sadd(`${guildId}:users`, targetUserId + 2);
      await redis.zadd("userkarma", 0, targetUserId + 3);
      await redis.sadd(`${guildId}:users`, targetUserId + 3);
      await redis.zadd("userkarma", 0, targetUserId + 4);
      await redis.sadd(`${guildId}:users`, targetUserId + 4);
      let res = await karmaRetriever.getTopUsers(10);
      assert.strictEqual(res.length, 5);
    });

    it("returns only users who are in guildId", async function(){
      await redis.zadd("userkarma", 10, targetUserId);
      await redis.sadd(`${guildId + 1}:users`, targetUserId);
      await redis.zadd("userkarma", -10, targetUserId + 1);
      await redis.sadd(`${guildId}:users`, targetUserId + 1);
      await redis.zadd("userkarma", 6, targetUserId + 2);
      await redis.sadd(`${guildId}:users`, targetUserId + 2);
      await redis.zadd("userkarma", 0, targetUserId + 3);
      await redis.sadd(`${guildId}:users`, targetUserId + 3);
      await redis.zadd("userkarma", 0, targetUserId + 4);
      await redis.sadd(`${guildId}:users`, targetUserId + 4);
      let res = await karmaRetriever.getTopUsersOfGuildTotal(3, guildId);
      assert.strictEqual(res[0].karma, 6);
      assert.strictEqual(res[0].userId, targetUserId + 2);
      assert.strictEqual(res[1].karma, 0);
      assert.strictEqual(res[2].karma, 0);
    });

    it("returns user who is also in other guild", async function(){
      await redis.zadd("userkarma", 10, targetUserId);
      await redis.sadd(`${guildId}:users`, targetUserId);
      await redis.sadd(`${guildId + 1}:users`, targetUserId);
      await redis.zadd("userkarma", -10, targetUserId + 1);
      await redis.sadd(`${guildId}:users`, targetUserId + 1);
      await redis.zadd("userkarma", 6, targetUserId + 2);
      await redis.sadd(`${guildId}:users`, targetUserId + 2);
      await redis.zadd("userkarma", 0, targetUserId + 3);
      await redis.sadd(`${guildId}:users`, targetUserId + 3);
      await redis.zadd("userkarma", 0, targetUserId + 4);
      await redis.sadd(`${guildId}:users`, targetUserId + 4);
      let res = await karmaRetriever.getTopUsersOfGuildTotal(3, guildId);
      assert.strictEqual(res[0].karma, 10);
      assert.strictEqual(res[0].userId, targetUserId);
      assert.strictEqual(res[1].karma, 6);
      assert.strictEqual(res[2].karma, 0);
    });

    it("throws when guild is disabled", async function(){
      await redis.zadd("userkarma", 10, targetUserId);
      await redis.sadd(`${guildId}:users`, targetUserId);
      await redis.zadd("userkarma", -10, targetUserId + 1);
      await redis.sadd(`${guildId}:users`, targetUserId + 1);
      await redis.set(`${guildId}:config:disabled`, true);
      await assert.rejects(async () => await karmaRetriever.getTopUsersOfGuildTotal(3, guildId), new Error("guild is disabled"));
    });
  });

  describe("getTopGuilds", function(){
    it("returns array with 3 entries when count is 3", async function() {
      await redis.zadd("guildkarma", 10, guildId);
      await redis.zadd("guildkarma", -10, guildId + 1);
      await redis.zadd("guildkarma", 6, guildId + 2);
      await redis.zadd("guildkarma", 0, guildId + 3);
      await redis.zadd("guildkarma", 0, guildId + 4);
      let res = await karmaRetriever.getTopGuilds(3);
      assert.strictEqual(res.length, 3);
    });

    it("returns array sorted descending by karma with guildIds", async function() {
      await redis.zadd("guildkarma", 10, guildId);
      await redis.zadd("guildkarma", -10, guildId + 1);
      await redis.zadd("guildkarma", 6, guildId + 2);
      await redis.zadd("guildkarma", 0, guildId + 3);
      await redis.zadd("guildkarma", 0, guildId + 4);
      let res = await karmaRetriever.getTopGuilds(3);
      assert.strictEqual(res[0].karma, 10);
      assert.strictEqual(res[0].guildId, guildId);
      assert.strictEqual(res[1].karma, 6);
      assert.strictEqual(res[2].karma, 0);
    });

    it("returns guild with higher guildId first when there are multiple guildIds with the same karma", async function() {
      await redis.zadd("guildkarma", 10, guildId);
      await redis.zadd("guildkarma", -10, guildId + 1);
      await redis.zadd("guildkarma", 6, guildId + 2);
      await redis.zadd("guildkarma", 0, guildId + 3);
      await redis.zadd("guildkarma", 0, guildId + 4);
      let res = await karmaRetriever.getTopGuilds(3);
      assert.strictEqual(res[2].guildId, guildId + 4);
    });

    it("returns an empty array when there are no guilds", async function() {
      let res = await karmaRetriever.getTopGuilds(3);
      assert.strictEqual(res.length, 0);
    });

    it("removes single disabled guilds from output and gets the next guild on the top list", async function() {
      await redis.zadd("guildkarma", 10, guildId);
      await redis.zadd("guildkarma", -10, guildId + 1);
      await redis.zadd("guildkarma", 6, guildId + 2);
      await redis.zadd("guildkarma", 0, guildId + 3);
      await redis.zadd("guildkarma", 0, guildId + 4);
      await redis.set(`${guildId + 4}:config:disabled`, true);
      let res = await karmaRetriever.getTopGuilds(3);
      assert.strictEqual(res[2].guildId, guildId + 3);
    });

    it("handles 3 disabled guilds", async function() {
      await redis.zadd("guildkarma", 10, guildId);
      await redis.zadd("guildkarma", -10, guildId + 1);
      await redis.zadd("guildkarma", 6, guildId + 2);
      await redis.zadd("guildkarma", 0, guildId + 3);
      await redis.zadd("guildkarma", 0, guildId + 4);
      await redis.set(`${guildId}:config:disabled`, true);
      await redis.set(`${guildId + 3}:config:disabled`, true);
      await redis.set(`${guildId + 4}:config:disabled`, true);
      let res = await karmaRetriever.getTopGuilds(3);
      assert.strictEqual(res[0].guildId, guildId + 2);
      assert.strictEqual(res[1].guildId, guildId + 1);
    });

    it("returns empty array with count 0", async function() {
      await redis.zadd("guildkarma", 10, guildId);
      await redis.zadd("guildkarma", -10, guildId + 1);
      let res = await karmaRetriever.getTopGuilds(0);
      assert.strictEqual(res.length, 0);
    });

    it("returns all users when count is larger them number of total users", async function() {
      await redis.zadd("guildkarma", 10, guildId);
      await redis.zadd("guildkarma", -10, guildId + 1);
      await redis.zadd("guildkarma", 6, guildId + 2);
      await redis.zadd("guildkarma", 0, guildId + 3);
      await redis.zadd("guildkarma", 0, guildId + 4);
      let res = await karmaRetriever.getTopGuilds(10);
      assert.strictEqual(res.length, 5);
    });
  });
}