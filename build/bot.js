"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("util"));
const { Client, Events, EmbedBuilder, GatewayIntentBits, PresenceUpdateStatus, ActivityType, Partials } = require("discord.js");
const votes = require("./votes");
const rules = require("./rules");
const commands_1 = require("./commands");
const toolbox_1 = require("./toolbox");
const exec = util_1.default.promisify(require('child_process').exec);
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.MessageContent],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});
var commands;
const token = require("../secret.json").token;
const botid = require("../secret.json").botid;
var mainGuild;
var publicchannel;
var ruleschannel;
var weirdosrole;
client.on(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setStatus(PresenceUpdateStatus.Online);
    client.user.setActivity('How to be edgy', { type: ActivityType.Streaming });
    mainGuild = (0, toolbox_1.findGuildById)(client.guilds, "1053792122312081529");
    if (mainGuild == undefined)
        return;
    ruleschannel = (0, toolbox_1.findTextChannelById)(mainGuild.channels, "1053846684280557588");
    publicchannel = (0, toolbox_1.findTextChannelById)(mainGuild.channels, "1053792123071254550");
    weirdosrole = (0, toolbox_1.findGuildRoleByLowercaseName)(mainGuild, "weirdos");
    if (weirdosrole != undefined && publicchannel != undefined)
        commands = new commands_1.Commands(weirdosrole, publicchannel);
    votes.initVotes(client, mainGuild);
    rules.initRules(client, mainGuild, ruleschannel);
});
client.on(Events.MessageCreate, (message) => {
    var msg = message.content.toLowerCase();
    if (message.author.id === botid)
        return;
    if (mainGuild == undefined)
        return;
    if (msg === ".joinmsg") {
        message.client.emit(Events.GuildMemberAdd, message.member);
    }
    else if (msg === ".leavemsg") {
        message.client.emit(Events.GuildMemberRemove, message.member);
    }
    else if (msg === ".checkroles") {
        commands === null || commands === void 0 ? void 0 : commands.checkRoles(mainGuild);
    }
});
client.on(Events.GuildMemberAdd, (member) => {
    const welcomeEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Hi Hellow Welcome ' + member.user.username + '! :3')
        .setAuthor({ name: '🤖 Beep Boop 🔧' })
        .setThumbnail(member.user.displayAvatarURL({}))
        .setTimestamp()
        .setFooter({ text: 'Have fun', iconURL: member.guild.iconURL({}) });
    publicchannel === null || publicchannel === void 0 ? void 0 : publicchannel.send({ embeds: [welcomeEmbed] });
    if (weirdosrole != undefined)
        member.roles.add(weirdosrole);
});
client.on(Events.GuildMemberRemove, (member) => {
    publicchannel === null || publicchannel === void 0 ? void 0 : publicchannel.send(member.user.toString() + " left us.. :c");
});
client.on(Events.InteractionCreate, (interaction) => {
    console.log("eh");
});
function messageReaction(reaction, user, removed) {
    return __awaiter(this, void 0, void 0, function* () {
        if (reaction.partial) {
            try {
                yield reaction.fetch();
            }
            catch (error) {
                console.error('Something went wrong when fetching the message:', error);
                return;
            }
        }
        votes.checkReactions(reaction, user, removed);
    });
}
;
client.on(Events.MessageReactionAdd, (reaction, user) => messageReaction(reaction, user, false));
client.on(Events.MessageReactionRemove, (reaction, user) => messageReaction(reaction, user, true));
client.on(Events.Error, () => { client.login(token); });
client.login(token);
