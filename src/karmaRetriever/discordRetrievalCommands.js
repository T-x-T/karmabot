import karmaRetriever from "./karmaRetriever.js";
import Discord from "discord.js";

export default async (interaction) => {
  const subcommand = interaction.options.getSubcommand();

  let guild;
  if (interaction.guild.available) {
    guild = interaction.guild;
  } else {
    guild = await interaction.guild.fetch();
  }

  const targetUser = interaction.options.getUser("user") ?? interaction.user;

  switch (subcommand) {
    case "total_server_karma": {
      await total_server_karma(interaction, guild);
      break;
    }
    case "total_server_karma_of_user": {
      await total_server_karma_of_user(interaction, guild, targetUser);
      break;
    }
    case "total_karma_of_user": {
      await total_karma_of_user(interaction, guild, targetUser);
      break;
    }
    case "rank_server_global": {
      await rank_server_global(interaction, guild, targetUser);
      break;
    }
    case "rank_of_user_in_server": {
      await rank_of_user_in_server(interaction, guild);
      break;
    }
    case "rank_of_user_in_server_total": {
      await rank_of_user_in_server_total(interaction, guild, targetUser);
      break;
    }
    case "top_global": {
      await top_global(interaction, guild);
      break;
    }
    case "top_server": {
      await top_server(interaction, guild);
      break;
    }
  }
};

