const DiscordJS = require("discord.js");
const ms = require("ms")
const piratish = require("pirate-speak");
const {prefix} = require("../config.json");

module.exports = {
    name: "daily",
    description: "Claim your daily reward",
    aliases: ["d"],
    category: "Economy",
    run: async(message,args,client,db,cooldowndb) => {
        const cooldownData = await cooldowndb.get(`${message.author.id}-daily`);

        if(parseInt(cooldownData) > Date.now()) return message.channel.send(new DiscordJS.MessageEmbed().setTitle(piratish.translate("❌ Slow down, come on")).setDescription(piratish.translate(`Bro please wait ${ms(parseInt(cooldownData) - Date.now(), {long: true})} before claiming your daily reward again.`)));

        await db.ensure(`${message.author.id}-bal`, 0);
        await db.ensure(`${message.author.id}-dstreak`, 0)
        const _currentBal = await db.get(`${message.author.id}-bal`)
        const _streak = await db.get(`${message.author.id}-dstreak`)
        const newBal = _currentBal + (50 * (_streak + 1))
        await db.set(`${message.author.id}-bal`, newBal)
        await db.inc(`${message.author.id}-dstreak`)
        cooldowndb.set(`${message.author.id}-daily`, Date.now() + ms("1d"))

        return message.channel.send(new DiscordJS.MessageEmbed()
        .setColor("RANDOM")
        .setDescription(piratish.translate(`You succesfuly claimed ${50 * (_streak + 1)} money as your daily reward! \n You're on a Daily Streak of ${db.get(`${message.author.id}-dstreak`)}! \n Your new amount of money is ${newBal}\n See your money using ${prefix}loot`))
        .setTitle(piratish.translate(`✅ Good Job`))
        )
    }
}