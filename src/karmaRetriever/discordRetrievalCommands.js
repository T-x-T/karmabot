import karmaRetriever from "./karmaRetriever.js";
import Discord from "discord.js";

export default (_client, _commandPrefix) => {
  const commandPrefix = _commandPrefix + " ";
  const client = _client;

  client.on("message", message => {
    let content = message.content.toLowerCase();

    if(message.author.bot) return;
    if(!content.startsWith(commandPrefix + "show") && !content.startsWith(commandPrefix + "rank") && !content.startsWith(commandPrefix + "top")) return;
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
        .setDescription("Sum of all karma of current server")
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
        .setDescription("Karma of user in current server")
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
        .setDescription("Karma of user across all servers")
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

  if(subcommand.startsWith("server global")){
    //+karma rank server global [@mention]: show global rank of author or mentioned user
    try{
      let rank = await karmaRetriever.getTotalRankOfUser(targetUser);
      let karma = await karmaRetriever.getTotalKarmaOfUser(targetUser);
      const embed = new Discord.MessageEmbed()
        .setColor("#000000")
        .setTitle(rank)
        .setDescription("Rank of users from current server by their global karma")
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
  }else if(subcommand.startsWith("server total")){
    //+karma rank server total: show rank of current guild
    try {
      let rank = await karmaRetriever.getTotalRankOfGuild(message.guild.id);
      let karma = await karmaRetriever.getTotalKarmaOfGuild(message.guild.id);
      const embed = new Discord.MessageEmbed()
        .setColor("#000000")
        .setTitle(rank)
        .setDescription("Rank of servers by their karma")
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
        .setDescription("Rank of users by their karma in current server")
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
        .setDescription("Rank of all users by their global karma")
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
  if(subcommand.startsWith("global")){
    //+karma top global: show top 10 users in current guild by global karma
    try{
      let topList = await karmaRetriever.getTopUsersOfGuildTotal(10, message.guild.id);
      let output = `Showing Top 10 users of ${message.guild.name} based on their global karma:\n`;
      output += await convertTopListToTable(topList, message);
      message.channel.send(output);
    }catch(e){
      message.channel.send(`Oopsie, something went wrong: ${e.message}`);
    }
  }else{
    //+karma top: show top 10 users current guild by guild karma
    try {
      let topList = await karmaRetriever.getTopUsersOfGuild(10, message.guild.id);
      let output = `Showing Top 10 users of ${message.guild.name} based on their karma in current server:\n`;
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