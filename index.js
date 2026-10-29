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

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'create_ticket') {
        const guild = interaction.guild;
        const channelName = `ticket-${interaction.user.username}`;

        const existingChannel = guild.channels.cache.find(c => c.name === channelName);
        if (existingChannel) {
            return interaction.reply({ content: 'Már van nyitott ticketed!', ephemeral: true });
        }

        const ticketChannel = await guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            permissionOverwrites: [
                {
                    id: guild.id,
                    deny: [PermissionFlagsBits.ViewChannel],
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
                },
            ],
        });

        const closeRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('close_ticket')
                    .setLabel('Ticket bezárása')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('🔒')
            );

        await ticketChannel.send({
            content: `Üdv, ${interaction.user}! Itt tudsz segítséget kérni.`,
            components: [closeRow]
        });

        await interaction.reply({ content: `A ticket csatorna létrejött: ${ticketChannel}`, ephemeral: true });
    }

    if (interaction.customId === 'close_ticket') {
        const channel = interaction.channel;
        await interaction.reply({ content: 'A csatorna 5 másodperc múlva bezáródik...' });
        setTimeout(() => channel.delete().catch(() => {}), 5000);
    }
});

client.login(process.env.TOKEN);
