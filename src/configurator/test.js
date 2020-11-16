import assert from "assert";

import Redis from "ioredis";
import {isRegExp} from "util";
let redis;

import configurator from "./configurator.js";

let targetUserId = "607502693514084352";
let guildId = "592303011947216896";
let upvoteEmojiId = "602200537299026002";
let downvoteEmojiId = "602200572673916942";

export default function(redisIp, redisPort) {
  before("setup", function() {
    return new Promise(async (resolve, reject) => {
      await configurator.connect(redisIp, redisPort);
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

  describe("disableUser", function(){
    it("returns ok", async function(){
      let res = await configurator.disableUser(targetUserId);
      assert.strictEqual(res, "OK");
    });

    it("disables given user", async function(){
      await configurator.disableUser(targetUserId);
      let res = await redis.get(`${targetUserId}:config:disabled`);
      assert.strictEqual(res, "true");
    });

    it("throws when falsy userId is given", async function(){
      await assert.rejects(async () => await configurator.disableUser(null), new Error("No userId given"));
    });
  });

  describe("enableUser", function() {
    it("returns ok", async function() {
      let res = await configurator.enableUser(targetUserId);
      assert.strictEqual(res, "OK");
    });

    it("enables given user", async function() {
      await configurator.enableUser(targetUserId);
      let res = await redis.get(`${targetUserId}:config:disabled`);
      assert.strictEqual(res, "false");
    });

    it("throws when falsy userId is given", async function() {
      await assert.rejects(async () => await configurator.enableUser(null), new Error("No userId given"));
    });
  });

  describe("disableGuildinUser", function(){
    it("returns 1", async function(){
      let res = await configurator.disableGuildinUser(targetUserId, guildId);
      assert.strictEqual(res, 1);
    });

    it("adds guild to disabled list", async function(){
      await configurator.disableGuildinUser(targetUserId, guildId);
      let res = await redis.sismember(`${targetUserId}:config:disabledguilds`, guildId);
      assert.strictEqual(res, 1);
    });

    it("adds two guilds", async function(){
      await configurator.disableGuildinUser(targetUserId, guildId);
      await configurator.disableGuildinUser(targetUserId, guildId + 1);
      let res = await redis.sismember(`${targetUserId}:config:disabledguilds`, guildId);
      let res2 = await redis.sismember(`${targetUserId}:config:disabledguilds`, guildId + 1);
      assert.strictEqual(res, 1);
      assert.strictEqual(res2, 1);
    });

    it("adds guild to correct user", async function(){
      await configurator.disableGuildinUser(targetUserId, guildId);
      await configurator.disableGuildinUser(targetUserId + 1, guildId + 1);
      let res = await redis.sismember(`${targetUserId + 1}:config:disabledguilds`, guildId + 1);
      assert.strictEqual(res, 1);
    });

    it("throws when falsy userId is given", async function(){
      await assert.rejects(async () => await configurator.disableGuildinUser(null, guildId), new Error("No userId given"));
    });

    it("throws when falsy guildId is given", async function() {
      await assert.rejects(async () => await configurator.disableGuildinUser(targetUserId, null), new Error("No guildId given"));
    });
  });

  describe("enableGuildInUser", function(){
    it("returns 0 when guild is already enabled in user", async function(){
      let res = await configurator.enableGuildInUser(targetUserId, guildId);
      assert.strictEqual(res, 0);
    });

    it("returns 1 when guild is disabled in user", async function() {
      await configurator.disableGuildinUser(targetUserId, guildId);
      let res = await configurator.enableGuildInUser(targetUserId, guildId);
      assert.strictEqual(res, 1);
    });

    it("enables specified guild", async function(){
      await configurator.disableGuildinUser(targetUserId, guildId);
      await configurator.disableGuildinUser(targetUserId, guildId + 1);
      await configurator.enableGuildInUser(targetUserId, guildId);
      let res = await redis.sismember(`${targetUserId}:config:disabledguilds`, guildId + 1);
      assert.strictEqual(res, 1);
    });

    it("enables guild in correct user", async function(){
      await configurator.disableGuildinUser(targetUserId, guildId);
      await configurator.disableGuildinUser(targetUserId + 1, guildId);
      await configurator.enableGuildInUser(targetUserId, guildId);
      let res = await redis.sismember(`${targetUserId}:config:disabledguilds`, guildId);
      let res2 = await redis.sismember(`${targetUserId + 1}:config:disabledguilds`, guildId);
      assert.strictEqual(res, 0);
      assert.strictEqual(res2, 1);
    });

    it("throws when falsy userId is given", async function() {
      await assert.rejects(async () => await configurator.enableGuildInUser(null, guildId), new Error("No userId given"));
    });

    it("throws when falsy guildId is given", async function() {
      await assert.rejects(async () => await configurator.enableGuildInUser(targetUserId, null), new Error("No guildId given"));
    });
  });

  describe("disableGuild", function(){
    it("returns ok", async function() {
      let res = await configurator.disableGuild(guildId);
      assert.strictEqual(res, "OK");
    });

    it("disables given guild", async function() {
      await configurator.disableGuild(guildId);
      let res = await redis.get(`${guildId}:config:disabled`);
      assert.strictEqual(res, "true");
    });

    it("throws when falsy guildId is given", async function() {
      await assert.rejects(async () => await configurator.disableGuild(null), new Error("No guildId given"));
    });
  });

  describe("enableGuild", function() {
    it("returns ok", async function() {
      let res = await configurator.enableGuild(guildId);
      assert.strictEqual(res, "OK");
    });

    it("enables given guild", async function() {
      await configurator.enableGuild(guildId);
      let res = await redis.get(`${guildId}:config:disabled`);
      assert.strictEqual(res, "false");
    });

    it("throws when falsy guildId is given", async function() {
      await assert.rejects(async () => await configurator.enableGuild(null), new Error("No guildId given"));
    });
  });

  describe("setUpvoteEmoji", function(){
    it("returns ok", async function(){
      let res = await configurator.setUpvoteEmoji(guildId, upvoteEmojiId);
      assert.strictEqual(res, "OK");
    });

    it("sets correct value", async function(){
      await configurator.setUpvoteEmoji(guildId, upvoteEmojiId);
      let res = await redis.get(`${guildId}:config:upvoteemojiid`);
      assert.strictEqual(res, upvoteEmojiId);
    });

    it("throws when falsy guildId is given", async function(){
      await assert.rejects(async () => await configurator.setUpvoteEmoji(null, upvoteEmojiId), new Error("No guildId given"));
    });

    it("throws when falsy upvoteEmojiId is given", async function() {
      await assert.rejects(async () => await configurator.setUpvoteEmoji(guildId, null), new Error("No emojiId given"));
    });
  });

  describe("setDownvoteEmoji", function() {
    it("returns ok", async function() {
      let res = await configurator.setDownvoteEmoji(guildId, downvoteEmojiId);
      assert.strictEqual(res, "OK");
    });

    it("sets correct value", async function() {
      await configurator.setDownvoteEmoji(guildId, downvoteEmojiId);
      let res = await redis.get(`${guildId}:config:downvoteemojiid`);
      assert.strictEqual(res, downvoteEmojiId);
    });

    it("throws when falsy guildId is given", async function() {
      await assert.rejects(async () => await configurator.setDownvoteEmoji(null, downvoteEmojiId), new Error("No guildId given"));
    });

    it("throws when falsy downvoteEmojiId is given", async function() {
      await assert.rejects(async () => await configurator.setDownvoteEmoji(guildId, null), new Error("No emojiId given"));
    });
  });
}