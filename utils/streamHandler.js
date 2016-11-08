//var geocoder = require('geocoder');
var NodeGeocoder = require('node-geocoder');

var options = {
  provider: 'google',

  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: 'AIzaSyBLgSmG01qmSd6OZ2H_Rns1l8OVtpz6axQ', // for Mapquest, OpenCage, Google Premier
  formatter: null         // 'gpx', 'string', ...
};
var geocoder = NodeGeocoder(options);

module.exports = function(stream, io){

  // When tweets get sent our way ...
  stream.on('data', function(data) {
    //console.log(data['user']['location']);
    if (data['user'] !== undefined && data['user']['location']!== null) {

      //console.log(data['user']['location']);
      geocoder.geocode(data['user']['location'], function ( err, geo_data ) {
       //console.log(geo_data);
        if(geo_data!==undefined && geo_data[0]!== undefined){
          latitude = geo_data[0].latitude;
          longitude = geo_data[0].longitude;
          //console.log(geo_data[0]);
          if(latitude!== null && geo_data[0].country!==undefined){
            loc_name = geo_data[0].country;
            // address = geo_data.results[0].address_components;
            // last_address = address[address.length-1];
            // if (last_address.types[0] === "postal_code"){
            //   last_address = address[address.length-2];
            // }
            // console.log(last_address.long_name);
            //Construct a new tweet object
            var tweet = {
              twid: data['id_str'],
              active: false,
              author: data['user']['name'],
              avatar: data['user']['profile_imaerge_url'],
              body: data['text'],
              lat: latitude,
              lng: longitude,
              //location: loc,
              location_name: loc_name,
              date: data['created_at'],
              screenname: data['user']['screen_name']
            };
            io.emit('tweet', tweet);
          }
        }
      });



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

    }
  });
  this.streamoff = function(){
    setTimeout(stream.destroy, 1);
  };
  stream.on('end', function (response) {
    console.log('stream has disconnected!');
  });
  stream.on('error', function (response) {
    console.log('error while stream!');
    console.log(response);
    //console.log('trying to reconnect...');
    //stream.reconnect;
  });
  stream.on('destroy', function (response) {
    console.log('stream has been destroyed!');
  });
};
