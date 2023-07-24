function assignment6(){
    let filePath="penguins_lter.csv";
    question0(filePath);    // preprocess data
}

let question0=function(filePath){
    //preprocess data
    d3.csv(filePath).then(function(data){

        // change data types to int/float/datetime as appropriate
        data.forEach(d => {
            d['Body Mass (g)'] = parseFloat(d['Body Mass (g)'])
            d['Culmen Depth (mm)'] = parseFloat(d['Culmen Depth (mm)'])
            d['Culmen Length (mm)'] = parseFloat(d['Culmen Length (mm)'])
            d['Flipper Length (mm)'] = parseInt(d['Flipper Length (mm)'])
            d['Sample Number'] = parseInt( d['Sample Number'])
            d['Delta 13 C (o/oo)'] = parseFloat(d['Delta 13 C (o/oo)'])
            d['Delta 15 N (o/oo)'] = parseFloat(d['Delta 15 N (o/oo)'])
        });

        antarcticaMap();
        mapAntarctica();
        networkGraph();
        swarmChart(data);
        flipperPenguins(data);
    });
}

let antarcticaMap=function(){

    const width = 1000;
    const height = 800;

    const svg = d3.select("#q1_plot")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    const config = {
        speed: 0.010,
        verticalTilted: 90,
        horizontalTilted: 90
    }

    var markers = [
        {long: 9.083, lat: 42.149}, // corsica
        {long: 7.26, lat: 43.71}, // nice
        {long: 2.349, lat: 48.864}, // Paris
        {long: -1.397, lat: 43.664}, // Hossegor
        {long: 3.075, lat: 50.640}, // Lille
        {long: -3.83, lat: 58}, // Morlaix
        {long: -67.11, lat: -68.36}, // Morlaix
      ];

    // The orthographic Earth projection 
    // Center(0,0) and no rotation 
    var projection = d3.geoOrthographic()
        .center([0, 0]) 
        .scale(300)
        .clipAngle(90 )
        .translate([width / 2, height / 2]) 
        .rotate([0,0])
  
    const path = d3.geoPath().projection(projection);

    

    var tooltip = d3.select("#two")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("padding", "2px")
        .style("color", "black")
        .style("position", "absolute");

    function drawMap(data) {  


        // Draw the map 
        svg.append("g") 
            .selectAll("path") 
            .data(data.features) 
            .enter().append("path") 
            .attr("fill", (d) => d.properties.name === "Antarctica" ? "#f2e9e4": "#9a8c98")
            .style("stroke", (d) => d.properties.name === "Antarctica" ? "grey": "white") 
            //.attr("fill", d.features.properties.name == "Antarctica" ? "blue":"sivler")
            //.attr('fill','silver')
            .attr("d", d3.geoPath() 
            .projection(projection) 
            .on("mouseover", function (e, d) {
                tooltip
                .style("opacity", 1)
            })
            .on("mousemove", function (e, d) {
                tooltip
                .html(d.properties.name)
                .style("left", (e.pageX + 10) + "px")
                .style("top", (e.pageY - 10) + "px")
            })
            .on("mouseout", function (e, d) {
                tooltip.style("opacity", 0)
            })
            
            

    )}

    d3.json("world.json").then(function (json) {
        drawMap(json);

    })

    Rotate();

    // Function to rotate() projection of globe.
    function Rotate() {
    d3.timer(function (elapsed) {
        projection.rotate(
            [config.speed*elapsed-120, 
            config.verticalTilted, 
            config.horizontalTilted]);
            svg.selectAll("path").attr("d", path);
        });
    }   

    
}

