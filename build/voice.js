"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveVoice = exports.joinVoice = void 0;
const voice_1 = require("@discordjs/voice");
function joinVoice(channel, guild) {
    const player = (0, voice_1.createAudioPlayer)();
    player.on('error', error => {
        console.error(`Error: ${error.message} with resource ${error.resource.metadata}`);
    });
    player.on(voice_1.AudioPlayerStatus.Playing, () => {
        console.log('The audio player has started playing!');
    });
    const connection = (0, voice_1.joinVoiceChannel)({
        channelId: channel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
    });
    connection.subscribe(player);
}
exports.joinVoice = joinVoice;
function leaveVoice(guild) {
    const connection = (0, voice_1.getVoiceConnection)(guild.id);
    connection === null || connection === void 0 ? void 0 : connection.disconnect();
}
exports.leaveVoice = leaveVoice;
