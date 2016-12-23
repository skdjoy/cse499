var express = require('express'),
  Twitter = require('twitter'),
  bodyParser = require('body-parser'),
  streamHandler = require('./utils/streamHandler'),
  config = require('./config');


var app = express();
var port = process.env.PORT || 8000;

app.use(bodyParser.json());

app.use("/", express.static(__dirname + "/public/"));

var client = new Twitter(config.twitter);



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
