import assert from "assert";

import {connect, upvote, downvote, removeUpvote, removeDownvote} from "./karmaUpdater.js";
import Redis from "ioredis";
let redis;

let srcUserId = "293029505457586176";
let targetUserId = "607502693514084352";
let guildId = "592303011947216896";

export default function(redisIp, redisPort){
  before("setup", function(){
    return new Promise(async(resolve, reject) => {
      await connect(redisIp, redisPort);
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
  
  beforeEach("clear redis", async function(){
    await clearRedis();
  });

  after("clear redis after", async function(){
    await clearRedis();
  });

  async function clearRedis(){
    await redis.flushall();
  }

  describe("upvote", function(){
    it("write a good upvote", async function(){
      await upvote(srcUserId, targetUserId, guildId);
      let res = await redis.zscore("userkarma", targetUserId);
      assert.strictEqual(res, "1");
    });

    it("dont write when src and target user are the same", async function(){
      await upvote(srcUserId, srcUserId, guildId);
      let res = await redis.get(`${srcUserId}:karma`);
      assert.strictEqual(res, null);
    });

    it("write only 2 votes when user upvotes three times at once", async function(){
      await upvote(srcUserId, targetUserId, guildId);
      await upvote(srcUserId, targetUserId, guildId);
      await upvote(srcUserId, targetUserId, guildId);
      let res = await redis.zscore("userkarma", targetUserId);
      assert.strictEqual(res, "2");
    });

    it("write no upvote when user has 2 votetimestamps in the past minute", async function(){
      await redis.rpush(`${srcUserId}:votetimestamps`, Date.now() - 5000);
      await redis.rpush(`${srcUserId}:votetimestamps`, Date.now() - 6000);

      await upvote(srcUserId, targetUserId, guildId);
      let res = await redis.zscore("userkarma", targetUserId);
      assert.strictEqual(res, null);
    });

    it("write no upvote when user has 10 votetimestamps in the past hour", async function(){
      for(let i = 0; i < 10; i++){
        await redis.rpush(`${srcUserId}:votetimestamps`, Date.now() - (1000 * 60 * 10 + i));
      }

      await upvote(srcUserId, targetUserId, guildId);
      let res = await redis.zscore("userkarma", targetUserId);
      assert.strictEqual(res, null);
    });

    it("write no upvote when user has 50 votetimestamps in the past day", async function(){
      let pipeline = redis.pipeline();
      for(let i = 0; i < 50; i++) {
        await pipeline.rpush(`${srcUserId}:votetimestamps`, Date.now() - (1000 * 60 * 60 + i));
      }
      await pipeline.exec();

      await upvote(srcUserId, targetUserId, guildId);
      let res = await redis.zscore("userkarma", targetUserId);
      assert.strictEqual(res, null);
    });

    it("write no upvote when targetuser is disabled", async function(){
      await redis.set(`${targetUserId}:config:disabled`, true);

      await upvote(srcUserId, targetUserId, guildId);
      let res = await redis.zscore("userkarma", targetUserId);
      assert.strictEqual(res, null);
    });

    it("write no upvote when guild is disabled in targetusers config", async function(){
      await redis.sadd(`${targetUserId}:config:disabledguilds`, guildId);

      await upvote(srcUserId, targetUserId, guildId);
      let res = await redis.zscore("userkarma", targetUserId);
      assert.strictEqual(res, null);
    });

    it("write upvote when different guild is disabled in targetusers config", async function(){
      await redis.sadd(`${targetUserId}:config:disabledguilds`, guildId + 1);

      await upvote(srcUserId, targetUserId, guildId);
      let res = await redis.zscore("userkarma", targetUserId);
      assert.strictEqual(res, "1");
    });

    it("adds current timestamp to DB", async function(){
      await upvote(srcUserId, targetUserId, guildId);
      let res = await redis.lrange(`${srcUserId}:votetimestamps`, 0, -1);
      assert.strictEqual(res.length, 1);
      assert.ok(res[0] > Date.now() - 100 && res[0] <= Date.now());
    });

    it("increments karma of user in guild", async function(){
      await upvote(srcUserId, targetUserId, guildId);
      let res = await redis.zscore(`${guildId}:userkarma`, targetUserId);
      assert.strictEqual(res, "1");
    });

    it("increments total karma of guild", async function(){
      await upvote(srcUserId, targetUserId, guildId);
      let res = await redis.zscore(`guildkarma`, guildId);
      assert.strictEqual(res, "1");
    });

    it("adds userid to guild", async function(){
      await upvote(srcUserId, targetUserId, guildId);
      let res = await redis.sismember(`${guildId}:users`, targetUserId);
      assert.strictEqual(res, 1);
    });

    it("adds userid to users", async function() {
      await upvote(srcUserId, targetUserId, guildId);
      let res = await redis.sismember("users", targetUserId);
      assert.strictEqual(res, 1);
    });

    it("adds guildId to guilds", async function(){
      await upvote(srcUserId, targetUserId, guildId);
      let res = await redis.sismember("guilds", guildId);
      assert.strictEqual(res, 1);
    });
  });

  describe("downvote", function(){
    it("write a good downvote", async function() {
      await downvote(srcUserId, targetUserId, guildId);
      let res = await redis.zscore("userkarma", targetUserId);
      assert.strictEqual(res, "-1");
    });

    it("dont write when src and target user are the same", async function() {
      await downvote(srcUserId, srcUserId, guildId);
      let res = await redis.get(`${srcUserId}:karma`);
      assert.strictEqual(res, null);
    });

    it("write only 2 votes when user downvotes three times at once", async function() {
      await downvote(srcUserId, targetUserId, guildId);
      await downvote(srcUserId, targetUserId, guildId);
      await downvote(srcUserId, targetUserId, guildId);
      let res = await redis.zscore("userkarma", targetUserId);
      assert.strictEqual(res, "-2");
    });

    it("write no downvote when user has 2 votetimestamps in the past minute", async function() {
      await redis.rpush(`${srcUserId}:votetimestamps`, Date.now() - 5000);
      await redis.rpush(`${srcUserId}:votetimestamps`, Date.now() - 6000);

      await downvote(srcUserId, targetUserId, guildId);
      let res = await redis.zscore("userkarma", targetUserId);
      assert.strictEqual(res, null);
    });

    it("write no downvote when user has 10 votetimestamps in the past hour", async function() {
      for(let i = 0; i < 10; i++) {
        await redis.rpush(`${srcUserId}:votetimestamps`, Date.now() - (1000 * 60 * 10 + i));
      }

      await downvote(srcUserId, targetUserId, guildId);
      let res = await redis.zscore("userkarma", targetUserId);
      assert.strictEqual(res, null);
    });

    it("write no downvote when user has 50 votetimestamps in the past day", async function() {
      let pipeline = redis.pipeline();
      for(let i = 0; i < 50; i++) {
        await pipeline.rpush(`${srcUserId}:votetimestamps`, Date.now() - (1000 * 60 * 60 + i));
      }
      await pipeline.exec();

      await downvote(srcUserId, targetUserId, guildId);
      let res = await redis.zscore("userkarma", targetUserId);
      assert.strictEqual(res, null);
    });

    it("write no downvote when targetuser is disabled", async function() {
      await redis.set(`${targetUserId}:config:disabled`, true);

      await downvote(srcUserId, targetUserId, guildId);
      let res = await redis.zscore("userkarma", targetUserId);
      assert.strictEqual(res, null);
    });

    it("write no downvote when guild is disabled in targetusers config", async function() {
      await redis.sadd(`${targetUserId}:config:disabledguilds`, guildId);

      await downvote(srcUserId, targetUserId, guildId);
      let res = await redis.zscore("userkarma", targetUserId);
      assert.strictEqual(res, null);
    });

    it("write downvote when different guild is disabled in targetusers config", async function() {
      await redis.sadd(`${targetUserId}:config:disabledguilds`, guildId + 1);

      await downvote(srcUserId, targetUserId, guildId);
      let res = await redis.zscore("userkarma", targetUserId);
      assert.strictEqual(res, "-1");
    });

    it("adds current timestamp to DB", async function() {
      await downvote(srcUserId, targetUserId, guildId);
      let res = await redis.lrange(`${srcUserId}:votetimestamps`, 0, -1);
      assert.strictEqual(res.length, 1);
      assert.ok(res[0] > Date.now() - 100 && res[0] <= Date.now());
    });

    it("decrements karma of user in guild", async function() {
      await downvote(srcUserId, targetUserId, guildId);
      let res = await redis.zscore(`${guildId}:userkarma`, targetUserId);
      assert.strictEqual(res, "-1");
    });

    it("decrements total karma of guild", async function() {
      await downvote(srcUserId, targetUserId, guildId);
      let res = await redis.zscore("guildkarma", guildId);
      assert.strictEqual(res, "-1");
    });

    it("adds userid to guild", async function() {
      await downvote(srcUserId, targetUserId, guildId);
      let res = await redis.sismember(`${guildId}:users`, targetUserId);
      assert.strictEqual(res, 1);
    });

    it("adds userid to users", async function() {
      await downvote(srcUserId, targetUserId, guildId);
      let res = await redis.sismember("users", targetUserId);
      assert.strictEqual(res, 1);
    });

    it("adds guildId to guilds", async function() {
      await upvote(srcUserId, targetUserId, guildId);
      let res = await redis.sismember("guilds", guildId);
      assert.strictEqual(res, 1);
    });
  });

  describe("removeUpvote", function(){
    it("decrements karma of targetUser", async function(){
      await removeUpvote(srcUserId, targetUserId, guildId);
      let res = await redis.zscore("userkarma", targetUserId);
      assert.strictEqual(res, "-1");
    });

    it("decrements karma of targetUser in guild", async function(){
      await removeUpvote(srcUserId, targetUserId, guildId);
      let res = await redis.zscore(`${guildId}:userkarma`, targetUserId);
      assert.strictEqual(res, "-1");
    });

    it("decrements total karma of guild", async function(){
      await removeUpvote(srcUserId, targetUserId, guildId);
      let res = await redis.zscore("guildkarma", guildId);
      assert.strictEqual(res, "-1");
    });
  });

  describe("removeDownvote", function(){
    it("increments karma of targetUser", async function() {
      await removeDownvote(srcUserId, targetUserId, guildId);
      let res = await redis.zscore("userkarma", targetUserId);
      assert.strictEqual(res, "1");
    });

    it("increments karma of targetUser in guild", async function() {
      await removeDownvote(srcUserId, targetUserId, guildId);
      let res = await redis.zscore(`${guildId}:userkarma`, targetUserId);
      assert.strictEqual(res, "1");
    });

    it("increments total karma of guild", async function() {
      await removeDownvote(srcUserId, targetUserId, guildId);
      let res = await redis.zscore("guildkarma", guildId);
      assert.strictEqual(res, "1");
    });
  });
}