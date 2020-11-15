import {upvote, downvote, removeUpvote, removeDownvote} from "./karmaUpdater.js";

export default _client => {
  const client = _client

  client.on("messageReactionAdd", async (reaction, user) => {
    if(!reaction.emoji.id) return;
    if(user.bot) return;

    if(!reaction.message.author) await reaction.message.channel.messages.fetch(reaction.message.id);

    if(reaction.emoji.id == "602200537299026002") upvote(user.id, reaction.message.author.id, reaction.message.guild.id);
    else if(reaction.emoji.id == "602200572673916942") downvote(user.id, reaction.message.author.id, reaction.message.guild.id)
    else console.log("invalid emoji:", reaction.emoji.id);
  });

  client.on("messageReactionRemove", async (reaction, user) => {
    if(!reaction.emoji.id) return;
    if(user.bot) return;
    
    if(!reaction.message.author) await reaction.message.channel.messages.fetch(reaction.message.id);

    if(reaction.emoji.id == "602200537299026002") removeUpvote(user.id, reaction.message.author.id, reaction.message.guild.id);
    else if(reaction.emoji.id == "602200572673916942") removeDownvote(user.id, reaction.message.author.id, reaction.message.guild.id);
    else console.log("invalid emoji:", reaction.emoji.id);
  });
};