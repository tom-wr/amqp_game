/*
 * app.js
 *
 * This module handles the rendering loop and sets the 
 * snapshots for the current game state.
 *
 */

define(['./render', './sidebar', './controller', './evolve', '../lib/Stats'], 
	function(render, sidebar, controller, evolve, stats){

		var ID = snapshot = shapeSnapshot = levelSnapshot= '',
			gameStatus = socket = 'play';

		function init(id, sock){
			
			ID = id;
			socket = sock;

			window.requestAnimFrame = setFrameRate();
			controller.init(ID, sock);

			showFrameRate();

			checkSnapshotExists(sock);

		};

		function checkSnapshotExists(socket){

				setTimeout(function(){
					if(snapshot && shapeSnapshot) {
						console.log('snapshots exists');
						checkSnapshotIdExists(socket);
					} else {
						console.log('snapshots dont exist');
						checkSnapshotExists(socket);
						socket.emit('message', { key:'game.input.req', id:ID, req:'shapeSnapshot'});
				}
			}, 1000);

		};

		function checkSnapshotIdExists(socket){
			if(snapshot.players[ID] && shapeSnapshot.playerShapes[ID].bodyShapes){
				console.log('snapshots ID exist');
				initGame();
			} else {
				setTimeout(checkSnapshotExists(socket), 1000);
			}
		}

		function initGame(){
			sidebar.init();
			render.init(ID, snapshot);
			evolve.init();
			play();
		}

		function play(){
			stats.begin();
			if(gameStatus == 'play'){
				render.draw(snapshot, shapeSnapshot);
				sidebar.draw(snapshot, shapeSnapshot.stats, ID);
			} else if (gameStatus == 'evolve'){
				gameStatus = evolve.draw(levelSnapshot, socket, ID);
			} else {
				console.log('gameStatus error');
			}
			requestAnimFrame(play);
			stats.end();
		};

		// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
		function setFrameRate(){
			return  window.requestAnimationFrame       || 
	           		window.webkitRequestAnimationFrame || 
	            	window.mozRequestAnimationFrame    || 
	              	window.oRequestAnimationFrame      || 
	              	window.msRequestAnimationFrame     || 
	              	function(/* function */ callback, /* DOMElement */ element){
	              		window.setTimeout(callback, 1000 / 60);
	              	};
		}

		function showFrameRate(){
			stats.setMode(2);
			stats.domElement.style.position = 'absolute';
			stats.domElement.style.left = '0px';
			stats.domElement.style.top = '0px';
			document.body.appendChild(stats.domElement);
		}

		function setSnapshot(snap){
			snapshot = snap;
		}

		function setShapeSnapshot(snap){

			if(shapeSnapshot.playerShapes){
				checkShapeChange(shapeSnapshot,snap);
			}
			
			shapeSnapshot = snap;
		}

		function checkShapeChange(oldsnap, newsnap){

			for(var player in shapeSnapshot.playerShapes){
				var oldVerts = oldsnap.playerShapes[player].bodyParts.mouth.vertices,
					newVerts = newsnap.playerShapes[player].bodyParts.mouth.vertices;
				for(var i in oldVerts){	
					if(oldVerts[i].x != newVerts[i].x){
						console.log(oldVerts[i].x +':'+newVerts[i].x);
						render.redrawPlayer(newsnap.playerShapes[player],player);
					}
				}
			}
		}

		function setLevelSnapshot(snap){
			snap.genePool = snapshot.players[ID].genePool;
			levelSnapshot = snap;
		}

		function setGameStatus(status){
			gameStatus = status;
		}

	return {
		init : init,
		setSnapshot : setSnapshot,
		setShapeSnapshot : setShapeSnapshot,
		setGameStatus : setGameStatus,
		setLevelSnapshot: setLevelSnapshot
	}
	
});