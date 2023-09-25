import { Message, Utils, WebhookClient } from "discord.js";
import { LOGGER, WEBHOOKS } from "../constants";



const messageHandler = (message: Message) => {
    const member = message.member;
    const avatar = member?.user.displayAvatarURL();
    const displayName = member?.displayName;
    const username = member?.user.username;
    let cleanMessage = message.cleanContent;

    if(message.webhookId || message.author.bot) return;

    if(message.mentions.everyone) {
        cleanMessage = cleanMessage.replace("@", "(@)")
    }

    sendWebhooks(displayName!, username!, avatar!, cleanMessage);
};


const sendWebhooks = (displayName: string, username: string, avatarURL: string, message: string) => {

    WEBHOOKS.forEach(function (webhook) {
        const webhookClient = new WebhookClient({ url: webhook});
        webhookClient.send({
            username: `${displayName} (${username})`,
            avatarURL: avatarURL,
            content: message,
        });
    })
}

export { messageHandler };