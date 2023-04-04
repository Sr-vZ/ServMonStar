
console.log("hello from js!")
chartColor = "#FFFFFF"
gradientChartOptionsConfigurationWithTooltipGreen = {
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
                suggestedMin: 1,
                suggestedMax: 125,
                padding: 20,
                fontColor: "#9e9e9e"
            }
        }],

        xAxes: [{
            barPercentage: 1.6,
            gridLines: {
                drawBorder: false,
                color: 'rgba(0,242,195,0.1)',
                zeroLineColor: "transparent",
            },
            ticks: {
                padding: 20,
                fontColor: "#9e9e9e"
            }
        }]
    }
}
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
var ctx = document.getElementById("chart_overall_usage").getContext('2d');
var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
var config = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: "Server usage",
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
site_url = document.URL
sseUri = "http://localhost:8000/sys_info"
sseUri = site_url + "sys_info"
var output;

// const exampleSocket = new WebSocket(wsUri)
// var ws = new WebSocket(wsUri)
const evtSource = new EventSource(sseUri);
server_info = []
ingress_chart_data = []
egress_chart_data = []
nw_chart_label = []
evtSource.addEventListener("update", function (event) {
    // Logic to handle status updates
    // console.log(event)
    server_info.push(JSON.parse(event.data))
    server_info = server_info.slice(-50)
    mem_usage_ratio = []
    for (i = 0; i < server_info.length; i++) {
        d = new Date(server_info[i].ts)
        chart_labels = d.toTimeString().split(' ')[0]
        chart_data = server_info[i].cpu_usage_overall
        mem_usage_ratio.push(server_info[i].ram_usage.ram_used / server_info[i].ram_usage.ram_total)
    }
    mem_usage_ratio = mem_usage_ratio.slice(-50)
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
    // gauge4.setValueAnimated(server_info[l - 1].ram_usage.percent)
    gauge_memory.setValueAnimated(server_info[l - 1].ram_usage.percent)
    spark_data = { series: [mem_usage_ratio] }
    new Chartist.Line('.ct-chart.bar', spark_data, sparkOptions)

    if (server_info.length > 2) {
        d1 = new Date(server_info[l - 1].ts)
        d2 = new Date(server_info[l - 2].ts)
        ts_delta = d2 - d1
        ingress_bytes = (server_info[l - 2].network_usage.bytes_recv - server_info[l - 1].network_usage.bytes_recv) / (ts_delta / 1000)
        egress_bytes = (server_info[l - 2].network_usage.bytes_sent - server_info[l - 1].network_usage.bytes_sent) / (ts_delta / 1000)
        ingress = niceBytes(ingress_bytes) + '/s'
        egress = niceBytes(egress_bytes) + '/s'
        ingress_chart_data.push(ingress_bytes / 1000)
        ingress_chart_data = ingress_chart_data.slice(-50)
        egress_chart_data.push(egress_bytes / 1000)
        egress_chart_data = egress_chart_data.slice(-50)

        nw_chart_label.push(d.toTimeString().split(' ')[0])
        nw_chart_label = nw_chart_label.slice(-50)
        nw_chart.data.labels = nw_chart_label
        nw_chart.data.datasets[0].data = ingress_chart_data
        nw_chart.data.datasets[1].data = egress_chart_data
        nw_chart.update()

        document.getElementById('nw_ingress_info').innerText = ingress
        document.getElementById('nw_egress_info').innerText = egress
    }

    docker_stats_update(server_info[l - 1].docker)

})



