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

client.get('trends/place',{id:1}, function(error, tweets, response) {
   console.log(tweets[0].trends.length);
   tweets[0].trends.forEach(function(current_val,index,arr){
     console.log(current_val.name);
   });
});

app.get('/home', function(req,res){
  res.send('This is the home page');
});


app.post('/home', function(req, res) {
  console.log(req.body.text);
  if(streamHandle!=null){
    streamHandle.streamoff();
  }
  client.stream('statuses/filter',{track:req.body.text}, function(stream){
    streamHandle = new streamHandler(stream,io);
  });
  res.send('Data received');
});



var server = app.listen(port);
streamHandle = null;
var io = require('socket.io').listen(server);
client.stream('statuses/filter',{track : 'javascript'}, function(stream){
  streamHandle = new streamHandler(stream,io);
});
