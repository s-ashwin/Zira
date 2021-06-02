require('dotenv').config();
const axios = require('axios');
const Scraper = require('images-scraper');

const google = new Scraper({
  puppeteer: {
    headless: true,
    args: ['--no-sandbox','--disable-setuid-sandbox']
  },
});

const{Client} = require('discord.js');
const client = new Client();
const prefix = "!";

const { Player } = require("discord-music-player");
const player = new Player(client, {
  leaveOnEnd: false,
  leaveOnStop: true,
  leaveOnEmpty: true,
  timeout: 0,
  volume: 150,
  quality: 'high',
});

client.player = player;

client.player.on('error', (error, message) => {
  switch (error) {
    case 'VoiceChannelTypeInvalid':
      message.channel.send(`You need to be in a Voice Channel to play music.`);
      break;
    case 'SearchIsNull':
      message.channel.send(`No song with that query was found.`);
      break;
    default:
      message.channel.send(`**Unknown Error Ocurred:** ${error}`);
      break;
  }
})

client.on('ready', ()=>{
    console.log("Hey i'm in");
})

client.on('message', (message)=>{
    if(!message.author.bot){
        //GENERAL
        if(message.content.toLowerCase()==='hello' || message.content.toLowerCase()==='hi' || message.content.toLowerCase()==='hey'){
            message.reply(`Hey ${message.author.username}!`);
        }
        if(message.content.toLowerCase()==='hey zira' || message.content.toLowerCase()==='zira'){
            message.reply(`Hey ${message.author.username}! This is Zira, Here is the list of commands you can use \n**!kick** @user - Kicks the user out of the server \n**!ban** @user - Ban user \n**!weather** cityname - Gives weather info\n**!movie** title - Gives movie info \n**!def** word - Gives definition \n**!img** subject - Gives Image \n**!play** song - Plays your favourite song`);
        }
        if(message.content.toLowerCase()===`what's your name` || message.content.toLowerCase()===`what is your name` || message.content.toLowerCase()===`who are you`){
            message.reply(`Hey ${message.author.username}! This is Zira, I am a Bot`);
        }

        //THANKS
        if (message.content.toLowerCase().includes("thank")) {
          message.react('❤️');
        }

        //BELIKEBILL
        if (message.content.toLowerCase().startsWith("be like")) {
          const args = message.content.slice(7).trim();
          if (args) {
            message.channel.send({files: [{attachment: `https://belikebill.ga/billgen-API.php?default=1&name=${args}`,name: "meme.jpeg"}]})
          } else {
            message.reply("Please provide a name")
          }
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

            //BAN
            if(command === "ban"){ 
              if(message.member.hasPermission("BAN_MEMBERS")){
                  const user = message.mentions.members.first();
                  if(user){
                      message.guild.members.ban(user)
                      .then((banneduser)=>message.channel.send(`${banneduser} was banned`))
                      .catch((err)=>message.channel.send(`Sorry, I couldn't do that`))
                  }
                  else{
                      message.reply("Please mention a valid user to ban")
                  }      
                  }
              else{
                  message.reply(`You don't have permissions to use this command`)
              }
          }
            
            //WEATHER
            if (command === 'weather') {
                const args = message.content.slice(prefix.length + command.length).trim();
                if (args) {
                    async function getweather() {
                        try {
                          const {data} = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${args}&appid=${process.env.WEATHER_API_KEY}`);
                          message.reply(`\n Temperature: ${Math.round(data.main.temp - 273.15)} °C \n Feels Like: ${Math.round(data.main.feels_like - 273.15)} °C \n Humidity: ${data.main.humidity}%`)
                        } catch (error) {
                          console.error(error);
                          message.reply("City not found")
                        }
                      }
                    getweather();
                }
                else{
                    message.reply("Please provide a city")
                }
            }

            //MOVIE
            if (command === 'movie') {
                const args = message.content.slice(prefix.length + command.length).trim();
                if (args) {
                    async function getmovie() {
                        try {
                          const {data} = await axios.get(`https://www.omdbapi.com/?apikey=${process.env.OMDB_API}&t=${args}`);
                          if(data.Response ==='True' && data.Poster!== 'N/A'){
                            message.reply(`\n**Plot:** ${data.Plot} \n**Director:** ${data.Director} \n**Actors:** ${data.Actors} \n**IMDb Rating:** ${data.imdbRating}/10`, {files: [data.Poster]})
                          }
                          else if(data.Response ==='True'){
                            message.reply(`\n**Plot:** ${data.Plot} \n**Director:** ${data.Director}`)
                          }
                          else{
                            message.reply("Movie not found")
                          }
                        } catch (error) {
                          console.error(error);
                          message.reply("Movie not found")
                        }
                      }
                    getmovie();
                }
                else{
                    message.reply("Please provide a movie name")
                }
            }

            //MEANING
            if (command === 'def') {
              const args = message.content.slice(prefix.length + command.length).trim();
              if (args) {
                async function getmeaning() {
                  try {
                    const {data} = await axios.get(`https://api.urbandictionary.com/v0/define?term=${args}`);
                    if (data.list[0]) {
                      message.reply(data.list[0].definition +"\n`Results from UrbanDictionary`")
                    }
                    else{
                      message.reply("No such words")
                    }     
                  } catch (error) {
                    console.error(error);
                    message.reply("No such words")
                  }
                }
              getmeaning();
              } else {
                message.reply("Please provide a word to find meaning")
              }
            }

            //FLIP
            if (command === 'flip') {
              const args = message.content.slice(prefix.length + command.length).trim();
              if (args) {
                message.delete()
                const mapping = '¡"#$%⅋,)(*+\'-˙/0ƖᄅƐㄣϛ9ㄥ86:;<=>?@∀qƆpƎℲפHIſʞ˥WNOԀQɹS┴∩ΛMX⅄Z[/]^_`ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz{|}~';
                const OFFSET = '!'.charCodeAt(0);
                message.channel.send(
                  args.split('')
                      .map(c => c.charCodeAt(0) - OFFSET)
                      .map(c => mapping[c] || ' ')
                      .reverse().join('')
              );
              }
              else{
                  message.reply("Please provide a text to flip")
              }
          }

           //CLEAR
           if (command === 'clear') {
            const args = message.content.slice(prefix.length + command.length).trim();
            if (args) {
              if(!message.member.hasPermission("MANAGE_MESSAGES")){
                message.reply("You don't have premssions to do that!");
              }
              else{
                message.channel.bulkDelete(parseInt(args)+1)
                  .then(() => {
                      message.channel.send(`Cleared ${args} messages`)
                        .then(msg => msg.delete({timeout : 2000}));
                  });
              }
            
            }
            else{
                message.reply("Please enter the number of messages to clear")
                .then(msg => msg.delete({timeout : 2000}));
            }
        }

        //IMG
        if (command === 'img') {
          const args = message.content.slice(prefix.length + command.length).trim();
          if (args) {
              async function getImg() {
                  try {
                      const result = await google.scrape(`${args}`,1);
                      message.channel.send({files: [{attachment:result[0].url, name:"result.jpg"}]})
                  } catch (error) {
                    console.error(error);
                    message.reply("Image not found")
                  }
                }
              getImg();
          }
          else{
              message.reply("What kind of image are you looking for?")
          }
        }

        //MUSIC
        if(command === 'play'){
          const args = message.content.slice(prefix.length + command.length).trim();
          if (args) {
            async function play() {
                try {
                  let song = await client.player.play(message, args);
                  if(song){message.reply(`🎧 Started playing ${song.name}`)}     
                  return;
                } catch (error) {
                  console.error(error);
                }
              }
            play();
        }
        }
        if(command === 'stop'){
          let isDone = client.player.stop(message);
          if(isDone)
              message.channel.send('Music stopped');
        }
        if(command === 'pause'){
          let song = client.player.pause(message);
          if(song) 
              message.channel.send(`${song.name} was paused!`);
        }
        if(command === 'resume'){
          let song = client.player.resume(message);
          if(song)
              message.channel.send(`${song.name} was resumed!`);
        }

        }
        }
        
})

client.login(process.env.BOT_TOKEN);
