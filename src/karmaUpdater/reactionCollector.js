import Discord from "discord.js"; 
const client = new Discord.Client({
    partials: ['USER', 'REACTION', 'MESSAGE']
});
import {upvote, downvote, removeUpvote, removeDownvote} from "./karmaUpdater.js";

function login(token){
  client.login(token);
}

client.once("ready", () => {
  console.log("reactionCollector logged in");
});

client.on("messageReactionAdd", async (reaction, user) => {
  if(!reaction.emoji.id) return;
  if(user.bot) return;

  if(!reaction.message.author) await reaction.message.channel.messages.fetch(reaction.message.id);


  if(reaction.emoji.id == "602200537299026002") upvote(user.id, reaction.message.author);
  else if(reaction.emoji.id == "602200572673916942") downvote(user.id, reaction.message.author)
  else console.log("invalid emoji:", reaction.emoji.id);
});

client.on("messageReactionRemove", async (reaction, user) => {
  if(!reaction.emoji.id) return;
  if(user.bot) return;

  if(!reaction.message.author) await reaction.message.channel.messages.fetch(reaction.message.id);

  if(reaction.emoji.id == "602200537299026002") removeUpvote(user.id, reaction.message.author);
  else if(reaction.emoji.id == "602200572673916942") removeDownvote(user.id, reaction.message.author)
  else console.log("invalid emoji:", reaction.emoji.id);
});


export default login;