define(['./app'], function(app){


	var initApp = function(){

		var socket = io.connect('localhost');

		socket.on('connect', function(){
			console.log("connected to server");
			socket.emit('init',{});
		});

		socket.on('init', function(message){
			console.log("setting ID: "+message.id);
			app.init(message.id, socket);
		});

		socket.on('message', function(message){
			if(message.shapeSnapshot){
				app.setShapeSnapshot(message.shapeSnapshot);
			} else {
				app.setSnapshot(message.snapshot);
			}
		});

	}

	function measureIncoming(){
		setTimeout(function(){
			var now = new Date().getTime();
			console.log(incoming/(now-lastTime));
			incoming = 0;
			lastTime = new Date().getTime();
			measureIncoming();
		}, 1000);
	}

	initApp();
	
});