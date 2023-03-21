console.log("hello from js!")
gradientChartOptionsConfigurationWithTooltipPurple = {
    maintainAspectRatio: false,
    legend: {
        display: false
    },

    tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
    },
    responsive: true,
    scales: {
        yAxes: [{
            barPercentage: 1.6,
            gridLines: {
                drawBorder: false,
                color: 'rgba(29,140,248,0.0)',
                zeroLineColor: "transparent",
            },
            ticks: {
                suggestedMin: 0,
                suggestedMax: 100,
                padding: 20,
                fontColor: "#9a9a9a"
            }
        }],

        xAxes: [{
            barPercentage: 1.6,
            gridLines: {
                drawBorder: false,
                color: 'rgba(225,78,202,0.1)',
                zeroLineColor: "transparent",
            },
            ticks: {
                padding: 20,
                fontColor: "#9a9a9a"
            }
        }]
    }
}
var ctx = document.getElementById("chartBig1").getContext('2d');
var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
var config = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: "My First dataset",
            fill: true,
            backgroundColor: gradientStroke,
            borderColor: '#d346b1',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#d346b1',
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: '#d346b1',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 0,
            data: [],
        }]
    },
    options: gradientChartOptionsConfigurationWithTooltipPurple
}


myChartData = new Chart(ctx, config)
var wsUri = "ws://localhost:8000/ws";
var output;

// const exampleSocket = new WebSocket(wsUri)
var ws = new WebSocket("ws://localhost:8000/ws")
server_info = []
ws.onmessage = function (event) {
    server_info.push(JSON.parse(event.data))
    server_info = server_info.slice(-50)
    // console.log(JSON.parse(event.data))
    //     // var messages = document.getElementById('messages')
    //     // var message = document.createElement('li')
    //     // var content = document.createTextNode(event.data)
    //     // message.appendChild(content)
    //     // messages.appendChild(message)
    for (i = 0; i < server_info.length; i++) {
        d = new Date(server_info[i].ts)
        chart_labels = d.toTimeString().split(' ')[0]
        chart_data = server_info[i].cpu_usage_overall
    }
    addData(myChartData, chart_labels, chart_data)
}

function addData(chart, label, data) {

    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

var ctx = document.getElementById("chartBig1").getContext('2d');

for (i = 0; i < server_info.length; i++) {
    d = new Date(server_info[i].ts)
    chart_labels = d.toTimeString().split(' ')[0]
    chart_data = server_info[i].cpu_usage_overall
}

// function update_chart()