var socket = io.connect();
var myApp = angular.module('myApp', ['ngAnimate']);
myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
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

  $scope.footertext="You are not searching anything right now."
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

    var color = colors[Math.floor(Math.random() * colors.length)];
    if(tweet_data.location_name in location_tweet_count_array){
      loc = tweet_data.location_name;
      location_tweet_count_array[loc]++;
      index = location_tweet_index_array[loc];
      barChart.data.datasets[0].data[index]++;
    }
    else{
      loc = tweet_data.location_name;
      location_tweet_count_array[loc] = 1;
      location_tweet_index_array[loc] = counter;
      barChart.data.datasets[0].backgroundColor.push(color);
      barChart.data.datasets[0].borderColor.push(color);
      barChart.data.labels.push(loc);
      barChart.data.datasets[0].data.push(location_tweet_count_array[loc]);
      counter++;
    }

    latlng = tweet_data.lat.toString()+tweet_data.lng.toString();
    if(latlng in latlng_count){
      latlng_count[latlng]++;
    }else{
      latlng_count[latlng]=1;
    }
    addGlobePoints(tweet_data.lat,tweet_data.lng,latlng_count[latlng]);

    barChart.update();

    });
  };



  $scope.search = function(){
    curSearchWord = $scope.s;
    $http.post('/search', $scope.s).success(function(response) {
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
      barChart.config.data = data_new;
      barChart.update();
      counter=0;
      location_tweet_count_array = new Object();
      location_tweet_index_array = new Object();
      latlng_count = new Object();
      clearGlobePoints();
      console.log(response);
      $scope.footertext="Current Stream: "+$scope.s.text;
    });
    document.getElementById("page-top").scrollIntoView();
  };

   $scope.refreshlist = function(){
    $scope.tweetlist=tweets;
    $scope.$apply();
  }

  $scope.pause =function(){
    pauseFlag=1;
    $scope.footertext="Current Stream is paused";
  };

  $scope.resume = function(){
    pauseFlag=0;
    $scope.footertext="Current Stream is resumed.";
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
