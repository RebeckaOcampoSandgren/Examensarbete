let statusArr = [/^1/, /^2/, /^3/, /^4/, /^5/];
let statusLabel = ["Informational", "Successful", "Redirectional", "Client Error", "Server Error"];
let counts = {};
var filterbtn = document.getElementById('filter');
let chart, datajson;
//set options for chart
let options = {
    title: 'HTTP Status Distribution',
    'width': 1300,
    'height': 600,
    pieHole: 0.4,
    pieSliceText: 'value',
    legend: { position: 'top' },
};

// Load the Visualization API and the piechart package.
google.charts.load("current", { packages: ["corechart"] });
// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart());


function drawChart() {
    $.getJSON("logfile1.json", function (json) {
        //Generate array with https methods from log file
        datajson = json.map(function (e) {
            return e.status;
        });

        //Count occurrence of status codes in data and add status to object with occurrence as value and status class as key
        for (let i = 0; i < statusArr.length; i++) {
            for (const num of datajson) {
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
    });

}

//Get input from checkboxes and update chart with chosen status classes
function updateChart() {
    let selectedStatus = {};
    let checkboxes = document.getElementsByClassName('statusCheckbox');

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
}
