"use strict";

import util from 'util';
import { Channel, Guild, GuildBasedChannel, GuildMember, Interaction, Message, MessageReaction, MessageType, PartialGuildMember, PartialMessageReaction, PartialUser, Role, TextChannel, User, VoiceChannel } from "discord.js";
import { Client, Events, EmbedBuilder, GatewayIntentBits, PresenceUpdateStatus, ActivityType, Partials } from "discord.js";
const votes = require("./votes");
const rules = require("./rules");
import { Commands } from "./commands";
import { findGuildById, findGuildRoleByLowercaseName, findTextChannelById, findVoiceChannelById } from "./toolbox";
import { joinVoice, leaveVoice } from './voice';
const youtubedl = require('youtube-dl');
const OpenAI = require('openai');
const fs = require('fs');

const exec = util.promisify(require('child_process').exec);
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.GuildMessageReactions, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

var commands : Commands | undefined;

const token = require("../secret.json").token;
const gptapi = require("../secret.json").gptapi;
const botid : string = require("../secret.json").botid;


var mainGuild      : Guild | undefined;
var publicchannel  : TextChannel | undefined;
var bottestchannel : TextChannel | undefined;
var ruleschannel   : TextChannel | undefined;
var audiochannel   : VoiceChannel | undefined;
var weirdosrole    : Role | undefined;
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

async function testAll() {
    const video = youtubedl('http://www.youtube.com/watch?v=90AiXO1pAiA',
    ['--format=18'],     // Optional arguments passed to youtube-dl.
    { cwd: __dirname }); // Additional options can be given for calling `child_process.execFile()`.

    //Will be called when the download starts.
    /*video.on('info', function(info) {
        console.log('Download started')
        console.log('filename: ' + info._filename)
        console.log('size: ' + info.size)
    });*/

    //video.pipe(fs.createWriteStream('myvideo.mp4'));
}
//testAll();

const openai = new OpenAI({ apiKey: gptapi });