let mapAntarctica=function(){

    const width = 800;
    const height = 800;

    const svg = d3.select("#mapAnt")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    const config = {
        speed: 0.010,
        verticalTilted: 90,
        horizontalTilted: 90
    }

    var markers = [
        {long: -64.769, lat: -64.086}, // Torgersen
        {long: -59.713, lat: -64.226}, // Dream
        {long: -66.207, lat: -66.717}, // Biscoe Islands
      ];

    // The orthographic Earth projection 
    // Center(0,0) and no rotation 
    var projection = d3.geoAzimuthalEquidistant()
        .center([0, 0]) 
        .scale(800)
        .clipAngle(90)
        .translate([width / 2, height / 2]) 
        .rotate([0,90])
  
    const path = d3.geoPath().projection(projection);


    function drawMap(data) {      
        // Draw the map 
        svg.append("g") 
            .selectAll("path") 
            .data(data.features) 
            .enter().append("path") 
            .attr("fill", (d) => d.properties.name === "Antarctica" ? "#f2e9e4": "#9a8c98")
            .style("stroke", (d) => d.properties.name === "Antarctica" ? "grey": "white") 
            //.attr("fill", d.features.properties.name == "Antarctica" ? "blue":"sivler")
            //.attr('fill','silver')
            .attr("d", d3.geoPath() 
                .projection(projection) 
    )}

    // Setting color labels 
    let color = d3.scaleOrdinal().domain([-64.769,-59.713,-66.207]).range(d3.schemeDark2);

    d3.json("world.json").then(function (json) {
        drawMap(json);
        svg
        .selectAll("myCircles")
        .data(markers)
        .enter()
        .append("circle")
            .attr("cx", function(d){ return projection([d.long, d.lat])[0] })
            .attr("cy", function(d){ return projection([d.long, d.lat])[1] })
            .attr("r", 9)
            .attr("fill", (d) => color(d.long))
            .attr("stroke-width", 3);

    })

    svg.append("text")
        .attr("x", (width / 2 ))             
        .attr("y", 40)
        .attr("text-anchor", "middle")  
        .style("font-size", "30px") 
        .style("font-weight", "bold")
        .style("fill", "white")
        .text("Islands Habited by Penguins");

    svg.append("circle").attr("cx",60).attr("cy",600).attr("r", 10).style("fill", "#D95E01")
    svg.append("circle").attr("cx",60).attr("cy",630).attr("r", 10).style("fill", "#1B9E76")
    svg.append("circle").attr("cx",60).attr("cy",660).attr("r", 10).style("fill", "#7570B2")

    svg.append("text").attr("x", 80).attr("y", 600).text("Dream Island").style("font-size", "20px").attr("alignment-baseline","middle").style("fill", "white")
    svg.append("text").attr("x", 80).attr("y", 630).text("Torgerson Island").style("font-size", "20px").attr("alignment-baseline","middle").style("fill", "white")
    svg.append("text").attr("x", 80).attr("y", 660).text("Biscoe Island").style("font-size", "20px").attr("alignment-baseline","middle").style("fill", "white")

}


