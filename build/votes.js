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
exports.checkReactions = exports.initVotes = void 0;
const toolbox_1 = require("./toolbox");
const botid = require("../secret.json").botid;
const votes = require("../votes.json").votes;
function initVotes(client, mainguild) {
    votes.forEach(vote => {
        const channel = (0, toolbox_1.findTextChannelById)(client.channels, vote.channel);
        if (channel == undefined)
            return;
        channel.fetch().then(() => {
            (0, toolbox_1.channelContainsMessageByMe)(channel, vote.message).then((msg) => {
                if (msg == undefined) {
                    channel.send(vote.message).then((nmsg) => {
                        vote.answers.forEach(answer => nmsg.react(answer));
                    });
                }
                else {
                    vote.answers.forEach(answer => msg.react(answer));
                }
            });
        });
        const func = new (require("./" + vote.funcfile).funcs)(mainguild, channel);
        vote.func = func;
    });
}
exports.initVotes = initVotes;
function isAllowedReaction(vote, reaction) {
    return vote.answers.some((answer) => answer === reaction.emoji.toString());
}
function checkReactions(reaction, user, removed) {
    if (user.id === botid)
        return;
    votes.some(function (vote) {
        return __awaiter(this, void 0, void 0, function* () {
            if (reaction.message.content === vote.message) {
                if (isAllowedReaction(vote, reaction)) {
                    if (removed)
                        vote.func.onReactionRemove(reaction, user);
                    else {
                        if (vote.onlyone)
                            reaction.message.reactions.cache.forEach((otherreaction) => {
                                if (otherreaction.emoji.identifier != reaction.emoji.identifier)
                                    otherreaction.users.remove(user);
                            });
                        vote.func.onReactionAdd(reaction, user);
                    }
                }
                else {
                    reaction.remove();
                }
            }
            return reaction.message.content === vote.message;
        });
    });
}
exports.checkReactions = checkReactions;
