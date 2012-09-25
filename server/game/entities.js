/*
 * entities.js
 *
 * Holds all the player, mob and static entities in object lists.
 * Takes snapshots of the lists to send to clients
 *
 */

console.log('@ entities');

module.exports = Entities = {

	mobCount: 0,

	count:{
		snow:0,
		zipper:0,
		egg:0
	},

	players: {},
	mobs: {},
	statics: {
		'#s1': {pos:{x:0, y:0}, ori:0}
	},

	snapshot: function(){

		var snap = {
			players:{},
			mobs:{},
			statics:this.statics,
		};

		for(var player in this.players){
			var thisPlayer = this.players[player];
			snap.players[thisPlayer.id] = {	
											pos: { x:thisPlayer.position.x.toFixed(0), y:thisPlayer.position.y.toFixed(0)}, 
											ori:thisPlayer.orientation.toFixed(3),
											age:thisPlayer.age.toFixed(0),
											energy:thisPlayer.energy.toFixed(0),
											genePool:thisPlayer.genePool,
											score:thisPlayer.score
										};
		}

		for(var mob in this.mobs){
			var thisMob = this.mobs[mob];
			snap.mobs[mob] =    {	
									pos: { x:thisMob.position.x.toFixed(0), y:thisMob.position.y.toFixed(0)}, 
									ori:thisMob.orientation.toFixed(3),
									type:thisMob.type
								};
			if(thisMob.type=='egg'){
				snap.mobs[mob].owner = thisMob.owner;
			}

		}

		return snap;

	},

	shapeSnapshot: function(){
		var snap = {
			playerShapes:{},
			stats:{}
		};
		for(var player in this.players){
			var thisPlayer = this.players[player];

			snap.playerShapes[thisPlayer.id] = 	{
													bodyShapes: thisPlayer.shapes,
													bodyParts: thisPlayer.bodyParts,
												};

			snap.stats[thisPlayer.id] = {
											energyTargetEgg: thisPlayer.energyTargetEgg,
											evolving: thisPlayer.evolving
										};
		}

		return snap;
	},

	generateMobID: function(){
		return 'm'+ this.mobCount++;
	}
}