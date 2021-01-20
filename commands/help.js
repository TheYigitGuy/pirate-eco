const DiscordJS = require("discord.js");
const pagination = require("discord.js-pagination");
const {translate} = require("pirate-speak"); 



module.exports = {
    name: "help",
    description: "See my commands or Get Info on a specific command!",
    aliases: ["h", "halp"],
    category: "System",
    run: async(message,args,client,db,cooldowndb) => {
        const botcmds = client.commands;
        const categories = client.commandCategories;
        const ccategories = []

        let placeholder = new DiscordJS.MessageEmbed()
            .setColor("RANDOM")
            .setTitle(`Here is my Commands:`)

        let reply = "";
        categories.forEach(category => {
            const matchingCommands = botcmds.filter(command => command.category == category);
            const mappedCommands = matchingCommands.map(e => `**${e.name}** => ${translate(e.description)}`).join("\n")
            reply += `**__${category} Commands:__** \n ${mappedCommands}\n\n`
        })

        await placeholder.setDescription(reply);
        return message.channel.send(placeholder)
    
    }
};