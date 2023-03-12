import { Guild, VoiceChannel } from "discord.js";
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, generateDependencyReport, getVoiceConnection, joinVoiceChannel, VoiceConnection } from '@discordjs/voice';

export function joinVoice(channel : VoiceChannel, guild : Guild)
{
    const player = createAudioPlayer();
    player.on('error', error => {
        console.error(`Error: ${error.message} with resource ${error.resource.metadata}`);
    });
    player.on(AudioPlayerStatus.Playing, () => {
        console.log('The audio player has started playing!');
    });

    //const resource = createAudioResource("/home/gumse/Projects/DiscordBots/CMO/augh.mp3", { inlineVolume: true });
    //resource.volume?.setVolume(0.5);
    //player.play(resource);

    const connection : VoiceConnection = joinVoiceChannel({
        channelId: channel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
    });
    connection.subscribe(player);
}

export function leaveVoice(guild : Guild)
{
    const connection = getVoiceConnection(guild.id);
    connection?.disconnect();
}