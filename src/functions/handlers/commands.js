const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { readdirSync } = require('fs');
module.exports = (client) => {
    client.handleCommands = async () => {
        const commandFolders = readdirSync(`./src/commands`);
        for (const folder of commandFolders) {
            const commandFiles = readdirSync(`./src/commands/${folder}`).filter(x => x.endsWith(".js"));

            const { commands, commandArray } = client;
            for (const file of commandFiles) {
                const command = require(`../../commands/${folder}/${file}`)
                commands.set(command.data.name, command);
                commandArray.push(command.data.toJSON())
            }
        }

        const clientId = process.env.client_id;
        const guildId = process.env.guild_id;

        const rest = new REST({ version: '9' }).setToken(process.env.token);
        try {
            console.log('Reloading "/" commands.');
            await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: client.commandArray }
            );

            console.log('Successfully reloaded "/" commands.');
        } catch (e) {
            console.error(e);
        }
    }
}