let ctx = document.getElementById('doughnutChart').getContext('2d');
let statusArr = [/^1/, /^2/, /^3/, /^4/, /^5/];
let statusLabel = ["Informational", "Successful", "Redirectional", "Client Error", "Server Error"];
const counts = {};
let chart, datajson;

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
        plugins: {
            title: {
                display: true,
                text: 'HTTP Status Distribution'
            }
        },
        animation: {
            duration: 0
        }
    };

    chart = new Chart(ctx, {
        type: 'doughnut',
        options: options,
        data: data
    });
});

//Get input from checkboxes and update chart with chosen status
function updateChart() {
    let selectedStatus = {};
    let checkboxes = document.getElementsByClassName('statusCheckbox');

    for (let checkbox of checkboxes) {
        if (checkbox.checked) {
            selectedStatus[checkbox.value] = counts[checkbox.value];
        }
    }

    chart.data.labels = Object.keys(selectedStatus);
    chart.data.datasets[0].data = Object.values(selectedStatus);
    chart.update();
}
