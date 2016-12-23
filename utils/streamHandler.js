
var nominatim = require('nominatim');

module.exports = function(stream, io){

  // When tweets get sent our way ...

  function processAndSend(data) {

    if (data['user'] !== undefined && data['user']['location']!== null) {

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
  });

  stream.on('destroy', function (response) {
    console.log('stream has been destroyed!');
  });

};
