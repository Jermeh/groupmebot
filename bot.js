var HTTPS = require('https');
var cool = require('cool-ascii-faces');
var request = require('request');
var cheerio = require('cheerio');

var botID = process.env.BOT_ID;

          
function respond() {
  console.log("in respond");
  var requestData = JSON.parse(this.req.chunks[0]), // The previous message sent
      coolguy = /^\/cool guy$/,
      help=/^\/help$/,
      pickup=/^\/pickup$/;
  if(this.req.body.sender_type != "bot"){
    if(requestData.text && coolguy.test(requestData.text)) {
    this.res.writeHead(200); 
    postMessage("");
    this.res.end(); 
    }
    else if(help.test(requestData.text)){
      this.res.writeHead(200); 
      postMessage("!help!");
      this.res.end(); 
    }
    else if(requestData.text.toLowerCase() == "hi bot"){
      this.res.writeHead(200); 
      postMessage("Hi, " + requestData.name);
      this.res.end(); 
    }
    else if(requestData.text.toLowerCase() == "nice." || requestData.text.toLowerCase() == "nice"){
      this.res.writeHead(200);
      postMessage("Nice!");
      this.res.end();
    }
    else if(requestData.text.toLowerCase().search("lmao") > -1 || requestData.text.toLowerCase().search("rofl") > -1){
      this.res.writeHead(200);
      postMessage("ROFLOLMAO");
      this.res.end();
    }
    else if(requestData.text.toLowerCase() == "shots fired"){
      this.res.writeHead(200);
      postMessage("*pew pew*");
      this.res.end();
    }
    else if(requestData.text.toLowerCase() == "white people"){
      this.res.writeHead(200);
      postMessage("http://i.imgur.com/Ha9zBLJ.gifv");
      this.res.end();
    }
    else if(pickup.test(requestData.text)) {
      this.res.writeHead(200);
      var url = 'http://www.pickuplinegen.com/';
      request(url, function(err, resp, body) {
        $ = cheerio.load(body);
        link = $('#content');
        responseText = $(link).text().trim();
        postMessage(responseText);
      });
      this.res.end();
    }
    else if(requestData.text.toLowerCase().search("/urban ") == 0) {
      console.log('in urban');
      this.res.writeHead(200);
      url = 'http://www.urbandictionary.com/define.php?term=';
      word = requestData.text.slice(7).replace(' ', '+');
      request(url+word, function(err, resp, body) {
        $ = cheerio.load(body);
        link = $('.meaning');
        responseText = $(link).text().trim().split('\n')[0];
        postMessage(responseText);
      });
      this.res.end();
    }
    else if(requestData.text.toLowerCase().search('/xkcd ') == 0) {
      this.res.writeHead(200);
      console.log('in xkcd');
      if(requestData.text.toLowerCase() == '/xkcd *' || requestData.text.toLowerCase() == '/xkcd') {
        comic = Math.floor(Math.random() * 1599).toString();
      } 
      else {
        comic = requestData.text.slice(6);
      }
      url = 'http://xkcd.com/' + comic;
      request(url, function(err, resp, body) {
        $ = cheerio.load(body);
        link = $('#comic img');
        image = $(link).attr("src");
        title = $(link).attr("title");
        postMessage('http:' + image);
        postMessage(title)
      });
      this.res.end();
    }
  }
  else {
    return
    this.res.writeHead(200);
    this.res.end();
  }
}
function getCommands(){
  return "/help - all the possible commands\n/cool guy - sends a cool face\n/urban <word> - urban dictionary definition\n'hi bot' - bot responds to your name"
}
function postMessage(text) {
  console.log("in post");

  var botResponse, options, body, botReq;
  options = {
      hostname: 'api.groupme.com',
      path: '/v3/bots/post',
      method: 'POST'
    };

  if(text == "") botResponse = cool();
  else if(text == "!help!") botResponse = getCommands();
  else           botResponse = text;

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending \"' + botResponse + '\" to ' + botID);

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


exports.respond = respond;