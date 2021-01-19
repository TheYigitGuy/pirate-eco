const {MessageEmbed} = require("discord.js");
const {translate} = require("pirate-speak");

module.exports = {
    name: "addmoney",
    description: "Add Money to Someone or yourself! <OWNER ONLY>",
    aliases: ["addm", "amoney"],
    category: "Economy-Owner",
    ownerOnly: true,
    run: async(message,args,client,db) => {
        const targetID = message.mentions.members.first() || message.author;
        await db.ensure(`${targetID.id}-bal`, 0)
        
        const money = args[0]
        if(isNaN(money)) return message.reply(translate("The first argument must be a number!"));

        const oldBal = await db.get(`${targetID.id}-bal`);
        const newBal = parseInt(parseInt(oldBal) + parseInt(money));

        await db.set(`${targetID.id}-bal`, newBal);

        const successEmbed = new MessageEmbed()
        .setColor("GREEN")
        .setTitle(translate(`💵 Money add`))
        .setDescription(translate(`Successfully added ${money} money to <@${targetID.id}>'s Loot.`))

        return message.channel.send(successEmbed);
    }
}