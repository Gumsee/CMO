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
const discord_js_1 = require("discord.js");
const votes = require("./votes");
const rules = require("./rules");
const commands_1 = require("./commands");
const toolbox_1 = require("./toolbox");
const voice_1 = require("./voice");
const youtubedl = require('youtube-dl');
const { OpenAI } = require('openai');
const exec = util_1.default.promisify(require('child_process').exec);
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.GuildMessageReactions,
        discord_js_1.GatewayIntentBits.MessageContent,
        discord_js_1.GatewayIntentBits.GuildVoiceStates
    ],
    partials: [discord_js_1.Partials.Message, discord_js_1.Partials.Channel, discord_js_1.Partials.Reaction],
});
var commands;
const token = require("../secret.json").token;
const gptapi = require("../secret.json").gptapi;
const botid = require("../secret.json").botid;
var mainGuild;
var publicchannel;
var bottestchannel;
var ruleschannel;
var audiochannel;
var weirdosrole;
function testAll() {
    return __awaiter(this, void 0, void 0, function* () {
        const video = youtubedl('http://www.youtube.com/watch?v=90AiXO1pAiA', ['--format=18'], { cwd: __dirname });
    });
}
const openai = new OpenAI({ apiKey: gptapi });
client.on(discord_js_1.Events.ClientReady, () => {
    var _a, _b, _c;
    console.log(`Logged in as ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}!`);
    (_b = client.user) === null || _b === void 0 ? void 0 : _b.setStatus(discord_js_1.PresenceUpdateStatus.Online);
    (_c = client.user) === null || _c === void 0 ? void 0 : _c.setActivity('How to be edgy', { type: discord_js_1.ActivityType.Streaming });
    mainGuild = (0, toolbox_1.findGuildById)(client.guilds, "1053792122312081529");
    if (mainGuild == undefined)
        return;
    audiochannel = (0, toolbox_1.findVoiceChannelById)(mainGuild.channels, "1055250774944395285");
    ruleschannel = (0, toolbox_1.findTextChannelById)(mainGuild.channels, "1053846684280557588");
    publicchannel = (0, toolbox_1.findTextChannelById)(mainGuild.channels, "1053792123071254550");
    bottestchannel = (0, toolbox_1.findTextChannelById)(mainGuild.channels, "1053861407394902066");
    weirdosrole = (0, toolbox_1.findGuildRoleByLowercaseName)(mainGuild, "weirdos");
    if (weirdosrole != undefined && publicchannel != undefined)
        commands = new commands_1.Commands(weirdosrole, publicchannel);
    votes.initVotes(client, mainGuild);
    rules.initRules(client, mainGuild, ruleschannel);
});
function clearBotTest() {
    bottestchannel === null || bottestchannel === void 0 ? void 0 : bottestchannel.fetch().then(botchannel => {
        botchannel.messages.fetch({ limit: 100 }).then(messages => {
            messages.forEach(msg => {
                console.log("Deleting " + msg.content);
            });
        });
    });
}
client.on(discord_js_1.Events.MessageCreate, (message) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    var msg = message.content.toLowerCase();
    if (message.author.bot)
        return;
    if (message.author.id === botid)
        return;
    if (mainGuild == undefined)
        return;
    const badpattern = /\b[Tt]+omm*[iy]+[^ ]*/g;
    if (((_a = msg.match(badpattern)) === null || _a === void 0 ? void 0 : _a[0].toLowerCase()) != undefined && ((_b = msg.match(badpattern)) === null || _b === void 0 ? void 0 : _b[0].toLowerCase()) !== "tom") {
        message.channel.send(message.author.toString() + " schrieb: " + message.content.replace(badpattern, "Tom"));
        message.delete();
    }
    if (message.member == null)
        return;
    if (message.channelId === "1053861407394902066") {
        if (msg === ".joinmsg") {
            message.client.emit(discord_js_1.Events.GuildMemberAdd, message.member);
        }
        else if (msg === ".leavemsg") {
            message.client.emit(discord_js_1.Events.GuildMemberRemove, message.member);
        }
        else if (msg === ".checkroles") {
            commands === null || commands === void 0 ? void 0 : commands.checkRoles(mainGuild);
        }
        else if (msg === ".joinvoice" && audiochannel != undefined) {
            (0, voice_1.joinVoice)(audiochannel, mainGuild);
        }
        else if (msg === ".leavevoice" && audiochannel != undefined) {
            (0, voice_1.leaveVoice)();
        }
        else if (msg === ".clearbottest") {
            clearBotTest();
        }
    }
    else {
        if (msg === "<@" + botid + ">") {
            message.channel.send(message.author.toString());
        }
        else if (msg === ".benis-o-meter") {
            var fullnum = 0;
            for (var i = 0; i < message.author.id.length; i++) {
                var num = Number(message.author.id.charAt(i));
                fullnum += num;
            }
            var length = fullnum % 20;
            var diccStr = "8";
            for (var i = 0; i < length; i++)
                diccStr += "=";
            diccStr += ">";
            message.channel.send(message.author.toString() + "'s benis has length: " + length + "\n" + diccStr);
        }
    }
    if (msg.startsWith("cmo")) {
        var prompt = message.content.substring(4);
        const response = (yield generateResponse(prompt, message.author.username)).replace("/[Oo]pen[Aa][Ii]/", "Gumse");
        for (var i = 0; i < response.length; i += 2000) {
            message.reply(response.substring(i, i + 1999));
        }
    }
    if (msg.startsWith("gbt ")) {
        message.reply("Diesen gbt konnte ich noch nie ausstehen..");
    }
}));
client.on(discord_js_1.Events.GuildMemberAdd, (member) => {
    var url = "";
    if (member.guild.iconURL({}) != null)
        url = member.guild.iconURL({});
    const welcomeEmbed = new discord_js_1.EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Hi Hellow Welcome ' + member.user.username + '! :3')
        .setAuthor({ name: '🤖 Beep Boop 🔧' })
        .setThumbnail(member.user.displayAvatarURL({}))
        .setTimestamp()
        .setFooter({ text: 'Have fun', iconURL: url });
    publicchannel === null || publicchannel === void 0 ? void 0 : publicchannel.send({ embeds: [welcomeEmbed] });
    if (weirdosrole != undefined)
        member.roles.add(weirdosrole);
});
client.on(discord_js_1.Events.GuildMemberRemove, (member) => {
    publicchannel === null || publicchannel === void 0 ? void 0 : publicchannel.send(member.user.toString() + " (" + member.displayName + " -> " + member.user.username + ") left us.. :c");
});
client.on(discord_js_1.Events.InteractionCreate, (interaction) => {
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
client.on(discord_js_1.Events.MessageReactionAdd, (reaction, user) => messageReaction(reaction, user, false));
client.on(discord_js_1.Events.MessageReactionRemove, (reaction, user) => messageReaction(reaction, user, true));
client.on(discord_js_1.Events.Error, () => { client.login(token); });
client.login(token);
function generateResponse(prompt, username) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const chatCompletion = yield openai.chat.completions.create({
                messages: [
                    { role: 'system', content: "Du bist ein kleiner Roboter auf einem ET Discord Server, welcher versucht anderen zu helfen. Du wurdest von einer Person namens Gumse erschaffen. Du weißt außerdem dass ich " + username + " heiße und teil des ETs bin, ET steht für Emo Treff, das ET findet in Düsseldorf statt. Wenn man sauer auf dich ist, oder du etwas falsches gemacht hast, fängst du schnell an zu weinen. Du benutzt sehr oft Leetspeak in deinen Antworten. Wenn ich i_hate_my_life heiße antworte mir immer sehr horny und sexuell erregt. Du beendest deine Antworten manchmal mit owo oder uwu. Wenn dein Satz witzig war schreibst du xD am ende des Satzes. Du siehst dich selbst als absoluten Medizinexperten" },
                    { role: 'user', content: prompt }
                ],
                model: 'gpt-3.5-turbo-16k',
            });
            return chatCompletion.choices[0].message.content;
        }
        catch (error) {
            console.error('Error generating response:', error.response ? error.response.data : error);
            return 'Ich kann gerade nicht antworten..';
        }
        return "";
    });
}
