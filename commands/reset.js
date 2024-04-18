const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Balance = require('../schemas/balance');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reset')
		.setDescription('Reset all user(s) balance in the current guild'),
    guildOnly: true,
	async execute (interaction) {
        let storedBalance = await Balance.find({
            guildId: interaction.guild.id,
        });

        if (storedBalance === null) {
            return interaction.reply({ embeds: [global.errors[6]] });
        }

        const embed = new EmbedBuilder()
            .setTitle('Reset')
            .setDescription('Successfully reset balances for all user\'s in this guild');

        await Balance.updateMany({ guildId: interaction.guild.id }, { balance: 0 }).then(
            interaction.reply({ embeds: [embed] })
        )
        .catch(console.error);
    }
};