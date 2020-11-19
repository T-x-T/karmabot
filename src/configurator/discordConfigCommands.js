import configurator from "./configurator.js";

let commandPrefix = "";

export default (_client, _commandPrefix) => {
  commandPrefix = _commandPrefix + " ";
  const client = _client;

  client.on("message", message => {
    let content = message.content.toLowerCase();

    if(message.author.bot) return;
    if(!content.startsWith(commandPrefix + "config")) return;
    
    content = content.replace(commandPrefix, "");
    let command = content.replace("config ", "");
    for(let executor in commandRoutes){
      if(command.startsWith(executor)){
        commandRoutes[executor](message);
        break;
      }
    }
  });
}

//+karma config disable - disables message author
//+karma config enable - enables message author
//+karma config disable server - disables given server in author
//+karma config enable server - enables given server in author

//+karma config server disable - disables guild the message was sent in - must be sent by an admin!
//+karma config server enable - enables guild the message was sent in - must be sent by an admin!
//+karma config server set upvote emoji <emoji> - sets given emoji as upvote emoji
//+karma config server set downvote emoji <emoji> - sets given emoji as downvote emoji

const commandRoutes = {
  "disable server": disableGuildInUser,
  "enable server": enableGuildInUser,
  "disable": disableUser,
  "enable": enableUser,
  "server disable": disableGuild,
  "server enable": enableGuild,
  "server set upvote": setUpvoteEmoji,
  "server set downvote": setDownvoteEmoji
};

async function disableUser(message){
  try{
    await configurator.disableUser(message.author.id);
    message.channel.send(`Disabled <@${message.author.id}>, their karma won't be counted and they won't be shown in any output anymore.\nTo enable again use ${commandPrefix}config enable`);
  }catch(e){
    message.channel.send(`I am very sorry, this didn't work. Here is why: ${e.message}`);
  }
}

async function enableUser(message) {
  try {
    await configurator.enableUser(message.author.id);
    message.channel.send(`Enabled <@${message.author.id}>, their karma will be counted and they will be shown in output again.\nTo disable again use ${commandPrefix}config disable`);
  } catch(e) {
    message.channel.send(`I am very sorry, this didn't work. Here is why: ${e.message}`);
  }
}

async function disableGuildInUser(message) {
  if(!message.guild){
    message.channel.send("This command works only in servers at the moment. Please use this command in the server you want to disable.");
    return;
  }

  try{
    await configurator.disableGuildinUser(message.author.id, message.guild.id);
    message.channel.send(`<@${message.author.id}> will not be receiving any karma in ${message.guild.name} and won't be shown in top lists of this guild\nTo enable again use ${commandPrefix}config enable server`);
  }catch(e){
    message.channel.send(`I am very sorry, this didn't work. Here is why: ${e.message}`);
  }
}

async function enableGuildInUser(message) {
  if(!message.guild) {
    message.channel.send("This command works only in servers at the moment. Please use this command in the server you want to enable.");
    return;
  }

  try {
    await configurator.enableGuildInUser(message.author.id, message.guild.id);
    message.channel.send(`<@${message.author.id}> will receive karma in ${message.guild.name} and will be shown in top lists of this guild again\nTo disable again use ${commandPrefix}config disable server`);
  } catch(e) {
    message.channel.send(`I am very sorry, this didn't work. Here is why: ${e.message}`);
  }
}

async function disableGuild(message) {
  if(!message.guild) {
    message.channel.send("This command works only in servers at the moment. Please use this command in the server you want to disable.");
    return;
  }

  if(!(await authorIsAdmin(message))){
    message.channel.send("You must have the administrator permission to configure server");
    return;
  }

  try {
    await configurator.disableGuild(message.guild.id);
    message.channel.send(`${message.guild.name} is now disabled.\nTo enable again use ${commandPrefix}config server enable`);
  } catch(e) {
    message.channel.send(`I am very sorry, this didn't work. Here is why: ${e.message}`);
  }
}

async function enableGuild(message) {
  if(!message.guild) {
    message.channel.send("This command works only in servers at the moment. Please use this command in the server you want to enable.");
    return;
  }

  if(!(await authorIsAdmin(message))) {
    message.channel.send("You must have the administrator permission to configure server");
    return;
  }

  try {
    await configurator.enableGuild(message.guild.id);
    message.channel.send(`${message.guild.name} is now enabled.\nTo disable again use ${commandPrefix}config server disable`);
  } catch(e) {
    message.channel.send(`I am very sorry, this didn't work. Here is why: ${e.message}`);
  }
}

async function setUpvoteEmoji(message) {
  if(!message.guild) {
    message.channel.send("This command works only in servers.");
    return;
  }

  if(!(await authorIsAdmin(message))) {
    message.channel.send("You must have the administrator permission to configure server");
    return;
  }

  try {
    let emojiId = extractEmojiId(message);
    if(!emojiId) return;

    let emoji = await message.guild.emojis.cache.get(emojiId);

    if(isValidEmoji(emoji, message.guild.id)){
      await configurator.setUpvoteEmoji(message.guild.id, emojiId.trim());
      message.channel.send(`The new upvote emoji of ${message.guild.name} is ${emoji}! React with this emoji to messages to upvote them.`);
    }else{
      message.channel.send("This isn't a valid emoji! You can only use custom emojis of this server.");
    }
  } catch(e) {
    message.channel.send(`I am very sorry, this didn't work. Here is why: ${e.message}`);
  }
}

async function setDownvoteEmoji(message) {
  if(!message.guild) {
    message.channel.send("This command works only in servers.");
    return;
  }

  if(!(await authorIsAdmin(message))) {
    message.channel.send("You must have the administrator permission to configure server");
    return;
  }

  try {
    let emojiId = extractEmojiId(message);
    if(!emojiId) return;

    let emoji = await message.guild.emojis.cache.get(emojiId);

    if(isValidEmoji(emoji, message.guild.id)) {
      await configurator.setDownvoteEmoji(message.guild.id, emojiId.trim());
      message.channel.send(`The new downvote emoji of ${message.guild.name} is ${emoji}! React with this emoji to messages to downvote them.`);
    } else {
      message.channel.send("This isn't a valid emoji! You can only use custom emojis of this server.");
    }
  } catch(e) {
    message.channel.send(`I am very sorry, this didn't work. Here is why: ${e.message}`);
  }
}

function extractEmojiId(message){
  let words = message.content.split(" ");

  if(words.length !== 7) {
    message.channel.send("Invalid amount of arguments");
    return;
  }

  let emojiId;
  try {
    emojiId = words[words.length - 1].split(":")[2].replace(">", "");
  } catch(e) {
    message.channel.send("You can only use custom server emojis!");
    return;
  }

  return emojiId;
}

function isValidEmoji(emoji, guildId){
  return emoji && emoji.guild && emoji.guild.id && emoji.guild.id === guildId;
}

async function authorIsAdmin(message){
  return await message.guild.members.cache.get(message.author.id).hasPermission("ADMINISTRATOR");
}
