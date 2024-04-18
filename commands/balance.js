const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Balance = require('../schemas/balance');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('Get the balance of a user mentioned or yourself')
        .addUserOption(option => option.setName('user').setDescription('[Optional] The user you want to view')),
	guildOnly: true,
	async execute (interaction) {
		const userField = interaction.options.getUser('user') || interaction.user;
        
        let storedBalance = await Balance.findOne({
            userId: userField.id,
            guildId: interaction.guild.id,
        });

        if (storedBalance === null) {
            return interaction.reply({ embeds: [global.errors[0]] });
        }

        const viewBalance = new EmbedBuilder()
            .setTitle(`${userField.username}'s balance`)
            .addFields(
                { name: `${storedBalance.balance} point(s)`, value: '\u200b' }
            )
            .setTimestamp();
        interaction.reply({ embeds: [viewBalance] });
	}
};