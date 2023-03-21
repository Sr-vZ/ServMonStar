from utils import get_sys_vitals
import time
import threading
import asyncio


st = time.time()

# for i in range(10):
#     print(get_sys_vitals())
#     time.sleep(0.1)


def get_vitals_loop():
    for i in range(10):
        print(get_sys_vitals())
        time.sleep(0.1)


# t1 = threading.Thread(target=get_vitals_loop)
# t1.start()


# print("elasped: ", et)
# t1.join()


et = time.time() - st
print("elasped: ", et)
