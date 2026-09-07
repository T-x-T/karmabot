import fs from "fs";
import Discord, {
  GatewayIntentBits,
  Collection,
  MessageFlags,
} from "discord.js";
import setupKarmaUpdater from "./src/karmaUpdater/index.js";
import setupKarmaRetriever from "./src/karmaRetriever/index.js";
import setupConfigurator from "./src/configurator/index.js";
import setupDiscordGeneralCommands from "./src/discordGeneralCommands/index.js";
import setupApiWebserver from "./src/webApi/index.js";
import setupHistoryRecorder from "./src/historyRecorder/index.js";
import setupHistoryRetriever from "./src/historyRetriever/index.js";

global.ENVIRONMENT = process.env.NODE_ENV ? process.env.NODE_ENV : "staging";
const config = JSON.parse(
  fs.readFileSync(`./config.${global.ENVIRONMENT}.json`)
);

setupApiWebserver(config.apiPort);

const discordClient = new Discord.Client({
  intents: [
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessageReactions,
  ],
});
discordClient.login(config.botToken);

discordClient.on(Discord.Events.ClientReady, async (readyClient) => {
  console.log("discordClient logged in");

  readyClient.config = config;

  await Promise.all([
    setupKarmaUpdater(readyClient, config.redisIp, config.redisPort),
    setupKarmaRetriever().init(readyClient, config.redisIp, config.redisPort),
    setupConfigurator().init(readyClient, config.redisIp, config.redisPort),
    setupDiscordGeneralCommands().init(
      readyClient,
      config.redisIp,
      config.redisPort,
      config.clientId,
      config.botToken
    ),
    setupHistoryRecorder(config.redisIp, config.redisPort),
    setupHistoryRetriever(config.redisIp, config.redisPort, readyClient),
  ]);

  const commands = new Collection();
  commands.set(setupConfigurator().data.name, {
    data: setupConfigurator().data,
    execute: setupConfigurator().execute,
  });
  commands.set(setupKarmaRetriever().data.name, {
    data: setupKarmaRetriever().data,
    execute: setupKarmaRetriever().execute,
  });
  commands.set(setupDiscordGeneralCommands().data.name, {
    data: setupDiscordGeneralCommands().data,
    execute: setupDiscordGeneralCommands().execute,
  });

  const rest = new Discord.REST().setToken(config.botToken);

  readyClient.commands = commands;
  try {
    const data = await rest.put(
      Discord.Routes.applicationGuildCommands(
        config.clientId,
        config.testGuildId
      ),
      {
        body: Array.from(commands.mapValues((x) => x.data.toJSON()).values()),
      }
    );
    console.log(
      `Successfully reloaded ${data.length} application (/) commands in the dev guild.`
    );
  } catch (e) {
    console.error(
      `Got an error when trying to refresh commands in test guild: ${e.message}`
    );
  }
  try {
    const data = await rest.put(
      Discord.Routes.applicationCommands(config.clientId),
      {
        body: Array.from(commands.mapValues((x) => x.data.toJSON()).values()),
      }
    );
    console.log(
      `Successfully reloaded ${data.length} application (/) commands globally.`
    );
  } catch (e) {
    console.error(
      `Got an error when trying to refresh commands globally: ${e.message}`
    );
  }

  readyClient.on(Discord.Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  });

  readyClient.user.setActivity("watching for your votes");

  console.log("everything logged in, lets go!");
});
