import karmaRetriever from "./karmaRetriever.js";
import Discord from "discord.js";

export default (_client, _commandPrefix) => {
  const commandPrefix = _commandPrefix + " ";
  const client = _client;

  client.on("message", message => {
    let content = message.content.toLowerCase();

    if(message.author.bot) return;
    if(!content.startsWith(commandPrefix)) return;
    if(!message.guild){
      message.channel.send("I only work in servers at the moment");
      return;
    } 
    
    content = content.replace(commandPrefix, "");
    let command = content.split(" ")[0];
    if(typeof commandRoutes[command] === "function") {
      commandRoutes[command](message, content.replace(command, "").trim());
    }
  });
}

//Commands:
//+karma show [@mention]: show karma of author or mentioned user
//+karma show serverkarma [@mention]: show karma in current guild of author or mentioned user
//+karma show server: show total karma of current server
//+karma rank [@mention]: show total rank of author or mentioned user
//+karma rank server total [@mention]: show total rank of author or mentioned user
//+karma rank server global: show rank of current guild
//+karma rank server [@mention]: show rank in server of author or mentioned user
//+karma top: show top 10 users current guild by guild karma
//+karma top total: show top 10 users in current guild by total karma

const commandRoutes = {
  show: show,
  rank: rank,
  top: top
};

async function show(message, subcommand){
  const targetUser = message.mentions.users.first() ? message.mentions.users.first().id : message.author.id;
  
  if(subcommand.startsWith("server total")){
    //+karma show server total: show total karma of current server
    try {
      let karma = await karmaRetriever.getTotalKarmaOfGuild(message.guild.id);
      const embed = new Discord.MessageEmbed()
        .setColor("#000000")
        .setTitle(karma)
        .setDescription("Sum of all karma received in server")
        .addField("server", message.guild.name, true)
        .addField("members", message.guild.memberCount, true)
        .setTimestamp()
        .setFooter(`Generated on request of ${message.author.tag}`);

      if(karma < 0) embed.setColor("#FF0000");
      if(karma > 0) embed.setColor("#00FF00");
      message.channel.send(embed);
    } catch(e) {
      message.channel.send(`Oopsie, something went wrong: ${e.message}`);
    }
  }else if(subcommand.startsWith("server")){
    //+karma show server [@mention]: show karma in current guild of author or mentioned user
    try {
      let karma = await karmaRetriever.getTotalKarmaOfUserInGuild(targetUser, message.guild.id);
      const embed = new Discord.MessageEmbed()
        .setColor("#000000")
        .setTitle(karma)
        .setDescription("Karma in server")
        .addField("user", `<@${targetUser}>`, true)
        .addField("server", message.guild.name, true)
        .setTimestamp()
        .setFooter(`Generated on request of ${message.author.tag}`);

      if(karma < 0) embed.setColor("#FF0000");
      if(karma > 0) embed.setColor("#00FF00");
      message.channel.send(embed);
    } catch(e) {
      message.channel.send(`Oopsie, something went wrong: ${e.message}`);
    }
  }else{
    //+karma show [@mention]: show karma of author or mentioned user
    try{
      let karma = await karmaRetriever.getTotalKarmaOfUser(targetUser);
      const embed = new Discord.MessageEmbed()
        .setColor("#000000")
        .setTitle(karma)
        .setDescription("Karma received across all servers")
        .addField("user", `<@${targetUser}>`, true)
        .addField("bot", (await message.guild.members.fetch(targetUser)).user.bot ? "yes" : "no", true)
        .setTimestamp()
        .setFooter(`Generated on request of ${message.author.tag}`);

      if(karma < 0) embed.setColor("#FF0000");
      if(karma > 0) embed.setColor("#00FF00");
      message.channel.send(embed);
    }catch(e){
      message.channel.send(`Oopsie, something went wrong: ${e.message}`);
    }
  }
}

