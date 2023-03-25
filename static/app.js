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

gradientBarChartConfiguration = {
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

            gridLines: {
                drawBorder: false,
                color: 'rgba(29,140,248,0.1)',
                zeroLineColor: "transparent",
            },
            ticks: {
                suggestedMin: 0,
                suggestedMax: 100,
                padding: 20,
                fontColor: "#9e9e9e"
            }
        }],

        xAxes: [{

            gridLines: {
                drawBorder: false,
                color: 'rgba(29,140,248,0.1)',
                zeroLineColor: "transparent",
            },
            ticks: {
                padding: 20,
                fontColor: "#9e9e9e"
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
// var config = {
//     type: 'bar',
//     responsive: true,
//     legend: {
//         display: false
//     },
//     data: {
//         labels: [],
//         datasets: [{
//             label: "Countries",
//             fill: true,
//             backgroundColor: gradientStroke,
//             hoverBackgroundColor: gradientStroke,
//             borderColor: '#d346b1',
//             borderWidth: 2,
//             borderDash: [],
//             borderDashOffset: 0.0,
//             data: [],
//         }]
//     },
//     options: gradientBarChartConfiguration
// }



myChartData = new Chart(ctx, config)
var client_id = Date.now()
var wsUri = "ws://localhost:8000/ws/" + client_id;
sseUri = "http://localhost:8000/sys_info"
var output;

// const exampleSocket = new WebSocket(wsUri)
var ws = new WebSocket(wsUri)
const evtSource = new EventSource(sseUri);
server_info = []

evtSource.addEventListener("update", function (event) {
    // Logic to handle status updates
    // console.log(event)
    server_info.push(JSON.parse(event.data))
    server_info = server_info.slice(-50)
    for (i = 0; i < server_info.length; i++) {
        d = new Date(server_info[i].ts)
        chart_labels = d.toTimeString().split(' ')[0]
        chart_data = server_info[i].cpu_usage_overall
    }
    addData(myChartData, chart_labels, chart_data)
    l = server_info.length
    update_infocards(server_info[l - 1])
    perCorelabels = []
    perCoreChartdata = server_info[l - 1].cpu_usage_percore
    for (i = 0; i < perCoreChartdata.length; i++) {
        perCorelabels[i] = "Core " + i
    }
    perCoreData.data.labels = perCorelabels
    perCoreData.data.datasets[0].data = perCoreChartdata
    perCoreData.update()
})



function update_infocards(data) {
    document.getElementById("overall_usage_info").innerText = data.cpu_usage_overall
    document.getElementById("sys_temp_info").innerText = data.cpu_temp.toFixed(1)
    document.getElementById("mem_usage_info").innerText = data.ram_usage.percent
    document.getElementById("disk_usage_info").innerText = data.disk_usage.percent

}


// ws.onmessage = function (event) {
//     server_info.push(JSON.parse(event.data))
//     server_info = server_info.slice(-50)
//     // console.log(JSON.parse(event.data))
//     //     // var messages = document.getElementById('messages')
//     //     // var message = document.createElement('li')
//     //     // var content = document.createTextNode(event.data)
//     //     // message.appendChild(content)
//     //     // messages.appendChild(message)
//     for (i = 0; i < server_info.length; i++) {
//         d = new Date(server_info[i].ts)
//         chart_labels = d.toTimeString().split(' ')[0]
//         chart_data = server_info[i].cpu_usage_overall
//     }
//     addData(myChartData, chart_labels, chart_data)
//     sendMessage()
// }

function sendMessage() {
    ws.send("alive!")
    // event.preventDefault()
}

function addData(chart, label, data) {

    chart.data.labels.push(label);
    chart.data.labels = chart.data.labels.slice(-50)
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data)
        dataset.data = dataset.data.slice(-50)
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

var ctx = document.getElementById("CountryChart").getContext("2d");

var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

gradientStroke.addColorStop(1, 'rgba(29,140,248,0.2)');
gradientStroke.addColorStop(0.4, 'rgba(29,140,248,0.0)');
gradientStroke.addColorStop(0, 'rgba(29,140,248,0)'); //blue colors


var perCoreData = new Chart(ctx, {
    type: 'bar',
    responsive: true,
    legend: {
        display: false
    },
    data: {
        labels: [],
        datasets: [{
            label: "per Core",
            fill: true,
            backgroundColor: gradientStroke,
            hoverBackgroundColor: gradientStroke,
            borderColor: '#1f8ef1',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            data: [],
        }]
    },
    options: gradientBarChartConfiguration
});