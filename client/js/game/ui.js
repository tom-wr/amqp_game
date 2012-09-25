/*
 * ui.js
 *
 * Provides functions needed for user interaction. 
 *
 * Handles mouse listeners and creates buttons with callback functions
 *
 */

define(function(){

	var buttons = [],
		areas = [],
		canvases = {
		main: document.getElementById('canvas'),
		side: document.getElementById('side_canvas')
	};

	function ConfirmButton(x, y, buttonType, callback){
		buttonType.x = x;
		buttonType.y = y;

		buttonType.hitArea.start.x += x;
		buttonType.hitArea.start.y += y;
		buttonType.hitArea.end.x += x;
		buttonType.hitArea.end.y += y;

		buttonType.callback = callback;

		return buttonType;
	}

	function ConfirmButtonStyle(width, length, label, shadowBlur){

		var newCanvas = document.createElement('canvas');
		newCanvas.width = width+shadowBlur;
		newCanvas.height = length+shadowBlur;
		newCtx = newCanvas.getContext('2d');

		newCtx.save();
		newCtx.fillStyle = '#fff';
		newCtx.strokeStyle = '#fff';
		newCtx.shadowColor = '#fff';
		newCtx.shadowBlur = shadowBlur;

		newCtx.save();

		var rectStartX = shadowBlur,
			rectStartY = shadowBlur,
			rectEndX = newCanvas.width-(2*shadowBlur),
			rectEndY = newCanvas.height-(2*shadowBlur);

		newCtx.rect(rectStartX, rectStartY, rectEndX, rectEndY);
		newCtx.textBaseline = 'middle';
		newCtx.textAlign = 'center';
		newCtx.font = '12pt Monaco';
		newCtx.fillText(label, newCanvas.width/2, newCanvas.height/2);	
		newCtx.stroke();
		newCtx.restore();

		newCtx.restore();

		return 	{	
					hitArea: 	{	
									start: 	{ x: rectStartX, 			y: rectStartY },
									end: 	{ x: rectEndX+shadowBlur, 	y: rectEndY+shadowBlur } 
								},
					canvas: 	newCanvas	
				};

	}

	function LevelButton(x, y, buttonType, name, callback){
		buttonType.x = x;
		buttonType.y = y;

		buttonType.name = name;

		buttonType.hitArea.start.x += x;
		buttonType.hitArea.start.y += y;
		buttonType.hitArea.end.x += x;
		buttonType.hitArea.end.y += y;

		buttonType.callback = callback;

		return buttonType;
	}

	function LevelButtonStyle(type, width, height, highlight){

		var newCanvas = createCanvas(width+10, height+10),
			newCtx = newCanvas.getContext('2d');
		if(!highlight){
			var label = type + 'out';
			buttons[label] = {};
			buttons[label].canvas = newCanvas;
		} else{
			var label = type + 'over';
			buttons[label] = {};
			buttons[label].canvas = newCanvas;
		}

		newCtx.save();

		newCtx.strokeStyle = '#fff';
		if(type=='min'){
			newCtx.fillStyle = '#99f';
		} else {
			newCtx.fillStyle = 'rgb(255, 255, 153)';
		}
		newCtx.shadowBlur = 8;
		newCtx.shadowColor ='#fff';

		var rectStartX = -width/2,
			rectStartY = -height/2,
			rectEndX = (-width/2)+width;
			rectEndY = (-height/2)+height;

		newCtx.save();
		newCtx.translate(newCanvas.width/2, newCanvas.height/2);
		newCtx.rect(-width/2,-height/2,width,height);
		if(highlight){
			newCtx.fill();	
		}
		newCtx.stroke();
		newCtx.beginPath();
		if(type=='plus'){
			newCtx.moveTo(0,-5);
			newCtx.lineTo(0,5);
		}
		newCtx.moveTo(-5, 0);
		newCtx.lineTo(5,0);
		newCtx.stroke();
		newCtx.restore();

		newCtx.restore();

		return 	{	
					hitArea: 	{	
									start: 	{ x: 5, 		y: 5 },
									end: 	{ x: width+5, 				y: height+5 } 
								},
					canvas: 	newCanvas	
				};
	}

	function text(text, ctx, x, y, size, colour, align, blur){
		var lineArray = [];
		var line = '';

		for(var i=0; i<text.length;i++){
			if(text[i]=='?'){
				lineArray.push(line);
				line = '';
			} else {
				line += text[i];
			}
		}

		var startY = y;

		console.log();

		for(var j=0; j<lineArray.length; j++){

			ctx.save();
			ctx.fillStyle = colour || '#fff';
			ctx.shadowColor = colour || '#fff';
			if(blur)
				ctx.shadowBlur = blur || size;
			ctx.textBaseline = 'middle';
			ctx.textAlign = align || 'left';
			ctx.font = size +'pt Ariel';
			ctx.fillText(lineArray[j], x, startY);
			ctx.restore();

			startY += size+5;
		}
	}

	function createCanvas(width, height){
		var newCanvas = document.createElement('canvas');

		newCanvas.height = height;
		newCanvas.width = width;

		return newCanvas;

	}

	function startMouseListeners(){
		canvases.main.addEventListener('click', function(e){ canvasClick(canvases.main, e) });
		canvases.side.addEventListener('click', function(e){ canvasClick(canvases.side, e) });
		canvases.main.addEventListener('mousemove', function(e){ canvasMouseMove(canvases.main, e) });
	}

	function canvasClick(canvas, e){

		var element = canvas,
			offsetX = 0,
			offsetY = 0,
			mx, my;

		if(element.offsetParent !== undefined){
			do{

				offsetX += element.offsetLeft;
				offsetY += element.offsetTop;

			} while((element = element.offsetParent));
		}

		x = e.pageX - offsetX;
		y = e.pageY - offsetY;

		console.log(x+':'+y);

		for(var i=0; i<buttons.length; i++){
			var butt = buttons[i];

			//console.log(butt.hitArea.start.x +' : '+butt.hitArea.start.y +' : '+butt.hitArea.end.x +' : '+butt.hitArea.end.y )

			if(butt.hitArea.start.x < x && butt.hitArea.start.y < y
				&& butt.hitArea.end.x > x && butt.hitArea.end.y > y ){
				butt.callback();
			}
		}
	}

	function canvasMouseMove(canvas, e){
		var element = canvas,
			offsetX = 0,
			offsetY = 0,
			mx, my;

		if(element.offsetParent !== undefined){
			do{

				offsetX += element.offsetLeft;
				offsetY += element.offsetTop;

			} while((element = element.offsetParent));
		}

		x = e.pageX - offsetX;
		y = e.pageY - offsetY;

		for(var i=0; i<areas.length;i++){
			var area = areas[i];

			if(area.startX < x && area.startY < y 
				&& area.endX > x && area.endY > y){	
				area.active = true;
				return;
			} else {
				area.active = false;
			}
		}

	}

	function clearButtons(){
		buttons.length = 0;
	}

	return {
		startMouseListeners: startMouseListeners,
		ConfirmButton: ConfirmButton,
		ConfirmButtonStyle: ConfirmButtonStyle,
		LevelButtonStyle: LevelButtonStyle,
		LevelButton: LevelButton,
		text: text,
		buttons: buttons,
		areas: areas,
		clearButtons: clearButtons
	}

});