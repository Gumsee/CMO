"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.funcs = void 0;
const toolbox_1 = require("./toolbox");
const votefuncinterface_1 = require("./votefuncinterface");
class funcs extends votefuncinterface_1.VoteFuncs {
    constructor(mainguild, votechannel) {
        super(mainguild, votechannel);
        this.roles = new Array(5);
        this.redrole = mainguild.roles.cache.find((role) => role.name.toLowerCase() == "red");
        this.whiterole = mainguild.roles.cache.find((role) => role.name.toLowerCase() == "white");
        this.purplerole = mainguild.roles.cache.find((role) => role.name.toLowerCase() == "purple");
        this.pinkrole = mainguild.roles.cache.find((role) => role.name.toLowerCase() == "pink");
        this.bluerole = mainguild.roles.cache.find((role) => role.name.toLowerCase() == "blue");
        this.blackrole = mainguild.roles.cache.find((role) => role.name.toLowerCase() == "black");
        this.orangerole = mainguild.roles.cache.find((role) => role.name.toLowerCase() == "orange");
        this.yellowrole = mainguild.roles.cache.find((role) => role.name.toLowerCase() == "yellow");
        this.brownrole = mainguild.roles.cache.find((role) => role.name.toLowerCase() == "brown");
        this.greenrole = mainguild.roles.cache.find((role) => role.name.toLowerCase() == "green");
        this.roles[0] = this.redrole;
        this.roles[1] = this.whiterole;
        this.roles[2] = this.purplerole;
        this.roles[3] = this.pinkrole;
        this.roles[4] = this.bluerole;
    }
    getRoleFromEmoji(emoji) {
        var roletoset;
        switch (emoji.toString()) {
            case "❤️":
                roletoset = this.redrole;
                break;
            case "🧡":
                roletoset = this.orangerole;
                break;
            case "💛":
                roletoset = this.yellowrole;
                break;
            case "💚":
                roletoset = this.greenrole;
                break;
            case "💙":
                roletoset = this.bluerole;
                break;
            case "💜":
                roletoset = this.purplerole;
                break;
            case "🤎":
                roletoset = this.brownrole;
                break;
            case "🖤":
                roletoset = this.blackrole;
                break;
            case "🤍":
                roletoset = this.whiterole;
                break;
            case ":pinkheart:":
                roletoset = this.pinkrole;
                break;
        }
        return roletoset;
    }
    onReactionAdd(reaction, user) {
        var role = this.getRoleFromEmoji(reaction.emoji);
        var member = (0, toolbox_1.findGuildMemberById)(this.mainGuild, user.id);
        if (role != undefined)
            member === null || member === void 0 ? void 0 : member.roles.add(role);
    }
    onReactionRemove(reaction, user) {
        var role = this.getRoleFromEmoji(reaction.emoji);
        var member = (0, toolbox_1.findGuildMemberById)(this.mainGuild, user.id);
        if (role != undefined)
            member === null || member === void 0 ? void 0 : member.roles.remove(role);
    }
}
exports.funcs = funcs;
