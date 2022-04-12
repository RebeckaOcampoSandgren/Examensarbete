let statusArr = [/^1/, /^2/, /^3/, /^4/, /^5/];
let statusLabel = ["Informational", "Successful", "Redirectional", "Client Error", "Server Error"];
let counts = {};
let svg, color, pie, arc, path;
const width = 550;
const height = 550;
const radius = Math.min(width, height) / 2.5;

fetch("logfile1.json")
    .then((response) => {
        return response.json();
    })
    .then((datafetch) => {
        //Generate array with status codes from log file
        let statuses = datafetch;
        datajson = statuses.map(function (e) {
            return e.status;
        });

        //Count occurrence of status codes in data and add status to object with occurrence as value and status class as key
        for (let i = 0; i < statusArr.length; i++) {
            for (const num of datajson) {
                //check if status code matches regex to decide status class
                if (statusArr[i].test(String(num))) {
                    counts[statusLabel[i]] = counts[statusLabel[i]] ? counts[statusLabel[i]] + 1 : 1;
                } else {
                    continue;
                }
            }
        }
    })

$(document).on("click", "#render", function () {
    //Setting color scale
    color = d3.scaleOrdinal()
        .range(['blue', 'red', 'orange', 'green', 'purple',])

    //Append svg to the div with id #myChart
    svg = d3.select("#myChart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    //calculate position of each group on the donut chart
    pie = d3.pie().value(d => d[1])

    let data_ready = pie(Object.entries(counts))

    //Build the donut chart
    arc = svg.selectAll('arc')
        .data(data_ready)
        .enter()

    path = d3.arc()
        .outerRadius(radius)
        .innerRadius(90)

    arc.append('path')
        .attr('d', path)
        .attr('fill', d => color(d.data[0]))

    //Append svg to div with id #myLegend
    var svgLegend = d3.select("#myLegend").append("svg")
        .attr("width", 600)
        .attr("height", 25)

    var dataL = 0;
    var offset = 100;

    //Create legends to each key in the data array
    var legend = svgLegend.selectAll('.legends')
        .data(Object.keys(counts))
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

//Update chart when filter button is pressed
function updateChart() {
    let selectedStatus = {};
    let checkboxes = document.getElementsByClassName('statusCheckbox');

    for (let checkbox of checkboxes) {
        if (checkbox.checked) {
            selectedStatus[checkbox.value] = counts[checkbox.value];
        }
    }

    //Rebuild the donut chart
    arc = svg.selectAll('arc')
        .data(pie(Object.entries(selectedStatus)))
        .enter()

    arc.append('path')
        .attr('d', path)
        .attr('fill', d => color(d.data[0]))

}
