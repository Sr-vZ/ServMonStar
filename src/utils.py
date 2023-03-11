import psutil
import subprocess

rpi4_gpu_temp_cmd = ["vcgencmd", "measure_temp"]
# res = subprocess.check_output(rpi4_gpu_temp_cmd).decode("utf-8")
print(psutil.cpu_count())
print(psutil.cpu_count(logical=False))
print(psutil.cpu_freq(percpu=True))
print([x / psutil.cpu_count() * 100 for x in psutil.getloadavg()])
print(psutil.sensors_temperatures()["cpu_thermal"][0].current)
print(psutil.sensors_fans())
print(psutil.sensors_battery())
print(psutil.cpu_percent(interval=None, percpu=True))

# def get_sys_vitals():
