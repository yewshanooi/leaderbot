const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Balance = require('../schemas/balance');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add')
		.setDescription('Add point(s) to a user mentioned or yourself')
        .addIntegerOption(option => option.setName('amount').setDescription('The amount of points to add (between 1 and 10000)').setMinValue(1).setMaxValue(10000).setRequired(true))
        .addUserOption(option => option.setName('user').setDescription('[Optional] The user to add points to')),
    guildOnly: true,
	async execute (interaction) {
		const userField = interaction.options.getUser('user') || interaction.user;
        const amount = interaction.options.getInteger('amount');

        let storedBalance = await Balance.findOne({
            userId: userField.id,
            guildId: interaction.guild.id,
        });

        if (storedBalance === null) {
            return interaction.reply({ embeds: [global.errors[0]] });
        }

        const newBalance = storedBalance.balance + amount;

        const embed = new EmbedBuilder()
            .setTitle(`+${amount} point(s) to ${userField.username}`)
            .setColor('#a2d729');

        await Balance.findOneAndUpdate({ _id: storedBalance._id }, { balance: newBalance }).then(
            interaction.reply({ embeds: [embed] })
        )
        .catch(console.error);
    }
};