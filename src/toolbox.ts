import { Channel, Collection, Guild, GuildChannelManager, GuildManager, GuildMember, Message, Role, TextChannel } from "discord.js";

const botid : string = require("../secret.json").botid;

export function findTextChannelByName(channels : GuildChannelManager, name : string) : TextChannel | undefined
{
    return (channels.cache.find(channel => channel.name === name)?.fetch() as TextChannel | undefined);
}

export function findTextChannelById(channels : GuildChannelManager, id : string)
{
    return (channels.cache.find(channel => channel.id === id) as TextChannel | undefined);
}

export function findGuildById(guilds : GuildManager, id : string) : Guild | undefined
{
    return guilds.cache.find(guild => guild.id === id);
}

export function findGuildMemberById(guild : Guild, id : string) : GuildMember | undefined
{
    return guild.members.cache.find(member => member.user.id === id);
}

export function findGuildRoleByLowercaseName(guild : Guild, name : string) : Role | undefined
{
    return guild.roles.cache.find(role => role.name.toLowerCase() === name);
}

export async function channelContainsMessageByMe(channel : TextChannel, message : string) : Promise<boolean>
{
    return await channel.messages.fetch().then(
        (messages) => messages.some(msg => msg.content === message && msg.author.id === botid)
    );
}