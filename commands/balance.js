const { MessageEmbed } = require("discord.js");
const piratish = require("pirate-speak")

module.exports = {
    name: "loot",
    description: "See your loot!",
    aliases: ["balance", "bal", "myloot"],
    category: "Economy",
    run: async(message,args,client,db,cooldownDB) => {
        const userBal = await db.get(`${message.author.id}-bal`);

        const lootEmbed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle("💰 Here is yer loot")
        .setDescription(piratish.translate(`You have ${userBal} money`))

        return message.channel.send(lootEmbed)
    }
}