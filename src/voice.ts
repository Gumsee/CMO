const fs = require('fs');
import { Guild, VoiceBasedChannel, VoiceChannel } from "discord.js";
import { StreamType, entersState, VoiceConnectionStatus, AudioPlayerStatus, createAudioPlayer, createAudioResource, generateDependencyReport, getVoiceConnection, joinVoiceChannel, VoiceConnection } from '@discordjs/voice';
const ytdl = require('ytdl-core');
const play = require('discordjs-ytdl')

var voiceConnection : VoiceConnection | undefined;
const YTDlpWrap = require('yt-dlp-wrap').default;
const ytDlpWrap = new YTDlpWrap('/usr/bin/yt-dlp');

export function joinVoice(channel : VoiceBasedChannel, guild : Guild, url : String)
{

    //const resource = createAudioResource("/home/gumse/Projects/DiscordBots/CMO/augh.mp3", { inlineVolume: true });
    //resource.volume?.setVolume(0.5);
    //player.play(resource);

    voiceConnection = joinVoiceChannel({
        channelId: channel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
    });

    const connection = getVoiceConnection(guild.id); 
    const player = createAudioPlayer();
    //const resource = createAudioResource(createReadStream('/home/gumse/Soundeffects/kaufland.ogg'));
    //console.log(resource);
    try {
        entersState(voiceConnection, VoiceConnectionStatus.Ready, 5000);
        console.log("Connected: " + channel.name);
    } 
    catch(error) 
    {
        console.log("Voice Connection not ready within 5s.", error);
        return;
    }

    if(connection !== undefined)
        connection.subscribe(player);

    console.log("1");
    try {
    let readableStream = ytDlpWrap.execStream([
        url,
        '-x',
        '--audio-format',
        'opus',
    ]);
    let stream = readableStream.pipe(fs.createWriteStream('streams/stream.ogg'));

    stream.on("finish", () => {
        const resource = createAudioResource('streams/stream.ogg');
        player.play(resource);
        console.log("playing");
    });
    }
    catch(error)
    {
        console.log("Failed to play video");
    }

    //const streamOptions = { seek: 0, volume: 1 };
    //const stream = ytdl('https://www.youtube.com/watch?v=a8VA5fjr5ps', {filter:'audioonly'});

    player.on('error', error => {
        console.error(`Error: ${error.message} with resource ${error.resource.metadata}`);
    });
    player.on(AudioPlayerStatus.Playing, () => {
        console.log('The audio player has started playing!');
    });

}

export function leaveVoice()
{
    voiceConnection?.disconnect();
}
