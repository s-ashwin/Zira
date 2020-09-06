require('dotenv').config();

const{Client} = require('discord.js');
const client = new Client();

client.on('ready', ()=>{
    console.log("Hey i'm in");
})


client.login(process.env.BOT_TOKEN);
