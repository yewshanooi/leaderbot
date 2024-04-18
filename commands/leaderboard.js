const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Balance = require('../schemas/balance');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Show the balance of user(s) in the current guild'),
    guildOnly: true,
	async execute (interaction) {
        const balances = await Balance.find({ guildId: interaction.guild.id }, 'userName balance').sort({ balance: -1 });

        const embed = new EmbedBuilder()
            .setTitle('Leaderboard')
            .setDescription('Here are the balance of users in this guild')
            .setTimestamp();

            if (balances.length === 0) {
                embed.addFields({ name: 'No user data', value: 'No data available for any user.' });
            } 
            else {
                balances.forEach((balance, index) => {
                    embed.addFields({ name: `#${index + 1}  ${balance.userName}`, value: `${balance.balance}` })
                });
            }

            return interaction.reply({ embeds: [embed] });
        }
};