function update_infocards(data) {
    document.getElementById("overall_usage_info").innerText = data.cpu_usage_overall
    document.getElementById("sys_temp_info").innerText = data.cpu_temp.toFixed(1)
    document.getElementById("mem_usage_info").innerText = data.ram_usage.percent
    document.getElementById("disk_usage_info").innerText = data.disk_usage.percent
    document.getElementById("memory_usage_ratio_info").innerText = niceBytes(data.ram_usage.ram_used) + " / " + niceBytes(data.ram_usage.ram_total)

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


function docker_stats_update(docker_data) {
    // console.log(data)
    tbody_html = ""
    // `string text ${expression} string text`
    for (i = 0; i < docker_data.length; i++) {
        data = docker_data[i]
        // delta_total_usage = (data.cpu_stats.cpu_usage.total_usage - data.precpu_stats.cpu_usage.total_usage) / data.precpu_stats.cpu_usage.total_usage

        // delta_system_usage = (data.cpu_stats.system_cpu_usage - data.precpu_stats.system_cpu_usage) / data.precpu_stats.system_cpu_usage

        // y = (delta_total_usage / delta_system_usage) * data.cpu_stats.cpu_usage.online_cpus * 100.0
        cpu_delta = data.cpu_stats.cpu_usage.total_usage - data.precpu_stats.cpu_usage.total_usage
        sys_delta = data.cpu_stats.system_cpu_usage - data.precpu_stats.system_cpu_usage
        cpu_percent = cpu_delta / sys_delta * 100 * data.cpu_stats.online_cpus
        // cpu_percent = data.cpu_stats.cpu_usage.total_usage * 100 / data.cpu_stats.system_cpu_usage


        // cpu_percent = y
        mem_percent = data.memory_stats.usage * 100 / data.memory_stats.limit
        mem_data = niceBytes(data.memory_stats.usage) + "/" + niceBytes(data.memory_stats.limit)
        nw_data = niceBytes(data.networks.eth0.rx_bytes) + " / " + niceBytes(data.networks.eth0.tx_bytes)
        blk_data = niceBytes(data.blkio_stats.io_service_bytes_recursive[0].value) + " / " + niceBytes(data.blkio_stats.io_service_bytes_recursive[1].value)
        tbody_html += `<tr><td class="text-center">${data.id.slice(0, 12)}</td><td class="text-center">${data.name}</td><td class="text-center">${cpu_percent.toFixed(2) + '%'}</td><td class="text-center">${mem_percent.toFixed(2) + '% ( ' + mem_data + ' )'}</td><td class="text-center">${nw_data}</td><td class="text-center">${blk_data}</td><td class="text-center">${data.pids_stats.current}</td></tr>`
    }
    document.getElementById('docker-table').innerHTML = tbody_html
}

var ctx = document.getElementById("chart_overall_usage").getContext('2d');

for (i = 0; i < server_info.length; i++) {
    d = new Date(server_info[i].ts)
    chart_labels = d.toTimeString().split(' ')[0]
    chart_data = server_info[i].cpu_usage_overall
}

// function update_chart()

var ctx = document.getElementById("chart_per_cpu_usage").getContext("2d");

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

var ctxGreen = document.getElementById("chart_nw_usage").getContext("2d");

var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

gradientStroke.addColorStop(1, 'rgba(66,134,121,0.15)');
gradientStroke.addColorStop(0.4, 'rgba(66,134,121,0.0)'); //green colors
gradientStroke.addColorStop(0, 'rgba(66,134,121,0)'); //green colors

var data = {
    labels: [],
    datasets: [{
        label: "Ingress",
        fill: true,
        backgroundColor: gradientStroke,
        borderColor: '#00d6b4',
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        pointBackgroundColor: '#00d6b4',
        pointBorderColor: 'rgba(255,255,255,0)',
        pointHoverBackgroundColor: '#00d6b4',
        pointBorderWidth: 20,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 15,
        pointRadius: 1,
        data: [],
    }, {
        label: "Egress",
        fill: true,
        // backgroundColor: gradientStroke,
        borderDash: [20, 20],
        borderColor: '#d60022',
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        pointBackgroundColor: '#d60022',
        pointBorderColor: 'rgba(255,255,255,0)',
        pointHoverBackgroundColor: '#d60022',
        pointBorderWidth: 20,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 15,
        pointRadius: 1,
        data: [],
    }]
};

var nw_chart = new Chart(ctxGreen, {
    type: 'line',
    data: data,
    options: gradientChartOptionsConfigurationWithTooltipGreen

})




var gauge_memory = Gauge(
    document.getElementById("gauge_memory"), {
    min: 0,
    max: 100,
    dialStartAngle: 180,
    dialEndAngle: 0,
    value: 1,
    label: function (value) {
        return Math.round(value) + "%"
    },
    color: function (value) {
        if (value < 25) {
            return "#5ee432";
        } else if (25 < value && value < 50) {
            return "#f7aa38";
        } else if (value > 50) {
            return "#ffc107";
        } else {
            return "#ef4655";
        }
    }
}
)


var sparkOptions = {
    height: '1em',
    width: '10ex',
    showPoint: false,
    fullWidth: true,
    chartPadding: { top: 0, right: 0, bottom: 0, left: 0 },
    axisX: { showGrid: false, showLabel: false, offset: 0 },
    axisY: { showGrid: false, showLabel: false, offset: 0 }
}

const units = ['bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

function niceBytes(x) {

    let l = 0, n = parseInt(x, 10) || 0;

    while (n >= 1024 && ++l) {
        n = n / 1024;
    }

    return (n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
}