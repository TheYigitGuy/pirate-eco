module.exports = async (client) => {
    console.log(`${client.user.tag} is Online!`)
    await client.user.setActivity(`Pirate Bot v1.1.0 | Ye scallywags are awesome!`).then(() => console.log("Activity succesfully set!"))
}