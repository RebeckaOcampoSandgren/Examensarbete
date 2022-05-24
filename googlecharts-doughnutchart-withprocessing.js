let statusArr = [/^1/, /^2/, /^3/, /^4/, /^5/];
let statusLabel = ["Informational", "Successful", "Redirectional", "Client Error", "Server Error"];
let counts = {};
let chart, datajson;

//set options for chart
let options = {
    title: 'HTTP Status Distribution',
    'width': 1300,
    'height': 600,
    pieSliceText: "none",
    pieHole: 0.4,
    legend: { position: 'top' },
};

// Load the Visualization API and the piechart package.
google.charts.load("current", { packages: ["corechart"] });

fetch("logfile4.json")
    .then((response) => {
        return response.json();
    })
    .then((datafetch) => {
        //Generate array with status codes from log file
        let statuses = datafetch;
        datajson = statuses.map(function (e) {
            return e.status;
        });

    })

$(document).ready(function () {
    $("#render").on("click", function () {
        //Save the start time for initial rendering time to local storage
        //localStorage.setItem('start', performance.now());

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

        //Create data table
        let data = new google.visualization.DataTable();
        data.addColumn('string', 'statusclass');
        data.addColumn('number', 'count');
        data.addRows(Object.entries(counts));

        chart = new google.visualization.PieChart(document.getElementById('donutchart'));
        chart.draw(data, options);

        //Save stop time + total rendering time for initial rendering to local storage
        //localStorage.setItem('stop', performance.now());
        //localStorage.setItem('renderTime', (localStorage.getItem('stop') - localStorage.getItem('start')).toFixed(2));
    });
});

//Get input from checkboxes and update chart with chosen status classes
function updateChart() {
    //Save the start time for rendering time to local storage
    localStorage.setItem('start', performance.now());

    let selectedStatus = {};
    let checkboxes = document.getElementsByClassName('statusCheckbox');

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

    for (let checkbox of checkboxes) {
        if (checkbox.checked) {
            selectedStatus[checkbox.value] = counts[checkbox.value];
        }
    }

    let updateData = new google.visualization.DataTable();
    updateData.addColumn('string', 'statusclass');
    updateData.addColumn('number', 'count');
    updateData.addRows(Object.entries(selectedStatus));
    chart.draw(updateData, options);

    //Save stop time + total rendering time for interactive rendering to local storage
    localStorage.setItem('stop', performance.now());
    localStorage.setItem('renderTime', (localStorage.getItem('stop') - localStorage.getItem('start')).toFixed(2));
}
