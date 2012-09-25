/*
 * game.js
 *
 * initialises the messages, world and mobengine modules
 *
 */

require('./classes');
require('./mobengine');
require('./entities');
require('./world');

console.log(" @ game");

function init(connection) {

	Messages.init(connection);
	World.init();
	MobEngine.init();
	
}

exports.init = init;