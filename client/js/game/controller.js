/*
 * controller.js
 *
 * This module handles the input from the player via 
 * the keyboard and sends it to the server.
 *
 */

define(function(){

		var heldKeys = {
			13:false, //return
			32:false, //space
			37:false, //left
			38:false, //up
			39:false, //right
			40:false //down
		};

		function init(ID, socket){

			document.onkeydown = function(event){
				var event = event || window.event;
				var keycode = event.keyCode;
				if(!heldKeys[keycode]){
					socket.emit('message',{key:'game.input.keyDown',msg:keycode, timecode:new Date().getTime() });
					heldKeys[keycode]=true;
				}
				if(keycode == 13){
					console.log('evolve');
				}
			}

			document.onkeyup = function(event){
				var event = event || window.event;
				var keycode = event.keyCode;
				socket.emit('message',{key:'game.input.keyUp',msg:keycode});
				heldKeys[keycode]=false;
			}
		}

return {
	init:init
}

});