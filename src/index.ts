import { Client, Partials } from "discord.js";
import { commandHandler, registerCommands } from "./commands/commands";
import { BOT_TOKEN, VERSION_STRING, LOGGER } from "./constants";
import { messageHandler } from "./messages/messages";

const client = new Client({
    
    intents: ["DirectMessages","DirectMessageTyping","DirectMessageReactions","GuildMessages","GuildMessageTyping","GuildMessageReactions", "Guilds", "MessageContent"],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.on("ready", () => {
    LOGGER.info(VERSION_STRING + " online!");
});

client.on("interactionCreate", (interaction) => {
    if(interaction.isChatInputCommand())  return commandHandler(interaction);
});

client.on("messageCreate", (message) => {
    if(message.guild) return messageHandler(message);
})

registerCommands().then(() => {
    return client.login(BOT_TOKEN);
}).catch(LOGGER.error);