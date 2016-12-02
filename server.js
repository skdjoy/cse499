var express = require('express'),
  //mongoose = require('mongoose'),
  //http = require('http'),
  //twitter = require('ntwitter'),
  Twitter = require('twitter'),
  bodyParser = require('body-parser'),
  streamHandler = require('./utils/streamHandler'),
  //TwitterStreamChannels = require('twitter-stream-channels'),
  config = require('./config');
  streamconfig = require('./streamconfig');


var app = express();
var port = process.env.PORT || 8000;

app.use(bodyParser.json());

app.use("/", express.static(__dirname + "/public/"));

//mongoose.connect('mongodb://localhost/stream-tweets');

//var client = new TwitterStreamChannels(config.twitter);

//var twit = new twitter(config.twitter);
var client = new Twitter(config.twitter);
//var tstream = new TwitterStreamChannels(streamconfig.twitter);

//var streamHandler_list = [];
//var stream = null;


app.get('/home', function(req,res){
  res.send('This is the home page');
});

app.get('/trends', function(req, res) {
  client.get('trends/place',{id:1}, function(error, tweets, response) {
    //console.log(tweets[0].trends);
    res.send(tweets[0].trends);
  });
});


app.post('/search', function(req, res) {
  console.log(req.body.text);
  if(streamHandle!=null){
    streamHandle.streamoff();
  }
  client.currentStream = client.stream('statuses/filter', {track:req.body.text});
  streamHandle = new streamHandler(client.currentStream,io);
  res.send('Data received');
});


var server = app.listen(port);
streamHandle = null;
var io = require('socket.io').listen(server);
// client.stream('statuses/filter',{track : 'javascript'}, function(stream){
//   streamHandle = new streamHandler(stream,io);
// });
