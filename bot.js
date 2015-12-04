var HTTPS = require('https');
var cool = require('cool-ascii-faces');
var request = require('request');
var cheerio = require('cheerio');
var pg = require('pg');

var botID = process.env.BOT_ID;

//TODO: Get groupIDs and use them somehow
var groupIDs = {
  test: '17740054',
  numenera: '13231121'
};

//Add all the quotes from the postgresql database to a global variable for easier access
quotes = []
pg.connect(process.env.DATABASE_URL, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting quotes...');

  client
    .query('SELECT quote FROM quotes;')
    .on('row', function(row) {
      quotes.push(row.quote);
    });
});

//SEARCH FUNCTIONS
function stringIn(text, strings) {  //Check if one of the strings is in text
  for (string in string) {
    if (text.toLowerCase().search(string) > -1) 
      return true;
  }
  return false;
}

function stringStarts(text, strings) { //Check if the text starts with one of the strings
  for (string in strings) {
    if (text.toLowerCase().search(string) == 0) 
      return true;
  }
  return false;
}

function stringIs(text, strings) {  //Check if the text is equal to one of the strings
  for (string in strings) {
    if (text.toLowerCase() == string)
      return true;
  }
  return false;
}
//END SEARCH FUNCTIONS

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
    if(coolguy.test(requestData.text)) {
    this.res.writeHead(200); 
    postMessage('');
    this.res.end(); 
    }
    else if(help.test(requestData.text)){
      this.res.writeHead(200); 
      postMessage('!help!');
      this.res.end(); 
    }
    else if(stringIs(requestData.text, ['hi bot'])){
      this.res.writeHead(200); 
      postMessage('Hi, ' + requestData.name);
      this.res.end(); 
    }
    else if(stringIs(requestData.text, ['nice', 'nice.', 'nice!'])){
      this.res.writeHead(200);
      postMessage('Nice!');
      this.res.end();
    }
    else if(stringIn(requestData.text, ['lmao', 'rofl'])){
      this.res.writeHead(200);
      postMessage('ROFLOLMAO');
      this.res.end();
    }
    else if(stringIs(requestData.text, ['shots fired'])){
      this.res.writeHead(200);
      postMessage('*pew pew*');
      this.res.end();
    }
    else if(stringIs(requestData.text, ['white people'])){
      this.res.writeHead(200);
      postMessage('http://i.imgur.com/Ha9zBLJ.gifv');
      this.res.end();
    }
    else if(pickup.test(requestData.text)) {
      console.log('in pickup')
      this.res.writeHead(200);
      getPickup();
      this.res.end();
    }
    else if(stringStarts(requestData.text, ['/urban '])) {
      console.log('in urban');
      this.res.writeHead(200);
      var word = requestData.text.slice(7).replace(' ', '+');
      getUrban(word);
      this.res.end();
    }
    else if(stringStarts(requestData.text, ['/xkcd '])) {
      this.res.writeHead(200);
      console.log('in xkcd');
      if(stringsIs(requestData.text, ['/xkcd','/xkcd ', '/xkcd *'])) {
        var comic = Math.floor(Math.random() * 1599).toString();
      } 
      else {
        var comic = requestData.text.slice(6);
      }
      getXKCD(comic);
      this.res.end();
    }
    else if(stringStarts(requestData.text, ['/add '])) {
      this.res.writeHead(200);
      console.log('in add quote');
      var quote = requestData.text.slice(5);
      addQuote(quote);
      this.res.end();
    }
    else if(stringStarts(requestData.text, ['/quote'])) {
      this.res.writeHead(200);
      console.log('in get quote');
      if (stringIs(requestData.text, ['/quote ', '/quote'])) {
        var number = Math.floor(Math.random() * (quotes.length - 1))
      } else {
        var number = parseInt(requestData.text.slice(7))
      }
      getQuote(number);
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

function getUrban(word) {
  var url = 'http://www.urbandictionary.com/define.php?term=';
  request(url+word, function(err, resp, body) {
    $ = cheerio.load(body);
    link = $('.meaning');
    responseText = $(link).text().trim().split('\n')[0].slice(0, 190);
    postMessage(responseText);
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
  return '/help - all the possible commands\n/cool guy - sends a cool face\n/urban <word> - urban dictionary definition\n/pickup - pickup line\n/xkcd <#> - xkcd grabber\n/add <quote> - add a quote ot the database\n/quote <#> - grab quote from database\n"hi bot" - bot responds to your name'
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