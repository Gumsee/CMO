import { Guild, Role, TextChannel } from "discord.js";

export class Commands
{
    weirdosRole: Role;
    commandsChannel : TextChannel;

    constructor(weirdosrole : Role, commandschannel : TextChannel)
    {
        this.weirdosRole = weirdosrole;
        this.commandsChannel = commandschannel;
    }

    checkRoles(guild : Guild)
    {
        guild.members.fetch().then(members => {
            members.forEach(member => {
                var weirdosname = this.weirdosRole.name;
                if(member.roles.cache.find(role => role.name === weirdosname) == undefined)
                {
                    var username = member.user.username;
                    this.commandsChannel.send(username + " is missing " + weirdosname + " role, setting role..");
    
                    member.roles.add(this.weirdosRole);
    
                    if(member.roles.cache.find(role => role.name === weirdosname) != undefined)
                        this.commandsChannel.send(username + " successfully became a " + weirdosname);
                }
            });
        }).catch(console.error);
    }
}