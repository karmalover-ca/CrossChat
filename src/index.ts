import { Client, Partials, WebhookClient } from "discord.js";
import { commandHandler, registerCommands } from "./commands/commands";
import { BOT_TOKEN, VERSION_STRING, LOGGER, WEBHOOKS, ICON_URL } from "./constants";
import { messageHandler } from "./messages/messages";
import { updateHandler } from "./messages/updates";
import { deleteHandler } from "./messages/deletes";

const client = new Client({
    
    intents: ["DirectMessages","DirectMessageTyping","DirectMessageReactions","GuildMessages","GuildMessageTyping","GuildMessageReactions", "Guilds", "MessageContent"],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.on("ready", () => {
    LOGGER.info(VERSION_STRING + " online!");
    WEBHOOKS.forEach(async function (webhook) {
        const webhookClient = new WebhookClient({ url: webhook });
        webhookClient.send({
            username: "CrossChat",
            avatarURL: ICON_URL,
            content: "Bot Ready - Cross Server system operational!"
        });
    });
});

client.on("interactionCreate", (interaction) => {
    if(interaction.isChatInputCommand())  return commandHandler(interaction);
});

client.on("messageCreate", (message) => {
    if(message.guild) return messageHandler(message);
})

client.on("messageUpdate", (oldMessage, newMessage) => {
    if(newMessage.guild) return updateHandler(oldMessage, newMessage);
})

client.on("messageDelete", (message) => {
    if(message.guild) return deleteHandler(message);
})

registerCommands().then(() => {
    return client.login(BOT_TOKEN);
}).catch(LOGGER.error);