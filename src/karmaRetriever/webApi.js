import karmaRetriever from "./karmaRetriever.js";
import discordFetcher from "./discordFetcher.js";

export default async function(req){
  req.path = req.path.replace("/api/v1/", "");
  switch(req.path){
    case "toplists/users":
      return await getTopUsers(req);
    case "toplists/guilds":
      return await getTopGuilds(req);
    default:
      throw new Error("API resource doesnt exist in v1 API");
  }
}

async function getTopUsers(req){
  let output = [];

  output = await karmaRetriever.getTopUsers(100);

  let userTags = {};
  await Promise.all(output.map(async element => {
    userTags[element.userId] = await discordFetcher.getUserTagById(element.userId);
  }));

  for(let i = 0; i < output.length; i++){
    output[i].userTag = userTags[output[i].userId];
    delete output[i].userId;
  }

  return output;
}

async function getTopGuilds(req){
  let output = [];
  output = await karmaRetriever.getTopGuilds(100);

  let guildNames = {};
  await Promise.all(output.map(async element => {
    guildNames[element.guildId] = await discordFetcher.getGuildNameById(element.guildId);
  }));

  for(let i = 0; i < output.length; i++){
    output[i].guildName = guildNames[output[i].guildId];
    delete output[i].guildId;
  }

  return output;
}