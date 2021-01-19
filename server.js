const DiscordJS = require("discord.js");
const {prefix,token} = require("./config.json");
const client = new DiscordJS.Client();
const enmap = require("enmap");
const fs = require("fs");

client.commands = new DiscordJS.Collection();
client.events = new DiscordJS.Collection();

const cmdFiles = fs.readdirSync("./commands/").filter(file => file.endsWith(".js"));
for(const file of cmdFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
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

    try {cmd.run(message,args,client,eco,cooldowns)}
    catch(err) {console.error(err)}
})

client.login(token)