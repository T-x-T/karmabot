import Discord from "discord.js";

let client, infoReader, clientId, botToken;

export default async (_client, _infoReader, _clientId, _botToken) => {
  client = _client;
  infoReader = _infoReader;
  clientId = _clientId;
  botToken = _botToken;

  client.on(Discord.Events.GuildCreate, async (_guild) => {
    let guild;
    if (_guild.available) {
      guild = _guild;
    } else {
      guild = await _guild.fetch();
    }
    let message = `Thanks for inviting me! I hope that we will have lots of fun together :)\n\nPlease configure your upvote/downvote emoji so I can start tracking karma in this server:\n\`/config server <upvote|downvote> default\` Instead of default you can just type a custom server emoji to use your own!\n`;
    let channel = guild.systemChannel;

    if (channel) {
      channel.send(message);
    } else {
      (await client.users.fetch(guild.ownerId)).send(message);
    }
  });
};
