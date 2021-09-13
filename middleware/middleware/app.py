from flask import Flask

from flask import request
from flask_cors import CORS

from models import MODELS

from datetime import datetime
import requests
import json
import os

import redis
from rq import Queue, Connection
from tasks import apply_task

API_URL = os.environ.get("API_URL", "http://172.18.0.1:8000/api")
REDIS_URL = os.environ.get("REDIS_URL", "redis://172.19.0.7:6379/0")

app = Flask(__name__)
CORS(app)

@app.route('/apply', methods=['POST'])
def apply():
    _, result = apply_task(request.data)

    return app.response_class(
            response= json.dumps(result),
            status=200,
            mimetype='application/json')

def apply_success(job, connection, result, *args, **kwargs):
    id, result = result
    headers = {"Content-Type":"application/json"}
    res = requests.post(f'{API_URL}/token/', json.dumps({'username':'admin', 'password':'1234'}), headers=headers)
    token = res.json()['access']
    headers['Authorization'] = "Bearer " + token
    res = requests.patch(f'{API_URL}/documents/{id}/', json.dumps(result), headers=headers).json()
    if 'msg' in res:
       print(f'apply_succes patch canceled for document {id} : {res["msg"]}')
    else :
       print(f'apply_succes patch succeed for document {id}')

@app.route('/queue-apply', methods=['POST'])
def queue_apply():
    with Connection(redis.from_url(REDIS_URL)):
        q = Queue()
        task = q.enqueue(apply_task, {'added_date': datetime.now().timestamp(), 'data':request.data}, job_timeout='15m', on_success=apply_success)
    return app.response_class(
            response= json.dumps({
                "status": "success",
                "data": {
                    "task_id": task.get_id()
                }
            }),
            status=200,
            mimetype='application/json')

@app.route('/apply-queue-count', methods=['GET'])
def apply_queue_count():
    with Connection(redis.from_url(REDIS_URL)):
        c = Queue().count
    return app.response_class(response=json.dumps({'count':c}), status=200, mimetype='application/json')

@app.route('/models-info', methods=['GET'])
def models_info():
    return app.response_class(
            response= json.dumps([{"name": model.get_fullname(), "desc": model.desc} for model in MODELS]),
            status=200,
            mimetype='application/json')
            