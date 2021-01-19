const {MessageEmbed} = require("discord.js");
const {translate} = require("pirate-speak");

module.exports = {
    name: "delmoney",
    description: "Delete Money from Someone's or your balance! <OWNER ONLY>",
    aliases: ["delm", "dmoney"],
    category: "Economy-Owner",
    ownersOnly: true,
    run: async(message,args,client,db) => {
        const targetID = message.mentions.members.first() || message.author;
        await db.ensure(`${targetID.id}-bal`, 0)
        
        const money = args[0]
        if(isNaN(money)) return message.reply(translate("The first argument must be a number!"));

        const oldBal = await db.get(`${targetID.id}-bal`);
        const newBal = parseInt(parseInt(oldBal) - parseInt(money));
        if(newBal < 0) return message.reply(translate("Bro you cant make people that poor, let them atleast have a positive amount of money."))

        await db.set(`${targetID.id}-bal`, newBal);

        const successEmbed = new MessageEmbed()
        .setColor("GREEN")
        .setTitle(translate(`💵 Money add`))
        .setDescription(translate(`Successfully removed ${money} money from <@${targetID.id}>'s Loot.`))

        return message.channel.send(successEmbed);
    }
}