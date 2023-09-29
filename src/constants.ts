import { EmbedFooterOptions } from "discord.js";
import { ConsoleLogger, FileLogger, Logger } from "./logger";

export const IS_PRODUCTION: boolean = process.env.IS_PRODUCTION != undefined;

// make this a file logger for production
export const LOGGER: Logger = IS_PRODUCTION ? new FileLogger(process.env.LOG_FILE ?? "./crosschat.log") : new ConsoleLogger();

export const BOT_TOKEN: string = process.env.BOT_TOKEN || "";

export const APPLICATION_ID: string = process.env.APPLICATION_ID || "";

export const DEV_SERVER_ID: string = process.env.DEV_SERVER_ID || "";

export const VERSION = process.env.VERSION ?? "0.0.0";

export const VERSION_STRING = process.env.VERSION_STRING ?? "CrossChat-v" + VERSION;

export const ICON_URL = process.env.ICON_URL ?? "https://karmalover.ca/logo.png";

export const EMBED_FOOTER: EmbedFooterOptions = {
    text: "Created by KarmaLover | " + VERSION_STRING,
};

export const EMBED_COLOUR = "0xB979B0";

export const WEBHOOKS = [
    "example",
    "exmaple"
]

export const GUILDS = [
    {
        id: "example",
        channel: "example",
        prefix: "uuw"
    },
    {
        id: "exape",
        channel: "erample",
        prefix: "rara"
    }
]
