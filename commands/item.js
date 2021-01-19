const { MessageEmbed } = require("discord.js");
const {translate} = require("pirate-speak")

module.exports = {
    name: "item",
    description: "Get Info about a specific Item.",
    aliases: ["iteminfo"],
    category: "Economy",
    run: async(message,args,client,db,cooldowndb) => {
        const itemID = args[0];
        if(!client.shop.has(itemID)) return message.channel.send(new MessageEmbed().setColor("RED").setTitle("❌ Nothing").setDescription(translate(`There's no such item with an ID ${itemID} in the shop!`)));
        const item = await client.shop.get(itemID);
        let info = `"**${translate(item.description)}**"\n ID: \`${item.id}\` \n Price: **${item.price}** \n Category: **${item.category}**`;
        if(item.category == "Ships") info += `\n Defense: **${item.defense}**`
        if(item.category == "Swords") info += `\n Attack: **${item.attack}**`

        const infoEmbed = new MessageEmbed()
        .setTitle(`⚔ Item : ${item.name}`)
        .setDescription(info)

        message.channel.send(infoEmbed)
    }
}