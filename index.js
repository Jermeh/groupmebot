var http, director, cool, bot, router, server, port, request;

http        = require('http');
director    = require('director');
cool        = require('cool-ascii-faces');
bot         = require('./bot.js');
request     = require('request');
pg          = require('pg');

router = new director.http.Router({
  '/' : {
    post: bot.respond,
    get: ping
  }
});

server = http.createServer(function (req, res) {
  req.chunks = [];
  req.on('data', function (chunk) {
    req.chunks.push(chunk.toString());
  });

  router.dispatch(req, res, function(err) {
    res.writeHead(err.status, {"Content-Type": "text/plain"});
    res.end(err.message);
  });
});

port = Number(process.env.PORT || 5000);
server.listen(port);

function ping() {
  this.res.writeHead(200);
  this.res.end("Groupme Bot Attempt");
}

