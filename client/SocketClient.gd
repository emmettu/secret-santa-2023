extends Node

# The URL we will connect to
# export var websocket_url = "wss://secret-santa-2023.onrender.com/ws"

export var websocket_url = "ws://localhost:5000/ws"

# Our WebSocketClient instance
var _client = WebSocketClient.new()

onready var guess_text = get_node("%GuessText")

func _ready():
	# Connect base signals to get notified of connection open, close, and errors.
	_client.connect("connection_closed", self, "_closed")
	_client.connect("connection_error", self, "_closed")
	_client.connect("connection_established", self, "_connected")
	# This signal is emitted when not using the Multiplayer API every time
	# a full packet is received.
	# Alternatively, you could check get_peer(1).get_available_packets() in a loop.
	_client.connect("data_received", self, "_on_data")

	# Initiate connection to the given URL.
	var err = _client.connect_to_url(websocket_url)
	if err != OK:
		print("Unable to connect")
		set_process(false)

func _closed(was_clean = false):
	# was_clean will tell you if the disconnection was correctly notified
	# by the remote peer before closing the socket.
	print("Closed, clean: ", was_clean)
	set_process(false)

func _connected(proto = ""):
	# This is called on connection, "proto" will be the selected WebSocket
	# sub-protocol (which is optional)
	print("Connected with protocol: ", proto)
	# You MUST always use get_peer(1).put_packet to send data to server,
	# and not put_packet directly when not using the MultiplayerAPI.
	var msg = { "client_id": OS.get_unique_id(), "room_id": 123 }
	# var msg = "{ 'client_id': '%s', 'text': 'hello'}" % OS.get_unique_id()
	_client.get_peer(1).put_packet(JSON.print(msg).to_utf8())

func _on_data():
	# Print the received packet, you MUST always use get_peer(1).get_packet
	# to receive data from server, and not get_packet directly when not
	# using the MultiplayerAPI.
	print("Got data from server: ", _client.get_peer(1).get_packet().get_string_from_utf8())

func _process(delta):
	# Call this in _process or _physics_process. Data transfer, and signals
	# emission will only happen when calling this function.
	_client.poll()


func _on_Submit_pressed():
	var msg = { "guess": guess_text.text, "client_id": OS.get_unique_id() }
	_client.get_peer(1).put_packet(JSON.print(msg).to_utf8())
