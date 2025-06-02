const { SlashCommandBuilder } = require('discord.js');
const { getCurrentStores } = require('../../sheet-interact.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("status")
        .setDescription("Current resources available"),
    async execute(interaction) {
        let stores = await getCurrentStores();
        let msg = "Current stores:";
        for (const [key,val] of Object.entries(stores)) {
            msg += "\n" + key + ": " + val;
        }
        await interaction.reply(msg);
    }
}
