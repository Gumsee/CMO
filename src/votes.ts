import { Client, Guild, GuildChannelManager, MessageReaction, TextChannel, User } from "discord.js";
import { findTextChannelById, findGuildById, channelContainsMessageByMe } from "./toolbox";
import { VoteFuncs } from "./votefuncinterface";

interface VoteInterface 
{
    message: string,
    answers: Array<string>
    onlyone: boolean,
    channel: string,
    guild: string,
    funcfile: string
    func: VoteFuncs
}

const botid : string = require("../secret.json").botid;
const votes : Array<VoteInterface> = require("../votes.json").votes;

export function initVotes(client : Client, mainguild : Guild)
{
    votes.forEach(vote => {
        const channel = findTextChannelById(client.channels as GuildChannelManager, vote.channel);

        if(channel == undefined)
            return;

        channel.fetch().then(() => {
            channelContainsMessageByMe(channel, vote.message).then((contains) => {
                if(!contains)
                {
                    channel.send(vote.message).then((msg) => {
                        vote.answers.forEach(answer => msg.react(answer));
                    });
                }
            });
        });

        const func : VoteFuncs = new (require("./" + vote.funcfile).funcs)(mainguild, channel) as VoteFuncs;
        vote.func = func;
    });
}

function isAllowedReaction(vote : VoteInterface, reaction : MessageReaction)
{
    return vote.answers.some((answer) => answer === reaction.emoji.toString());
}

export function checkReactions(reaction : MessageReaction, user : User, removed : boolean)
{
    if(user.id === botid)
        return;
    
    votes.some(async function(vote) {
        if(reaction.message.content === vote.message) {

            if(isAllowedReaction(vote, reaction))
            {
                if(removed)
                    vote.func.onReactionRemove(reaction, user);
                else
                {
                    if(vote.onlyone)
                        reaction.message.reactions.cache.forEach((otherreaction) => {
                            if(otherreaction.emoji.identifier != reaction.emoji.identifier) 
                                otherreaction.users.remove(user);
                        });
                    vote.func.onReactionAdd(reaction, user);
                }
            }
            else
            {
                reaction.remove();
            }
        }

        return reaction.message.content === vote.message;
    });
}