const { SlashCommandBuilder } = require('discord.js');
const { getForces, getForceNames } = require('../../sheet-interact.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('defend')
        .setDescription('Have a unit defend the forest!')
        .addStringOption(option =>
            option.setName('unit')
                .setDescription('The unit that is defending')
                .setRequired(true)
                .setAutocomplete(true)
        ),
    async execute(interaction) {
        const unitName = interaction.options.getString('unit');

        const forces = await getForces();

        const unit = forces.find(f => f.name == unitName) ?? null;

        console.log(unit);

        const value = Math.floor(unit.fight/10);
        await interaction.reply(`The ${unit.name} defend the forest for ${value} defense!`);
    },
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused(true);
        const forces = await getForceNames();
        let choices = forces.map(f => f.name);
        const filtered = choices.filter(choice => choice.startsWith(focusedValue.value));
        await interaction.respond(
            filtered.map(choice => ({name:choice, value: choice}))
        );
    }
}
