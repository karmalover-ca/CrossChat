import { Message, PartialMessage, WebhookClient } from "discord.js";
import { LOGGER, GUILDS } from "../constants";
import { WhMessages, messageCache } from "./messages";

const deleteHandler = (message: Message | PartialMessage) => {
    if(!GUILDS.find(t=> t.id == message.guild?.id)) return;
    if(!GUILDS.find(t=> t.channel == message.channel.id)) return;
    if(!messageCache.find(t=> t.origin == message.id)) return;

    const whMessageIds = messageCache.find(t=> t.origin == message.id)?.whMessages;
    if(!whMessageIds) return;

    deleteWebhooks(whMessageIds);
}

const deleteWebhooks = (whMessageIds: WhMessages[]) => {
    whMessageIds.forEach(function (whMessage) {
        const webhookClient = new WebhookClient({ url: whMessage.webhookUrl });
        webhookClient.deleteMessage(whMessage.messageId).catch(LOGGER.error);
    });
}

export { deleteHandler };