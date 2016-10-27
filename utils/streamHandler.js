var Tweet = require('../models/Tweet');

module.exports = function(stream, io){

  // When tweets get sent our way ...
  stream.on('data', function(data) {

    if (data['user'] !== undefined && data['geo']!== null) {

      // Construct a new tweet object
      var tweet = {
        twid: data['id_str'],
        active: false,
        author: data['user']['name'],
        avatar: data['user']['profile_imaerge_url'],
        body: data['text'],
        date: data['created_at'],
        location: data['geo']['coordinates'],
        screenname: data['user']['screen_name']
      };

      // Create a new model instance with our object
      /*
      var tweetEntry = new Tweet(tweet);

      // Save the tweet to the database
      tweetEntry.save(function(err) {
        if (!err) {
          // If everything is cool, socket.io emits the tweet.
          io.emit('tweet', tweet);
        }
      });
      */
      io.emit('tweet', tweet);
    }
  });
  this.streamoff = function(){
    setTimeout(stream.destroy,20000);
  };
  stream.on('end', function (response) {
    console.log('stream has disconnected!');
  });
  stream.on('destroy', function (response) {
    // Handle a 'silent' disconnection from Twitter, no end/error event fired
  });
};
