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
var log = require('debug')('forecast.io'),
    request = require('request'),
    util = require('util'),
    qs = require('querystring');

function ForecastError (errors) {
  Error.captureStackTrace(this, ForecastError);
  this.errors = errors;
}

util.inherits(ForecastError, Error);

ForecastError.prototype.toString = function toString (){
  return "ForecastError: " + this.errors;
}

function Forecast (options) {
  if ( ! options) throw new ForecastError('APIKey must be set on Forecast options');
  if ( ! options.APIKey) throw new ForecastError('APIKey must be set on Forecast options');
  this.APIKey = options.APIKey;
  this.requestTimeout = options.timeout || 2500
  this.url = 'https://api.darksky.net/forecast/' + options.APIKey + '/';
}


Forecast.prototype.buildUrl = function buildUrl (latitude, longitude, time, options) {

 if (typeof time === 'object') {
    options = time;
    delete time;
 }

  var query = '?' + qs.stringify(options);
  var url = this.url + latitude + ',' + longitude;

  if ((typeof time === 'number')||(typeof time === 'string')) {
    url += ',' + time;
  }

  url += query;

  log('get ' + url);
  return url;
}

Forecast.prototype.get = function get (latitude, longitude, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  var url = this.buildUrl(latitude, longitude, options);

  request.get({uri:url, timeout:this.requestTimeout}, function (err, res, data) {
    if (err) {
      callback(err);
    } else if(res.headers['content-type'].indexOf('application/json') > -1) {
      callback(null, res, JSON.parse(data));
    } else if(res.statusCode === 200) {
      callback(null, res, data);
    } else {
      callback(new ForecastError(data), res, data);
    }
  });
};

Forecast.prototype.getAtTime = function getAtTime (latitude, longitude, time, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  var url = this.buildUrl(latitude, longitude, time, options);

  request.get({uri:url, timeout:this.requestTimeout}, function (err, res, data) {
    if (err) {
      callback(err);
    } else {
      data = JSON.parse(data);
      callback(null, res, data);
    }
  });
};

module.exports = Forecast;
