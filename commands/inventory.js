const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "inventory",
    description: "View what goodies you've got!",
    aliases: ["goodies", "inv"],
    category: "Economy",
    run: async(message,args,client,db,cooldowndb) => {
        await db.ensure(`${message.author.id}-inventory`, []);

        const userInventory = db.get(`${message.author.id}-inventory`);
        const placeholder = new MessageEmbed()
        .setTitle(`Yer inventory`)
        .setDescription(`Here is yer items`)

        userInventory.forEach(item => {
            placeholder.addField(`${item.name}` , item.description)
        })

        return message.channel.send(placeholder)
    }
}