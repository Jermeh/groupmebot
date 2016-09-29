var HTTPS = require('https');
var cool = require('cool-ascii-faces');
var request = require('request');
var cheerio = require('cheerio');
var pg = require('pg');
var DarkSky = require('forecast.io');

var botID = process.env.BOT_ID;
var darkSkyKey = process.env.SKY_KEY;
var auburnLat = 32.5934;
var auburnLong = 85.4952;                      



function respond() {
  console.log('in respond');
  //TODO: Change the regex to search
  var requestData = JSON.parse(this.req.chunks[0]), //previous message sent
      coolguy = /^\/cool guy$/, //various regex commands
      help=/^\/help$/,
      pickup=/^\/pickup$/;
  //Verification that a user sent the command, minimizes infinite loops from the bot
  if(this.req.body.sender_type != 'bot'){
    //Else-if tree for command checking
    if(requestData.text && coolguy.test(requestData.text)) {
    this.res.writeHead(200); 
    postMessage('');
    this.res.end(); 
    }
    else if(help.test(requestData.text)){
      this.res.writeHead(200); 
      postMessage('!help!');
      this.res.end(); 
    }
    else if(requestData.text.toLowerCase() == 'hi bot'){
      this.res.writeHead(200); 
      postMessage('Hi, ' + requestData.name);
      this.res.end(); 
    }
    else if(requestData.text.toLowerCase() == 'what?'){
      this.res.writeHead(200);
      postMessage('What?');
      postMessage('http://i.imgur.com/95ut9Uh.jpg');
      this.res.end();
    }
    else if(requestData.text.toLowerCase() == 'nice.' || requestData.text.toLowerCase() == 'nice' || requestData.text.toLowerCase() == 'nice!'){
      this.res.writeHead(200);
      postMessage('Nice!');
      this.res.end();
    }
    else if(requestData.text.toLowerCase().search('lmao') > -1 || requestData.text.toLowerCase().search('rofl') > -1){
      this.res.writeHead(200);
      postMessage('ROFLOLMAO');
      this.res.end();
    }
    else if(requestData.text.toLowerCase() == 'gay'){
      this. res.writeHead(200);
      postMessage('GAAAAAAAAAAAAAAAAAY');
      postMessage('http://i.imgur.com/gaNa9xy.jpg');
      this.res.end();
    }
    else if(requestData.text.toLowerCase() == 'shots fired'){
      this.res.writeHead(200);
      postMessage('*pew pew*');
      this.res.end();
    }
    else if(requestData.text.toLowerCase() == 'white people'){
      this.res.writeHead(200);
      postMessage('http://i.imgur.com/Ha9zBLJ.gifv');
      this.res.end();
    }
    
    else if((requestData.text.toLowerCase().search("im") >= 0 || requestData.text.toLowerCase().search("i\'m") >= 0) 
               && requestData.text.toLowerCase().search("dirty") >= 0 && requestData.text.toLowerCase().search("dan") >= 0){
      this.res.writeHead(200);
      postMessage('NO I\'M DIRTY DAN');
      this.res.end();
    }
    else if(requestData.text.toLowerCase().search("atta boy") >= 0){
      this.res.writeHead(200);
      postMessage('http://i.imgur.com/kwPvNAf.jpg');
      this.res.end();
    }
    else if(requestData.text.toLowerCase().search("fwan") >= 0){
      this.res.writeHead(200);
      postMessage('https://i.imgur.com/VKLgWql.jpg');
      this.res.end();
    }
    else if(requestData.text.toLowerCase().search("you suck") >= 0){
      this.res.writeHead(200);
      postMessage('Suck what? \;\)');
      postMessage('https://i.imgur.com/VKLgWql.jpg');
      this.res.end();
    }
    else if(requestData.text.toLowerCase().search('billy') >= 0){
      this.res.writeHead(200);
      postMessage('But Billy\'s my friend!');
      postMessage('https://i.imgur.com/xkDPun6.jpg');
      this.res.end();
    }
    else if(requestData.text.toLowerCase().search('mckenzie') >= 0 || requestData.text.toLowerCase().search('mackenzie') >=0
            || requestData.text.toLowerCase().search('if you say so') >= 0) {
      this.res.writeHead(200);
      postMessage('http://i.imgur.com/KpGEcUO.jpg');
      this.res.end();
    }
    else if(requestData.text.toLowerCase().search("30 second") >= 0){
      this.res.writeHead(200);
      postMessage('It may only be 30 seconds, but it\'ll be a good 30 seconds \;\)');
      postMessage('http://i.imgur.com/GR1WlBI.png');
      this.res.end();
    }
    else if(requestData.text.toLowerCase().search("salty") >= 0 || requestData.text.toLowerCase().search('salt queen') >= 0){
      var imgNum = Math.floor(Math.random() * 8);
      var img = '';
      switch(imgNum) {
        case 0:
          img = 'http://i.imgur.com/zWbUYiX.jpg';
          break;
        case 1:
          img = 'http://i.imgur.com/WzyRPpg.jpg';
          break;
        case 2:
          img = 'http://i.imgur.com/amrqJaw.jpg';
          break;
        case 3:
          img = 'http://i.imgur.com/AtH5DRH.jpg';
          break;
        case 4:
          img = 'http://i.imgur.com/BIuECN5.jpg';
          break;
        case 5:
          img = 'http://i.imgur.com/gBy3yhw.jpg';
          break;
        case 6:
          img = 'http://i.imgur.com/dYjzTUO.jpg';
          break;
        case 7:
          img = 'http://i.imgur.com/zAsrfbt.jpg';
          break;
      }
      this.res.writeHead(200);
      postMessage(img);
      this.res.end();
    }
    else if(pickup.test(requestData.text)) {
      console.log('in pickup')
      this.res.writeHead(200);
      getPickup();
      this.res.end();
    }
    else if(requestData.text.toLowerCase().search('/urban ') == 0) {
      console.log('in urban');
      this.res.writeHead(200);
      var word = requestData.text.slice(7).replace(' ', '+');
      getUrban(word);
      this.res.end();
    }
    else if(requestData.text.toLowerCase().search('/weather ') == 0) {
      console.log('in weather');
      this.res.writeHead(200);
      var when = requestData.text.slice(7).replace(' ', '+');
      getWeather(when);
      this.res.end();
    }
    else if(requestData.text.toLowerCase().search("stephe") >= 0){
      this.res.writeHead(200);
      postMessage('http://i.imgur.com/pCJZp5G.jpg');
      this.res.end();
    }
    else if(requestData.text.toLowerCase().search('/xkcd ') == 0) {
      this.res.writeHead(200);
      console.log('in xkcd');
      if(requestData.text.toLowerCase() == '/xkcd *' || requestData.text.toLowerCase() == '/xkcd') {
        var comic = Math.floor(Math.random() * 1599).toString();
      } 
      else {
        var comic = requestData.text.slice(6);
      }
      getXKCD(comic);
      this.res.end();
    }
    else if(requestData.text.toLowerCase().search('/add ') == 0) {
      this.res.writeHead(200);
      console.log('in add quote');
      var quote = requestData.text.slice(5);
      addQuote(quote);
      this.res.end();
    }
  }
  else {
    return
    this.res.writeHead(200);
    this.res.end();
  }
}

