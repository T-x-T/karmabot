import infoReader from "./infoReader.js";
import discodGeneralCommands from "./discordGeneralCommands.js";
import Discord, { SlashCommandBuilder } from "discord.js";

export default () => ({
  init: async (discordClient, redisIp, redisPort, clientId, botToken) => {
    infoReader.connect(redisIp, redisPort);
    discodGeneralCommands(discordClient, infoReader, clientId, botToken);
  },
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("General info about TxTs Karmabot"),
  async execute(interaction) {
    infoReader.connect(
      interaction.client.config.redisIp,
      interaction.client.config.redisPort
    );

    const embed = new Discord.EmbedBuilder()
      .setColor("#000000")
      .setTitle("Info")
      .setDescription("Shows some general info about the bot")
      .addFields(
        {
          name: "servers",
          value: `${await infoReader.getGuildCount()}`,
        },
        { name: "users", value: `${await infoReader.getUserCount()}` },
        {
          name: "invite",
          value:
            "[click me](https://discord.com/oauth2/authorize?client_id=779060613590548521&scope=bot&permissions=1073859648)",
        },
        { name: "creator", value: "@thetxt" },
        { name: "website", value: "https://karmabot.thetxt.io" },
        {
          name: "vote",
          value:
            "please vote for me on [top.gg](https://top.gg/bot/779060613590548521)",
        },
        { name: "repo", value: "https://git.thetxt.io/thetxt/karmabot" },
        { name: "send bug reports to", value: "karmabot@thetxt.io" }
      )
      .setTimestamp()
      .setFooter({
        text: `Generated on request of @${interaction.user.username}`,
      });

    await interaction.reply({
      embeds: [embed],
    });
  },
});
