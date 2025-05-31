const { SlashCommandBuilder } = require('discord.js');
const { getForces, getForceNames, getResourceNames } = require('../../sheet-interact.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gather')
        .setDescription('Roll gathering for various units')
        .addStringOption(option =>
            option.setName('unit')
                .setDescription('The unit that is gathering')
                .setRequired(true)
                .setAutocomplete(true)
        )
        .addStringOption(option =>
            option.setName('resource')
                .setDescription('The resource that is gathered')
                .setRequired(true)
                .setAutocomplete(true)
        ),
    async execute(interaction) {
        const unitName = interaction.options.getString('unit');
        const resourceName = interaction.options.getString('resource');

        const forces = await getForces();

        const unit = forces.find(f => f.name == unitName) ?? null;

        console.log(unit);

        const dice = Math.floor((unit.watch + unit.channel)/10);
        const roll = Math.floor(Math.random()*(dice-1) + 1);

        await interaction.reply(`The ${unit.name} gather ${roll} ${resourceName} [1d${dice}]`);
    },
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused(true);

        console.log(focusedValue);

        let choices;
        
        if (focusedValue.name === 'unit') {
            const forces = await getForceNames();
            choices = forces.map(f => f.name);
        }
        if (focusedValue.name === 'resource') {
            choices = await getResourceNames();
        }
        const filtered = choices.filter(choice => choice.startsWith(focusedValue.value));
        await interaction.respond(
            filtered.map(choice => ({name:choice, value: choice}))
        );
    }
}
