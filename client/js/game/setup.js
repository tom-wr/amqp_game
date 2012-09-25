/*
 * setup.js
 *
 * Displays the start screen for the game
 *
 */

define(['./ui', './boot'], function(ui, boot){

	init();

	function init(){
	
		var canvas = document.getElementById('canvas'),
			ctx, canvasOffsetLeft, canvasOffsetTop;
	
		if(canvas.getContext){
	
			ctx = canvas.getContext('2d');
			canvasOffsetLeft = canvas.offsetLeft;
			canvasOffsetTop = canvas.offsetTop;
	
			ui.startMouseListeners();
	
		}
	
		var confirmButtonStyle = new ui.ConfirmButtonStyle(100,50,'START', 10);
		var button = new ui.ConfirmButton(420, 220, confirmButtonStyle, function(){ ui.clearButtons();boot.init();} );
		ui.text('THE AMQP SEA GAME', ctx, 230, 150, 50);
		ui.buttons.push(button);
		ctx.drawImage(button.canvas, button.x, button.y);
		ui.clearButtons();
		boot.init();

	}

});