import configurator from "./configurator.js";

export default (_client) => {
  const client = _client;

  client.on("guildDelete", async (guild) => {
    await configurator.deleteGuild(guild.id);
  });
};
