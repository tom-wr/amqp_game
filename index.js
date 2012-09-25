/*
 * index.js
 *
 * Starts the connection to the AMQP server through node-amqp
 * Starts the webserver
 * Creates the socket interface
 *
 */

var amqp = require("amqp");

// create connection to AMQP server
var connection = amqp.createConnection({host:'localhost'});

// when the AMQP connection is ready
connection.on('ready', function(){

	// create a new topic exchange
	var gameExchange = connection.exchange('gameExchange', {type:'topic',autoDelete:true});
    console.log(' [x] gameExchange created ');

    // create a 'gameInputQ' and bind it to the 'gameExchange' exchange
	var gameInputQ = connection.queue('gameInputQ', function(queue){
		console.log(' [x] gameInputQ created');
		queue.bind('gameExchange', 'game.input.#');
		
		// create a 'outQ' and bind it to the 'gameExchage' exchange
		var outQ = connection.queue('outQ', function(queue){
			console.log(' [x] outQ created');
			queue.bind('gameExchange', 'game.output.#');

			// start the web server
			var server = require('./server/server').start(),
			// startcreate the socket interface
    		socketio = require('./server/socketinterface').startSockets(server, connection);
		});
	});
});