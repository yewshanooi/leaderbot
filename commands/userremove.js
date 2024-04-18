const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Balance = require('../schemas/balance');
const chalk = require('chalk');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('userremove')
		.setDescription('Remove a user from the database')
        .addStringOption(option => option.setName('user_id').setDescription('The user ID you want to remove').setRequired(true)),
	guildOnly: true,
	async execute (interaction) {
		const userIdField = interaction.options.getString('user_id');

        let storedBalance = await Balance.findOne({
            userId: userIdField,
            guildId: interaction.guild.id,
        });

        if (!storedBalance) {
            const userNotExist = new EmbedBuilder()
                .setTitle('Error')
                .setDescription(`User ID **${userIdField}** is not in the database.`)
                .setColor('#ff5555');

            interaction.reply({ embeds: [userNotExist] });
        } else {
            await Balance.deleteOne({
                userId: userIdField,
                guildId: interaction.guild.id,
            }).then(() => {
                console.log(`${chalk.white.bold(`[MongoDB - Remove User] User ID: ${userIdField}, Guild ID: ${interaction.guild.id}`)}`);

                const removeUser = new EmbedBuilder()
                    .setTitle('User Removed')
                    .setDescription(`User ID **${userIdField}** have been removed from the database.`);

                interaction.reply({ embeds: [removeUser] });
            })
            .catch(console.error);
        }
    }
};