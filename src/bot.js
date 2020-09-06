require('dotenv').config();

const{Client} = require('discord.js');
const client = new Client();

client.on('ready', ()=>{
    console.log("Hey i'm in");
})

client.on('message', (message)=>{
    if(!message.author.bot){
        if(message.content.toLowerCase()==='hello' || message.content.toLowerCase()==='hi'){
            message.reply(`Hey ${message.author.username}! This is Zira`);
        }
}
})

client.login(process.env.BOT_TOKEN);
