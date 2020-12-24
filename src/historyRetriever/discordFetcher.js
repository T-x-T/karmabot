let client;

export default {
  async connect(_client) {
    client = _client;
  },
  
  async getGuildNameById(guildId) {
    return (await client.guilds.fetch(guildId)).name;
  }
}