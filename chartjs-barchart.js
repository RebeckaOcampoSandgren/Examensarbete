let ctx = document.getElementById('barChart').getContext('2d');
let data, chart;
let methodCount = {};

$.getJSON("logfile.json", function (json) {
    //Generate array with https methods from log file
    data = json.map(function (e) {
        return e.method;
    });

    //Count occurrence of every http method in data array and add method to object with occurrence as value
    for (let element of data) {
        if (methodCount[element]) {
            methodCount[element] += 1;
        } else {
            methodCount[element] = 1;
        }
    }

    var dataObj = {
        type: 'bar',
        data: {
            labels: Object.keys(methodCount),
            datasets: [{
                label: 'Occurrence',
                data: Object.values(methodCount),
                backgroundColor: 'rgba(0, 119, 204, 0.3)'
            }]
        }
    };

    chart = new Chart(ctx, dataObj);
});

//Get input from checkboxes and update chart with chosen methods
function updateChart() {
    let selectedMethods = {};
    let checkboxValues = [];
    const checkboxes = document.getElementsByClassName('methodCheckbox');

    for (let checkbox of checkboxes) {
        if (checkbox.checked) {
            checkboxValues.push(checkbox.value.toUpperCase());
        }
    }

    for (let value of checkboxValues) {
        selectedMethods[value] = methodCount[value];
    }

    chart.data.labels = Object.keys(selectedMethods);
    chart.data.datasets[0].data = Object.values(selectedMethods);
    chart.update();
}

