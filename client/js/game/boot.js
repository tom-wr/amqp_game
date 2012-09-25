/*
 * boot.js
 *
 * This module starts the socket.io connection to the server 
 * and handles incoming messages.
 *
 */

define(['./app'], function(app){

	var testList = [], counter=0;

	var initApp = function(){

		var socket = io.connect('localhost');

		socket.on('connect', function(){
			console.log("connected to server");
			socket.emit('init',{});
		});

		socket.on('init', function(message){
			console.log("setting ID: "+message.id);
			var ID = message.id;

			socket.on('message', function(message){

				switch(message.key){
					case 'game.output.snapshot':
					testList.push( (new Date().getTime() - message.timecode));
					counter++;
					if(counter==1000){
						var total = 0;
		   				for(var i=0;i<testList.length;i++){
		   					total+=testList[i];
		   				}
		   				console.log('Result: '+(total/testList.length));
	   				}
					app.setSnapshot(message.snapshot);
					break;

					case 'game.output.shapeSnapshot':
					app.setShapeSnapshot(message.shapeSnapshot);
					break;

					case 'game.output.'+ID:
					console.log('push');
					handlePush(message);
					
					break

					default:
					console.log('default');
					break;
				}

			});
			
			app.init(message.id, socket);

		});

	}

	function handlePush(message){
		switch(message.push){

			case 'evolve':
			app.setLevelSnapshot(message.msg);
			app.setGameStatus('evolve');
			break;

			case 'play':
			app.setGameStatus('play');

			default:
			break;

		}
	}

	return {
		init: initApp
	}
	
});