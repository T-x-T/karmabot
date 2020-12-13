let karmaWriter, configReader;

async function connect(_karmaWriter, _configReader){
  karmaWriter = _karmaWriter;
  configReader = _configReader;
}

async function upvote(srcUserId, targetUserId, guildId){
  if(!await isValidVote(srcUserId, targetUserId, guildId)) return;
  
  await Promise.all([
    incrementKarma(targetUserId, guildId),
    commonValidVoteTasks(srcUserId, targetUserId, guildId)
  ]);
}

async function downvote(srcUserId, targetUserId, guildId){
  if(!await isValidVote(srcUserId, targetUserId, guildId)) return;
  
  await Promise.all([
    decrementKarma(targetUserId, guildId),
    commonValidVoteTasks(srcUserId, targetUserId, guildId)
  ]);
}

async function removeUpvote(srcUserId, targetUserId, guildId) {
  if(!await isValidVote(srcUserId, targetUserId, guildId)) return;
  await decrementKarma(targetUserId, guildId);
}

async function removeDownvote(srcUserId, targetUserId, guildId) {
  if(!await isValidVote(srcUserId, targetUserId, guildId)) return;
  await incrementKarma(targetUserId, guildId);
}

async function commonValidVoteTasks(srcUserId, targetUserId, guildId){
  await Promise.all([
    karmaWriter.addVoteTimestamp(srcUserId),
    karmaWriter.addUserToGuildUserListIfNotPresent(targetUserId, guildId),
    karmaWriter.addToUsersIfNotPresent(targetUserId),
    karmaWriter.addToGuildIfNotPresent(guildId)
  ]);
}

async function isValidVote(srcUserId, targetUserId, guildId){
  if(srcUserId === targetUserId) return false;
  if(await configReader.isUserDisabled(targetUserId)) return false;
  if(await configReader.isGuildDisabledInUser(targetUserId, guildId)) return false
  if(await isRateLimited(srcUserId)) return false;

  return true;
}

async function isRateLimited(srcUserId){
  //Ratelimiting check preparation
  let timestamps = await karmaWriter.getVoteTimestamps(srcUserId);
  timestamps.push(Date.now());
  let currentTime = Date.now();

  //user has voted less than 3 times in the past minute
  let votesInPastMinute = 0;
  timestamps.forEach(timestamp => {
    if(timestamp > currentTime - (1000 * 60)) votesInPastMinute++;
  });
  if(votesInPastMinute >= 3) return true;

  //user has voted less than 10 times in the past hour
  let votesInPastHour = 0;
  timestamps.forEach(timestamp => {
    if(timestamp > currentTime - (1000 * 60 * 60)) votesInPastHour++;
  });
  if(votesInPastHour >= 10) return true;

  //user has voted less than 50 times in the past day
  let votesInPastDay = 0;
  timestamps.forEach(timestamp => {
    if(timestamp > currentTime - (1000 * 60 * 60 * 24)) votesInPastDay++;
  });
  if(votesInPastDay >= 50) return true;

  return false;
}

async function incrementKarma(targetUserId, guildId){
  await karmaWriter.incrementKarma(targetUserId);
  await karmaWriter.incrementGuildKarmaOfUser(targetUserId, guildId);
  await karmaWriter.incrementGuildTotalKarma(guildId);
}

async function decrementKarma(targetUserId, guildId){
  await karmaWriter.decrementKarma(targetUserId);
  await karmaWriter.decrementGuildKarmaOfUser(targetUserId, guildId);
  await karmaWriter.decrementGuildTotalKarma(guildId);
}

export {connect, upvote, downvote, removeUpvote, removeDownvote};