//var geocoder = require('geocoder');
// var NodeGeocoder = require('node-geocoder');
//
// var options = {
//   provider: 'google',
//
//   // Optional depending on the providers
//   httpAdapter: 'https', // Default
//   apiKey: 'AIzaSyBLgSmG01qmSd6OZ2H_Rns1l8OVtpz6axQ', // for Mapquest, OpenCage, Google Premier
//   formatter: null         // 'gpx', 'string', ...
// };
// var geocoder = NodeGeocoder(options);
var nominatim = require('nominatim');
// nominatim.search({ q: 'Adelaide, 5000, South Australia, Australia'}, function(err, opts, results) {
//   console.log(results);
// });

module.exports = function(stream, io){

  // When tweets get sent our way ...

  function processAndSend(data) {
    //console.log(data);
    if (data['user'] !== undefined && data['user']['location']!== null) {

      //console.log(data['user']['location']);
      nominatim.search({ q: data['user']['location']}, function(err, opts, results) {
        if(results[0]!==undefined){
          //console.log(results);
          latitude=results[0].lat;
          longitude=results[0].lon;
          loc_name = results[0].address.country;
          var tweet = {
            twid: data['id_str'],
            active: false,
            author: data['user']['name'],
            avatar: data['user']['profile_image_url'],
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
      });
    }
  }
  stream.on('data', processAndSend);

  this.streamoff = function(){
    stream.destroy();
  };

  stream.on('end', function (response) {
    console.log('stream has disconnected!');
  });

  stream.on('error', function (response) {
    console.log('error while stream!');
    console.log(response);
    // console.log('trying to reconnect...');
    // stream.reconnect;
  });

  stream.on('destroy', function (response) {
    console.log('stream has been destroyed!');
  });

};
