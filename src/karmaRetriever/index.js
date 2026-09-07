import karmaRetriever from "./karmaRetriever.js";
import discordRetrievalCommands from "./discordRetrievalCommands.js";
import discordFetcher from "./discordFetcher.js";
import karmaReader from "./karmaReader.js";
import configReader from "./configReader.js";
import setupWebApi from "./webApi.js";
import { SlashCommandBuilder } from "discord.js";

export default () => ({
  init: async (discordClient, redisIp, redisPort) => {
    try {
      await karmaReader.connect(redisIp, redisPort);
      await configReader.connect(redisIp, redisPort);
      await karmaRetriever.connect(karmaReader, configReader);
      console.log("karmaRetriever connected to redis");

      discordFetcher.connect(discordClient);

      setupWebApi();
    } catch (e) {
      console.log("karmaRetriever failed to connect to redis:", e);
    }
  },

  data: new SlashCommandBuilder()
    .setName("show")
    .setDescription("Commands to show karma")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("total_server_karma")
        .setDescription("Total karma of server")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("total_server_karma_of_user")
        .setDescription("Total karma of user in this server")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Show karma of someone else.")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("total_karma_of_user")
        .setDescription("Total karma of user in all servers")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Show karma of someone else.")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("rank_server_global")
        .setDescription("Rank of server by its total karma")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("rank_server").setDescription("Rank of server")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("rank_of_user_in_server")
        .setDescription(
          "Rank of user in current server by their karma in this server"
        )
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Show rank of someone else.")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("rank_of_user_in_server_total")
        .setDescription("Rank of user by their karma in all servers")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Show rank of someone else.")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("top_global")
        .setDescription("Top 10 users of this server by their global karma")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("top_server")
        .setDescription(
          "Top 10 users of this server by their karma in this server"
        )
    ),

  async execute(interaction) {
    await discordRetrievalCommands(interaction);
  },
});
