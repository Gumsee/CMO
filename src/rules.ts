import { Client, Guild, TextChannel } from "discord.js";
import { channelContainsMessageByMe } from "./toolbox";

interface RuleInterface 
{
    setname: string,
    rules: Array<string>
}

const botid : string = require("../secret.json").botid;
const rules : Array<RuleInterface> = require("../rules.json").rulessets;

export function initRules(client : Client, mainguild : Guild, ruleschannel : TextChannel)
{
    rules.forEach(rule => {
        ruleschannel.fetch().then(() => {
            channelContainsMessageByMe(ruleschannel, rule.setname).then((contains) => {
                if(!contains)
                    ruleschannel.send(rule.setname);
            });
        });
    });
}