let networkGraph = function(){

    const width = 600;
    const height = 700;
    const margin = [120, 120, 120, 150];

    const svg = d3.select("#networkG")
        .attr("width", width)
        .attr("height", height)


    d3.json("myfile.json").then(function(data) {
        console.log("++++++")
        console.log(data);

        let bodymass = Array.from(new Set(data.nodes.map((d) => d['Body Mass'])));
        console.log(bodymass)


        const logscale = d3.scaleLog().domain(d3.extent(bodymass)).range([1,2])

        let color = d3.scaleOrdinal()
            .domain(['Adelie Penguin (Pygoscelis adeliae)', 'Chinstrap penguin (Pygoscelis antarctica)', 'Gentoo penguin (Pygoscelis papua)','Torgersen Island', 'Dream Island','Biscoe Island'])
            .range(['#d81159','#ffbc42','#0496ff','#D95E01', '#1B9E76', '#7570B2'])

        var force = d3.forceSimulation(data.nodes)
              .force("charge", d3.forceManyBody().strength(-2.8))
              .force("link", d3.forceLink(data.edges))
              .force('center', d3.forceCenter(width/2, height/2+50))
              

        console.log(force);

        //create the color array using an existing colormap
        const colors = d3.scaleOrdinal(d3.schemeCategory10);

        //create edges
        const edges = svg.selectAll("line")
            .data(data.edges)
            .enter()
            .append("line")
            .attr("stroke", "lightgray")
        
        //create nodes
        const nodes = svg.selectAll("circle")
            .data(data.nodes)
            .enter()
            .append("circle")
            .attr('r', d => d['Body Mass'])
            .style("fill", function(d) {
                return color(d.Species);
            });

        
        //when the simulation "ticks", execute the callback function
        force.on("tick", function() {

            edges.attr("x1", function(d) { return d.source.x; })
                 .attr("y1", function(d) { return d.source.y; })
                 .attr("x2", function(d) { return d.target.x; })
                 .attr("y2", function(d) { return d.target.y; });
        
            nodes.attr("cx", function(d) { return d.x; })
                 .attr("cy", function(d) { return d.y; })

        });

        let zoom = d3.zoom()
            .scaleExtent([0.1, 8])
            .on('zoom', function(event) {
                svg.selectAll(['circle', 'line', 'text'])
                .attr('transform', event.transform);
            });
        
        svg.call(zoom)

        svg.append("text")
            .attr("x", (width / 2 ))             
            .attr("y", 40)
            .attr("text-anchor", "middle")  
            .style("font-size", "30px") 
            .style("font-weight", "bold")
            .style("fill", "white")
            .text("Penguins Nodes Per Island");

        svg.append("text")
            .attr("x", (495))             
            .attr("y", 450)
            .attr("text-anchor", "middle")  
            .style("font-size", "15px") 
            .style("font-weight", "bold")
            .style("fill", "white")
            .text("Torgeson Island");

        svg.append("text")
            .attr("x", (200))             
            .attr("y", 550)
            .attr("text-anchor", "middle")  
            .style("font-size", "15px") 
            .style("font-weight", "bold")
            .style("fill", "white")
            .text("Biscoe Island");
        
        svg.append("text")
            .attr("x", (180))             
            .attr("y", 131)
            .attr("text-anchor", "middle")  
            .style("font-size", "15px") 
            .style("font-weight", "bold")
            .style("fill", "white")
            .text("Dream Island");
        
        svg.append("circle").attr("cx",40).attr("cy",600).attr("r", 10).style("fill", "#d81159")
        svg.append("circle").attr("cx",40).attr("cy",630).attr("r", 10).style("fill", "#ffbc42")
        svg.append("circle").attr("cx",40).attr("cy",660).attr("r", 10).style("fill", "#0496ff")

        svg.append("text").attr("x", 60).attr("y", 600).text("Adelie Penguin").style("font-size", "20px").attr("alignment-baseline","middle").style("fill", "white")
        svg.append("text").attr("x", 60).attr("y", 630).text("Chinstrap penguin").style("font-size", "20px").attr("alignment-baseline","middle").style("fill", "white")
        svg.append("text").attr("x", 60).attr("y", 660).text("Gentoo penguin").style("font-size", "20px").attr("alignment-baseline","middle").style("fill", "white")

    });
}

