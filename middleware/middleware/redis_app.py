# redis_app.py

import os
import redis
from rq import Connection, Worker

def run_worker():
    redis_url = os.environ.get("REDIS_URL", "redis://172.19.0.7:6379/0")
    redis_connection = redis.from_url(redis_url)
    with Connection(redis_connection):
        worker = Worker(['default'])
        worker.work()


if __name__ == "__main__":
    run_worker()