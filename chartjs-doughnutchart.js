let ctx = document.getElementById('doughnutChart').getContext('2d');
let statusArr = [/^1/, /^2/, /^3/, /^4/, /^5/];
let statusLabel = ["Informational", "Successful", "Redirection", "Client Error", "Server Error"];
const counts = {};

$.getJSON("logfile1.json", function (json) {
    //Generate array with https methods from log file
    data = json.map(function (e) {
        return e.status;
    });

    //Count occurrence of status codes in data and add status to object with occurrence as value and status class as key
    for (let i = 0; i < statusArr.length; i++) {
        for (const num of data) {
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
                    'rgb(252, 204, 109)',
                    'rgb(187, 230, 124)',
                    'rgb(115, 209, 168)',
                    'rgb(149, 166, 222)',
                    'rgb(250, 125, 239)',
                ]
            }
        ]

    };

    var options = {
        plugins: {
            title: {
                display: true,
                text: 'HTTP Status Distribution'
            }
        }
    };

    new Chart(ctx, {
        type: 'doughnut',
        options: options,
        data: data
    });

});


