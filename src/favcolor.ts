import { Emoji, Guild, MessageReaction, Role, TextChannel, User } from "discord.js";
import { findGuildMemberById } from "./toolbox";
import { VoteFuncs } from "./votefuncinterface";

export class funcs extends VoteFuncs
{
    redrole       : Role | undefined; 
    whiterole     : Role | undefined; 
    purplerole    : Role | undefined; 
    pinkrole      : Role | undefined; 
    bluerole      : Role | undefined;
    blackrole     : Role | undefined;
    orangerole    : Role | undefined;
    yellowrole    : Role | undefined;
    brownrole     : Role | undefined;
    greenrole     : Role | undefined;
    roles : Role[] | undefined[] = new Array(5);

    constructor(mainguild : Guild, votechannel : TextChannel)
    {
        super(mainguild, votechannel);
        
        this.redrole    = mainguild.roles.cache.find((role : Role) => role.name.toLowerCase() == "red");
        this.whiterole  = mainguild.roles.cache.find((role : Role) => role.name.toLowerCase() == "white");
        this.purplerole = mainguild.roles.cache.find((role : Role) => role.name.toLowerCase() == "purple");
        this.pinkrole   = mainguild.roles.cache.find((role : Role) => role.name.toLowerCase() == "pink");
        this.bluerole   = mainguild.roles.cache.find((role : Role) => role.name.toLowerCase() == "blue");
        this.blackrole  = mainguild.roles.cache.find((role : Role) => role.name.toLowerCase() == "black");
        this.orangerole = mainguild.roles.cache.find((role : Role) => role.name.toLowerCase() == "orange");
        this.yellowrole = mainguild.roles.cache.find((role : Role) => role.name.toLowerCase() == "yellow");
        this.brownrole  = mainguild.roles.cache.find((role : Role) => role.name.toLowerCase() == "brown");
        this.greenrole  = mainguild.roles.cache.find((role : Role) => role.name.toLowerCase() == "green");
        this.roles[0] = this.redrole;
        this.roles[1] = this.whiterole;
        this.roles[2] = this.purplerole;
        this.roles[3] = this.pinkrole;
        this.roles[4] = this.bluerole;
    }

    getRoleFromEmoji(emoji : Emoji) : Role | undefined
    {
        var roletoset : Role | undefined;
        switch(emoji.toString())
        {
            case "❤️":          roletoset = this.redrole;    break; //Red
            case "🧡":          roletoset = this.orangerole; break; //Orange
            case "💛":          roletoset = this.yellowrole; break; //Yellow
            case "💚":          roletoset = this.greenrole;  break; //Green
            case "💙":          roletoset = this.bluerole;   break; //Blue
            case "💜":          roletoset = this.purplerole; break; //Purple
            case "🤎":          roletoset = this.brownrole;  break; //Brown
            case "🖤":          roletoset = this.blackrole;  break; //Black
            case "🤍":          roletoset = this.whiterole;  break; //White
            case ":pinkheart:": roletoset = this.pinkrole;   break; //Pink
        }

        return roletoset;
    }

    onReactionAdd(reaction : MessageReaction, user : User)
    {
        var role = this.getRoleFromEmoji(reaction.emoji);
        var member = findGuildMemberById(this.mainGuild, user.id);
        if(role != undefined)
            member?.roles.add(role);
    }

    onReactionRemove(reaction : MessageReaction, user : User)
    {
        var role = this.getRoleFromEmoji(reaction.emoji);
        var member = findGuildMemberById(this.mainGuild, user.id);
        if(role != undefined)
            member?.roles.remove(role);
    }
}