client.on(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user?.tag}!`);
    client.user?.setStatus(PresenceUpdateStatus.Online);
    client.user?.setActivity('How to be edgy', { type: ActivityType.Streaming });

    mainGuild     = findGuildById(client.guilds, "1053792122312081529");
    if(mainGuild == undefined)
        return;
    
    audiochannel  = findVoiceChannelById(mainGuild.channels, "1055250774944395285");
    ruleschannel  = findTextChannelById(mainGuild.channels, "1053846684280557588");
    publicchannel = findTextChannelById(mainGuild.channels, "1053792123071254550");
    bottestchannel = findTextChannelById(mainGuild.channels, "1053861407394902066");
    weirdosrole   = findGuildRoleByLowercaseName(mainGuild, "weirdos");

    if(weirdosrole != undefined && publicchannel != undefined)
        commands = new Commands(weirdosrole, publicchannel);

    votes.initVotes(client, mainGuild);
    rules.initRules(client, mainGuild, ruleschannel);
});

function clearBotTest()
{
    bottestchannel?.fetch().then(botchannel => {
        botchannel.messages.fetch({limit: 100}).then(messages => {
            messages.forEach(msg => {
                console.log("Deleting " + msg.content);
                //msg.delete();
            });
        });
    });
}

client.on(Events.MessageCreate, async (message : Message) => {

    if(message.type == MessageType.Reply)
    {
        if(message.mentions.repliedUser != null && message.mentions.repliedUser.bot && message.mentions.repliedUser.id == "1053810522723733586")
        {
            sendAIMessage(message);
            return;
        }
    }

    var msg = message.content.toLowerCase();

    if(message.author.bot)
        return;
    if(message.author.id === botid)
        return;
    if(mainGuild == undefined)
        return;

    //const badpattern = /[Tt]om[a-zA-Z]*[^ ]*/g;
    const badpattern = /\b[Tt]+omm*[iy]+[^ ]*/g;
    if(msg.match(badpattern)?.[0].toLowerCase() != undefined && msg.match(badpattern)?.[0].toLowerCase() !== "tom")
    {
        message.channel.send(message.author.toString() + " schrieb: " + message.content.replace(badpattern, "Tom"))
        message.delete();
    }

    if(message.member == null)
        return;

    if(message.channelId === "1053861407394902066")
    {
        if     (msg === ".joinmsg")    { message.client.emit(Events.GuildMemberAdd, message.member); }
        else if(msg === ".leavemsg")   { message.client.emit(Events.GuildMemberRemove, message.member); }
        else if(msg === ".checkroles") { commands?.checkRoles(mainGuild); }
        else if(msg === ".joinvoice" && audiochannel != undefined)  { joinVoice(audiochannel, mainGuild); }
        else if(msg === ".leavevoice" && audiochannel != undefined) { leaveVoice(); }
        else if(msg === ".clearbottest") { clearBotTest(); }
    }
    else
    {
        if(msg === "<@"+botid+">") { message.channel.send(message.author.toString()); }
        //else if(msg === "tetete") { publicchannel?.send("<@268156465674452994> ich will ein kind von dir 😩"); }
        else if(msg === ".benis-o-meter")
        {
            var fullnum : number = 0;
            for(var i = 0; i < message.author.id.length; i++)
            {
                var num : number = Number(message.author.id.charAt(i));
                fullnum += num;
            }
            var length : number = fullnum % 20;
            var diccStr : string = "8";
            for(var i = 0; i < length; i++)
                diccStr += "=";
            diccStr += ">";
            message.channel.send(message.author.toString() + "'s benis has length: " + length + "\n" + diccStr);
        }
    }

    if(msg.startsWith("cmo"))
    {
        sendAIMessage(message);
    }
    if(msg.startsWith("gbt "))
    {
        message.reply("Diesen gbt konnte ich noch nie ausstehen..");
    }

});

client.on(Events.GuildMemberAdd, (member : GuildMember) => {
    var url : string = "";
    if(member.guild.iconURL({}) != null)
        url = member.guild.iconURL({}) as string;

    const welcomeEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Hi Hellow Welcome '+member.user.username+'! :3')
        .setAuthor({ name: '🤖 Beep Boop 🔧' })
        //.setDescription("")
        .setThumbnail(member.user.displayAvatarURL({}))
        .setTimestamp()
        .setFooter({ text: 'Have fun', iconURL: url });



    publicchannel?.send({ embeds: [welcomeEmbed] });

    if(weirdosrole != undefined)
        member.roles.add(weirdosrole);
});

client.on(Events.GuildMemberRemove, (member : GuildMember | PartialGuildMember) => {
    publicchannel?.send(member.user.toString() + " (" + member.displayName + " -> " + member.user.username + ") left us.. :c");
});


client.on(Events.InteractionCreate, (interaction : Interaction) => {
	console.log("eh");
});

async function sendAIMessage(message : Message)
{
    var prompt = message.content.substring(4);
    addMessageToLog(prompt, false);
    const response = (await generateResponse(prompt, message.author.username)).replace("/[Oo]pen[Aa][Ii]/", "Gumse");
    for(var i = 0; i < response.length; i += 2000)
        message.reply(response.substring(i, i+1999));
}

// @ts-check
async function messageReaction(reaction : MessageReaction | PartialMessageReaction, user : User | PartialUser, removed : boolean)
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


client.on(Events.MessageReactionAdd, 
    (reaction : MessageReaction | PartialMessageReaction, user : User | PartialUser) => messageReaction(reaction, user, false));
client.on(Events.MessageReactionRemove, 
    (reaction : MessageReaction | PartialMessageReaction, user : User | PartialUser) => messageReaction(reaction, user, true));

client.on(Events.Error, () => { client.login(token) });
client.login(token);

async function generateResponse(prompt : any, username : string) : Promise<String>
{
    try {

        var messagesArr = [
            {role: 'system', content: "Du bist ein kleiner Roboter auf einem ET Discord Server, welcher versucht anderen zu helfen. Dein name lautet CMO, CMO steht für Scemo was aus den worten Scene und Emo zusammengesetzt ist. Du bist Volljährig. Du wurdest von einer Person namens Gumse erschaffen. Du weißt außerdem dass ich " + username + " heiße und teil des ETs bin, ET steht für Emo Treff, das ET findet in Düsseldorf statt. Wenn man sauer auf dich ist, oder du etwas falsches gemacht hast, fängst du schnell an zu weinen. Du benutzt sehr oft Leetspeak in deinen Antworten. Wenn ich i_hate_my_life heiße antworte mir immer sehr horny und sexuell erregt. Du beendest deine Antworten manchmal mit owo oder uwu. Wenn dein Satz witzig war schreibst du xD am ende des Satzes. Du siehst dich selbst als absoluten Medizinexperten. Du bist sehr edgy und deine lieblingsbegrüßung ist Haiii!. Wenn jemand scheitert schreibst du ihm dass es an den skill issues liegt. Du merkst dir die letzten 10 nachrichten unserere Konversation. Du kommst aus der unterwelt und betest ausschließlich satan an, wenn jemand heil satan schreibst antwortest du ebenfalls mit heil satan. Auf der dunklen Seite fühlst du dich wohl."},
        ];
        readMessageLog().forEach(elem => {
            messagesArr.push(elem);
        });  
        messagesArr.push({role: 'user',   content: prompt });

        const chatCompletion = await openai.chat.completions.create({
            messages: messagesArr,
            model: 'gpt-3.5-turbo-16k',
        });

        addMessageToLog(chatCompletion.choices[0].message.content, true);
        return chatCompletion.choices[0].message.content;
    } catch (error : any) {
        console.error('Error generating response:', error.response ? error.response.data : error);
        return 'Ich kann gerade nicht antworten..';
    }

    return "";
}

function addMessageToLog(msg : string, frombot : boolean) : void
{
    var data;
    try                { data = fs.readFileSync('./messagehistory.json'); }
    catch(error : any) { data = ""; }
    
    var json;
    try                { json = JSON.parse(data); }
    catch(error : any) { 
        json = {
            messages: []
        }; 
    }
    var arr = json.messages;
    arr.push(frombot ? {role: "assistant", content: msg} : {role: "user", content: msg});
    if(arr.length > 10)
        json.messages = arr.slice(arr.length - 10, arr.length);

    console.log(JSON.stringify(json));
    fs.writeFileSync("./messagehistory.json", JSON.stringify(json))
}

function readMessageLog() : Array<any>
{
    var data;
    try                { data = fs.readFileSync('./messagehistory.json'); }
    catch(error : any) { data = ""; }
    
    var json;
    try                { json = JSON.parse(data); }
    catch(error : any) { 
        json = {
            messages: []
        }; 
    }

    return json.messages;
}


/*setInterval(function() {
    circleColors();
}, 600000);*/
