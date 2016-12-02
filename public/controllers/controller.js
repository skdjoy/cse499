var socket = io.connect();
var myApp = angular.module('myApp', ['ngAnimate']);
myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
    //console.log("Hello World from controller");
  var colors = ['red', 'yellow', 'orange', 'green', 'cyan', 'pink','brown','blue','grey'];
  CHART = document.getElementById("barChart");
  var data = {
    labels: [],
    datasets: [
        {
            backgroundColor: [],
            borderColor: [],
            borderWidth: 2,
            data: [],
        }
    ]
  };
  var ctx = document.getElementById("barChart").getContext("2d");
  var barChart = new Chart(ctx, {
    type: 'bar',
    data: data,
    options:{
      scales: { xAxes: [{ gridLines: { show: true, color: "white", } }],
        yAxes: [{ gridLines: { show: true, color: "white", } }]
      },
      legend:{
        display: false
      }
    }
  });




  //planetbuilder();

  // setInterval(function() {
  //   var lat = Math.random() * 170 - 85;
  //   var lng = Math.random() * 360 - 180;
  //   var color = colors[Math.floor(Math.random() * colors.length)];
  //   globe.plugins.pings.add(lng, lat, { color: color, ttl: 2000, angle: 10 });
  // }, 10);

  // setInterval(function() {
  //   var lat = Math.random() * 170 - 85;
  //   var lng = Math.random() * 360 - 180;
  //   addGlobePoints(lat,lng,3);
  // }, 100);dGlobePoints(tweet_data.lat,tweet_data.lng,latlng_count[latlng]);

// On tweet event emission...
  var tweets=[];
  var tweets_index=0;
  var location_tweet_count_array = new Object();
  var location_tweet_index_array = new Object();
  var latlng_count = new Object();
  var latlng;
  var counter = 0;
  var curSearchWord=null;
  var pauseFlag = 0;
  var pauselistFlag = 0;
  var tlistcount=0;



  var start = function(){socket.on('tweet', function (tweet_data) {
    if(pauseFlag===1){
      return;
    }
    // var lindex= tlistcount % 4;
    // tweets[lindex]= tweet_data;
    if(pauselistFlag!=1){
      if(tweets.length===3){
        tweets=[];
        tweets.push(tweet_data);
        $scope.refreshlist();
      }else{
        tweets.push(tweet_data);
        $scope.refreshlist();
      }
    }
    //console.log(data.body);
    //console.log(data.location.lat);
    //console.log(data.location.lng);
    var color = colors[Math.floor(Math.random() * colors.length)];
    // globe.plugins.pings.add(tweet_data.lng, tweet_data.lat, { color: color, ttl: 4000, angle: 10 });
    //console.log(tweet_data.location_name in location_tweet_count_array);
    if(tweet_data.location_name in location_tweet_count_array){
      loc = tweet_data.location_name;
      //console.log("found same location");
      location_tweet_count_array[loc]++;
      index = location_tweet_index_array[loc];
      barChart.data.datasets[0].data[index]++;
      //addGlobePoints(tweet_data.lat,tweet_data.lng,location_tweet_count_array[loc]);
    }
    else{
      loc = tweet_data.location_name;
      location_tweet_count_array[loc] = 1;
      location_tweet_index_array[loc] = counter;
      barChart.data.datasets[0].backgroundColor.push(color);
      //color = colors[Math.floor(Math.random() * colors.length)];
      barChart.data.datasets[0].borderColor.push(color);
      barChart.data.labels.push(loc);
      barChart.data.datasets[0].data.push(location_tweet_count_array[loc]);
      counter++;
      //addGlobePoints(tweet_data.lat,tweet_data.lng,location_tweet_count_array[loc]);
    }

    latlng = tweet_data.lat.toString()+tweet_data.lng.toString();
    if(latlng in latlng_count){
      latlng_count[latlng]++;
    }else{
      latlng_count[latlng]=1;
    }
    addGlobePoints(tweet_data.lat,tweet_data.lng,latlng_count[latlng]);
    //console.log(latlng_count);

    //console.log(location_tweet_count_array);
    // for (location in location_tweet_count_array){
    //   console.log(location);
    //   console.log(location_tweet_count_array[location]);
    //   //lineChart.data.labels.push(location.toString());
    //   //lineChart.data.datasets[0].data.push(location_tweet_count_array[location]);
    // }
    barChart.update();
    //refresh_tweets_list(tweets);

    });
  };



  $scope.search = function(){
    curSearchWord = $scope.s;
    $http.post('/search', $scope.s).success(function(response) {
      // if(barChart!=null){
      //   barChart.destroy();
      // }
      data_new = {
        labels: [],
        datasets: [
            {
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
      latlng_count = new Object();
      clearGlobePoints();
      console.log(response);
    });
    //document.getElementById("page-top").scrollIntoView();
  };


  // var refresh_tweets_list = function(tweets) {
  //   $http.get('/home').success(function(response) {
  //     //console.log("I got the data I requested");
  //     //$scope.tweets = tweets;
  //   });
  // };

   $scope.refreshlist = function(){
    $scope.tweetlist=tweets;
    $scope.$apply();
  }

  $scope.pause =function(){
    pauseFlag=1;
  };

  $scope.resume = function(){
    pauseFlag=0;
  };
  $scope.pauselist =function(){
    pauselistFlag=1;
  };

  $scope.resumelist = function(){
    pauselistFlag=0;
  };

  $http.get('/trends').success(function(response) {
    getCirclePack(response);
  });

  start();
}]);﻿
