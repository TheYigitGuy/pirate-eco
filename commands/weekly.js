const DiscordJS = require("discord.js");
const ms = require("ms")
const piratish = require("pirate-speak");
const {prefix} = require("../config.json");

module.exports = {
    name: "weekly",
    description: "Claim your weekly reward",
    aliases: ["week"],
    category: "Economy",
    run: async(message,args,client,db,cooldowndb) => {
        const cooldownData = await cooldowndb.get(`${message.author.id}-weekly`);

        if(parseInt(cooldownData) > Date.now()) return message.channel.send(new DiscordJS.MessageEmbed().setTitle(piratish.translate("❌ Slow down, come on")).setDescription(piratish.translate(`Bro please wait ${ms(parseInt(cooldownData) - Date.now(), {long: true})} before claiming your weekly reward again.`)));

        await db.ensure(`${message.author.id}-bal`, 0);
        await db.ensure(`${message.author.id}-wstreak`, 0)
        const _currentBal = await db.get(`${message.author.id}-bal`)
        const _streak = await db.get(`${message.author.id}-wstreak`)
        const newBal = _currentBal + (500 * (_streak + 1))
        await db.set(`${message.author.id}-bal`, newBal)
        if(_streak < 5)await db.inc(`${message.author.id}-wstreak`)
        cooldowndb.set(`${message.author.id}-weekly`, Date.now() + ms("1w"))

        return message.channel.send(new DiscordJS.MessageEmbed()
        .setColor("RANDOM")
        .setDescription(piratish.translate(`You succesfuly claimed ${500 * (_streak + 1)} money as your weekly reward! \n You're on a Weekly Streak of ${db.get(`${message.author.id}-wstreak`)}! \n Your new amount of money is ${newBal}\n See your money using ${prefix}loot`))
        .setTitle(piratish.translate(`✅ Good Job`))
        )
    }
}