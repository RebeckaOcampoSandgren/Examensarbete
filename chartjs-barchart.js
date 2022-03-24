let ctx = document.getElementById('barChart').getContext('2d');

$.getJSON("logfile.json", function (json) {
    //Generate array with https methods 
    let data = json.map(function (e) {
        return e.method;
    });

    //Count occurrence of every http method in data array and add method to object with occurrence as value
    let methodCount = {};
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

    var chart = new Chart(ctx, dataObj);
});



