import Discord from "discord.js";

let commandPrefix = "";
let client;

export default (_client, _commandPrefix) => {
  commandPrefix = _commandPrefix + " ";
  client = _client;

  client.on("message", message => {
    let content = message.content.toLowerCase();
    
    if(message.author.bot) return;
    if(!content.startsWith(commandPrefix + "help") && !content.startsWith(commandPrefix + "info")) return;

    content = content.replace(commandPrefix, "");
    let command = content.replace("config ", "");
    for(let executor in topics) {
      if(command.startsWith(executor)) {
        topics[executor](message);
        return;
      }
    }
    //Default
    help(message);
  });

  client.on("guildCreate", guild => {
    guild.systemChannel.send(`Thanks for inviting me, please configure your upvote/downvote emoji so I can start tracking karma in this server:\n${commandPrefix}config server set <upvote|downvote> emoji <emoji>\nfor more help use '${commandPrefix}help' and '${commandPrefix}info`);
  });
}

const topics = {
  info: info
};

async function help(message){
  let output = "";

  output += `Listing all commands\n`;
  output += "Syntax: <mandatory choice> <mandatory option 1|mandatory option 2> [optional choice] [optional option 1|optional option 2]\n\n";
  output += `The prefix ${commandPrefix}must be written infront of all commands\n`;
  output += "If you dont @mention, the bot takes you instead\n";
  output += "`help ` show this message\n\n";
  output += "`info` show info\n\n";
  output += "`show [@mention|serverkarma[@mention]|server]` show [total karma of @mention|karma in server of @mention|karma of server]\n\n";
  output += "`rank [@mention|server total [@mention]|server global|server [@mention]]` rank [total rank of @mention|rank in server based on total karma of @mention|rank of server|rank in server of @mention]\n\n";
  output += "`top [total]` show top 10 users in server [by total karma]\n\n";
  output += "`config <disable|enable>` disables|enables you, this means your karma won't be counted and you won't be shown in any output when disabled. Can be DMed to the bot\n\n";
  output += "`config <disable|enable> server` disables|enables current server. You won't be shown as part of the current server in any output when disabled.\n\n";
  output += "`config server <disable|enable>` disables|enables server this was sent in. Server won't be shown in any output when disabled. Must be sent by an admin\n\n";
  output += "`config server set <upvote|downvote> emoji <emoji>` sets up the <upvote|downvote> emoji of server. <emoji> must be a custom server emoji. Must be sent by an admin";

  message.channel.send(output);
}

async function info(message){
  let userCount = 0;
  client.guilds.cache.array().forEach(guild => userCount += guild.memberCount);

  const embed = new Discord.MessageEmbed()
    .setColor("#000000")
    .setTitle("Info")
    .setDescription("Shows some general info about the bot")
    .addField("guilds", client.guilds.cache.array().length, true)
    .addField("users", userCount, true)
    .addField("invite", "[click me](https://discord.com/oauth2/authorize?client_id=779060613590548521&scope=bot&permissions=1073859648)", true)
    .addField("creator", "Txt#0001", true)
    .addField("website", "https://thetxt.io", true)
    .addField("repo", "https://gitlab.com/T-x-T/karmabot", true)
    .addField("send bug reports to", "incoming+t-x-t-karmabot-22359119-issue-@incoming.gitlab.com")
    .setTimestamp()
    .setFooter(`Generated on request of ${message.author.tag}`);

  message.channel.send(embed);
}
