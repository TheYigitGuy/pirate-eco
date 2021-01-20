const { MessageEmbed } = require("discord.js");
const {translate} = require("pirate-speak");

module.exports = {
    name: "buy",
    description: "Buy items!",
    category: "Economy",
    run: async(message,args,client,db,cooldowndb) => {
        await db.ensure(`${message.author.id}-inventory`, []);
        await db.ensure(`${message.author.id}-bal`, 0);

        const userInv = db.get(`${message.author.id}-inventory`);
        const userBal = db.get(`${message.author.id}-bal`);

        const itemID = args[0];
        if(!itemID) return message.reply(translate("My dude what u want to buy?"))
        if(!client.shop.has(itemID)) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(translate(`There's no such item in database with an ID of ${itemID}`)).setTitle("❌ Nothing."))

        const item = client.shop.get(itemID);
        if(db.get(`${message.author.id}-inventory`).find(object => object.id === itemID)) return message.reply("You cant buy items twice")
         

        await db.push(`${message.author.id}-inventory`, item);
        await db.set(`${message.author.id}-bal`, (parseInt(userBal) - item.price))

        message.channel.send(new MessageEmbed()
        .setColor("RANDOM")
        .setDescription(translate(`You succesfuly bought a(n) ${item.name}! \n Your new amount of money is ${parseInt(userBal - item.price)}\n See your money using pr!loot \n See your inventory using pr!inventory`))
        .setTitle(translate(`✅ Success`)))
    }
}