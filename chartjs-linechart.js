let ctx = document.getElementById('lineChart').getContext('2d');
const counts = {};

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

$(document).on("click", "#render", function () {
    //Save the start time for initial rendering time to local storage
    //localStorage.setItem('start', performance.now());

    //Set the data for the chart
    var data = {
        labels: Object.keys(counts),
        datasets: [
            {
                data: Object.values(counts),
                fill: false,
                borderColor: 'rgb(0, 119, 179)',
                tension: 0.1
            }
        ]

    };

    //Set the options for the chart
    var options = {
        maintainAspectRatio: false,
        responsive: false,
        animation: {
            duration: 0
        },
        elements: {
            point: {
                radius: 0
            }
        },
        plugins: {
            tooltip: {
                enabled: false
            },
            title: {
                display: true,
                text: '404 Errors'
            },
            legend: {
                display: false
            }
        }
    };

    let chart = new Chart(ctx, {
        type: 'line',
        options: options,
        data: data
    });

    //Save stop time + total rendering time for initial rendering to local storage
    //localStorage.setItem('stop', performance.now());
    //localStorage.setItem('renderTime', (localStorage.getItem('stop') - localStorage.getItem('start')).toFixed(2));
});
