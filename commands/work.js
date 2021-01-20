const DiscordJS = require("discord.js");
const ms = require("ms")
const piratish = require("pirate-speak");
const {prefix} = require("../config.json");

module.exports = {
    name: "work",
    description: "Earn money.",
    aliases: ["w"],
    category: "Economy",
    run: async(message,args,client,db,cooldowndb) => {
        const cooldownData = await cooldowndb.get(`${message.author.id}-work`);
        if(!message.author.id === "750802821900664864") {

        if(parseInt(cooldownData) > Date.now()) return message.channel.send(new DiscordJS.MessageEmbed().setTitle(piratish.translate("❌ Slow down, come on")).setDescription(piratish.translate(`Bro please wait ${ms(parseInt(cooldownData) - Date.now(), {long: true})} before working again.`)));
        }

        const randomMoney = Math.floor((Math.random() * 251) + 50) //max 300, min 50 
        await db.ensure(`${message.author.id}-bal`, 0);
        const _currentBal = await db.get(`${message.author.id}-bal`)
        const newBal = _currentBal + randomMoney
        await db.set(`${message.author.id}-bal`, newBal)
        if(!message.author.id === "750802821900664864") {
        cooldowndb.set(`${message.author.id}-work`, Date.now() + ms("1h"))
        cooldowndb.delete("750802821900664864-work")
        }

        return message.channel.send(new DiscordJS.MessageEmbed()
        .setColor("RANDOM")
        .setDescription(piratish.translate(`You succesfully worked for ${randomMoney}! \n Your new amount of money is ${newBal}\n See your money using ${prefix}loot`))
        .setTitle(piratish.translate(`✅ Good Job`))
        )
    }
}