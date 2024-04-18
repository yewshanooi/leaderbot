const newLocal = require('fs');
const fs = newLocal;
const dotenv = require('dotenv');
	dotenv.config();
const chalk = require('chalk');
global.errors = require('./errors.js');

// Initialise mongoose npm package to manage MongoDB database
const mongoose = require('mongoose');

const { ActivityType, Client, Collection, GatewayIntentBits, InteractionType, Partials } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping], partials: [Partials.Channel] });
client.commands = new Collection();


const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const cmdFile of commandFiles) {
    const command = require(`./commands/${cmdFile}`);
    client.commands.set(command.data.name, command);
}

if (!process.env.TOKEN) throw new Error(`${chalk.redBright.bold(`Error: Missing ${chalk.bold('TOKEN')} field in the .env file`)}`);
if (!process.env.CLIENT_ID) throw new Error(`${chalk.redBright.bold(`Error: Missing ${chalk.bold('CLIENT_ID')} field in the .env file`)}`);
if (!process.env.GUILD_ID) throw new Error(`${chalk.redBright.bold(`Error: Missing ${chalk.bold('GUILD_ID')} field in the .env file`)}`);


client.once('ready', client => {
	console.log(`${chalk.white.bold(`\nConnected to Discord as ${client.user.username}\nServing ${client.users.cache.size} user(s) and ${client.channels.cache.size} channel(s) in ${client.guilds.cache.size} guild(s)\n`)}`);
});


client.on('ready', client => {
	client.user.setActivity({
		name: `${client.users.cache.size} user(s) and ${client.channels.cache.size} channel(s)`,
		type: ActivityType.Watching
	});
});


client.on('interactionCreate', async interaction => {
	const { client } = interaction;
    if (interaction.type !== InteractionType.ApplicationCommand) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	// Outputs an error message if user tries to run a guild-only command in a Direct Message
	if (command.guildOnly && interaction.channel.type === 1) {
		return interaction.reply({ embeds: [global.errors[4]] });
	}


	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ embeds: [global.errors[5]] });
	}
});


// Debug event log for console
client.on('debug', info => {
	console.log(`${chalk.dim(info)}`)
});


// Mongoose Connection Event: Connecting
mongoose.connection.on('connecting', () => {
	console.log(`${chalk.greenBright.bold('[MongoDB] Connecting to database')}`)
});

// Mongoose Connection Event: Connected
mongoose.connection.on('connected', () => {
	console.log(`${chalk.greenBright.bold('[MongoDB] Successfully connected to database')}`)
});

// Mongoose Connection Event: Error
mongoose.connection.on('error', (err) => {
	console.log(`${chalk.redBright.bold('[MongoDB] Error: There was a problem connecting to MongoDB')}`, err)
});

// Mongoose Connection Event: Disconnected
mongoose.connection.on('disconnected', () => {
	console.log(`${chalk.redBright.bold('[MongoDB] Error: Disconnected from MongoDB')}`)
});


client.login(process.env.TOKEN);

// Async process to connect to MongoDB
(async () => {
	await mongoose.connect(process.env.MONGODB_TOKEN).catch(console.error);
})();