let swarmChart=function(data){
    const width = 900;
    const height = 800;
    const margin = [120, 120, 120, 150];

    const svg = d3.select("#q2_plot")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    console.log(data)

    let species = Array.from(new Set(data.map((d) => d.Species)));

    let islands = Array.from(new Set(data.map((d) => d.Island)));
    console.log(islands)


    console.log(species)

    // Setting x-axis labels
    let xScale = d3
      .scaleBand()
      .domain(species)
      .range([margin[3], width - margin[1]]);

    // Setting color labels 
    let color = d3.scaleOrdinal().domain(species).range(d3.schemePaired);


    let yRange = d3.extent(data.map((d) => d["Flipper Length (mm)"]))
    yRange[0]-= 10
    yRange[1]+= 10
    console.log(yRange[0]+10)
    console.log(yRange+10)
    // Setting y-axis labels
    let yScale = d3
      .scaleLinear()
      .domain(yRange)
      .range([height - margin[2], margin[0]]);

    let bodyMass = d3.extent(data.map((d) => d["Body Mass (g)"]));
    let size = d3.scaleSqrt().domain(bodyMass).range([3, 25]);

    // Assign Axis
    var xAxis = d3.axisBottom().scale(xScale);
    var yAxis = d3.axisLeft().scale(yScale);

     // Transfrom Axis
     let xAxisCall = svg.append("g").call(xAxis).attr("class", "xAxis").attr("transform", `translate(-120, ${height - 120})`);
     let yAxisCall = svg.append("g").call(yAxis).attr("class", "yAxis").attr("transform", `translate(70, 0)`);

     var tooltip = d3.select("#q2_plot")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("padding", "2px")
        .style("color", "black")
        .style("position", "absolute");

    svg.selectAll(".circ")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "circ")
        .attr("stroke", "black")
        .attr("fill", (d) => color(d.Species))
        .attr("r", (d) => size(d["Body Mass (g)"]))
        .attr("cx", (d) => xScale(d.Species))
        .attr("cy", (d) => yScale(d["Flipper Length (mm)"]))
        .on("mouseover", function (e, d) {
            tooltip
            .style("opacity", 1)
        })
        .on("mousemove", function (e, d) {
            tooltip
            .html("Body Mass: "+ d['Body Mass (g)'] + " Grams")
            .style("left", (e.pageX + 10) + "px")
            .style("top", (e.pageY - 10) + "px")
        })
        .on("mouseout", function (e, d) {
            tooltip.style("opacity", 0)
        });

    
    svg.append("text")
        .attr("x", (width / 2 - 50))             
        .attr("y", 25)
        .attr("text-anchor", "middle")  
        .style("font-size", "30px") 
        .style("font-weight", "bold")
        .style("fill", "white")
        .text("Swarm Plot of Flipper Length by Species");
    
    svg.append("text")
        .attr("x", (width / 2 - 50))             
        .attr("y", 750)
        .attr("text-anchor", "middle")  
        .style("font-size", "25px") 
        .style("fill", "white")
        .text("Penguin Species");

    svg.append("text")
        .attr("x", -400)             
        .attr("y", 30)
        .attr("text-anchor", "middle")  
        .style("font-size", "25px") 
        .style("transform" , "rotate(-90deg)")
        .style("fill", "white")
        .text("Flipper Length (mm)")

    

    svg.append("circle").attr("cx",100).attr("cy",240).attr("r", 6).style('fill','white')
    svg.append("circle").attr("cx",115).attr("cy",240).attr("r", 8).style('fill','white')
    svg.append("circle").attr("cx",133).attr("cy",240).attr("r", 10).style('fill','white')


    svg.append("circle").attr("cx",120).attr("cy",150).attr("r", 10).style("fill", "#A6CEE3")
    svg.append("circle").attr("cx",120).attr("cy",180).attr("r", 10).style("fill", "#2078B4")
    svg.append("circle").attr("cx",120).attr("cy",210).attr("r", 10).style("fill", "#B2DF8A")

    svg.append("text").attr("x", 140).attr("y", 150).text("Adelie Penguin").style("font-size", "20px").attr("alignment-baseline","middle").style("fill", "white")
    svg.append("text").attr("x", 140).attr("y", 180).text("Chinstrap Penguin").style("font-size", "20px").attr("alignment-baseline","middle").style("fill", "white")
    svg.append("text").attr("x", 140).attr("y", 210).text("Gentoo Penguin").style("font-size", "20px").attr("alignment-baseline","middle").style("fill", "white")
    svg.append("text").attr("x", 150).attr("y", 240).text("Body Mass (g)").style("font-size", "20px").attr("alignment-baseline","middle").style("fill", "white")


}

