var data = {};
let statusArr = [/^1/, /^2/, /^3/, /^4/, /^5/];
let statusLabel = ["Informational", "Successful", "Redirectional", "Client Error", "Server Error"];

d3.json("logfile1.json")
    .then(function (jsondata) {
        djson = jsondata.map(function (e) {
            return e.status;
        });

        //Count occurrence of status codes in data and add status to object with occurrence as value and status class as key
        for (let i = 0; i < statusArr.length; i++) {
            for (const num of djson) {
                //check if status code matches regex to decide status class
                if (statusArr[i].test(String(num))) {
                    data[statusLabel[i]] = data[statusLabel[i]] ? data[statusLabel[i]] + 1 : 1;
                } else {
                    continue;
                }
            }
        }

        //Define width, height and radius 
        const width = 550,
            height = 550,
            radius = Math.min(width, height) / 2.5

        //Setting color scale
        const color = d3.scaleOrdinal()
            .range(['rgb(252, 204, 109)', 'rgb(187, 230, 124)', 'rgb(115, 209, 168)', 'rgb(149, 166, 222)', 'rgb(250, 125, 239)'])

        //Append svg to the div with id #myChart
        let svg = d3.select("#myChart")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

        //calculate position of each group on the donut chart
        let pie = d3.pie().value(d => d[1])
        let data_ready = pie(Object.entries(data))

        //Build the chart
        svg
            .selectAll('all')
            .data(data_ready)
            .join('path')
            .attr('d', d3.arc()
                .innerRadius(90)
                .outerRadius(radius)
            )
            .attr('fill', d => color(d.data[0]))

        //Append svg to div with id #myLegend
        var svgLegend = d3.select("#myLegend").append("svg")
            .attr("width", 550)
            .attr("height", 25)

        var dataL = 0;
        var offset = 100;

        //Create legends to each key in the data array
        var legend = svgLegend.selectAll('.legends')
            .data(Object.keys(data))
            .enter().append('g')
            .attr("class", "legends")
            .attr("transform", function (d, i) {
                if (i === 0) {
                    dataL = d.length + offset
                    return "translate(0,0)"
                } else {
                    var newdataL = dataL
                    dataL += d.length + offset
                    return "translate(" + (newdataL) + ",0)"
                }
            })

        //Create the shapes for the legend
        legend.append('rect')
            .attr("x", 0)
            .attr("y", 10)
            .attr("width", 20)
            .attr("height", 10)
            .style("fill", function (d, i) {
                return color(i)
            })
        //Text for the legend
        legend.append('text')
            .attr("x", 25)
            .attr("y", 20)
            .text(function (d, i) {
                return d
            })
            .attr("class", "textselected")
            .style("text-anchor", "start")
            .style("font-size", 12)

    });



