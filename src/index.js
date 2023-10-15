require('dotenv').config();
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { readdirSync } = require('fs');
const { token } = process.env;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction
    ]
});
client.commands = new Collection();
client.commandArray = [];

const functionFolders = readdirSync(`./src/functions`);
for (const folder of functionFolders) {
    const functionFiles = readdirSync(`./src/functions/${folder}`).filter(x => x.endsWith(".js"));

    for (const file of functionFiles) require(`./functions/${folder}/${file}`)(client);
}

client.handleEvents();
client.handleCommands();
client.login(token);