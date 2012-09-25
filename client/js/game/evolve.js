/*
 * evolve.js
 * 
 * This module handles the rendering of the evolution screen
 *
 */

define(['./ui'], function(ui){

	CANVAS = {};
	SIDE_CANVAS = {};

	levelState = {};

	var reset = false,
		confirm = false;

	canvasList = {

		levelmeter: { x: 200, 	y:100, 	canvas: '' },
		title: 		{ x: 5, 	y:25,  	canvas: '' },
		levels: 	{ },
		buttons:  	{ },
		stats: 		{ 
						'SPEED': 		{ x:100,	y:335, 	canvas:'', desc:'SPEED??Inceases top speed?and acceleration.?' },
						'AGILITY': 		{ x:100,	y:410, 	canvas:'', desc:'AGILITY??Increases your ability?to turn quickly.?' },
						'ENERGY': 		{ x:100,	y:110, 	canvas:'', desc:'ENERGY??Increases your start?energy.?' },
						'LIFESPAN': 	{ x:100,	y:185, 	canvas:'', desc:'LIFESPAN??Increases the age to?which you live.?' },
						'LITTER': 		{ x:450, 	y:335, 	canvas:'', desc:'LITTER??Increases chances of?producing more than?one egg.?' },
						'INCUBATION': 	{ x:450, 	y:260, 	canvas:'', desc:'INCUBATION??Decreases time period?for an egg to hatch.?' },
						'DIGESTION': 	{ x:450, 	y:185, 	canvas:'', desc:'DIGESTION??Increases amount of?energy obtained from?food.?' },
						'REPRODUCTION': { x:450, 	y:110, 	canvas:'', desc:'REPRODUCTION??Decreases energy?required to reproduce.?' },
						'MOUTH': 		{ x:450, 	y:410, 	canvas:'', desc:'MOUTH SIZE??Increases the size?of the fish mouth.?' }

					},
		genepool: { x: 75, y: 60 }

	}

	function init(){

		var canvas = document.getElementById('canvas');
		CANVAS = { 	width: canvas.width, height: canvas.height,
					cx: canvas.width/2, cy:canvas.height/2,
					element: canvas};
		if(canvas.getContext){
			CANVAS.ctx = canvas.getContext('2d');
		}

		var side_canvas = document.getElementById('side_canvas');
		SIDE_CANVAS = { 	width: canvas.width, height: canvas.height,
					cx: canvas.width/2, cy:canvas.height/2,
					element: canvas};
		if(side_canvas.getContext){
			SIDE_CANVAS.ctx = side_canvas.getContext('2d');
		}

		preRender();
		createButtons();

	}
	
	function draw(levelSnaphot, socket, ID){
		if(confirm){
			socket.emit('message', {key:'game.input.evolve', id:ID, levels:levelState});
			confirm = false;
			levelState = {};
			return 'play';
		}
		if(reset){
			levelState = copy(levelSnaphot);
			reset = false;
		}
		drawMain(levelSnaphot);
		drawSide();

		return 'evolve';

	}

	function drawMain(levelSnaphot){
		var ctx = CANVAS.ctx;
		clear(ctx);

		if(levelStateEmpty()){
			levelState = copy(levelSnaphot);
		}

		drawStatLevels(ctx);
		drawGenePool(levelState.genePool);
		drawButtons(ctx);
	}

	function drawSide(){
		var s_ctx = SIDE_CANVAS.ctx;
		clear(s_ctx);

		positionCanvas(canvasList.title, s_ctx);
		drawDescriptionText();
		drawSideButtons(s_ctx);


	}

	function copy(o){
		var n = {};
		for(var x in o){
			n[x] = o[x];
		}
		return n;
	}

	function levelStateEmpty(){
		for(var x in levelState){
			return false;
		}
		return true;
	}

	function preRender(){
		for(var i=0; i<10; i++){
			preRenderLevelMeter(i);
		}
		for(var stat in canvasList.stats){
			preRenderStatText(stat);
		}
		preRenderTitle();
	}

	function preRenderTitle(){
		var newCanvas = createCanvas(250,100);

		var newCtx = newCanvas.getContext('2d');

		canvasList['title'].canvas =  newCanvas;

		newCtx.save();
		ui.text('EVOLVE?', newCtx, newCanvas.width/2, newCanvas.height/2, 20);
		newCtx.restore();
	}

	function preRenderStatText(text){
		var newCanvas = createCanvas(250,100);

		var newCtx = newCanvas.getContext('2d');

		canvasList.stats[text].canvas =  newCanvas;

		newCtx.save();
		ui.text(text+'?', newCtx, newCanvas.width/2, newCanvas.height/2, 10);
		newCtx.restore();
	}

	function preRenderLevelMeter(level){

		var newCanvas = createCanvas(250, 100);

		var newCtx = newCanvas.getContext('2d');

		canvasList.levels['lvl'+(level+1)] = {};
		canvasList.levels['lvl'+(level+1)].canvas =  newCanvas;

		newCtx.save();

		newCtx.fillStyle = 'rgb(153,153,255)';
		newCtx.strokeStyle = '#fff';
		newCtx.shadowColor = '#fff';
		newCtx.shadowBlur = 10;

		newCtx.save();
		var rd = (255-153)/9,
			gd = (255-153)/9,
			bd = (153-255)/9;

		newCtx.translate(0, newCanvas.height/2);
		for(var i=0; i<10; i++){
			newCtx.fillStyle = 'rgb('+ (153+(i*rd)) +','+ (153+(i*gd))+','+ (255+(i*bd))+')';
			newCtx.translate(20, 0);
			newCtx.beginPath();
			newCtx.rect(0,0,10,15);
			if(i<=level)
				newCtx.fill();
			newCtx.stroke();
		}
	
		newCtx.restore();

		newCtx.beginPath();
		newCtx.lineCap = 'round';
		newCtx.lineWidth = 2;
		newCtx.moveTo(20,40);
		newCtx.lineTo(210,40);
		newCtx.stroke();

		newCtx.restore();
	}

	function createButtons(){
		for(var stat in canvasList.stats){
			var eachStat = canvasList.stats[stat];
			var statName = stat;
			var plusStyle = ui.LevelButtonStyle('plus', 26, 26, false),
				plusbutton = ui.LevelButton(eachStat.x+200,eachStat.y+5,plusStyle, stat, 
					function(){ 

						var name = this.name.toLowerCase(),
							level = levelState[this.name.toLowerCase()]+1;
						if(level<=10 && levelState.genePool!=0){
							levelState[name]++;
							levelState.genePool--;
						}
					}
				);
			ui.buttons.push(plusbutton);

			/*var minStyle = ui.LevelButtonStyle('min', 26, 26, false),
				minbutton = ui.LevelButton(eachStat.x-45,eachStat.y+5,minStyle,function(){console.log('found button: '+stat)});
			ui.buttons.push(minbutton);*/
		}

		var confirmStyle = new ui.ConfirmButtonStyle(100,70,'CONFIRM',10),
			confirmButton = new ui.ConfirmButton(30,375,confirmStyle,confirmStats);
		ui.buttons.push(confirmButton);

		var clearStyle = new ui.ConfirmButtonStyle(100,35,'CLEAR',10),
			clearButton = new ui.ConfirmButton(30,340,clearStyle,clearStats);
		ui.buttons.push(clearButton);
	}

	function drawButtons(ctx){

		for(var button in ui.buttons){
			var eachButton = ui.buttons[button];
			if(eachButton.name)
				ctx.drawImage(eachButton.canvas, eachButton.x, eachButton.y);
		}
	}

	function drawSideButtons(ctx){
		for(var button in ui.buttons){
			var eachButton = ui.buttons[button];
			if(!eachButton.name)
				ctx.drawImage(eachButton.canvas, eachButton.x, eachButton.y);
		}
	}

	function preRenderButton(type, highlight){

		var newCanvas = createCanvas(50, 50),
			newCtx = newCanvas.getContext('2d');
		if(!highlight){
			var label = type + 'out';
			canvasList.buttons[label] = {};
			canvasList.buttons[label].canvas = newCanvas;
		} else{
			var label = type + 'over';
			canvasList.buttons[label] = {};
			canvasList.buttons[label].canvas = newCanvas;
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

		newCtx.save();
		newCtx.translate(newCanvas.width/2, newCanvas.height/2);
		newCtx.rect(-13,-13,26,26);
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
	}

	function createCanvas(width, height){
		var newCanvas = document.createElement('canvas');

		newCanvas.height = height;
		newCanvas.width = width;

		return newCanvas;

	}

	function positionCanvas(c, ctx){
		ctx.drawImage(c.canvas, c.x - (c.canvas.width/2), c.y-(c.canvas.height/2));
	}

	function positionFreeCanvas(c, x, y, ctx){
		ctx.drawImage(c.canvas, x-20, y-(c.canvas.height/2)+10);
	}

	function drawStatLevels(ctx){
		for(var stat in canvasList.stats){
			var eachStat = canvasList.stats[stat],
				key = stat.toLowerCase()

			positionCanvas(eachStat, ctx);
			positionFreeCanvas(canvasList.levels['lvl'+levelState[key]], eachStat.x, eachStat.y+10, ctx);
			ui.areas.push({ name: stat, startX: eachStat.x, startY: eachStat.y, endX: eachStat.x+250, endY: eachStat.y+50, active:false});
		}
	}

	function drawGenePool(count){

		var ctx = CANVAS.ctx;

		ctx.save();
		ctx.translate(canvasList.genepool.x, canvasList.genepool.y);
		ctx.fillStyle = '#fff';
		ctx.strokeStyle = '#fff';
		ctx.shadowColor ='#fff';
		ctx.shadowBlur = 10;

		ctx.save();
		ctx.rect(-50, -50, 100,50);
		ctx.stroke();
		ctx.restore();

		ctx.save();
		ctx.font = '30pt Monaco';
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'center';
		ctx.fillText(''+count, 25, -25);
		ctx.font = '6pt Monaco';
		ctx.fillText('GENE POOL', -20, -25);
		ctx.restore();

		ctx.save();

		var geneX = -50,
			geneY = 3,
			geneLength = 100/count,
			drawLength = geneLength-1;

		if(count==0){

			ctx.strokeStyle = '#fff';
			ctx.beginPath();
			ctx.rect(geneX, geneY, 100, 10);
			ctx.stroke();

		} else {

			for(var i=0; i<count;i++){
				if(i==count-1){
					drawLength = geneLength;
				}
				ctx.beginPath();
				ctx.fillRect(geneX, geneY, drawLength, 10);
				ctx.fill();
				geneX += geneLength;
			}

		}

		ctx.restore();

		ctx.restore();
	}

	function drawDescriptionText(){
		for(var i=0;i<ui.areas.length;i++){
			var area = ui.areas[i];
			if(area.active){
				ui.text(canvasList.stats[area.name].desc, SIDE_CANVAS.ctx, 1,120, 12, '#fff', 'left', 0);
			}
		}
	}

	function confirmStats(){
		confirm = true;
	}

	function clearStats(){
		reset = true;
	}

	function clear(ctx){
		ctx.clearRect(0,0,CANVAS.width, CANVAS.height);
	}

	return {
		init: init,
		draw: draw
	}
	
});