let flipperPenguins=function(data) {

    console.log("++++")
    console.log(data)

    var height = 600;
    var width = 600;
    var padding = 55;

    const svg = d3.select("#flipper")
        .append("svg")
        .attr("width", width)
        .attr("height", height)



    let length = Array.from(new Set(data.map((d) => d['Culmen Length (mm)'])));

    let depth = Array.from(new Set(data.map((d) => d['Culmen Depth (mm)'])));


    // ScaleLiner()
    let xScaleHeight = d3.scaleLinear().domain([d3.min(length)-3, d3.max(length)+3]).range([padding, width - padding]);
    let yScaleWeight = d3.scaleLinear().domain([d3.min(depth)-3, d3.max(depth)+3]).range([height - padding, padding]);

    // Assign Axis
    let xAxis = d3.axisBottom().scale(xScaleHeight);
    let yAxis = d3.axisLeft().scale(yScaleWeight);

    // Transfrom Axis    
    let xAxisObject = svg.append("g").attr("transform", `translate(0, ${height - padding})`).call(xAxis).attr("class", "xAxis");
    let yAxisObject = svg.append("g").attr("transform", `translate(${padding} ,0)`).call(yAxis).attr("class", "yAxis");

    // ScaleOrdinal() Color
    var colorScale = d3.scaleOrdinal()
    .domain(['Adelie Penguin (Pygoscelis adeliae)', 'Chinstrap penguin (Pygoscelis antarctica)', 'Gentoo penguin (Pygoscelis papua)'])
    .range(['#A6CEE3','#2078B4','#B2DF8A'])


    var tooltip = d3.select("#flipper")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("padding", "2px")
        .style("color", "black")
        .style("position", "absolute");

    // Map Data with DOM Elements
    svg.selectAll("#flipper")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return xScaleHeight(d["Culmen Length (mm)"]); } )
        .attr("cy", function (d) { return yScaleWeight(d["Culmen Depth (mm)"]); } )
        .attr("r", 6)
        .style("fill", (d) => colorScale(d["Species"]))
        .on("mouseover", function (e, d) {
            tooltip
            .style("opacity", 1)
        })
        .on("mousemove", function (e, d) {
            tooltip
            .html(d.Species)
            .style("left", (e.pageX + 10) + "px")
            .style("top", (e.pageY - 10) + "px")
        })
        .on("mouseout", function (e, d) {
            tooltip.style("opacity", 0)
        });

    svg.append("text")
        .attr("x", (width / 2 ))             
        .attr("y", 25)
        .attr("text-anchor", "middle")  
        .style("font-size", "20px") 
        .style("font-weight", "bold")
        .style("fill", "white")
        .text("Scatter Plot of Culmen Length vs Culmen Depth by Species");
    
    svg.append("text")
        .attr("x", (width / 2 ))             
        .attr("y", 590)
        .attr("text-anchor", "middle")  
        .style("font-size", "20px") 
        .style("fill", "white")
        .text("Culmen Length (mm)");

    svg.append("text")
        .attr("x", -300)             
        .attr("y", 20)
        .attr("text-anchor", "middle")  
        .style("font-size", "20px") 
        .style("transform" , "rotate(-90deg)")
        .style("fill", "white")
        .text("Culmen Depth (mm)")

    
        svg.append("circle").attr("cx",80).attr("cy",70).attr("r", 10).style("fill", "#A6CEE3")
        svg.append("circle").attr("cx",80).attr("cy",100).attr("r", 10).style("fill", "#2078B4")
        svg.append("circle").attr("cx",80).attr("cy",130).attr("r", 10).style("fill", "#B2DF8A")
    
        svg.append("text").attr("x", 100).attr("y", 70).text("Adelie Penguin").style("font-size", "20px").attr("alignment-baseline","middle").style("fill", "white")
        svg.append("text").attr("x", 100).attr("y", 100).text("Chinstrap Penguin").style("font-size", "20px").attr("alignment-baseline","middle").style("fill", "white")
        svg.append("text").attr("x", 100).attr("y", 130).text("Gentoo Penguin").style("font-size", "20px").attr("alignment-baseline","middle").style("fill", "white")




}
