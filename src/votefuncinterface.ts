import { Guild, MessageReaction, TextChannel, User } from "discord.js";

export class VoteFuncs
{
    mainGuild: Guild;
    voteChannel: TextChannel;

    constructor(mainguild : Guild, votechannel : TextChannel)
    {
        this.mainGuild = mainguild;
        this.voteChannel = votechannel;
    };
    onReactionAdd(reaction : MessageReaction, user : User) : void {};
    onReactionRemove(reaction : MessageReaction, user : User) : void {};
};