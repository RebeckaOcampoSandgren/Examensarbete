let counts = {};

// Load the Visualization API and the chart packages.
google.charts.load("current", { packages: ["corechart"] });

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
    })

$(document).ready(function () {
    $("#render").on("click", function () {
        //Save the start time for initial rendering time to local storage
        //localStorage.setItem('start', performance.now());

        //Create data table
        let data = new google.visualization.DataTable();
        data.addColumn('string', 'Date');
        data.addColumn('number', 'Occurrence');
        data.addRows(Object.entries(counts));

        //set options for chart
        var options = {
            vAxis: {
                minValue: 0,
                viewWindow: {
                    min: 0
                }
            },
            title: '404 Errors',
            curveType: 'function',
            legend: 'none',
            'tooltip': {
                trigger: 'none'
            },
            'width': 1300,
            'height': 500
        };

        var chart = new google.visualization.LineChart(document.getElementById('linechart'));
        chart.draw(data, options);

        //Save stop time + total rendering time for initial rendering to local storage
        //localStorage.setItem('stop', performance.now());
        //localStorage.setItem('renderTime', (localStorage.getItem('stop') - localStorage.getItem('start')).toFixed(2));
    });
});
