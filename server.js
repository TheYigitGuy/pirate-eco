const DiscordJS = require("discord.js");
const {prefix,token,owners} = require("./config.json");
const client = new DiscordJS.Client();
const enmap = require("enmap");
const fs = require("fs");
const pirateSpeak = require("pirate-speak");

client.commands = new DiscordJS.Collection();
client.events = new DiscordJS.Collection();
client.shop = new DiscordJS.Collection();
client.shopCategories = new DiscordJS.Collection();
client.commandCategories = new DiscordJS.Collection();

const cmdFiles = fs.readdirSync("./commands/").filter(file => file.endsWith(".js"));
for(const file of cmdFiles) {
    const command = require(`./commands/${file}`);
    if(!client.commandCategories.has(command.category)) client.commandCategories.set(command.category, command.category);
    client.commands.set(command.name, command);
}

const shopItems = fs.readdirSync("./shop/").filter(file => file.endsWith(".js"));
for(const _item of shopItems) {
    const item = require(`./shop/${_item}`);
    client.shop.set(item.id, item);
    if(item.category == "Ships" && (item.attack || !item.defense)) throw new TypeError("Ships should only have a defense value.")
    if(!client.shopCategories.has(item.category)) client.shopCategories.set(item.category, item.category);
}

const eco = new enmap({
    name: "economy",
    cloneLevel: "deep",
    fetchAll: true,
    autoFetch: true
})

const cooldowns = new enmap({
    name: "cooldowns",
    cloneLevel: "deep",
    fetchAll: false,
    autoFetch: true
})


fs.readdir('./events', (err, files) => {
    if(err) return console.error(err);
    files.forEach(file => {
        if(!file.endsWith(".js")) return;
        const event = require(`./events/${file}`);
        const eventName = file.split(".")[0];
        client.on(eventName, event.bind(null, client));
        delete require.cache[require.resolve(`./events/${file}`)]
    })
})

client.on("message", async message => {
    if(!message.content.startsWith(prefix) || message.author.bot || !message.guild) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = await client.commands.get(command)
    || client.commands.find(c => c.aliases && c.aliases.includes(command));

    if(!cmd) return;

    if(cmd.ownersOnly && !owners.includes(message.author.id)) return message.reply(pirateSpeak.translate("You can't do that."))

    try {cmd.run(message,args,client,eco,cooldowns)}
    catch(err) {console.error(err)}
})

client.login(token)