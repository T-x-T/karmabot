import assert from "assert";

import historyReader from "./historyReader.js";
import configReader from "./configReader.js";
import historyRetriever from "./historyRetriever.js";

import Redis from "ioredis";
let redis;

const targetUserId = "607502693514084352";
const guildId = "592303011947216896";

export default function(redisIp, redisPort) {
  before("setup", function() {
    return new Promise(async (resolve, reject) => {
      await historyReader.connect(redisIp, redisPort);
      await configReader.connect(redisIp, redisPort);

      await historyRetriever.connect(historyReader, configReader);
      console.log("\t[before] historyRetriever connected");

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

  describe("getTotalKarmaHistory", function() {
    it("returns empty array with empty database", async function() {
      let res = await historyRetriever.getTotalKarmaHistory(10);
      assert.strictEqual(res.length, 0);
    });

    it("returns element with correct structure", async function() {
      const date = Date.now() - 1000;
      await redis.zadd("history:totalkarma", date, `12:${date}`);

      const res = await historyRetriever.getTotalKarmaHistory(10);

      assert.strictEqual(res[0].timestamp, date);
      assert.strictEqual(res[0].karma, 12);
    });

    it("returns only entries within specified time range", async function() {
      const date = Date.now() - 1000;
      const dateOld = Date.now() - (1000 * 60 * 60 * 6);
      await redis.zadd("history:totalkarma", date, `12:${date}`);
      await redis.zadd("history:totalkarma", dateOld, `13:${dateOld}`);
      await redis.zadd("history:totalkarma", date + 1, `14:${date + 1}`);

      const res = await historyRetriever.getTotalKarmaHistory(5);

      assert.strictEqual(res.length, 2);
      assert.strictEqual(res[0].karma, 12);
      assert.strictEqual(res[1].karma, 14);
    });
  });

  describe("getUserKarmaHistory", function() {
    it("returns empty array with empty database", async function() {
      let res = await historyRetriever.getUserKarmaHistory(10, targetUserId);
      assert.strictEqual(res.length, 0);
    });

    it("returns element with correct structure", async function() {
      const date = Date.now() - 1000;
      await redis.zadd(`history:${targetUserId}:userkarma`, date, `12:${date}`);

      const res = await historyRetriever.getUserKarmaHistory(10, targetUserId);

      assert.strictEqual(res[0].userId, targetUserId);
      assert.strictEqual(res[0].timestamp, date);
      assert.strictEqual(res[0].karma, 12);
    });

    it("returns only entries within specified time range", async function() {
      const date = Date.now() - 1000;
      const dateOld = Date.now() - (1000 * 60 * 60 * 6);
      await redis.zadd(`history:${targetUserId}:userkarma`, date, `12:${date}`);
      await redis.zadd(`history:${targetUserId}:userkarma`, dateOld, `13:${dateOld}`);
      await redis.zadd(`history:${targetUserId}:userkarma`, date + 1, `14:${date + 1}`);

      const res = await historyRetriever.getUserKarmaHistory(5, targetUserId);

      assert.strictEqual(res.length, 2);
      assert.strictEqual(res[0].karma, 12);
      assert.strictEqual(res[1].karma, 14);
    });

    it("returns only entries of specified user", async function() {
      const date = Date.now() - 1000;
      await redis.zadd(`history:${targetUserId}:userkarma`, date, `12:${date}`);
      await redis.zadd(`history:${targetUserId + 1}:userkarma`, date, `12:${date}`);
      await redis.zadd(`history:${targetUserId}:userkarma`, date + 1, `12:${date + 1}`);

      const res = await historyRetriever.getUserKarmaHistory(5, targetUserId);

      assert.strictEqual(res[0].karma, 12);
      assert.strictEqual(res[0].userId, targetUserId);
      assert.strictEqual(res[1].karma, 12);
      assert.strictEqual(res[1].userId, targetUserId);
      assert.strictEqual(res.length, 2);
    });

    it("throws when targetUser is disabled", async function() {
      let date = new Date() - 1000;
      await redis.set(`${targetUserId}:config:disabled`, true);
      await redis.zadd(`history:${targetUserId}:userkarma`, date, `12:${date}`);
      await assert.rejects(async () => await historyRetriever.getUserKarmaHistory(5, targetUserId), new Error("user is disabled"));
    });
  });

  describe("getGuildKarmaHistory", function() {
    it("returns empty array with empty database", async function() {
      let res = await historyRetriever.getGuildKarmaHistory(10, guildId);
      assert.strictEqual(res.length, 0);
    });

    it("returns element with correct structure", async function() {
      const date = Date.now() - 1000;
      await redis.zadd(`history:${guildId}:guildkarma`, date, `12:${date}`);

      const res = await historyRetriever.getGuildKarmaHistory(10, guildId);

      assert.strictEqual(res[0].guildId, guildId);
      assert.strictEqual(res[0].timestamp, date);
      assert.strictEqual(res[0].karma, 12);
    });

    it("returns only entries within specified time range", async function() {
      const date = Date.now() - 1000;
      const dateOld = Date.now() - (1000 * 60 * 60 * 6);
      await redis.zadd(`history:${guildId}:guildkarma`, date, `12:${date}`);
      await redis.zadd(`history:${guildId}:guildkarma`, dateOld, `13:${dateOld}`);
      await redis.zadd(`history:${guildId}:guildkarma`, date + 1, `14:${date + 1}`);

      const res = await historyRetriever.getGuildKarmaHistory(5, guildId);

      assert.strictEqual(res.length, 2);
      assert.strictEqual(res[0].karma, 12);
      assert.strictEqual(res[1].karma, 14);
    });

    it("returns only entries of specified guild", async function() {
      const date = Date.now() - 1000;
      await redis.zadd(`history:${guildId}:guildkarma`, date, `12:${date}`);
      await redis.zadd(`history:${guildId + 1}:guildkarma`, date, `12:${date}`);
      await redis.zadd(`history:${guildId}:guildkarma`, date + 1, `12:${date + 1}`);

      const res = await historyRetriever.getGuildKarmaHistory(5, guildId);

      assert.strictEqual(res[0].karma, 12);
      assert.strictEqual(res[0].guildId, guildId);
      assert.strictEqual(res[1].karma, 12);
      assert.strictEqual(res[1].guildId, guildId);
      assert.strictEqual(res.length, 2);
    });

    it("throws when guild is disabled", async function() {
      let date = new Date() - 1000;
      await redis.set(`${guildId}:config:disabled`, true);
      await redis.zadd(`history:${guildId}:guildkarma`, date, `12:${date}`);
      await assert.rejects(async () => await historyRetriever.getGuildKarmaHistory(5, guildId), new Error("guild is disabled"));
    });
  });

  describe("getUserInGuildKarmaHistory", function() {
    it("returns empty array with empty database", async function() {
      let res = await historyRetriever.getUserInGuildKarmaHistory(10, targetUserId, guildId);
      assert.strictEqual(res.length, 0);
    });

    it("returns element with correct structure", async function() {
      const date = Date.now() - 1000;
      await redis.zadd(`history:${guildId}:${targetUserId}:userkarma`, date, `12:${date}`);

      const res = await historyRetriever.getUserInGuildKarmaHistory(10, targetUserId, guildId);

      assert.strictEqual(res[0].userId, targetUserId);
      assert.strictEqual(res[0].guildId, guildId);
      assert.strictEqual(res[0].timestamp, date);
      assert.strictEqual(res[0].karma, 12);
    });

    it("returns only entries within specified time range", async function() {
      const date = Date.now() - 1000;
      const dateOld = Date.now() - (1000 * 60 * 60 * 6);
      await redis.zadd(`history:${guildId}:${targetUserId}:userkarma`, date, `12:${date}`);
      await redis.zadd(`history:${guildId}:${targetUserId}:userkarma`, dateOld, `13:${dateOld}`);
      await redis.zadd(`history:${guildId}:${targetUserId}:userkarma`, date + 1, `14:${date + 1}`);

      const res = await historyRetriever.getUserInGuildKarmaHistory(5, targetUserId, guildId);

      assert.strictEqual(res.length, 2);
      assert.strictEqual(res[0].karma, 12);
      assert.strictEqual(res[1].karma, 14);
    });

    it("returns only entries of specified guild", async function() {
      const date = Date.now() - 1000;
      await redis.zadd(`history:${guildId}:${targetUserId}:userkarma`, date, `12:${date}`);
      await redis.zadd(`history:${guildId + 1}:${targetUserId}:userkarma`, date, `12:${date}`);
      await redis.zadd(`history:${guildId}:${targetUserId}:userkarma`, date + 1, `12:${date + 1}`);

      const res = await historyRetriever.getUserInGuildKarmaHistory(5, targetUserId, guildId);

      assert.strictEqual(res[0].karma, 12);
      assert.strictEqual(res[0].guildId, guildId);
      assert.strictEqual(res[1].karma, 12);
      assert.strictEqual(res[1].guildId, guildId);
      assert.strictEqual(res.length, 2);
    });

    it("returns only entries of specified user", async function() {
      const date = Date.now() - 1000;
      await redis.zadd(`history:${guildId}:${targetUserId}:userkarma`, date, `12:${date}`);
      await redis.zadd(`history:${guildId}:${targetUserId + 1}:userkarma`, date, `12:${date}`);
      await redis.zadd(`history:${guildId}:${targetUserId}:userkarma`, date + 1, `12:${date + 1}`);

      const res = await historyRetriever.getUserInGuildKarmaHistory(5, targetUserId, guildId);

      assert.strictEqual(res[0].karma, 12);
      assert.strictEqual(res[0].userId, targetUserId);
      assert.strictEqual(res[1].karma, 12);
      assert.strictEqual(res[1].userId, targetUserId);
      assert.strictEqual(res.length, 2);
    });

    it("throws when targetUser is disabled", async function() {
      let date = new Date() - 1000;
      await redis.set(`${targetUserId}:config:disabled`, true);
      await redis.zadd(`history:${guildId}:${targetUserId}:userkarma`, date, `12:${date}`);
      await assert.rejects(async () => await historyRetriever.getUserInGuildKarmaHistory(5, targetUserId, guildId), new Error("user is disabled"));
    });

    it("throws when guild is disabled", async function() {
      let date = new Date() - 1000;
      await redis.set(`${guildId}:config:disabled`, true);
      await redis.zadd(`history:${guildId}:${targetUserId}:userkarma`, date, `12:${date}`);
      await assert.rejects(async () => await historyRetriever.getUserInGuildKarmaHistory(5, targetUserId, guildId), new Error("guild is disabled"));
    });

    it("throws when targetUser has disabled guild", async function() {
      let date = new Date() - 1000;
      redis.sadd(`${targetUserId}:config:disabledguilds`, guildId);
      await redis.zadd(`history:${guildId}:${targetUserId}:userkarma`, date, `12:${date}`);
      await assert.rejects(async () => await historyRetriever.getUserInGuildKarmaHistory(5, targetUserId, guildId), new Error("user has disabled guild"));
    });
  });

  describe("getGuildKarmaOfAllGuildsOfUserHistory", function() {
    const date = Date.now() - 1000;
    const dateOld = Date.now() - (1000 * 60 * 60 * 11);

    async function addExamples() {
      await redis.zadd(`history:${guildId}:${targetUserId}:userkarma`, date, `12:${date}`);
      await redis.zadd(`history:${guildId + 1}:${targetUserId}:userkarma`, date, `13:${date}`);
      await redis.zadd(`history:${guildId + 2}:${targetUserId}:userkarma`, date, `14:${date}`);
      await redis.sadd(`${guildId}:users`, targetUserId);
      await redis.sadd(`${guildId + 2}:users`, targetUserId);
      await redis.sadd("guilds", guildId);
      await redis.sadd("guilds", guildId+2);
    }
    async function addExamplesWithOld() {
      await redis.zadd(`history:${guildId}:${targetUserId}:userkarma`, date, `12:${date}`);
      await redis.zadd(`history:${guildId + 1}:${targetUserId}:userkarma`, date, `13:${date}`);
      await redis.zadd(`history:${guildId + 2}:${targetUserId}:userkarma`, dateOld, `14:${dateOld}`);
      await redis.sadd(`${guildId}:users`, targetUserId);
      await redis.sadd(`${guildId + 2}:users`, targetUserId);
      await redis.sadd("guilds", guildId);
      await redis.sadd("guilds", guildId+2);
    }

    it("returns empty array with empty database", async function() {
      let res = await historyRetriever.getGuildKarmaOfAllGuildsOfUserHistory(10, targetUserId);
      assert.strictEqual(res.length, 0);
    });

    it("returns element with correct structure", async function() {
      await addExamples();

      const res = await historyRetriever.getGuildKarmaOfAllGuildsOfUserHistory(10, targetUserId);
      
      assert.strictEqual(res.length, 2);
      assert.strictEqual(res[0].guildId, guildId);
      assert.strictEqual(res[1].guildId, guildId + 2);
      assert.strictEqual(res[0].guildkarmaHistory[0].karma, 12);
      assert.strictEqual(res[1].guildkarmaHistory[0].karma, 14);
      assert.strictEqual(res[0].guildkarmaHistory[0].userId, targetUserId);
      assert.strictEqual(res[1].guildkarmaHistory[0].userId, targetUserId);
      assert.strictEqual(res[0].guildkarmaHistory[0].guildId, guildId);
      assert.strictEqual(res[1].guildkarmaHistory[0].guildId, guildId+2);
    });

    it("returns only entries within specified time range", async function() {
      await addExamplesWithOld();

      const res = await historyRetriever.getGuildKarmaOfAllGuildsOfUserHistory(10, targetUserId);

      assert.strictEqual(res.length, 1);
      assert.strictEqual(res[0].guildId, guildId);
      assert.strictEqual(res[0].guildkarmaHistory[0].karma, 12);
      assert.strictEqual(res[0].guildkarmaHistory[0].userId, targetUserId);
      assert.strictEqual(res[0].guildkarmaHistory[0].guildId, guildId);
    });

    it("throws when targetUser is disabled", async function() {
      await addExamples();
      await redis.set(`${targetUserId}:config:disabled`, true);
      await assert.rejects(async () => await historyRetriever.getGuildKarmaOfAllGuildsOfUserHistory(10, targetUserId), new Error("user is disabled"));
    });

    it("exclude guilds that are disabled in user", async function() {
      await redis.sadd(`${targetUserId}:config:disabledguilds`, guildId);
      await addExamples();

      const res = await historyRetriever.getGuildKarmaOfAllGuildsOfUserHistory(10, targetUserId);

      assert.strictEqual(res.length, 1);
      assert.strictEqual(res[0].guildId, guildId+2);
      assert.strictEqual(res[0].guildkarmaHistory[0].karma, 14);
      assert.strictEqual(res[0].guildkarmaHistory[0].userId, targetUserId);
      assert.strictEqual(res[0].guildkarmaHistory[0].guildId, guildId+2);
    });
  });


  describe("getUserCountHistory", function() {
    it("returns empty array with empty database", async function() {
      let res = await historyRetriever.getUserCountHistory(10);
      assert.strictEqual(res.length, 0);
    });

    it("returns element with correct structure", async function() {
      const date = Date.now() - 1000;
      await redis.zadd("history:usercount", date, `12:${date}`);

      const res = await historyRetriever.getUserCountHistory(10);

      assert.strictEqual(res[0].count, 12);
      assert.strictEqual(res[0].timestamp, date);
    });

    it("returns only entries within specified time range", async function() {
      const date = Date.now() - 1000;
      const dateOld = Date.now() - (1000 * 60 * 60 * 6);
      await redis.zadd("history:usercount", date, `12:${date}`);
      await redis.zadd("history:usercount", dateOld, `13:${dateOld}`);
      await redis.zadd("history:usercount", date + 1, `14:${date + 1}`);

      const res = await historyRetriever.getUserCountHistory(5);

      assert.strictEqual(res.length, 2);
      assert.strictEqual(res[0].count, 12);
      assert.strictEqual(res[1].count, 14);
    });
  });

  describe("getGuildCountHistory", function() {
    it("returns empty array with empty database", async function() {
      let res = await historyRetriever.getGuildCountHistory(10);
      assert.strictEqual(res.length, 0);
    });

    it("returns element with correct structure", async function() {
      const date = Date.now() - 1000;
      await redis.zadd("history:guildcount", date, `12:${date}`);

      const res = await historyRetriever.getGuildCountHistory(10);

      assert.strictEqual(res[0].count, 12);
      assert.strictEqual(res[0].timestamp, date);
    });

    it("returns only entries within specified time range", async function() {
      const date = Date.now() - 1000;
      const dateOld = Date.now() - (1000 * 60 * 60 * 6);
      await redis.zadd("history:guildcount", date, `12:${date}`);
      await redis.zadd("history:guildcount", dateOld, `13:${dateOld}`);
      await redis.zadd("history:guildcount", date + 1, `14:${date + 1}`);

      const res = await historyRetriever.getGuildCountHistory(5);

      assert.strictEqual(res.length, 2);
      assert.strictEqual(res[0].count, 12);
      assert.strictEqual(res[1].count, 14);
    });
  });
}