"use strict";
try {
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { Client, Events, EmbedBuilder, GatewayIntentBits, PresenceUpdateStatus, ActivityType} = require("discord.js");
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});
const token = 'MTA1MzgxMDUyMjcyMzczMzU4Ng.GcvnK7.sEmOdxXAWRCNFftFxIKnOBtIfiGOkEgYbnYDng';


var redrole, whiterole, purplerole, pinkrole, bluerole;
var roles = new Array(5);
var ari;
var i = 0;
var role;
function circleColors()
{
    if(ari == undefined)
        return;
    
    var lastrole = role;
    role = roles[i++];
    if(i >= roles.length)
        i = 0;
    
    
    if(lastrole != undefined)
        ari.roles.remove(lastrole)
    
    if(role != undefined)
        ari.roles.add(role)
}


client.on(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setStatus(PresenceUpdateStatus.Online);
    client.user.setActivity('How to be edgy', { type: ActivityType.Streaming });

    const mainGuild = client.guilds.cache.find(guild => guild.id == "1053792122312081529");

    if(mainGuild != undefined)
    {
        mainGuild.members.fetch({ user: '1053715131223244831', force: true }).then(arif => {
            ari = arif;
            //console.log("Ari Roles:", ari.roles);
        })
        redrole    = mainGuild.roles.cache.find(role => role.name.toLowerCase() == "red");
        whiterole  = mainGuild.roles.cache.find(role => role.name.toLowerCase() == "white");
        purplerole = mainGuild.roles.cache.find(role => role.name.toLowerCase() == "purple");
        pinkrole   = mainGuild.roles.cache.find(role => role.name.toLowerCase() == "pink");
        bluerole   = mainGuild.roles.cache.find(role => role.name.toLowerCase() == "blue");
        roles[0] = redrole;
        roles[1] = whiterole;
        roles[2] = purplerole;
        roles[3] = pinkrole;
        roles[4] = bluerole;
    }
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
    const channel     = member.guild.channels.cache.find(channel => channel.name === "public-channel");
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
        member.roles.add(weirdosrole);
});

client.on(Events.GuildMemberRemove, (member) => {
    const channel     = member.guild.channels.cache.find(channel => channel.name === "public-channel");

    if(channel != undefined)
        channel.send(member.user.toString() + " left us.. :c");
});

client.on(Events.Error, () => { client.login(token) });
client.login(token);

setInterval(function() {
    circleColors();
}, 300000);
}
catch(err) {
    console.error(err.message);
}