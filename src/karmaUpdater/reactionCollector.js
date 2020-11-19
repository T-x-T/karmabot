import {upvote, downvote, removeUpvote, removeDownvote} from "./karmaUpdater.js";
import configReader from "./configReader.js";

export default _client => {
  const client = _client

  client.on("messageReactionAdd", async (reaction, user) => {
    if(!reaction.emoji.id) return;
    if(user.bot) return;

    if(!reaction.message.author) await reaction.message.channel.messages.fetch(reaction.message.id);

    if(reaction.emoji.id == await configReader.getGuildUpvoteEmoji(reaction.message.guild.id)) upvote(user.id, reaction.message.author.id, reaction.message.guild.id);
    else if(reaction.emoji.id == await configReader.getGuildDownvoteEmoji(reaction.message.guild.id)) downvote(user.id, reaction.message.author.id, reaction.message.guild.id);
  });

  client.on("messageReactionRemove", async (reaction, user) => {
    if(!reaction.emoji.id) return;
    if(user.bot) return;
    
    if(!reaction.message.author) await reaction.message.channel.messages.fetch(reaction.message.id);

    if(reaction.emoji.id == await configReader.getGuildUpvoteEmoji(reaction.message.guild.id)) removeUpvote(user.id, reaction.message.author.id, reaction.message.guild.id);
    else if(reaction.emoji.id == await configReader.getGuildDownvoteEmoji(reaction.message.guild.id)) removeDownvote(user.id, reaction.message.author.id, reaction.message.guild.id);
  });
};