//QUOTE FUNCTIONS
//adds a quote to the postgresql database and the quotes global
function addQuote(quote) {
  quotes.push(quote);
  pg.connect(process.env.DATABASE_URL, function(err, client) {
    if (err) throw err;
    console.log('Connected to postgres...Adding quote' + quote);

    client
      .query('INSERT INTO quotes VALUES($1)', [quote], function(err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log('Inserted: ' + quote);
        }
      });
  });
  postMessage("Added quote to database.");
}

//gets a specified quote from the quotes global
function getQuote(number) {
  if (number >= quotes.length) postMessage('No quote at that index');
  else postMessage(quotes[number]);
}
//END QUOTE FUNCTIONS

//COMMAND FUNCTIONS
function getPickup() {
  var url = 'http://www.pickuplinegen.com/';
  request(url, function(err, resp, body) {
    $ = cheerio.load(body);
    link = $('#content');
    responseText = $(link).text().trim();
    postMessage(responseText);
  });
}

function getWeather(when){
  var options = {
    APIKey : darkSkyKey
  };
  if (when == 'currently') options = {exclude : 'minutely, hourly, daily, alerts, flags'};
  else if (when == 'minutely') options = {exclude : 'currently, hourly, daily, alerts, flags'};
  else if (when == 'hourly') options = {exclude : 'currently, minutely, daily, alerts, flags'};
  else if (when == 'daily') options = {exclude : 'currently, minutely, hourly, alerts, flags'};
  else if (when == 'alerts') options = {exclude : 'currently, minutely, hourly, alerts, flags'};
  else if (when == 'flags') options = {exclude : 'currently, minutely, hourly, alerts'};
  darksky = new DarkSky(options);
  darksky.get(auburnLat, auburnLong, function (err, res, data) {
    if (err) throw err;
    console.log('res: ' + util.inspect(res));
    console.log('data: ' + util.inspect(data));
  });
}

function getUrban(word) {
  var url = 'http://www.urbandictionary.com/define.php?term=';
  request(url+word, function(err, resp, body) {
    $ = cheerio.load(body);
    link = $('.meaning');
    responseTextSliced = $(link).text().trim().split('\n')[0].slice(0, 190);
    postMessage(responseTextSliced);
    responseExtended = $(link).text().trim().split('\n')[0];
    if (responseExtended.length > 190 && responseExtended.length < 380) {
      postMessage(responseExtended.slice(190, responseExtended.length));
    }
    else if (responseExtended.length > 190){
      postMessage(responseExtended.slice(190, 380));
    }
  });
}

function getXKCD(number) {
  url = 'http://xkcd.com/' + number;
  request(url, function(err, resp, body) {
    $ = cheerio.load(body);
    link = $('#comic img');
    image = $(link).attr('src');
    title = $(link).attr('title');
    postMessage('http:' + image);
    postMessage(title);
  });
}

function getCommands(){
  return '/help - all the possible commands\n/cool guy - sends a cool face\n/urban <word> - urban dictionary definition\n/pickup - pickup line\n/xkcd <#> - xkcd grabber\n"hi bot" - bot responds to your name'
}
//END COMMAND FUNCTIONS

//postMessage through the groupme API
function postMessage(text) {
  console.log('in post');

  var botResponse, options, body, botReq;
  options = {
      hostname: 'api.groupme.com',
      path: '/v3/bots/post',
      method: 'POST'
    };

  //TODO: Change this to be streamlined with all the other commands
  if(text == '') botResponse = cool();
  else if(text == '!help!') botResponse = getCommands();
  else           botResponse = text;

  //object sent to the groupme API
  body = {
    'bot_id' : botID,
    'text' : botResponse
  };

  console.log('sending \'' + botResponse + '\' to ' + botID);

  //Check for and log various errors
  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body)); //sends the requestData in the body
}

//Start the bot
exports.respond = respond;
