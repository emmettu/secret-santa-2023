from flask import Flask
from flask import Flask, render_template
from flask_socketio import SocketIO

from flask import Flask
from flask_sock import Sock


app = Flask(__name__)

app.config['SECRET_KEY'] = 'your secret key'
sock = Sock(app)

@sock.route('/')
def echo(ws):
    print(ws.environ)
    while True:
        data = ws.receive()
        ws.send(data)
