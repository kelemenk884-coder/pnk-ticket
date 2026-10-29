const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('A Discord bot online!');
});

app.listen(PORT, () => {
    console.log(`A web szerver elindult a ${PORT}-es porton`);
});

const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`Bejelentkezve mint ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
    if (message.content === '!ticketsetup' && message.member.permissions.has(PermissionFlagsBits.Administrator)) {
        const embed = new EmbedBuilder()
            .setTitle('🎫 Ticket Rendszer')
            .setDescription('Kattints az alábbi gombra egy új ticket nyitásához!')
            .setColor(0x00AE86);

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('create_ticket')
                    .setLabel('Ticket nyitása')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('🎫')
            );

        await message.channel.send({ embeds: [embed], components: [row] });
        await message.delete();
    }
});

client.login(process.env.TOKEN);
