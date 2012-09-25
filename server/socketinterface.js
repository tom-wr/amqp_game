/*
 * socketinterface.js
 *
 * Manages Socket.IO connections to clients
 *
 */

var io = require('socket.io');

console.log("@ socketInterface");


/*
 * Manages an object containing the connection socket ID and 
 * the client session IDs
 */
function Connections(){
	var list = {};
	var counter = 0;

	function newName(){
		var name = 'p'+(++counter);
		console.log(' [+] created name '+ name);
		return name;
	};

	this.add = function(socketID){
		console.log(' [+] setting name for:' + socketID);
		list[socketID] = newName();
	};
	this.getID = function(socketID){
		return list[socketID];
	};
	this.remove = function(socketID){
		delete list[socketID];
	}
}

/*
 * Starts the socket.io message listeners 
 */
function startSockets(server, connection){

	var iosocket = io.listen(server),
		connections = new Connections(),
		gameExchange = connection.exchanges['gameExchange'];
	
	iosocket.configure('development', function(){
		iosocket.set('log level', '2');
	});
	
	// on a new client connection
	iosocket.sockets.on('connection', function(socket){
		
		console.log(' [+] Socket connection established');
		var socketID = socket.id;

		// on 'init' message from client
		socket.on('init', function(){

			connections.add(socketID);
			var connectionID = connections.getID(socketID);

			// create a new AMQP queue for the client's connection
			connection.queue(connectionID+'Q', function(queue){
				queue.bind('gameExchange', 'game.output.'+connectionID);	
				queue.subscribe(function(message){
					socket.emit('message', message );
				});

			});
			
			socket.emit('init', {id:connectionID});
			// publish connection message to gane server
			gameExchange.publish('game.input.connect', {key: 'game.input.connect', id:connectionID});

		});

		// on 'message' received from client
		socket.on('message', function(message){
			message.id = connections.getID(socketID);
	   		gameExchange.publish(message.key, message);
		});

		socket.on('disconnect', function(){
			console.log(" [+] disconnecting")
			var targetID = connections.getID(socketID);
			connections.remove(socketID);
			var routeKey = 'game.input.disconnect'
			gameExchange.publish(routeKey, {key:routeKey, id: targetID});
		});
	
	});

	// message listener for the 'outQ' queue of the 'gameExchange' exchange
	connection.queues['outQ'].subscribe(function(message){

		switch(message.key){

			case 'game.output.snapshot':
			iosocket.sockets.emit('message',message);
			break;

			case 'game.output.shapeSnapshot':
			iosocket.sockets.emit('message', message);
			break;

			default:
			break;
		}
	});

	return iosocket;
};

exports.startSockets = startSockets;