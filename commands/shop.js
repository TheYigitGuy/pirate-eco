const DiscordJS = require("discord.js");
const piratish = require("pirate-speak");
const { description } = require("./daily");
const pagination = require("discord.js-pagination");

module.exports = {
    name: "shop",
    description: "See what's waiting for you in the shop!",
    aliases: ["store", "s"],
    category: "Economy",
    run: async(message,args,client,db,cooldowndb) => {
        const categoryEmbeds = []
        client.shopCategories.forEach(async category => {
            let placeholder = new DiscordJS.MessageEmbed()
            .setTitle(`Shop Category: ${category}`)
            client.shop.forEach(item => {
                if(item.category === category) {
                placeholder.addField(item.name, `\n${item.description}\n Price: ${item.price}\n ID: ${item.id}`)
            }
          })

          await categoryEmbeds.push(placeholder)
        })

        pagination(message, categoryEmbeds, ["⏪" , "⏩"], 120000)
    }
}