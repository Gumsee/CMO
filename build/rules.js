"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRules = void 0;
const toolbox_1 = require("./toolbox");
const botid = require("../secret.json").botid;
const rules = require("../rules.json").rulessets;
function initRules(client, mainguild, ruleschannel) {
    rules.forEach(rule => {
        ruleschannel.fetch().then(() => {
            (0, toolbox_1.channelContainsMessageByMe)(ruleschannel, rule.setname).then((msg) => {
                if (msg == undefined)
                    ruleschannel.send(rule.setname);
            });
        });
    });
}
exports.initRules = initRules;
