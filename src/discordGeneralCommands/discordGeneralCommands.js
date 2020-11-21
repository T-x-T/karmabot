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

  client.on("guildCreate", async guild => {
    let message = `Thanks for inviting me! I hope that we will have lots of fun together :)\n\nPlease configure your upvote/downvote emoji so I can start tracking karma in this server:\n\`${commandPrefix}config server set <upvote|downvote> emoji default\` Instead of default you can just type a custom server emoji to use your own!\n\nFor more help use \`${commandPrefix}help\` and \`${commandPrefix}info\``;
    let channel = guild.systemChannel;
    if(!channel) await (guild.channels.cache.array()).forEach(_channel => {
      if(_channel.name.includes("general")){
        if(channel && channel.name.length > _channel.name.length){
          channel = _channel;
        }else if(!channel){
          channel = _channel;
        }
      }
    });

    if(channel){
      channel.send(message);
    }else{
      (await client.users.fetch(guild.ownerID)).send(message);
    }
  });
}

const topics = {
  "info": info,
  "help show": show,
  "help rank": rank,
  "help top": top,
  "help config": config
};

async function help(message){
  let output = "";

  output += "basic commands:\n";
  output += `\`${commandPrefix}help\`: show this message\n`;
  output += `\`${commandPrefix}info\`: show general info about the bot\n\n`;

  output += `karmabot specific commands (use \`${commandPrefix}help [command]\` to get more help on the following commands):\n`;
  output += `\`${commandPrefix}show\`: show karma of single user\n`;
  output += `\`${commandPrefix}rank\`: show rank of single user\n`;
  output += `\`${commandPrefix}top\`: show top lists\n`;
  output += `\`${commandPrefix}config\`: configure your (servers) experience\n`;
  
  message.channel.send(output);
}

function show(message){
  let output = "";

  output += `\`${commandPrefix}show\`: Show your global karma\n`; 
  output += `\`${commandPrefix}show @mention\`: Show global karma of mentioned user\n`; 
  output += `\`${commandPrefix}show serverkarma\`: Show your server karma\n`; 
  output += `\`${commandPrefix}show serverkarma @mention\`: Show server karma of mentioned user\n`; 
  output += `\`${commandPrefix}show server\`: Show karma of server\n`; 

  message.channel.send(output);
}

function rank(message){
  let output = "";

  output += `\`${commandPrefix}rank\`: Show your global rank\n`; 
  output += `\`${commandPrefix}rank @mention\`: Show global rank of mentioned user\n`; 
  output += `\`${commandPrefix}rank server\`: Show your rank in the current server\n`; 
  output += `\`${commandPrefix}rank server @mention\`: Show rank in the current server of mentioned user\n`; 
  output += `\`${commandPrefix}rank server total\`: Show your rank in the current server based on your global karma\n`; 
  output += `\`${commandPrefix}rank server total @mention\`: Show rank in the current server based on global karma of mentioned user\n`; 
  
  message.channel.send(output);
}

function top(message) {
  let output = "";

  output += `\`${commandPrefix}top\`: Show top 10 users in current server\n`;
  output += `\`${commandPrefix}top total\`: Show top 10 users in current server based on global karma\n`;

  message.channel.send(output);
}

function config(message) {
  let output = "";

  output += "User config commands:"
  output += `\`${commandPrefix}config disable/enable\`: Disables/Enables you, this will stop counting your karma and displaying you in any output\n`;
  output += `\`${commandPrefix}config disable/enable server\`: Disables/Enables you in the current server, this will stop counting your karma in the server and stop displaying you in any output specific to this server\n`;
  
  output += "Server config commands (must be sent by an admin):"
  output += `\`${commandPrefix}config server disable/enable\`: Disables/Enables the current server, this will stop showing any output specific to this server.\n`;
  output += `\`${commandPrefix}config server set upvote emoji _your custom emoji here_\`: Sets the server specific upvote emoji. React to messages with this emoji to upvote them.\n`;
  output += `\`${commandPrefix}config server set downvote emoji _your custom emoji here_\`: Sets the server specific downvote emoji. React to messages with this emoji to downvote them.\n`;
  output += "(Both emojis can be the same, but thats kinda stupid)";


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
