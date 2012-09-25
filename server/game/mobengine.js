/*
 * mobengine.js
 *
 * handles initial creation of and maintenance of mobs
 *
 */

require('./classes');
require('./entities');
require('./world');
require('./constants');

console.log('@ mobengine');

module.exports = MobEngine = {

	init: function(){
		console.log('||| mob initiation ceremony')
		for(var i=0; i<Constants.count.snow;i++){
			this.createSnow();
		}
		for(var j=0; j<Constants.count.zipper;j++){
			this.createZipper();
		}
	},

	checkMobLevels:function(){

		while(Entities.count.zipper < Constants.count.zipper){
			this.createZipper();
		}
		while(Entities.count.snow < Constants.count.snow){
			this.createSnow();
		}
		
	},

	createSnow: function(){
		this.createMob({
			type: 'snow',
			position: this.randomPosition(),
			orientation: this.randomOrientation()
		});
		Entities.count.snow++;
	},

	createZipper: function(){
		this.createMob({
			type:'zipper',
			position: this.randomPosition(),
			orientation:this.randomOrientation(),
			throttle: true
		});
		Entities.count.zipper++;
	},

	createMob: function(attr){
		var mobID = Entities.generateMobID();
		attr.id = mobID;
		var mob = new Mob(attr);
		Entities.mobs[mobID] = mob;
		World.createBody(mob);
		return mob;
	},

	destroy: function(mob){
		delete Entities.mobs[mob.id];
	},

	randomMovement: function(mob){
		mob.velocity = {
			x: Math.floor( Math.random() * mob.maxSpeed ),
			y: Math.floor( Math.random() * mob.maxSpeed )
		}
	},

	randomPosition: function(){
		var xRange = 800-20,
			yRange = 500-20;

		var pos = {
			x: Math.floor(Math.random()*xRange) * getMulti(),
			y: Math.floor(Math.random()*yRange) * getMulti()
		};

		function getMulti(){
			var multi = Math.floor(Math.random()*2);
			if( multi < 1 ){
				return -1;
			} else {
				return 1;
			}
		}
		return pos;
	},

	randomOrientation: function(){
		var ori = ( Math.random() * Math.PI*2 );
		return ori;
	}

}