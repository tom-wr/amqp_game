/*
 * render.js
 * 
 * This module handles the rendering of the game onto the game
 * canvases. Where possible graphics are pre-rendered in off-screen
 * canvases and positioned when needed.
 *
 */

define(function(){

var 				ctx, // main canvas context
					 ID, // client player session ID	
	playerCanvasList={}, // list of player canvases
	   mobCanvasList={}, // list of mob type canvases
  boundaryCanvasList={}, // list of boundary canvases
    staticCanvasList={}, // list of static canvases
			CANVAS = {}; // canvas attributes
	 shapeSnapshot = ''; // player shape snapshot

/*
* init 
*
* Initialises the canvas and display state for the client's
* session.
*
* @params	id (string)		: client's game ID   	
*			snapshot ({})	: initial game state snapshot
*/

function init(id, snapshot, shapeSnapshot){
	ID = id;
	shapeSnapshot = this.shapeSnapshot;
	var canvas = document.getElementById('canvas');
	CANVAS = { 	width: canvas.width, height: canvas.height,
				cx: canvas.width/2, cy:canvas.height/2,
				element: canvas};
	if(canvas.getContext){
		ctx = document.getElementById('canvas').getContext('2d');
	}

	preRenderEntities();

}


function draw(snapshot, shapeSnapshot){

	drawGameWorld(snapshot, shapeSnapshot);
}

function drawGameWorld(snapshot, shapeSnapshot){
	checkCanviExist(shapeSnapshot);

	ctx.save();
	ctx.fillStyle = '#000B17';

	ctx.clearRect( 0, 0, CANVAS.width, CANVAS.height);
		
	ctx.restore();

	var IDPos = snapshot.players[ID].pos;

	for(var stat in staticCanvasList){
		positionStatic(staticCanvasList[stat], IDPos);
	}

	for(var mob in snapshot.mobs){
		positionMob(snapshot.mobs[mob], IDPos)
	}

	for(var player in snapshot.players){
		if(playerCanvasList[player]){
			if(player == ID){
					positionEntity(snapshot.players[player], player, true);
				} else {
					positionEntity(snapshot.players[player], player, false, IDPos);
			}
		}
	}

	drawBoundaries(IDPos);
}

/*
 *	PRE-RENDERING
 */

function preRenderEntities(){
	preRenderPlayers();
	preRenderMobs();
	preRenderBoundaries();
	preRenderStatics();
}

/*
* drawPreRenderPlayers / drawPreRenderMobs
*
* For each player and each mob type create a pre-rendered
* off-screen canvas. 
*
* @params	snapshot ({})	: snapshot of gamestate  	
*
*/

function preRenderPlayers(){

	for(var player in shapeSnapshot.playerShapes){
		createPlayerCanvas(shapeSnapshot.playerShapes[player], player);
	}
}

function preRenderMobs(){
	createMobCanvas('snow');
	createMobCanvas('egg');
	createMobCanvas('badegg');
	createMobCanvas('zipper');
}

function preRenderBoundaries(){
	createHorizontalBoundaryCanvas(CANVAS.width*2+20, 20);
	createVerticalBoundaryCanvas(20, CANVAS.height*2+20);
}

function preRenderStatics(){
	createSpawnPointCanvas();
}

/*
* createPlayerCanvas
*
* creates a new canvas for a player and adds it to the player
* canvas list with player ID for key.
*
* @params	player ({})			: player entity object  	
*			playerID (string)	: ID of player being drawn
*
*/

function createPlayerCanvas(playerShape, playerID){
	console.log(playerShape, playerID);
	var n_canvas = document.createElement('canvas');
	n_canvas.height = 50;
	n_canvas.width = 50;
	n_ctx = n_canvas.getContext('2d');
	drawPreRenderPlayer(playerShape, playerID, n_ctx);
	playerCanvasList[playerID] = n_canvas;
}

/*
* createMobCanvas
*
* creates a new canvas for mob type and adds it to the list
* of canvases with mobtype for key.
*
* @params	mobType (string)	: mobtype being drawn  	
*
*/

function createMobCanvas(mobType){
	var n_canvas = document.createElement('canvas');
	n_canvas.height = 20;
	n_canvas.width = 20;
	n_ctx = n_canvas.getContext('2d');
	if(mobType == 'snow')
		drawPreRenderMob(n_ctx);
	else if(mobType == 'egg')
		drawPreRenderEgg(n_ctx, mobType);
	else if(mobType == 'badegg'){
		drawPreRenderEgg(n_ctx, mobType);
	}
	else if(mobType == 'zipper'){
		drawPreRenderZipper(n_ctx);
	}
	mobCanvasList[mobType] = n_canvas;
}

/*
* createBoundaryCanvas
*
* creates a new canvas for a boundary and adds it to the list
* of canvases.
*
*/

function createHorizontalBoundaryCanvas(width, height){
	var n_canvas = document.createElement('canvas');
	n_canvas.height = height;
	n_canvas.width = width;
	n_ctx = n_canvas.getContext('2d');
	drawPreRenderBoundaryHorizontal(n_ctx, width, height);
	boundaryCanvasList['x'] = n_canvas;
}

function createVerticalBoundaryCanvas(width, height){
	var n_canvas = document.createElement('canvas');
	n_canvas.height = height;
	n_canvas.width = width;
	n_ctx = n_canvas.getContext('2d');
	drawPreRenderBoundaryVertical(n_ctx, width, height);
	boundaryCanvasList['y'] = n_canvas;
}

function createSpawnPointCanvas(){
	var n_canvas = document.createElement('canvas');
	n_canvas.height = 60;
	n_canvas.width = 60;
	n_ctx = n_canvas.getContext('2d');

	n_ctx.save();
	n_ctx.fillStyle = '#000B17';
	n_ctx.shadowColor = '#99f';
	n_ctx.shadowBlur = 8;
	n_ctx.strokeStyle = '#000B17';
	n_ctx.translate(30, 30)//n_ctx.width/2, n_ctx.height/2);

	n_ctx.save();
	n_ctx.beginPath();
	n_ctx.moveTo(0,0);
	n_ctx.arc(0,0,25,0,Math.PI*2, true);
	n_ctx.closePath();
	n_ctx.fill();
	n_ctx.restore();

	n_ctx.restore();

	staticCanvasList['spawnPoint'] = n_canvas;
}

/*
* drawPreRenderPlayer 
*
* draws the player shape onto the provided canvas context.
*
* @params	player (object)		: player entity object 
*			playerID (string) 	: ID of player being drawn
*			context ({})		: canvas context object
*
*/

function drawPreRenderPlayer(playerShape, playerID, context){

	var bodyShape = playerShape.bodyShapes.body;
	var verts = bodyShape.vertices;

	context.save();
	context.translate(25, 25);

	context.save();

	if(playerID == ID) {
		context.strokeStyle = '#fff';
		context.fillStyle = '#fff';
		context.shadowColor = 'white';
	} else {
		context.fillStyle = '#f99';
		context.strokeStyle = '#f99';
		context.shadowColor = '#f99';
	}
	context.shadowBlur = 10;
	context.beginPath();
	context.moveTo(verts[0].x, verts[0].y);
	for (var i = 1; i < verts.length; i++) {

		drawQuadraticCurve(verts[i-1], verts[i], context);

		if(i == verts.length-1){
			drawQuadraticCurve(verts[i], verts[0], context);
		}

	};
	context.stroke();
	context.closePath();
	context.fill();
	context.restore();

	context.restore();

	drawPreRenderBodyParts(playerShape, playerID, context);	

	function drawPreRenderBodyParts(playerShape, playerID, context){

		for(var bodyPart in playerShape.bodyParts){

			context.save();
			context.translate(25,25);
			context.strokeStyle = '#777';
			if(playerID == ID) {
				context.fillStyle = '#fff';
				context.shadowColor = 'white';
			} else {
				context.fillStyle = '#f99';
				context.shadowColor = '#f99';
			}
			context.shadowBlur = 8;
			var partVerts = playerShape.bodyParts[bodyPart].vertices;

			context.beginPath();
			context.moveTo(partVerts[0].x, verts[0].y);
			for(var i = 1; i<partVerts.length;i++){
				drawQuadraticCurve(partVerts[i-1], partVerts[i], context);
				if(i==partVerts.length-1){
					drawQuadraticCurve(partVerts[i], partVerts[0], context);
				}
			};
			context.stroke();
			context.closePath();
			context.fill();

			context.restore();
		}
	}
}


function drawPreRenderMob(context){

	context.save();
	context.strokeStyle = '#9f9';
	context.shadowColor = '#9f9';
	context.shadowBlur = 3;
	context.translate(10,10);

	context.save();
	context.beginPath();
	context.arc(0,0,2,0,Math.PI*2, true);
	context.stroke();
	context.restore();

	context.save();
	var angle = Math.PI*2/8;
	for(var i=0;i<8;i++){
		context.rotate(angle);
		context.beginPath();
		context.moveTo(0, 2);
		context.lineTo(0, 4);
		context.stroke();
	}
	context.restore();

	context.restore();

}

function drawPreRenderZipper(context){

	context.save();
	context.strokeStyle = '#BADFFF';
	context.fillStyle = '#BADFFF';
	context.shadowColor = '#BADFFF';
	context.shadowBlur = 10;
	context.translate(10,10);

	context.save();
	context.lineCap = 'round';
	context.lineWidth = 2;
	context.beginPath();
	context.moveTo(0, 0);
	context.lineTo(0, 7);
	context.stroke();
	context.restore();

	context.save();
	context.beginPath();
	context.arc(0,0,3,0,Math.PI*2, true);
	context.fill();
	context.restore();

	context.restore();

}


function drawPreRenderEgg(context, type)
{
	context.save();

	if(type=='egg'){//FCDA6A
		context.fillStyle = '#FFFC9E';
		context.shadowColor = '#FFFC9E';
	}
	else{
		context.fillStyle ='#f99';
		context.shadowColor = '#f99';
	}
		
	context.shadowBlur = 8;
	context.translate(10,10);

	context.save();
	context.beginPath();
	context.arc(0,0,5,0,Math.PI*2, true);
	context.fill();
	context.restore();

	context.restore();
}


function drawPreRenderBoundaryHorizontal(context, width, height){

	context.save();

	context.strokeStyle = '#99f';
	context.lineWidth = 2;
	context.shadowColor = '#99f';
	context.shadowBlur = 8;
	context.lineCap = 'round';

	context.save();
	context.translate(width/2, height/2);
	context.beginPath();
	context.moveTo(-width/2 + 20, 0);
	context.lineTo( width/2 - 20, 0);
	context.stroke();
	context.restore();

	context.restore();

}

function drawPreRenderBoundaryVertical(context, width, height){
	context.save();

	context.strokeStyle = '#99f';
	context.lineWidth = 2;
	context.shadowColor = '#99f';
	context.shadowBlur = 8;
	context.lineCap = 'round';

	context.save();
	context.translate(width/2, height/2);
	context.beginPath();
	context.moveTo(0, -height/2+20);
	context.lineTo(0, height/2-20);
	context.stroke();
	context.restore();

	context.restore();
}

function drawBoundaries(IDPos){
	for(var plane in boundaryCanvasList){
		if(plane=='x'){
			positionBoundary(boundaryCanvasList[plane], -CANVAS.width, -CANVAS.height, plane, IDPos);
			positionBoundary(boundaryCanvasList[plane], -CANVAS.width, CANVAS.height, plane, IDPos);
		} else {
			positionBoundary(boundaryCanvasList[plane], -CANVAS.width, -CANVAS.height, plane, IDPos);
			positionBoundary(boundaryCanvasList[plane], CANVAS.width, -CANVAS.height, plane, IDPos);
		}
	}
}

/*
 * CANVASPOSITION
 */

function positionEntity(ent, entID, centre, IDPos){

	ctx.save();

	ctx.translate(CANVAS.cx, CANVAS.cy);
	if(!centre){
		ctx.translate(ent.pos.x-IDPos.x, ent.pos.y-IDPos.y);
	}
	ctx.rotate(ent.ori);
	ctx.drawImage(playerCanvasList[entID], -25, -25);

	ctx.restore();
}


function positionMob(mob, IDPos){
	ctx.save();

	ctx.translate(CANVAS.cx, CANVAS.cy);
	ctx.translate(mob.pos.x-IDPos.x, mob.pos.y-IDPos.y);
	ctx.rotate(mob.ori);

	if(mob.type == 'egg' && mob.owner != ID){
		//console.log('owner: '+mob.owner +' : '+ID);
		ctx.drawImage(mobCanvasList['badegg'], -10, -10);
	} else {
		ctx.drawImage(mobCanvasList[mob.type], -10, -10);
	}

	ctx.restore();
}

function positionBoundary(boundaryCanvas, x, y, plane, IDPos){

	ctx.save();

	ctx.translate(CANVAS.cx, CANVAS.cy);
	ctx.translate(x-IDPos.x, y-IDPos.y);
	if(plane=='x'){
		ctx.translate(0, (y/-Math.abs(y))*10);
	} else {
		ctx.translate((x/-Math.abs(x))*10, 0);
	}

	ctx.drawImage(boundaryCanvas, -10, -10);

	ctx.restore();

}


function positionStatic(staticCanvas , IDPos){
	ctx.save();
	ctx.translate(CANVAS.cx, CANVAS.cy);
	ctx.translate(-IDPos.x, -IDPos.y);
	ctx.drawImage(staticCanvas, -staticCanvas.width/2, -staticCanvas.height/2);
	ctx.restore();
}


function redrawPlayer(newShape, playerID){
	createPlayerCanvas(newShape, playerID);
}


function checkCanviExist(shapeSnapshot){
	for(var player in shapeSnapshot.playerShapes){
		if(!playerCanvasList[player]){
			console.log('creatingCanvavs')
			createPlayerCanvas(shapeSnapshot.playerShapes[player],player)
		}
	}
}


function drawQuadraticCurve(startVert, endVert, context){
	//find normals
	var dx = endVert.x - startVert.x,
		dy = endVert.y - startVert.y;

	//normalise normals and apply multiplier
	var len = Math.sqrt(dx * dx + dy * dy);
	dx = dx/len*2;
	dy = dy/len*2;

	// find halfway point of line
	var midPointX = (endVert.x - startVert.x) / 2,
		midPointY = (endVert.y - startVert.y) / 2;

	//extend curvepoint along normal
	var curveX = startVert.x + midPointX,
	curveY = startVert.y + midPointY;

	context.quadraticCurveTo(dy+curveX, -dx+curveY, endVert.x, endVert.y);
}

	return {
		init: init,
		draw: draw,
		redrawPlayer: redrawPlayer
	}

});