async function total_server_karma(interaction, guild) {
  try {
    let karma = await karmaRetriever.getTotalKarmaOfGuild(guild.id);
    const embed = new Discord.EmbedBuilder()
      .setColor(karma < 0 ? "#FF0000" : karma > 0 ? "#00FF00" : "#000000")
      .setTitle(`${karma}`)
      .setDescription("Sum of all karma of current server")
      .addFields(
        {
          name: "server",
          value: `${guild.name}`,
        },
        {
          name: "members",
          value: `${guild.memberCount}`,
        }
      )
      .setTimestamp()
      .setFooter({
        text: `Generated on request of @${interaction.user.username}`,
      });

    await interaction.reply({
      embeds: [embed],
    });
  } catch (e) {
    console.error(e);
    await interaction.reply(`Oopsie, something went wrong: ${e.message}`);
  }
}
async function total_server_karma_of_user(interaction, guild, targetUser) {
  try {
    let karma = await karmaRetriever.getTotalKarmaOfUserInGuild(
      targetUser,
      guild.id
    );
    const embed = new Discord.EmbedBuilder()
      .setColor(karma < 0 ? "#FF0000" : karma > 0 ? "#00FF00" : "#000000")
      .setTitle(`${karma}`)
      .setDescription("Karma of user in current server")
      .addFields(
        {
          name: "user",
          value: `${targetUser}`,
        },
        {
          name: "server",
          value: `${guild.name}`,
        }
      )
      .setTimestamp()
      .setFooter({
        text: `Generated on request of @${interaction.user.username}`,
      });

    await interaction.reply({
      embeds: [embed],
    });
  } catch (e) {
    console.error(e);
    await interaction.reply(`Oopsie, something went wrong: ${e.message}`);
  }
}
async function total_karma_of_user(interaction, guild, targetUser) {
  try {
    let karma = await karmaRetriever.getTotalKarmaOfUser(targetUser);
    const embed = new Discord.EmbedBuilder()
      .setColor(karma < 0 ? "#FF0000" : karma > 0 ? "#00FF00" : "#000000")
      .setTitle(`${karma}`)
      .setDescription("Karma of user across all servers")
      .addFields(
        {
          name: "user",
          value: `${targetUser}`,
        },
        {
          name: "bot",
          value: (await guild.members.fetch(targetUser)).user.bot
            ? "yes"
            : "no",
        }
      )
      .setTimestamp()
      .setFooter({
        text: `Generated on request of @${interaction.user.username}`,
      });

    await interaction.reply({
      embeds: [embed],
    });
  } catch (e) {
    console.error(e);
    await interaction.reply(`Oopsie, something went wrong: ${e.message}`);
  }
}
async function rank_server_global(interaction, guild) {
  try {
    let rank = await karmaRetriever.getTotalRankOfGuild(guild.id);
    let karma = await karmaRetriever.getTotalKarmaOfGuild(guild.id);
    const embed = new Discord.EmbedBuilder()
      .setColor(karma < 0 ? "#FF0000" : karma > 0 ? "#00FF00" : "#000000")
      .setTitle(`${rank}`)
      .setDescription("Rank of server by its total karma")
      .addFields(
        {
          name: "karma",
          value: `${karma}`,
        },
        {
          name: "server",
          value: `${guild.name}`,
        },
        {
          name: "members",
          value: `${guild.approximateMemberCount}`,
        }
      )
      .setTimestamp()
      .setFooter({
        text: `Generated on request of @${interaction.user.username}`,
      });

    await interaction.reply({
      embeds: [embed],
    });
  } catch (e) {
    console.error(e);
    await interaction.reply(`Oopsie, something went wrong: ${e.message}`);
  }
}
async function rank_of_user_in_server(interaction, guild) {
  try {
    let rank = await karmaRetriever.getGuildRankOfUser(targetUser, guild.id);
    let karma = await karmaRetriever.getTotalKarmaOfUserInGuild(
      targetUser,
      guild.id
    );
    const embed = new Discord.EmbedBuilder()
      .setColor(karma < 0 ? "#FF0000" : karma > 0 ? "#00FF00" : "#000000")
      .setTitle(`${rank}`)
      .setDescription(
        "Rank of user in current server by their karma in this server"
      )
      .addFields(
        {
          name: "karma",
          value: `${karma}`,
        },
        {
          name: "user",
          value: `${targetUser}`,
        },
        {
          name: "bot",
          value: (await guild.members.fetch(targetUser)).user.bot
            ? "yes"
            : "no",
        }
      )
      .setTimestamp()
      .setFooter({
        text: `Generated on request of @${interaction.user.username}`,
      });

    await interaction.reply({
      embeds: [embed],
    });
  } catch (e) {
    if (e.message === "user not found") {
      await interaction.reply(
        "User not found, maybe they haven't received a vote yet?"
      );
    } else {
      console.error(e);
      await interaction.reply(`Oopsie, something went wrong: ${e.message}`);
    }
  }
}
async function rank_of_user_in_server_total(interaction, guild, targetUser) {
  try {
    let rank = await karmaRetriever.getTotalRankOfUser(targetUser);
    let karma = await karmaRetriever.getTotalKarmaOfUser(targetUser);
    const embed = new Discord.EmbedBuilder()
      .setColor(karma < 0 ? "#FF0000" : karma > 0 ? "#00FF00" : "#000000")
      .setTitle(`${rank}`)
      .setDescription("Rank of user by their karma in all servers")
      .addFields(
        {
          name: "karma",
          value: `${karma}`,
        },
        {
          name: "user",
          value: `${targetUser}`,
        },
        {
          name: "bot",
          value: (await guild.members.fetch(targetUser)).user.bot
            ? "yes"
            : "no",
        }
      )
      .setTimestamp()
      .setFooter({
        text: `Generated on request of @${interaction.user.username}`,
      });

    await interaction.reply({
      embeds: [embed],
    });
  } catch (e) {
    if (e.message === "user not found") {
      await interaction.reply(
        "User not found, maybe they haven't received a vote yet?"
      );
    } else {
      console.error(e);
      await interaction.reply(`Oopsie, something went wrong: ${e.message}`);
    }
  }
}
async function top_global(interaction, guild) {
  try {
    let topList = await karmaRetriever.getTopUsersOfGuildTotal(10, guild.id);
    let output = `Showing Top 10 users of ${guild.name} based on their global karma:\n`;
    output += await convertTopListToTable(topList, guild);
    await interaction.reply(output);
  } catch (e) {
    await interaction.reply(`Oopsie, something went wrong: ${e.message}`);
  }
}
async function top_server(interaction, guild) {
  try {
    let topList = await karmaRetriever.getTopUsersOfGuild(10, guild.id);
    let output = `Showing Top 10 users of ${guild.name} based on their karma in current server:\n`;
    output += await convertTopListToTable(topList, guild);
    await interaction.reply(output);
  } catch (e) {
    await interaction.reply(`Oopsie, something went wrong: ${e.message}`);
  }
}

async function convertTopListToTable(topList, guild) {
  let output = "```Rank Karma Name\n";
  for (let i = 0; i < topList.length; i++) {
    let username = "unknown";
    try {
      let user = await guild.members.fetch(topList[i].userId);
      username = user.displayName;
    } catch (_) {}

    let rank = i;
    rank++;
    rank = rank.toString() + ".";
    while (rank.length <= 3) rank += " ";

    let karma = topList[i].karma.toString();
    while (karma.length <= 5) karma += " ";
    if (!karma.startsWith("-")) {
      karma = " " + karma;
    } else {
      karma = karma + " ";
    }

    output += `${rank}${karma}${username}\n`;
  }
  output += "```";
  return output;
}
