"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Commands = void 0;
class Commands {
    constructor(weirdosrole, commandschannel) {
        this.weirdosRole = weirdosrole;
        this.commandsChannel = commandschannel;
    }
    checkRoles(guild) {
        guild.members.fetch().then(members => {
            members.forEach(member => {
                var weirdosname = this.weirdosRole.name;
                if (member.roles.cache.find(role => role.name === weirdosname) == undefined) {
                    var username = member.user.username;
                    this.commandsChannel.send(username + " is missing " + weirdosname + " role, setting role..");
                    member.roles.add(this.weirdosRole);
                    if (member.roles.cache.find(role => role.name === weirdosname) != undefined)
                        this.commandsChannel.send(username + " successfully became a " + weirdosname);
                }
            });
        }).catch(console.error);
    }
}
exports.Commands = Commands;
