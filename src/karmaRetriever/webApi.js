import karmaRetriever from "./karmaRetriever.js";
import discordFetcher from "./discordFetcher.js";

export default async function(req){
  req.path = req.path.replace("/api/v1/", "");

  if(req.path.startsWith("toplists/users")){
    return await getTopUsers(req);
  } else if(req.path.startsWith("toplists/guilds")){
    return await getTopGuilds(req);
  } else if(req.path.startsWith("history/totalkarma")){
    return await getHistoryTotalKarma(req);
  } else if(req.path.startsWith("history/userkarma/")) {
    return await getHistoryUserKarma(req);
  } else if(req.path.startsWith("history/guildkarma/") && req.path.includes("/totalkarma")) {
    return await getHistoryGuildKarma(req);
  } else if(req.path.startsWith("history/guildkarma/") && req.path.includes("/userkarma/")) {
    return await getHistoryUserInGuildKarma(req);
  } else {
    throw new Error("API resource doesnt exist in v1 API");
  }
}

async function getTopUsers(req){
  let output = [];

  output = await karmaRetriever.getTopUsers(100);

  let userTags = {};
  await Promise.all(output.map(async element => {
    try{
      userTags[element.userId] = await discordFetcher.getUserTagById(element.userId);
    }catch(e){
      userTags[element.userId] = "deleted";
    }
  }));

  for(let i = 0; i < output.length; i++){
    output[i].userTag = userTags[output[i].userId];
  }

  return output;
}

async function getTopGuilds(req){
  let output = [];
  output = await karmaRetriever.getTopGuilds(100);

  let guildNames = {};
  let memberCounts = {};
  await Promise.all(output.map(async element => {
    try{
      guildNames[element.guildId] = await discordFetcher.getGuildNameById(element.guildId);
      memberCounts[element.guildId] = await discordFetcher.getGuildMemberCount(element.guildId);
    }catch(e){
      guildNames[element.guildId] = "deleted";
      memberCounts[element.guildId] = 0;
    }
  }));

  for(let i = 0; i < output.length; i++){
    output[i].guildName = guildNames[output[i].guildId];
    output[i].memberCount = memberCounts[output[i].guildId];
  }

  return output;
}

async function getHistoryTotalKarma(req){
  const hoursInPast = req.query.hoursInPast ? req.query.hoursInPast : 24 * 7;
  return await karmaRetriever.getTotalKarmaHistory(hoursInPast);
}

async function getHistoryUserKarma(req){
  const hoursInPast = req.query.hoursInPast ? req.query.hoursInPast : 24 * 7;
  const userId = req.path.split("/")[2];
  return await karmaRetriever.getUserKarmaHistory(hoursInPast, userId);
}

async function getHistoryGuildKarma(req){
  const hoursInPast = req.query.hoursInPast ? req.query.hoursInPast : 24 * 7;
  const guildId = req.path.split("/")[2];
  return await karmaRetriever.getGuildKarmaHistory(hoursInPast, guildId);
}

async function getHistoryUserInGuildKarma(req){
  const hoursInPast = req.query.hoursInPast ? req.query.hoursInPast : 24 * 7;
  const userId = req.path.split("/")[4];
  const guildId = req.path.split("/")[2];
  return await karmaRetriever.getUserInGuildKarmaHistory(hoursInPast, userId, guildId);
}