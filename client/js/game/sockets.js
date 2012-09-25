define(function(){

	var socketInterface {

		connect: function(ID, snapshot) {

			var socket = io.connect('localhost');

			socket.on('connect', function(){
				console.log("connected to server");
				socket.emit('init',{});
			});

			socket.on('init', function(message){
				console.log("setting ID: " + message.id);
				ID = message.id;
				init();
			});

			socket.on('message', function(message){
				if(message.shapeSnapshot){
					shapeSnapshot = message.shapeSnapshot;
				} else { 
					snapshot = message.snapshot;
				}
			});

		}
	}

	return {
		connect:connect

	}

}