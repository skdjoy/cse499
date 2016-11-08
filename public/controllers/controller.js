var socket = io.connect();
var myApp = angular.module('myApp', []);
myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
    //console.log("Hello World from controller");
  var colors = ['red', 'yellow', 'orange', 'green', 'cyan', 'pink','brown','blue','grey'];
  CHART = document.getElementById("barChart");
  var data = {
    labels: [],
    datasets: [
        {
            label: "Tweet count by location",
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1,
            data: [],
        }
    ]
  };
  var ctx = document.getElementById("barChart").getContext("2d");
  var barChart = new Chart(ctx, {
    type: 'bar',
    data: data
  });




  //planetbuilder();

  // setInterval(function() {
  //   var lat = Math.random() * 170 - 85;
  //   var lng = Math.random() * 360 - 180;
  //   var color = colors[Math.floor(Math.random() * colors.length)];
  //   globe.plugins.pings.add(lng, lat, { color: color, ttl: 2000, angle: 10 });
  // }, 10);

// On tweet event emission...
  var tweets = [];
  var location_tweet_count_array = new Object();
  var location_tweet_index_array = new Object();
  counter = 0;
  var start = function(){socket.on('tweet', function (tweet_data) {
        //tweets.push(data);
        //console.log(data.body);
        //console.log(data.location.lat);
        //console.log(data.location.lng);
        var color = colors[Math.floor(Math.random() * colors.length)];
        globe.plugins.pings.add(tweet_data.lng, tweet_data.lat, { color: color, ttl: 4000, angle: 10 });
        //console.log(tweet_data.location_name in location_tweet_count_array);
        if(tweet_data.location_name in location_tweet_count_array){
          loc = tweet_data.location_name;
          //console.log("found same location");
          location_tweet_count_array[loc]++;
          index = location_tweet_index_array[loc];
          barChart.data.datasets[0].data[index]++;
        }
        else{
          loc = tweet_data.location_name;
          location_tweet_count_array[loc] = 1;
          location_tweet_index_array[loc] = counter;
          barChart.data.datasets[0].backgroundColor.push(color);
          color = colors[Math.floor(Math.random() * colors.length)];
          barChart.data.datasets[0].borderColor.push(color);
          barChart.data.labels.push(loc);
          barChart.data.datasets[0].data.push(location_tweet_count_array[loc]);
          counter++;
        }
        //console.log(location_tweet_count_array);
        // for (location in location_tweet_count_array){
        //   console.log(location);
        //   console.log(location_tweet_count_array[location]);
        //   //lineChart.data.labels.push(location.toString());
        //   //lineChart.data.datasets[0].data.push(location_tweet_count_array[location]);
        // }
        barChart.update();
        //refresh_tweets_list(tweets);
      }
    );
  };



  $scope.search = function(){
    $http.post('/home', $scope.s).success(function(response) {
      // if(barChart!=null){
      //   barChart.destroy();
      // }
      data_new = {
        labels: [],
        datasets: [
            {
                label: "Tweet count by location",
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1,
                data: [],
            }
        ]
      };
      // var barChart = new Chart(ctx, {
      //   type: 'bar',
      //   data: data_new
      // });
      barChart.config.data = data_new;
      barChart.update();
      counter=0;
      location_tweet_count_array = new Object();
      location_tweet_index_array = new Object();
      console.log(response);
    });
  };


  var refresh_tweets_list = function(tweets) {
    $http.get('/home').success(function(response) {
      //console.log("I got the data I requested");
      //$scope.tweets = tweets;
    });
  };

  start();


}]);﻿
