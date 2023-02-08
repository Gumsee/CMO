"use strict";
try {
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { Client, Events, EmbedBuilder, GatewayIntentBits } = require("discord.js");
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});
const token = 'MTA1MzgxMDUyMjcyMzczMzU4Ng.GcvnK7.sEmOdxXAWRCNFftFxIKnOBtIfiGOkEgYbnYDng';

client.on(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setStatus("online");
    client.user.setActivity('How to be edgy', { type: 'WATCHING' });
});

client.on(Events.MessageCreate, message => {
    var msg = message.content.toLowerCase();
    if(message.author.id === "1053810522723733586")
        return;

    if(msg === ".joinmsg")
    {
        message.client.emit(Events.GuildMemberAdd, message.member);
    }
    if(msg === ".leavemsg")
    {
        message.client.emit(Events.GuildMemberRemove, message.member);
    }
});

client.on(Events.GuildMemberAdd, (member) => {
    const channel     = member.guild.channels.cache.find(channel => channel.name === "public-channel")
    const weirdosrole = member.guild.roles.cache.find(role => role.name.toLowerCase() === "weirdos");

    const welcomeEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Hi Hellow Welcome '+member.user.username+'! :3')
        .setAuthor({ name: '🤖 Beep Boop 🔧' })
        //.setDescription("")
        .setThumbnail(member.user.displayAvatarURL({dynamic: true}))
        .setTimestamp()
        .setFooter({ text: 'Have fun', iconURL: member.guild.iconURL({dynamic: true}) });



    if(channel != undefined)
        channel.send({ embeds: [welcomeEmbed] });

    if(weirdosrole != undefined)
        member.roles.add(weirdosrole)
});

client.on(Events.GuildMemberRemove, (member) => {
    const channel     = member.guild.channels.cache.find(channel => channel.name === "public-channel");

    if(channel != undefined)
        channel.send(member.user.toString() + " left us.. :c");
});

client.on(Events.Error, () => { client.login(token) });
client.login(token);
}
catch(err) {
    console.error(err.message);
}