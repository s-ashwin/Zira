require('dotenv').config();

const{Client} = require('discord.js');
const client = new Client();
const prefix = "!";

client.on('ready', ()=>{
    console.log("Hey i'm in");
})

client.on('message', (message)=>{
    if(!message.author.bot){
        //GENERAL
        if(message.content.toLowerCase()==='hello' || message.content.toLowerCase()==='hi'){
            message.reply(`Hey ${message.author.username}!`);
        }
        if(message.content.toLowerCase()==='hey zira' || message.content.toLowerCase()==='zira'){
            message.reply(`Hey ${message.author.username}! This is Zira, Here is the list of commands you can use \n !kick @user - Kicks the user out of the server \n !weather cityname - Displays weather report`);
        }
        if(message.content.toLowerCase()===`what's your name` || message.content.toLowerCase()===`what is your name` || message.content.toLowerCase()===`who are you`){
            message.reply(`Hey ${message.author.username}! This is Zira, I am a Bot`);
        }

        //COMMANDS
        if(message.content.startsWith(prefix)){
            const command = message.content.slice(prefix.length).trim().split(' ').shift();

            //KICK
            if(command === "kick"){ 
                if(message.member.hasPermission("KICK_MEMBERS")){
                    const user = message.mentions.members.first();
                    if(user){
                        user.kick()
                        .then((kickeduser)=>message.channel.send(`${kickeduser} was kicked out of this server`))
                        .catch((err)=>message.channel.send(`Sorry, I couldn't do that`))
                    }
                    else{
                        message.reply("Please mention a valid user to kick out")
                    }      
                    }
                else{
                    message.reply(`You don't have permissions to use this command`)
                }
            }
            
        }
        }
        
})

client.login(process.env.BOT_TOKEN);
