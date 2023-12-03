"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveVoice = exports.joinVoice = void 0;
const fs = require('fs');
const voice_1 = require("@discordjs/voice");
const ytdl = require('ytdl-core');
const play = require('discordjs-ytdl');
var voiceConnection;
const YTDlpWrap = require('yt-dlp-wrap').default;
const ytDlpWrap = new YTDlpWrap('/usr/bin/yt-dlp');
function joinVoice(channel, guild, url) {
    voiceConnection = (0, voice_1.joinVoiceChannel)({
        channelId: channel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
    });
    const connection = (0, voice_1.getVoiceConnection)(guild.id);
    const player = (0, voice_1.createAudioPlayer)();
    try {
        (0, voice_1.entersState)(voiceConnection, voice_1.VoiceConnectionStatus.Ready, 5000);
        console.log("Connected: " + channel.name);
    }
    catch (error) {
        console.log("Voice Connection not ready within 5s.", error);
        return;
    }
    if (connection !== undefined)
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
            const resource = (0, voice_1.createAudioResource)('streams/stream.ogg');
            player.play(resource);
            console.log("playing");
        });
    }
    catch (error) {
        console.log("Failed to play video");
    }
    player.on('error', error => {
        console.error(`Error: ${error.message} with resource ${error.resource.metadata}`);
    });
    player.on(voice_1.AudioPlayerStatus.Playing, () => {
        console.log('The audio player has started playing!');
    });
}
exports.joinVoice = joinVoice;
function leaveVoice() {
    voiceConnection === null || voiceConnection === void 0 ? void 0 : voiceConnection.disconnect();
}
exports.leaveVoice = leaveVoice;
