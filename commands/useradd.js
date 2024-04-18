const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Balance = require('../schemas/balance');
const mongoose = require('mongoose');
const chalk = require('chalk');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('useradd')
		.setDescription('Add a user to the database')
        .addUserOption(option => option.setName('user').setDescription('The user you want to add').setRequired(true)),
	guildOnly: true,
	async execute (interaction) {
		const userField = interaction.options.getUser('user');
            if (userField.bot === true) return interaction.reply({ embeds: [global.errors[3]] });
        
        let storedBalance = await Balance.findOne({
            userId: userField.id,
            guildId: interaction.guild.id,
        });

        if (!storedBalance) {
            storedBalance = await new Balance({
                _id: new mongoose.Types.ObjectId(),
                userName: userField.username,
                userId: userField.id,
                guildId: interaction.guild.id,
                balance: 0
            });

            await storedBalance.save().then(() => {
                console.log(`${chalk.white.bold(`[MongoDB - Add User] User ID: ${userField.id}, Guild ID: ${interaction.guild.id}`)}`);

                const addUser = new EmbedBuilder()
                    .setTitle('User Added')
                    .setDescription(`User **${userField.username}** have been added in the database.`);

                interaction.reply({ embeds: [addUser] });
            })
            .catch(console.error);
        return storedBalance;
        } else {
            const userExist = new EmbedBuilder()
                .setTitle('Error')
                .setDescription(`User **${userField.username}** already exists in the database.`)
                .setColor('#ff5555');

            interaction.reply({ embeds: [userExist] });
        }
	}
};