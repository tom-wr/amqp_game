/*
 * logic.js
 *
 * Handles non-physics related game logic
 *
 */

require('./entities');
require('./constants');
require('./mobengine');
require('./messages');


console.log('@ logic');

module.exports = Logic = {
	
	timer: {
		last: '',
		eggs: {}
	},

	createAndDestroy: {
		create: [],
		destroy: [],
		reset: [],
		mouth: [],
	},



	init: function(){
		this.timer.last = new Date().getTime();
	},

	step: function(){
		var now = new Date().getTime(),
			dt = now - this.timer.last;

		for(player in Entities.players){
			if(!Entities.players[player].pause){
				this.calculateAge(Entities.players[player], dt);
				this.calculateEnergy(Entities.players[player], dt);
				this.reproduce(Entities.players[player]);
				this.checkEvolving(Entities.players[player]);
			}
		}

		this.checkEggTimer();
		this.checkMobPosition();
		MobEngine.checkMobLevels();

		this.timer.last = new Date().getTime();
	},

	// calculate age of entity given time passed from last calculation
	calculateAge: function(entity, dt){

		entity.age -= ((2+entity.lifespan)/dt);
		if( entity.age < 0 ){
			entity.age = 0;
			entity.alive = false;
			this.killPlayer(entity);
		}

	},

	// calculate energy of entity given time passed from last calculation 
	calculateEnergy:function(entity, dt){

		if(entity.energy < 0)
			entity.energy = 0;
		entity.energy += entity.energyDigestion*entity.belly;
		entity.belly = 0;

	},

	// entity creates an egg if it's reproduce variable id true and has enough energy to do so
	reproduce:function(entity){

		if(entity.reproduce && (entity.energy >= entity.energyTargetEgg)){
			var rand = Math.floor(Math.random()*10)+1;
			var litter = (rand < entity.litter) ? 2 :1;
			var pos = { x: entity.position.x+1, y:entity.position.y-1}

			for(var i=0; i<litter; i++){
				this.createAndDestroy.create.push({owner:entity.id, type:'egg', position:pos});
				pos = { x: pos.x+1, y: pos.y+1 }
			}

			entity.energy -= entity.energyTargetEgg;
			entity.reproduce = false;
		}

	},

	// calculates if an egg is older than it's incubation period 
	// and if so destroys egg and adds to owner's genepool
	checkEggTimer: function(){

		var now = new Date().getTime();
		for(var egg in this.timer.eggs){
			var thisEgg = this.timer.eggs[egg];
			if(((now-thisEgg.timeborn)/1000) > Entities.players[thisEgg.owner].incubation){
				this.createAndDestroy.destroy.push(thisEgg);
				Entities.players[thisEgg.owner].genePool++;
				delete this.timer.eggs[egg];
			}
		}

	},

	// checks if mobs are out of bounds and if so destroys them
	checkMobPosition: function(){

		for(var mob in Entities.mobs){
			var entity = Entities.mobs[mob];
			if(entity.type == 'zipper'){
				if(Math.abs(entity.position.y) > Constants.world.height/2-20 ||
					Math.abs(entity.position.x) > Constants.world.width/2-20){
					this.createAndDestroy.destroy.push(entity);
				}
			}
		}

	},

	//Checks if player wants to and an evolve and if so sends a shapesnapshot
	checkEvolving: function(entity){
		if(entity.evolving==true && entity.genePool > 0){
			Messages.shapeSnapshot();
		}		
	},

	// if player is evolving it evolves, else the player is killed by resetting it
	killPlayer: function(entity){
		if(entity.evolving){
			this.evolvePlayer(entity);
		} else {
			entity.score += entity.genePool;
			entity.resetStats();
			entity.resetWorldSpace();
			entity.resetActive();
			this.createAndDestroy.reset.push(entity);
			Messages.shapeSnapshot();
		}
	},

	// the game updates for the player are paused and 
	// sends a push message to the client instructing it to evolve
	evolvePlayer: function(entity){
		entity.pause = true;
		Messages.pushRequest(entity.id, { push:'evolve', msg: entity.levels });
	},

	// finalises a player's evolution
	confirmEvolve: function(entity, newLevels){
		delete newLevels.genePool;
		if(entity.levels.mouth != newLevels.mouth){
			this.createAndDestroy.mouth.push({id:entity.id, mouthsize:newLevels.mouth});
		}
		entity.levels = newLevels;
		entity.pause = false;
		entity.evolving = false;
		entity.genePool = 0;
		this.killPlayer(entity);

		console.log('logic: confirm evolve');

		console.log(newLevels);
	}

}