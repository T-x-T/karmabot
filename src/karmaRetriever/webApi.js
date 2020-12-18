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
  }
];