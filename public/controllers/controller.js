var socket = io.connect();
var myApp = angular.module('myApp', []);
myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
    //console.log("Hello World from controller");

  //planetbuilder();
   var colors = ['red', 'yellow', 'white', 'orange', 'green', 'cyan', 'pink'];
  // setInterval(function() {
  //   var lat = Math.random() * 170 - 85;
  //   var lng = Math.random() * 360 - 180;
  //   var color = colors[Math.floor(Math.random() * colors.length)];
  //   globe.plugins.pings.add(lng, lat, { color: color, ttl: 2000, angle: 10 });
  // }, 10);

// On tweet event emission...
  var tweets = [];
  var start = function(){socket.on('tweet', function (data) {
        //tweets.push(data);
        //console.log(data);
        var color = colors[Math.floor(Math.random() * colors.length)];
        globe.plugins.pings.add(data.location[1], data.location[0], { color: color, ttl: 2000, angle: 10 });
        //refresh_tweets_list(tweets);
      }
    );
  };


  $scope.start_tweets = function() {
    console.log('it starts');
    start();
  };

  var refresh_tweets_list = function(tweets) {
    $http.get('/home').success(function(response) {
      //console.log("I got the data I requested");
      //$scope.tweets = tweets;
    });
  };


}]);﻿
