let client;

export default {
  async connect(_client){
    client = _client;
  },

  async getUserTagById(userId){
    return (await client.users.fetch(userId)).tag;
  },

  async getGuildNameById(guildId){
    return (await client.guilds.fetch(guildId)).name;
  }
}