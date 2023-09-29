import { Message, PartialMessage, WebhookClient } from "discord.js";
import { LOGGER, GUILDS } from "../constants";
import { WhMessages, messageCache } from "./messages";

const updateHandler = (oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage) => {
    if(!GUILDS.find(t=> t.id == newMessage.guild?.id)) return;
    if(!GUILDS.find(t=> t.channel == newMessage.channel.id)) return;
    if(!messageCache.find(t=> t.origin == newMessage.id)) return;

    let cleanMessage = newMessage.cleanContent;
    if(cleanMessage === null) return;
    const whMessageIds = messageCache.find(t=> t.origin == newMessage.id)?.whMessages;
    if(!whMessageIds) return;

    // testing twice anyways
    if(newMessage.webhookId || newMessage.author?.bot) return;

    if(newMessage.mentions.everyone) {
        cleanMessage = cleanMessage.replace("@", "(@)");
    }

    if(newMessage.attachments.size > 0) {
        newMessage.attachments.forEach(function (attachment) {
            cleanMessage = cleanMessage + ` ${attachment.url}`;
        });
    }

    if(cleanMessage === "") {
        if(newMessage.stickers.size > 0) {
            cleanMessage = `*(sticker) :${newMessage.stickers.first()?.name}:*`;
        }
    }

    if(cleanMessage.length > 2000) {
        newMessage.reply(`${newMessage.member?.user} your edited message is too long\nIt must be 1990 charecters or lower`);
        return;
    }

    editWebhooks(cleanMessage, whMessageIds);
}


const editWebhooks = (message: string, whMessageIds: WhMessages[]) => {

    whMessageIds.forEach(function (whMessage) {
        const webhookClient = new WebhookClient({ url: whMessage.webhookUrl });
        webhookClient.editMessage(whMessage.messageId, {
            content: message
        }).catch(LOGGER.error);
    });
}

export { updateHandler };