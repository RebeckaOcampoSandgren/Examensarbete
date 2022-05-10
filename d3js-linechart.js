let counts = {};
let result;

fetch("logfile3.json")
    .then((response) => {
        return response.json();
    })
    .then((datafetch) => {
        let map1 = new Map(
            datafetch.map(object => {
                return [object.datetime, object.status];
            }),
        );

        for (let [key, value] of map1) {
            let d2 = key.split(":");
            //Check if status code is 404 and save occurence to object with date
            if (value === 404) {
                counts[d2[0]] = counts[d2[0]] ? counts[d2[0]] + 1 : 1;
            } else {
                continue;
            }
        }
        //Put the keys and values of counts into array of objects for displaying data correctly in line chart
        result = Object.entries(counts).map(([k, v]) => ({ ['Date']: k, ['Value']: v }));
        console.log(result);
    })

$(document).on("click", "#render", function () {
    //Save the start time for initial rendering time to local storage
    //localStorage.setItem('start', performance.now());

    //Setting the dimensions and margins of the chart
    var margin = { top: 20, right: 20, bottom: 50, left: 70 },
        width = 1100 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

    //Set ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    var parseTime = d3.timeParse("%d/%b/%Y");

    //Define the line
    var lineValue = d3.line()
        .x(function (d) { return x(d.Date); })
        .y(function (d) { return y(d.Value); });

    //Append svg to div #myChart
    var svg = d3.select("#myChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    //Append a title to the chart
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("404 Errors");

    //Format data from result array
    result.forEach(function (d) {
        d.Date = parseTime(d.Date);
        d.Value = +d.Value;
    });

    //Set the range of date and value for x and y axis
    x.domain(d3.extent(result, function (d) { return d.Date; }));
    y.domain([0, d3.max(result, function (d) { return d.Value; })]);

    //Add path of the line
    svg.append("path")
        .data([result])
        .attr("class", "line")
        .attr("d", lineValue);

    //Adding x axis with tilted date labels
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
            .ticks(40)
            .tickFormat(d3.timeFormat("%d/%b/%y")))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

    //Adding the y axis
    svg.append("g")
        .call(d3.axisLeft(y));

    //Save stop time + total rendering time for initial rendering to local storage
    //localStorage.setItem('stop', performance.now());
    //localStorage.setItem('renderTime', (localStorage.getItem('stop') - localStorage.getItem('start')).toFixed(2));
});