async function rank(message, subcommand){
  const targetUser = message.mentions.users.first() ? message.mentions.users.first().id : message.author.id;

  if(subcommand.startsWith("server total")){
    //+karma rank server total [@mention]: show total rank of author or mentioned user
    try{
      let rank = await karmaRetriever.getTotalRankOfUser(targetUser);
      let karma = await karmaRetriever.getTotalKarmaOfUser(targetUser);
      const embed = new Discord.MessageEmbed()
        .setColor("#000000")
        .setTitle(rank)
        .setDescription("Rank of users in this server by karma across all guilds")
        .addField("karma", karma)
        .addField("user", `<@${targetUser}>`, true)
        .addField("bot", (await message.guild.members.fetch(targetUser)).user.bot ? "yes" : "no", true)
        .setTimestamp()
        .setFooter(`Generated on request of ${message.author.tag}`);

      if(karma < 0) embed.setColor("#FF0000");
      if(karma > 0) embed.setColor("#00FF00");
      message.channel.send(embed);
    }catch(e){
      if(e.message === "user not found"){
        message.channel.send("User not found, maybe they haven't received a vote yet?");
      }else{
        message.channel.send(`Oopsie, something went wrong: ${e.message}`);
      }
    }
  }else if(subcommand.startsWith("server global")){
    //+karma rank server global: show rank of current guild
    try {
      let rank = await karmaRetriever.getTotalRankOfGuild(message.guild.id);
      let karma = await karmaRetriever.getTotalKarmaOfGuild(message.guild.id);
      const embed = new Discord.MessageEmbed()
        .setColor("#000000")
        .setTitle(rank)
        .setDescription("Rank of server counting all karma received in server")
        .addField("karma", karma)
        .addField("server", message.guild.name, true)
        .addField("members", message.guild.memberCount, true)
        .setTimestamp()
        .setFooter(`Generated on request of ${message.author.tag}`);

      if(karma < 0) embed.setColor("#FF0000");
      if(karma > 0) embed.setColor("#00FF00");
      message.channel.send(embed);
    } catch(e) {
      message.channel.send(`Oopsie, something went wrong: ${e.message}`);
    }
  }else if(subcommand.startsWith("server")) {
    //+karma rank server [@mention]: show rank in server of author or mentioned user
    try {
      let rank = await karmaRetriever.getGuildRankOfUser(targetUser, message.guild.id);
      let karma = await karmaRetriever.getTotalKarmaOfUserInGuild(targetUser, message.guild.id);
      const embed = new Discord.MessageEmbed()
        .setColor("#000000")
        .setTitle(rank)
        .setDescription("Rank of users in this server by karma in this server")
        .addField("karma", karma)
        .addField("user", `<@${targetUser}>`, true)
        .addField("bot", (await message.guild.members.fetch(targetUser)).user.bot ? "yes" : "no", true)
        .setTimestamp()
        .setFooter(`Generated on request of ${message.author.tag}`);

      if(karma < 0) embed.setColor("#FF0000");
      if(karma > 0) embed.setColor("#00FF00");
      message.channel.send(embed);
    } catch(e) {
      if(e.message === "user not found") {
        message.channel.send("User not found, maybe they haven't received a vote yet?");
      } else {
        message.channel.send(`Oopsie, something went wrong: ${e.message}`);
      }
    }
  }else{
    //+karma rank [@mention]: show total rank of author or mentioned user
    try {
      let rank = await karmaRetriever.getTotalRankOfUser(targetUser);
      let karma = await karmaRetriever.getTotalKarmaOfUser(targetUser);
      const embed = new Discord.MessageEmbed()
        .setColor("#000000")
        .setTitle(rank)
        .setDescription("Rank of users globally by karma")
        .addField("karma", karma)
        .addField("user", `<@${targetUser}>`, true)
        .addField("bot", (await message.guild.members.fetch(targetUser)).user.bot ? "yes" : "no", true)
        .setTimestamp()
        .setFooter(`Generated on request of ${message.author.tag}`);

      if(karma < 0) embed.setColor("#FF0000");
      if(karma > 0) embed.setColor("#00FF00");
      message.channel.send(embed);
    } catch(e) {
      if(e.message === "user not found") {
        message.channel.send("User not found, maybe they haven't received a vote yet?");
      } else {
        message.channel.send(`Oopsie, something went wrong: ${e.message}`);
      }
    }
  }
}

async function top(message, subcommand){
  if(subcommand.startsWith("total")){
    //+karma top total: show top 10 users in current guild by total karma
    try{
      let topList = await karmaRetriever.getTopUsersOfGuildTotal(10, message.guild.id);
      let output = `Showing Top 10 users of ${message.guild.name} based on their total karma gained across all servers:\n`;
      output += await convertTopListToTable(topList, message);
      message.channel.send(output);
    }catch(e){
      message.channel.send(`Oopsie, something went wrong: ${e.message}`);
    }
  }else{
    //+karma top: show top 10 users current guild by guild karma
    try {
      let topList = await karmaRetriever.getTopUsersOfGuildTotal(10, message.guild.id);
      let output = `Showing Top 10 users of ${message.guild.name} based on their karma gained in this server:\n`;
      output += await convertTopListToTable(topList, message);
      message.channel.send(output);
    } catch(e) {
      message.channel.send(`Oopsie, something went wrong: ${e.message}`);
    }
  }
}

async function convertTopListToTable(topList, message){
  let output = "```Rank Karma Name\n";
  for(let i = 0; i < topList.length; i++) {
    let user = await message.guild.members.fetch(topList[i].userId);
    let username = user.nickname ? user.nickname : user.user.tag;

    let rank = i;
    rank++;
    rank = rank.toString() + ".";
    while(rank.length <= 3) rank += " ";

    let karma = topList[i].karma.toString();
    while(karma.length <= 5) karma += " ";
    if(!karma.startsWith("-")) {
      karma = " " + karma;
    } else {
      karma = karma + " ";
    }

    output += `${rank}${karma}${username}\n`;
  }
  output += "```";
  return output;
}