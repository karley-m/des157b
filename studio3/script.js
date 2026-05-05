(function(){
    'use strict';
    console.log('reading js');

      
    console.log(d3);

    // d3.select();
    // d3.selectAll();

    // d3.select('h1').style('color','red')
    //     .attr('class','heading') //class
    //     .text('updated h1 tag'); //innerHTML

    // d3.select('body').append('p').text('first paragraph');

    //working with data
    // var dataset = [1, 2, 3, 4, 5];

    // d3.select('body')
    //     .selectAll('p')
    //     .data(dataset)
    //     .enter() //takes data nodes one by one to perform further stuff on them
    //     .append('p') //appends paragraph for each data element
    //     // .text('d3 is awesome')
    //     .text(function(d) { return d; }); //gets the value of the data item





    //Load data and create nodes
    d3.csv("data.csv", d => ({
        id: d.ID,
        category: d.Category,
        value: +d.Value.replace(/,/g, "") // remove commas
    })).then(data => {
        console.log(data); // should show real numbers now
        createNodes(data);
        console.log(data.map(d => d.value));
    });

    function createNodes(data) {
        const svg = d3.select("svg");
    
        svg.selectAll("circle")
            .data(data)
            .join("circle")
            .attr("cx", (d, i) => i * 100 + 50) // spread horizontally
            .attr("cy", 200)                   // fixed vertical position
            .attr("r", d => d.value / 50)      // scale size from value
            .style("fill", "steelblue");

        svg.selectAll("text")
            .data(data)
            .join("text")
            .attr("x", (d, i) => i * 100 + 50)
            .attr("y", 200)
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em") // vertical centering trick
            .text(d => d.id)
            .style("fill", "white")
            .style("font-size", "10px");
    }





    






})();