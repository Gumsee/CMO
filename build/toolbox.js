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
Object.defineProperty(exports, "__esModule", { value: true });
exports.channelContainsMessageByMe = exports.findGuildRoleByLowercaseName = exports.findGuildMemberById = exports.findGuildById = exports.findVoiceChannelById = exports.findTextChannelById = exports.findTextChannelByName = void 0;
const botid = require("../secret.json").botid;
function findTextChannelByName(channels, name) {
    var _a;
    return (_a = channels.cache.find(channel => channel.name === name)) === null || _a === void 0 ? void 0 : _a.fetch();
}
exports.findTextChannelByName = findTextChannelByName;
function findTextChannelById(channels, id) {
    return channels.cache.find(channel => channel.id === id);
}
exports.findTextChannelById = findTextChannelById;
function findVoiceChannelById(channels, id) {
    return channels.cache.find(channel => channel.id === id);
}
exports.findVoiceChannelById = findVoiceChannelById;
function findGuildById(guilds, id) {
    return guilds.cache.find(guild => guild.id === id);
}
exports.findGuildById = findGuildById;
function findGuildMemberById(guild, id) {
    return guild.members.cache.find(member => member.user.id === id);
}
exports.findGuildMemberById = findGuildMemberById;
function findGuildRoleByLowercaseName(guild, name) {
    return guild.roles.cache.find(role => role.name.toLowerCase() === name);
}
exports.findGuildRoleByLowercaseName = findGuildRoleByLowercaseName;
function channelContainsMessageByMe(channel, message) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield channel.messages.fetch().then((messages) => messages.some(msg => msg.content === message && msg.author.id === botid));
    });
}
exports.channelContainsMessageByMe = channelContainsMessageByMe;
