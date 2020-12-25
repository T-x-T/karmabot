import karmaRetriever from "./karmaRetriever.js";
import discordFetcher from "./discordFetcher.js";
import router from "../webApi/router.js";

export default async function(){
  handlers.forEach(x => x());
}

let handlers = [
  () => {
    router.register(
      (req) => req.path.startsWith("toplists/users"),
      async (req) => {
        let output = [];

        output = await karmaRetriever.getTopUsers(100);

        let userTags = {};
        await Promise.all(output.map(async element => {
          try {
            userTags[element.userId] = await discordFetcher.getUserTagById(element.userId);
          } catch(e) {
            userTags[element.userId] = "deleted";
          }
        }));

        for(let i = 0; i < output.length; i++) {
          output[i].userTag = userTags[output[i].userId];
        }

        return output;
      }
    )
  },

  () => {
    router.register(
      (req) => req.path.startsWith("toplists/guilds"),
      async (req) => {
        let output = [];
        output = await karmaRetriever.getTopGuilds(100);

        let guildNames = {};
        let memberCounts = {};
        await Promise.all(output.map(async element => {
          try {
            guildNames[element.guildId] = await discordFetcher.getGuildNameById(element.guildId);
            memberCounts[element.guildId] = await discordFetcher.getGuildMemberCount(element.guildId);
          } catch(e) {
            guildNames[element.guildId] = "deleted";
            memberCounts[element.guildId] = 0;
          }
        }));

        for(let i = 0; i < output.length; i++) {
          output[i].guildName = guildNames[output[i].guildId];
          output[i].memberCount = memberCounts[output[i].guildId];
        }

        return output;
      }
    )
  },

  () => {
    router.register(
      (req) => req.path.startsWith("users") && req.path.includes("totalkarma"),
      async (req) => {
        const userId = req.path.split("/")[1];
        const karma = await karmaRetriever.getTotalKarmaOfUser(userId);
        return {
          userId: userId,
          totalkarma: karma
        };
      }
    )
  },

  () => {
    router.register(
      (req) => req.path.startsWith("users") && req.path.includes("guildkarma"),
      async (req) => {
        const userId = req.path.split("/")[1];
        const entries = await karmaRetriever.getGuildKarmaOfAllGuildsOfUser(userId);

        return await Promise.all(entries.map(async entry => {
          try{
            entry.guildName = await discordFetcher.getGuildNameById(entry.guildId);
          }catch(e){
            entry.guildName = "deleted";
          }
          return entry;
        }));
      }
    )
  },

  () => {
    router.register(
      (req) => req.path.startsWith("rank/user") && !req.path.includes("guild") && req.path.includes("global"),
      async (req) => {
        const userId = req.path.split("/")[2];
        const rank = await karmaRetriever.getTotalRankOfUser(userId);
        return {
          userId: userId,
          globalRank: rank
        };
      }
    )
  },

  () => {
    router.register(
      (req) => req.path.startsWith("rank/user") && req.path.includes("/guild/") && req.path.includes("local"),
      async (req) => {
        const userId = req.path.split("/")[2];
        const guildId = req.path.split("/")[4];
        const rank = await karmaRetriever.getGuildRankOfUser(userId, guildId);
        let guildName;
        try{
          guildName = await discordFetcher.getGuildNameById(guildId);
        }catch(e){
          guildName = "deleted";
        }
        return {
          userId: userId,
          guildId: guildId,
          guildName: guildName,
          localGuildRank: rank
        }
      }
    )
  },

  () => {
    router.register(
      (req) => req.path.startsWith("rank/user") && req.path.includes("/guild/") && req.path.includes("global"),
      async (req) => {
        const userId = req.path.split("/")[2];
        const guildId = req.path.split("/")[4];
        const rank = await karmaRetriever.getTotalGuildRankOfUser(userId, guildId);
        let guildName;
        try {
          guildName = await discordFetcher.getGuildNameById(guildId);
        } catch(e) {
          guildName = "deleted";
        }
        return {
          userId: userId,
          guildId: guildId,
          guildName: guildName,
          globalGuildRank: rank
        }
      }
    )
  },

  () => {
    router.register(
      (req) => req.path.startsWith("rank/user") && req.path.includes("/guilds/local"),
      async (req) => {
        const userId = req.path.split("/")[2];
        const ranks = await karmaRetriever.getGuildRankOfAllGuildsOfUser(userId);
        const ranksWithNames = await Promise.all(ranks.map(async (rank) => {
          try {
            rank.guildName = await discordFetcher.getGuildNameById(rank.guildId)
          } catch(e) {
            rank.guildName = "deleted"
          }
          return rank;
        }));
        return ranksWithNames;
      }
    )
  },

  () => {
    router.register(
      (req) => req.path.startsWith("rank/user") && req.path.includes("/guilds/global"),
      async (req) => {
        const userId = req.path.split("/")[2];
        const ranks = await karmaRetriever.getTotalGuildRankOfAllGuildsOfUser(userId);
        const ranksWithNames = await Promise.all(ranks.map(async (rank) => {
          try {
            rank.guildName = await discordFetcher.getGuildNameById(rank.guildId)
          } catch(e) {
            rank.guildName = "deleted"
          }
          return rank;
        }));
        return ranksWithNames;
      }
    )
  },

  () => {
    router.register(
      (req) => req.path.startsWith("rank/guild/"),
      async (req) => {
        const guildId = req.path.split("/")[2];
        const rank = await karmaRetriever.getTotalRankOfGuild(guildId);
        let guildName;
        try {
          guildName = await discordFetcher.getGuildNameById(guildId);
        } catch(e) {
          guildName = "deleted";
        }
        return {
          guildId: guildId,
          guildName: guildName,
          rank: rank
        }
      }
    ) 
  }
];
