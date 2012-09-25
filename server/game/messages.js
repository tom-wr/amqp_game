/*
 * messages.js
 *
 * Handles the incoming and outgoing messages from the game engine
 *
 */

require('./entities');
require('./world');
require('./logic');

console.log('@ messages');

var testList = [], counter = 0;

module.export = Messages = {

	snapshotReq: {},
	outbox: {},
	connection: '',
	gameExchange: '',

	// initialises the message event listeners for incoming messages.
	init:function(connection){

		this.connection = connection;
		this.gameExchange = connection.exchanges['gameExchange']; 

		// on a message being popped from the AMQP queue
		connection.queues['gameInputQ'].subscribe(function(message){

			var ID = message.id;

			switch(message.key){
				case 'game.input.keyDown':
				if(Entities.players[ID])
					Entities.players[ID].onKeyDown(message.msg);
				break;

				case 'game.input.keyUp':
				if(Entities.players[ID])
					Entities.players[ID].onKeyUp(message.msg);
				break;

				case 'game.input.disconnect':
					World.deleteBody(Entities.players[ID]);
					delete Entities.players[ID];
				break;

				case 'game.input.connect':
					var newPlayer = new Player({id:ID, type:'player'});
					World.createBody(newPlayer);
					Entities.players[ID] = newPlayer;
					Messages.shapeSnapshot();
				break;

				case 'game.input.req':
					Messages.shapeSnapshot();
				break;

				case 'game.input.evolve':
					Logic.confirmEvolve(Entities.players[message.id], message.levels);
					Messages.pushRequest(message.id, { push:'play' });
				break;

				default:
				console.log(' [?] gameInputQ subscribe default');
				break;
			}
		});

		//setInterval(this.snapshot.bind(this), 50);
		this.snapshot();
	},

	// sends a snapshot out to clients
	snapshot: function(){
		var snap = Entities.snapshot(),
			key = 'game.output.snapshot';
		if(this.connection){
			this.gameExchange.publish(key,{snapshot:snap, key:key, timecode:new Date().getTime()});		
		} else {
			console.log('\t[?] Connection not ready');
		}
		setTimeout(this.snapshot.bind(this), 50);
	},

	//sends a shapesnapshot to clients
	shapeSnapshot: function(){
		var snap = Entities.shapeSnapshot(),
			key = 'game.output.shapeSnapshot';
		if(this.connection){
			this.gameExchange.publish(key, {shapeSnapshot:snap, key:key});
		} else {
			console.log('\t[?] Connection not ready');
		}
	},

	// sends a push message out to a client
	pushRequest: function(id, message){
		var key = 'game.output.'+id;
		message.key = key;
		console.log(key);
		this.gameExchange.publish( key, message);
	}

}