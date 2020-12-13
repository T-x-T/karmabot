let configReaderWriter;

export default {
  async connect(_configReaderWriter){
    configReaderWriter = _configReaderWriter;
  },

  async disableUser(userId){
    if(!userId) throw new Error("No userId given");
    return await configReaderWriter.disableUser(userId);
  },

  async enableUser(userId){
    if(!userId) throw new Error("No userId given");
    return await configReaderWriter.enableUser(userId);
  },

  async disableGuildinUser(userId, guildId){
    if(!userId) throw new Error("No userId given");
    if(!guildId) throw new Error("No guildId given");
    return await configReaderWriter.disableGuildinUser(userId, guildId);
  },

  async enableGuildInUser(userId, guildId){
    if(!userId) throw new Error("No userId given");
    if(!guildId) throw new Error("No guildId given");
    return await configReaderWriter.enableGuildInUser(userId, guildId);
  },

  async disableGuild(guildId){
    if(!guildId) throw new Error("No guildId given");
    return await configReaderWriter.disableGuild(guildId);
  },

  async enableGuild(guildId){
    if(!guildId) throw new Error("No guildId given");
    return await configReaderWriter.enableGuild(guildId);
  },

  async setUpvoteEmoji(guildId, emojiId){
    if(!guildId) throw new Error("No guildId given");
    if(!emojiId) throw new Error("No emojiId given");
    return await configReaderWriter.setUpvoteEmoji(guildId, emojiId);
  },

  async setDownvoteEmoji(guildId, emojiId){
    if(!guildId) throw new Error("No guildId given");
    if(!emojiId) throw new Error("No emojiId given");
    return await configReaderWriter.setDownvoteEmoji(guildId, emojiId);
  }
}