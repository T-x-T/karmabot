import configurator from "./configurator.js";
import discordConfigCommands from "./discordConfigCommands.js";
import configReaderWriter from "./configReaderWriter.js";
import {
  SlashCommandBuilder,
  PermissionsBitField,
  MessageFlags,
} from "discord.js";

export default () => ({
  init: async (discordClient, redisIp, redisPort) => {
    await configReaderWriter.connect(redisIp, redisPort);
    await configurator.connect(configReaderWriter);
    console.log("configurator connected to redis");

    discordConfigCommands(discordClient);
  },
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Configure your experience")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("user")
        .setDescription("User options")
        .addBooleanOption((option) =>
          option
            .setName("status")
            .setDescription(
              "Set the status of your user, if you set it to false, it won't collect any more karma."
            )
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("server")
        .setDescription("Server options")
        .addBooleanOption((option) =>
          option
            .setName("status")
            .setDescription(
              "Set the status of your server, if you set it to false, it won't collect any more karma."
            )
            .setRequired(false)
        )
        .addBooleanOption((option) =>
          option
            .setName("use_default_upvote_emoji")
            .setDescription("Use the default upvote emoji.")
            .setRequired(false)
        )
        .addBooleanOption((option) =>
          option
            .setName("use_default_downvote_emoji")
            .setDescription("Use the default downvote emoji.")
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName("upvote_emoji")
            .setDescription("Set the custom upvote emoji of your server.")
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName("downvote_emoji")
            .setDescription("Set the custom downvote emoji of your server.")
            .setRequired(false)
        )
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand == "user") {
      const status = interaction.options.getBoolean("status") ?? true;
      if (status) {
        await configurator.enableGuildInUser(
          interaction.user.id,
          interaction.guildId
        );
        await interaction.reply({
          content:
            "You will receive karma in this server and be shown top lists",
          flags: MessageFlags.Ephemeral,
        });
        return;
      } else {
        await configurator.disableGuildinUser(
          interaction.user.id,
          interaction.guildId
        );
        await interaction.reply({
          content:
            "You will no longer receive karma in this server and be shown top lists",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }
    } else {
      if (
        !interaction.memberPermissions.has(
          PermissionsBitField.Flags.Administrator
        )
      ) {
        await interaction.reply({
          content:
            "You must be an administrator to manage the server settings!",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      const status = interaction.options.getBoolean("status");
      const use_default_upvote_emoji = interaction.options.getBoolean(
        "use_default_upvote_emoji"
      );
      const use_default_downvote_emoji = interaction.options.getBoolean(
        "use_default_downvote_emoji"
      );
      const upvote_emoji = interaction.options.getString("upvote_emoji");
      const downvote_emoji = interaction.options.getString("downvote_emoji");

      if (status) {
        await configurator.enableGuild(interaction.guildId);
        await interaction.reply({
          content: "I am now enabled in this server",
          flags: MessageFlags.Ephemeral,
        });
      } else if (status !== null && !status) {
        await configurator.disableGuild(interaction.guildId);
        await interaction.reply({
          content: "I am now disabled in this server",
          flags: MessageFlags.Ephemeral,
        });
      }

      if (use_default_upvote_emoji) {
        let guild;
        if (interaction.guild.available) {
          guild = interaction.guild;
        } else {
          guild = await interaction.guild.fetch();
        }
        let emoji = await configurator.addDefaultUpvoteEmoji(guild);
        await configurator.setUpvoteEmoji(interaction.guildId, emoji.id);
        await interaction.reply({
          content: `The new upvote emoji is ${emoji}! React with this emoji to messages to upvote them.`,
          flags: MessageFlags.Ephemeral,
        });
      }

      if (use_default_downvote_emoji) {
        let guild;
        if (interaction.guild.available) {
          guild = interaction.guild;
        } else {
          guild = await interaction.guild.fetch();
        }
        let emoji = await configurator.addDefaultDownvoteEmoji(guild);
        await configurator.setDownvoteEmoji(interaction.guildId, emoji.id);
        await interaction.reply({
          content: `The new downvote emoji is ${emoji}! React with this emoji to messages to downvote them.`,
          flags: MessageFlags.Ephemeral,
        });
      }

      if (upvote_emoji) {
        let guild;
        if (interaction.guild.available) {
          guild = interaction.guild;
        } else {
          guild = await interaction.guild.fetch();
        }

        let emoji = (await guild.emojis.fetch()).find(
          (x) => x.name == upvote_emoji
        );
        if (emoji) {
          await configurator.setUpvoteEmoji(guild.id, emoji.id);
        }

        await interaction.reply({
          content: `The new upvote emoji is ${emoji}! React with this emoji to messages to upvote them.`,
          flags: MessageFlags.Ephemeral,
        });
      }

      if (downvote_emoji) {
        let guild;
        if (interaction.guild.available) {
          guild = interaction.guild;
        } else {
          guild = await interaction.guild.fetch();
        }

        let emoji = (await guild.emojis.fetch()).find(
          (x) => x.name == downvote_emoji
        );
        if (emoji) {
          await configurator.setDownvoteEmoji(guild.id, emoji.id);
        }

        await interaction.reply({
          content: `The new downvote emoji is ${emoji}! React with this emoji to messages to downvote them.`,
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  },
});
