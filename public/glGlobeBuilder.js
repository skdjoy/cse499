if(!Detector.webgl){
  Detector.addGetWebGLMessage();
}
else {
  var container = document.getElementById('planet');
  var globe = new DAT.Globe(container);
  var years = ['1990','1995','2000'];

  console.log(globe);
  var i, tweens = [];

  var settime = function(globe, t) {
    return function() {
      new TWEEN.Tween(globe).to({time: t/years.length},500).easing(TWEEN.Easing.Cubic.EaseOut).start();
      return;
    };
  };


  var xhr;
  TWEEN.start();


  // xhr = new XMLHttpRequest();
  // xhr.open('GET', 'webgl_globe/population909500.json', true);
  // xhr.onreadystatechange = function(e) {
  //   if (xhr.readyState === 4) {
  //     if (xhr.status === 200) {
  //       var data = JSON.parse(xhr.responseText);
  //       window.data = data;
  //       for (i=0;i<data.length;i++) {
  //         globe.addData(data[i][1], {format: 'magnitude', name: "points", animated: true});
  //       }
  //       globe.createPoints();
  //       settime(globe,0)();
  //       globe.animate();
  //       //document.body.style.backgroundImage = 'none'; // remove loading
  //     }
  //   }
  // };
  // xhr.send(null);
  globe.animate();
  // setInterval(function() {
  //   globe.clearPoints();
  //   var lat = 170 - 85;
  //   var lng = 360 - 180;
  //   var size =(Math.random() * 1);
  //   globe.addBarOnPoint(lat,lng,size);
  //
  // }, 1000);

  var addGlobePoints = function(lat,lng,size){
    size=size/50;
    globe.addBarOnPoint(lat,lng,size);
  };
  var clearGlobePoints = function(){
    globe.clearPoints();
  };
}
