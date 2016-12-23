getCirclePack = function(data){

  var children_data=[];
  var man_data=new Object();

  for(i in data){
    var temp_data=new Object();
    temp_data.name = data[i].name;
    if(data[i].tweet_volume!==null){
      temp_data.value = Math.floor(data[i].tweet_volume);
    }else{
      temp_data.value = 1000;
    }
    children_data.push(temp_data);
  }
  man_data.name="trends";
  man_data.children = children_data;
  //console.log(man_data);

  container = document.getElementById('toptrends');

  var width=container.offsetWidth,height=300;
  var canvas = d3.select("#toptrends").append("svg")
    .attr("width",width)
    .attr("height",height)
    .append("g")
      .attr("transform","translate(0,0)");

  var pack = d3.layout.pack()
    .size([width,height-10])
    .padding(10);

  var nodes= pack.nodes(man_data);
  console.log(nodes);
  nodes.shift();
  var node = canvas.selectAll(".node")
    .data(nodes)
    .enter()
    .append("g")
      .attr("class","node")
      .attr("transform",function(d){return "translate("+d.x+","+d.y+")";});

    var tooltip = d3.select("#toptrends")
  	.append("div")
  	.style("position", "absolute")
  	.style("z-index", "10")
  	.style("visibility", "hidden")
  	.text("a simple tooltip");

  function colores_google(n) {
    var colores_g = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
    return colores_g[n % colores_g.length];
  }
  node.append("circle")
    .attr("r",function(d){return d.r;})
    .attr("fill",function(d,i){return colores_google(i);})
    .attr("opacity",0.25)
    .attr("stroke","#ADADAD")
    .attr("stroke-width",2)
    .on("mouseover", function(d){d3.select(this).attr("stroke-width",5).attr("opacity",1);return tooltip.style("visibility", "visible").text(d.name);})
	  .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
	  .on("mouseout", function(){d3.select(this).attr("stroke-width",2).attr("opacity",0.25);return tooltip.style("visibility", "hidden");});
};
