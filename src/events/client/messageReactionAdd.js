const { EmbedBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas')
module.exports = {
	name: "messageReactionAdd",
	once: false,
	async execute(reaction, user, client) {
		if (reaction.partial) {
			try {
				await reaction.fetch();
			} catch (e) {
				console.error(e);
				return;
			}
		}

		/*
		We handle the reaction event here, including the embed and emoji stuff.
		Might make the emoji deleted after 5-10 min or something, so as to prevent api funny
		*/
		let n = 5; // TEMPORARILY


		if (reaction.count >= 5 && reaction.emoji == '⭐' || n == 5) {
			const cacheGuild = await client.guilds.fetch(process.env.guild_id)
			const msgAuthor = reaction.message.author;
			const msgContent = reaction.message;

			// console.log(msgAuthor)
			// console.log(msgContent)

			const av = await msgAuthor.displayAvatarURL({ format: 'jpg', size: 512, dynamic: true })
			const avatarUrl = av.replace('.webp', '.png');
			console.log(avatarUrl)

			const avatarImage = await loadImage(avatarUrl);
			const canvas = createCanvas(128, 128);
			const context = canvas.getContext('2d');

			// Set the radius of the circular crop
			const radius = canvas.width / 2;

			// Calculate the center of the canvas
			const centerX = canvas.width / 2;
			const centerY = canvas.height / 2;

			// Clear the canvas
			context.clearRect(0, 0, canvas.width, canvas.height);

			// Create a clipping path in the shape of a circle
			context.beginPath();
			context.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
			context.clip();

			// Draw the image within the clipping path
			context.drawImage(avatarImage, 0, 0, canvas.width, canvas.height);

			// Restore the clipping path (optional, but a good practice)
			context.closePath();

			// Convert the canvas content to a data URL
			const croppedImage = canvas.toDataURL('image/png');

			console.log(av)

			cacheGuild.emojis.create({
				attachment: croppedImage,
				name: msgAuthor.username
			}).then(emoji => console.log('made emoji')).catch(console.error);


			const embed = new EmbedBuilder()
				.setColor('Blurple')
				.setDescription('╭╴:yellow_circle: **User 1** hello...\n:green_circle: **[User2](https://discord.com)**\n    Hello There!')


			if (msgContent.type === 'REPLY') {
				const reply = msgContent.fetchReference();
				embed.setDescription()
			}

			reaction.message.channel.send({ embeds: [embed] })
		}


	}
}