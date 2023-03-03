"use strict";

import util from 'util';
import { Channel, Guild, GuildBasedChannel, GuildMember, Interaction, Message, MessageReaction, Role, TextChannel, User } from "discord.js";
const { Client, Events, EmbedBuilder, GatewayIntentBits, PresenceUpdateStatus, ActivityType, Partials} = require("discord.js");
const votes = require("./votes");
const rules = require("./rules");
import { Commands } from "./commands";
import { findGuildById, findGuildRoleByLowercaseName, findTextChannelById, findTextChannelByName } from "./toolbox";

const exec = util.promisify(require('child_process').exec);
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.MessageContent],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

var commands : Commands | undefined;

const token = require("../secret.json").token;
const botid : string = require("../secret.json").botid;


var mainGuild     : Guild | undefined;
var publicchannel : TextChannel | undefined;
var ruleschannel  : TextChannel | undefined;
var weirdosrole   : Role | undefined;
/*var ari : GuildMember;
var i = 0;
var role : Role | undefined;
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
}*/


client.on(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setStatus(PresenceUpdateStatus.Online);
    client.user.setActivity('How to be edgy', { type: ActivityType.Streaming });

    mainGuild     = findGuildById(client.guilds, "1053792122312081529");
    if(mainGuild == undefined)
        return;
    
    ruleschannel  = findTextChannelById(mainGuild.channels, "1053846684280557588");
    publicchannel = findTextChannelById(mainGuild.channels, "1053792123071254550");
    weirdosrole   = findGuildRoleByLowercaseName(mainGuild, "weirdos");

    if(weirdosrole != undefined && publicchannel != undefined)
        commands = new Commands(weirdosrole, publicchannel);

    votes.initVotes(client, mainGuild);
    rules.initRules(client, mainGuild, ruleschannel);
});

client.on(Events.MessageCreate, (message : Message) => {
    var msg = message.content.toLowerCase();
    if(message.author.id === botid)
        return;
    if(mainGuild == undefined)
        return;

    const badpattern = /[Tt]om[a-zA-Z]*[^ ]*/g;
    if(msg.match(badpattern)?.[0].toLowerCase() != undefined && msg.match(badpattern)?.[0].toLowerCase() !== "tom")
    {
        message.channel.send(message.author.toString() + " schrieb: " + message.content.replace(badpattern, "Tom"))
        message.delete();
    }

    if     (msg === ".joinmsg")    { message.client.emit(Events.GuildMemberAdd, message.member); }
    else if(msg === ".leavemsg")   { message.client.emit(Events.GuildMemberRemove, message.member); }
    else if(msg === ".checkroles") { commands?.checkRoles(mainGuild); }
});

client.on(Events.GuildMemberAdd, (member : GuildMember) => {
    const welcomeEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Hi Hellow Welcome '+member.user.username+'! :3')
        .setAuthor({ name: '🤖 Beep Boop 🔧' })
        //.setDescription("")
        .setThumbnail(member.user.displayAvatarURL({}))
        .setTimestamp()
        .setFooter({ text: 'Have fun', iconURL: member.guild.iconURL({}) });



    publicchannel?.send({ embeds: [welcomeEmbed] });

    if(weirdosrole != undefined)
        member.roles.add(weirdosrole);
});

client.on(Events.GuildMemberRemove, (member : GuildMember) => {
        publicchannel?.send(member.user.toString() + " left us.. :c");
});


client.on(Events.InteractionCreate, (interaction : Interaction) => {
	console.log("eh");
});

// @ts-check
async function messageReaction(reaction : MessageReaction, user : User, removed : boolean)
{
	// When a reaction is received, check if the structure is partial
	if (reaction.partial) {
		// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}
    votes.checkReactions(reaction, user, removed);
};


client.on(Events.MessageReactionAdd, (reaction : MessageReaction, user : User) => messageReaction(reaction, user, false));
client.on(Events.MessageReactionRemove, (reaction : MessageReaction, user : User) => messageReaction(reaction, user, true));

client.on(Events.Error, () => { client.login(token) });
client.login(token);

/*setInterval(function() {
    circleColors();
}, 600000);*/
