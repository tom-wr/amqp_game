/*
 * sidebar.js
 *
 * Renders the sidebar of game play
 *
 */

define(function(){

	var SIDE_CANVAS = { };
	var CANVAS_LIST = { };

	function init(){

		var side_canvas = document.getElementById('side_canvas');

		SIDE_CANVAS = { 	
							width: side_canvas.width, 	height: side_canvas.height,
							cx: side_canvas.width/2, 	cy:side_canvas.height/2,
							element: side_canvas 
		};

		CANVAS_LIST = {	
						score: 			{ 	x: SIDE_CANVAS.cx, 	y: 30,	colour: '#AFDCFA',	canvas: '' },
						age_meter: 		{ 	x: SIDE_CANVAS.cx, 	y: 130,	colour: '#AFDCFA',	canvas: '' },
						energy_meter: 	{	x: SIDE_CANVAS.cx, 	y: 250,	colour: '#FFCC8A',	canvas: '' },
						gene_pool: 		{ 	x: SIDE_CANVAS.cx, 	y: 375, colour: '#fff',		canvas: '' },
						evolve_ask: 	{ 	x: SIDE_CANVAS.cx, 	y: 451, colour: '#fff',		canvas: '' },
						evolving: 		{ 	x: SIDE_CANVAS.cx, 	y: 451, colour: '#fff',		canvas: '' },
						heading: 		{ 	x: SIDE_CANVAS.cx, 	y: 30, 	colour: '#fff',		canvas: '' }
		};

		if(side_canvas.getContext){
			SIDE_CANVAS.ctx = document.getElementById('side_canvas').getContext('2d');
		}

		clear();
		preRenderDisplay();

	}

	function preRenderDisplay(){
		preRenderAgeMeter();
		preRenderEnergyMeter();
		preRenderEvolveAsk();
		preRenderEvolving();
		preRenderHeading();
	}

	function preRenderAgeMeter(){
		var n_canvas = document.createElement('canvas');
		n_canvas.height = 150;
		n_canvas.width = 150;
		var n_ctx = n_canvas.getContext('2d'),
			c = CANVAS_LIST.age_meter;

		n_ctx.save();
		n_ctx.fillStyle = c.colour;
		n_ctx.strokeStyle = c.colour;
		n_ctx.shadowColor = c.colour;
		n_ctx.shadowBlur = 20;

		n_ctx.translate(n_canvas.width/2, n_canvas.height/2);

		n_ctx.save();
		n_ctx.beginPath();
		n_ctx.arc(0,0,20,0,Math.PI*2,true);
		n_ctx.fill();
		n_ctx.restore();

		n_ctx.save();
		n_ctx.fillStyle = '#777';
		n_ctx.textBaseline = 'middle';
		n_ctx.textAlign = 'center';
		n_ctx.font = '6pt Monaco';
		n_ctx.fillText('AGE', 0, 0);
		n_ctx.restore();

		n_ctx.save();
		n_ctx.strokeStyle = '#777';
		var angle = 2*Math.PI/100;
		for(var i=0; i<100; i++){
			n_ctx.rotate(angle);
			n_ctx.beginPath();
			n_ctx.moveTo(0, -40);
			n_ctx.lineTo(0, -50);
			n_ctx.stroke();
		}
		n_ctx.restore();

		n_ctx.restore();

		CANVAS_LIST.age_meter.canvas = n_canvas;
	}

	function preRenderEnergyMeter(){
		var n_canvas = document.createElement('canvas');
		n_canvas.height = 150;
		n_canvas.width = 150;
		var	n_ctx = n_canvas.getContext('2d'),
			c = CANVAS_LIST.energy_meter;

		n_ctx.save();
		n_ctx.fillStyle = c.colour;
		n_ctx.strokeStyle = c.colour;
		n_ctx.shadowColor = c.colour;
		n_ctx.shadowBlur = 20;

		n_ctx.translate(n_canvas.width/2, n_canvas.height/2);

		n_ctx.save();
		n_ctx.beginPath();
		n_ctx.arc(0,0,20,0,Math.PI*2,true);
		n_ctx.fill();
		n_ctx.restore();

		n_ctx.save();
		n_ctx.fillStyle = '#777';
		n_ctx.textBaseline = 'middle';
		n_ctx.textAlign = 'center';
		n_ctx.font = '6pt Monaco';
		n_ctx.fillText('ENERGY', 0, 0);
		n_ctx.restore();

		n_ctx.save();
		n_ctx.strokeStyle = '#777';
		var angle = 2*Math.PI/100;
		for(var i=0; i<100; i++){
			n_ctx.rotate(angle);
			n_ctx.beginPath();
			n_ctx.moveTo(0, -40);
			n_ctx.lineTo(0, -50);
			n_ctx.stroke();
		}
		n_ctx.restore();

		n_ctx.restore();

		CANVAS_LIST.energy_meter.canvas = n_canvas;
	}

	function preRenderGenePool(){
		var n_canvas = document.createElement('canvas');
		n_canvas.height = 150;
		n_canvas.width = 150;
		n_ctx = n_canvas.getContext('2d');



		CANVAS_LIST.energy_meter.canvas = n_canvas;
	}

	function preRenderEvolveAsk(){
		var n_canvas = document.createElement('canvas');
		n_canvas.height = 150;
		n_canvas.width = 150;
		n_ctx = n_canvas.getContext('2d');
		CANVAS_LIST.evolve_ask.canvas = n_canvas;
	

		n_ctx.save();
		n_ctx.fillStyle = '#fff';
		n_ctx.strokeStyle = '#fff';
		n_ctx.shadowColor ='#fff';
		n_ctx.shadowBlur = 10;
		n_ctx.translate(n_canvas.width/2, n_canvas.height/2);

		n_ctx.save();
		n_ctx.fillStyle = '#999';
		n_ctx.textBaseline = 'middle';
		n_ctx.textAlign = 'center';
		n_ctx.font = '8pt Monaco';
		n_ctx.fillText('press [enter] to', 0, -45);
		n_ctx.restore();

		n_ctx.save();
		n_ctx.fillStyle = '#fff';
		n_ctx.textBaseline = 'middle';
		n_ctx.textAlign = 'center';
		n_ctx.font = '14pt Monaco';
		n_ctx.fillText('EVOLVE', 0, -25);
		n_ctx.restore();

		n_ctx.restore();

	}

	function preRenderEvolving(){
		var n_canvas = document.createElement('canvas');
		n_canvas.height = 150;
		n_canvas.width = 150;
		n_ctx = n_canvas.getContext('2d');
		CANVAS_LIST.evolving.canvas = n_canvas;
	

		n_ctx.save();
		n_ctx.fillStyle = '#fff';
		n_ctx.strokeStyle = '#fff';
		n_ctx.shadowColor ='#fff';
		n_ctx.shadowBlur = 10;
		n_ctx.translate(n_canvas.width/2, n_canvas.height/2);

		n_ctx.save();
		n_ctx.fillStyle = '#fff';
		n_ctx.textBaseline = 'middle';
		n_ctx.textAlign = 'center';
		n_ctx.font = '14pt Monaco';
		n_ctx.fillText('EVOLVING', 0, -25);
		n_ctx.fillText('...', 0, -15);
		n_ctx.restore();

		n_ctx.restore();
	}

	function preRenderHeading(){
		var n_canvas = document.createElement('canvas');
		n_canvas.height = 150;
		n_canvas.width = 150;
		n_ctx = n_canvas.getContext('2d');
		CANVAS_LIST.heading.canvas = n_canvas;

		n_ctx.save();
		n_ctx.fillStyle = '#fff';
		n_ctx.strokeStyle = '#fff';
		n_ctx.shadowColor ='#fff';
		n_ctx.shadowBlur = 10;

		n_ctx.translate(n_canvas.width/2, n_canvas.height/2);
		n_ctx.rect(-70,-25, 140, 30);
		n_ctx.stroke();

		n_ctx.save();
		n_ctx.fillStyle = '#fff';
		n_ctx.textBaseline = 'middle';
		n_ctx.textAlign = 'center';
		n_ctx.font = '12pt Monaco';
		n_ctx.fillText('NAME', 0, -8);
		n_ctx.restore();

		n_ctx.save();
		n_ctx.beginPath();
		//n_ctx.rect(21,-25,50,50);
		n_ctx.fill();
		n_ctx.restore();

		n_ctx.restore();
	}


	function draw(snapshot, stats, ID){
		clear();
		positionDisplay(CANVAS_LIST.age_meter);
		positionDisplay(CANVAS_LIST.energy_meter);
		
		if(snapshot.players[ID].genePool > 0){
			if(stats[ID].evolving)
				positionDisplay(CANVAS_LIST.evolving);
			else
				positionDisplay(CANVAS_LIST.evolve_ask);
		}

		//positionDisplay(CANVAS_LIST.heading);

		drawAge(snapshot.players[ID].age);
		drawEnergy(snapshot.players[ID].energy, stats[ID].energyTargetEgg);

		drawGenePool(snapshot.players[ID].genePool);
		drawScore(snapshot.players[ID].score);
	}

	function positionDisplay(display){
		var ctx = SIDE_CANVAS.ctx;

		ctx.save();
		ctx.translate(display.x, display.y)
		ctx.drawImage(display.canvas, -display.canvas.width/2, -display.canvas.height/2);
		ctx.restore();
	}

	function drawAge(percent){
		Math.floor(percent);
		var ctx = SIDE_CANVAS.ctx;
		ctx.save();
		ctx.translate(CANVAS_LIST.age_meter.x, CANVAS_LIST.age_meter.y);
		ctx.strokeStyle = CANVAS_LIST.age_meter.colour;
		var angle = 2*Math.PI/100;
		for(var i=0; i<100; i++){
			ctx.rotate(angle);
			if(i < percent){
				ctx.beginPath();
				ctx.moveTo(0, -40);
				ctx.lineTo(0, -50);
				ctx.stroke();
			}
			if(i<percent && percent < 20){
				ctx.save();
				ctx.strokeStyle = '#f99';
				ctx.beginPath();
				ctx.moveTo(0, -40);
				ctx.lineTo(0, -50);
				ctx.stroke();
				ctx.restore();	
			}
		}
		ctx.restore();
	}

	function drawEnergy(percent, energyTarget){
		Math.floor(percent);
		var ctx = SIDE_CANVAS.ctx;
		ctx.save();
		ctx.translate(CANVAS_LIST.energy_meter.x, CANVAS_LIST.energy_meter.y);
		ctx.strokeStyle = CANVAS_LIST.energy_meter.colour;
		var angle = 2*Math.PI/100;

		for(var i=0; i<100; i++){
			ctx.rotate(angle);
			if(i < percent){
				if(i > energyTarget){
					ctx.save();
					ctx.strokeStyle = '#80FF84';
					ctx.beginPath();
					ctx.moveTo(0, -40);
					ctx.lineTo(0, -50);
					ctx.stroke();
					ctx.restore();
				} else {
					ctx.beginPath();
					ctx.moveTo(0, -40);
					ctx.lineTo(0, -50);
					ctx.stroke();
				}
			}
			if(i == energyTarget){
				ctx.save();
				ctx.strokeStyle = '#80FF84';
				ctx.beginPath();
				ctx.moveTo(0, -40);
				ctx.lineTo(0, -50);
				ctx.stroke();
				ctx.restore();	
			}
		}
		ctx.restore();
	}

	function drawScore(score){
		var ctx = SIDE_CANVAS.ctx;

		ctx.save();
		ctx.strokeStyle = '#fff';
		ctx.fillStyle = '#fff';
		ctx.shadowColor = '#fff';
		ctx.shadowBlur = 8;
		ctx.translate(SIDE_CANVAS.cx, 0);


		ctx.save();
		ctx.rect(-50,8,100,60);
		ctx.stroke();
		ctx.restore();

		ctx.save();
		ctx.font = '25pt Monaco';
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'right';
		ctx.fillText(''+score, 40, 45);
		ctx.font = '8pt Monaco';
		ctx.textAlign = 'left';
		ctx.fillText('SCORE', -40, 20);
		ctx.restore();

		ctx.restore();

	}

	function drawGenePool(count){

		var yPos = CANVAS_LIST.gene_pool.y;

		var ctx = SIDE_CANVAS.ctx;

		ctx.save();
		ctx.translate(SIDE_CANVAS.cx, yPos);
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

	function clear(){

		var ctx = SIDE_CANVAS.ctx;

		ctx.save();
		ctx.clearRect( 0, 0, SIDE_CANVAS.width, SIDE_CANVAS.height);
		ctx.restore();
	}



	return {
		init: init,
		draw:draw
	}

});