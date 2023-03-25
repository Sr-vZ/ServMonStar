import psutil, datetime
import docker

# rpi4_gpu_temp_cmd = ["vcgencmd", "measure_temp"]
# res = subprocess.check_output(rpi4_gpu_temp_cmd).decode("utf-8")
# print(psutil.cpu_count())
# print(psutil.cpu_count(logical=False))
# print(psutil.cpu_freq(percpu=True))
# print([x / psutil.cpu_count() * 100 for x in psutil.getloadavg()])
# print(psutil.sensors_temperatures()["cpu_thermal"])
# print(psutil.sensors_temperatures()["cpu_thermal"][0].current)
# print(psutil.sensors_fans())
# print(psutil.sensors_battery())
# print(psutil.cpu_percent(interval=1, percpu=True))
# print(psutil.cpu_percent(interval=1, percpu=False))
# cpu_freq = psutil.cpu_freq(percpu=True)
# print(cpu_freq[0].current, cpu_freq[0].min, cpu_freq[0].max)
# print(psutil.virtual_memory().total)
# print(psutil.cpu_percent(interval=None, percpu=True))

client = docker.DockerClient(base_url="unix:///var/run/docker.sock")


def get_sys_vitals():
    # get all system vital and return as json
    cpu_core_count = psutil.cpu_count()
    cpu_thermals = psutil.sensors_temperatures()["cpu_thermal"]
    if len(cpu_thermals) == 1:
        cpu_temp = cpu_thermals[0].current
    else:
        cpu_temp = []
        for cpu_thermal in cpu_thermals:
            cpu_temp.append(cpu_thermal.current)
    cpu_freqs = psutil.cpu_freq(percpu=True)
    if len(cpu_freqs) == 1:
        cpu_freq = {
            "curr": cpu_freqs[0].current,
            "min": cpu_freqs[0].min,
            "max": cpu_freqs[0].max,
        }
    else:
        cpu_freq = []
        for cf in cpu_freqs:
            cpu_freq.append({"curr": cf.current, "min": cf.min, "max": cf.max})

    cpu_usage_tot = psutil.cpu_percent(interval=None, percpu=False)
    cpu_usage_cores = psutil.cpu_percent(interval=None, percpu=True)
    avg_load = [x / cpu_core_count * 100 for x in psutil.getloadavg()]
    ram_stats = psutil.virtual_memory()
    swap_mem = psutil.swap_memory()

    boot_time = psutil.boot_time()
    disk_stats = psutil.disk_io_counters()
    # disk_stats_per_disk = psutil.disk_io_counters(perdisk=True)
    disk_usage = psutil.disk_usage("/")
    disk_io = psutil.disk_io_counters()
    ram_usage_stats = {
        "percent": ram_stats.percent,
        "ram_total": ram_stats.total,
        "ram_avail": ram_stats.available,
        "ram_used": ram_stats.used,
        "ram_free": ram_stats.free,
    }
    disk_usage_stats = {
        "percent": disk_usage.percent,
        "disk_total": disk_usage.total,
        "disk_free": disk_usage.free,
        "disk_used": disk_usage.used,
        "disk_io_read_bytes": disk_io.read_bytes,
        "disk_io_write_bytes": disk_io.write_bytes,
        "disk_io_read_time": disk_io.read_time,
        "disk_io_write_time": disk_io.write_time,
    }

    docker_stats = []
    for containers in client.containers.list():
        docker_stats.append(containers.stats(decode=None, stream=False))
    vitals = {
        "ts": str(datetime.datetime.now()),
        "no_of_cores": cpu_core_count,
        "cpu_temp": cpu_temp,
        "cpu_freq": cpu_freq,
        "cpu_usage_overall": cpu_usage_tot,
        "cpu_usage_percore": cpu_usage_cores,
        "avg_load": avg_load,
        "ram_usage": ram_usage_stats,
        "disk_usage": disk_usage_stats,
        "uptime": datetime.datetime.fromtimestamp(boot_time).strftime(
            "%Y-%m-%d %H:%M:%S"
        ),
        "docker": docker_stats,
    }

    return vitals


# print(get_sys_vitals())

# client = docker.DockerClient(base_url="unix:///var/run/docker.sock")
# for containers in client.containers.list():
#     print(containers.stats(decode=None, stream=True))

# print(datetime.datetime.now().strftime("%Y-%m-%d "))
