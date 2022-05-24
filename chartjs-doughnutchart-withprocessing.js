let ctx = document.getElementById('doughnutChart').getContext('2d');
let statusArr = [/^1/, /^2/, /^3/, /^4/, /^5/];
let statusLabel = ["Informational", "Successful", "Redirectional", "Client Error", "Server Error"];
const counts = {};
let chart, datajson;

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

$(document).on("click", "#render", function () {
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

    var data = {
        labels: Object.keys(counts),
        datasets: [
            {
                data: Object.values(counts),
                backgroundColor: [
                    'blue',
                    'red',
                    'orange',
                    'green',
                    'purple',
                ]
            }
        ]

    };

    var options = {
        maintainAspectRatio: false,
        animation: {
            duration: 0
        }
    };

    chart = new Chart(ctx, {
        type: 'doughnut',
        options: options,
        data: data
    });
    //Save stop time + total rendering time for initial rendering to local storage
    //localStorage.setItem('stop', performance.now());
    //localStorage.setItem('renderTime', (localStorage.getItem('stop') - localStorage.getItem('start')).toFixed(2));
});

//Get input from checkboxes and update chart with chosen status
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

    chart.data.labels = Object.keys(selectedStatus);
    chart.data.datasets[0].data = Object.values(selectedStatus);
    chart.update();

    //Save stop time + total rendering time for interactive rendering to local storage
    localStorage.setItem('stop', performance.now());
    localStorage.setItem('renderTime', (localStorage.getItem('stop') - localStorage.getItem('start')).toFixed(2));
}
