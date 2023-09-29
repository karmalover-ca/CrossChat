import { Message, TextChannel, WebhookClient } from "discord.js";
import { WEBHOOKS, GUILDS, LOGGER } from "../constants";

export interface WhMessages {
    messageId: string;
    webhookUrl: string;
}
export interface MessageCache {
    origin: string;
    whMessages: [...WhMessages[]];
}

export const messageCache: MessageCache[] = [];

const messageHandler = async (message: Message) => {
    if(!GUILDS.find(t=>t.id == message.guild?.id)) return;
    if(!GUILDS.find(t=>t.channel == message.channel.id)) return;

    const member = message.member;
    const guildPrefix = GUILDS.find(t=>t.id == message.guild?.id)?.prefix;
    const displayName = member?.displayName;
    const username = member?.user.username;
    const discriminator = member?.user.discriminator;
    const avatar = member?.user.displayAvatarURL();
    let cleanMessage = message.cleanContent;

    if(message.webhookId || message.author.bot) return;
    
    let channelWhId = "";
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const channel: TextChannel = message.channel;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await channel.fetchWebhooks().then(webhooks => channelWhId = webhooks.first()?.id);
    //if(!channelWhUrl) return;

    if(message.mentions.everyone) {
        cleanMessage = cleanMessage.replace("@", "(@)");
    }

    cleanMessage = cleanMessage.replace("<@", "<-@");

    if(message.attachments.size > 0) {
        message.attachments.forEach(function (attachment) {
            cleanMessage = cleanMessage + ` ${attachment.url}`;
        });
    }
    
    if(cleanMessage === "") {
        if(message.stickers.size > 0) {
            cleanMessage = `*(sticker) :${message.stickers.first()?.name}:*`;
        }
    }

    if(cleanMessage.length > 2000) {
        message.reply(`${message.member?.user} your message is too long\nIt must be 2000 charecters or lower`);
        return;
    }

    sendWebhooks(guildPrefix!, displayName!, username!, discriminator!, avatar!, cleanMessage, message.id, channelWhId);
};


const sendWebhooks = (guildPrefix: string, displayName: string, username: string, discriminator: string, avatarURL: string, message: string, messageId: string, channelWhId: string) => {

    const whMessageIds: WhMessages[] = [];

    Promise.all(WEBHOOKS.map(async wh => {
        if(!wh.includes(channelWhId)) {
            const webhookClient = new WebhookClient({ url: wh });
            return webhookClient.send({
                username: `${guildPrefix} ${displayName} (${username}#${discriminator})`,
                avatarURL: avatarURL,
                content: message,
            }).then(apiMessage => whMessageIds.push({messageId: apiMessage.id, webhookUrl: wh})).catch(LOGGER.error);
        }
    })).then(() => {
        messageCache.push({
            origin: messageId,
            whMessages: whMessageIds,
        });
    }).catch(LOGGER.error);
}

export { messageHandler };