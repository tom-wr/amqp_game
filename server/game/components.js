/*
 * components.js
 *
 * Holds the components for the classes module to build with
 *
 */

require('./constants');

console.log('@ components');

module.exports = Component = {

	WorldSpace: function(){
		this.position 		= { x:0, y:0 };
		this.orientation 	= 0;

		this.resetWorldSpace = function(){
			this.position = { x:0, y:0 };
			this.orientation = 0;
		}
	},

	Active: function(){

		this.rotation 		= 0;
		this.rotationSpeed 	= (Math.PI*2)/2;
		this.throttle 		= false;
		this.speed 		= -25;

		this.resetActive = function(){
			this.rotation = 0;
			this.throttle = false;
		}
		
	},

	Stats: function(){
		
		this.alive = true;
		this.ageMax = 100;
		this.age = this.ageMax;
		this.belly = 0;
		this.energy = 0;
		this.energyDigestion = 5;
		this.energyTargetEgg = 90;
		this.evolving = false;
		this.genePool = 0;
		this.incubation = 15;
		this.lifespan = 0.1;
		this.litter = 1;
		this.pause = false;
		this.reproduce = false;
		this.score = 0;

		this.resetStats = function(){
			this.age = this.ageMax;
			this.lifespan = this.levels.lifespan*0.1;
			this.energy = this.levels.energy*5;
			this.speed = -25-(this.levels.speed*5);
			this.rotationSpeed = (Math.PI*2)/(2-(this.levels.agility*0.1));
			this.energyTargetEgg = 95-(this.levels.reproduction*5);
			this.energyDigestion = this.levels.digestion*5;
			this.incubation = 15-this.levels.incubation; 
			this.litter = this.levels.litter;
			this.mouth = this.levels.mouth;

			this.belly = 0;
			this.genePool = 50;
		}

q		this.levels = {
			lifespan: 		1,
			energy: 		1,
			speed: 			1,
			agility: 		1,
			reproduction: 	1,
			digestion: 		1,
			incubation: 	1,
			litter: 		1,
			mouth: 			1
		}
	},

	Shape: function(){
		this.type = 'default';
		this.shapes = {

			body: 	{
						type: 'polygon',
						vertices: [ 
							{ x: -5, y: -10 },
							{ x: 5, y: -10 },
							{ x: 0, y: 10 }
						],
						radius: ''
					}

		};
	},

	BodyParts: function(){
		this.bodyParts = {

			mouth: {
					type: 'polygon',
					vertices: [
						{ x: -5, y: -10},
						{ x: -3, y: -15},
						{ x:  3, y: -15},
						{ x:  5, y: -10}
					],
					radius: ''
				}
		};
	},

	Control: function(){
		this.onKeyDown = function(keycode){
			switch(keycode){
				//return
				case 13:
				this.evolving = true;
				break;

				//space
				case 32:
				this.reproduce = true;
				break;

				//left
				case 37:
				this.rotation = -1;
				break;

				//up
				case 38:
				this.throttle = true;
				break;

				//right
				case 39:
				this.rotation = 1;
				break;

				//down
				case 40:
				this.currentSpeed = 0;
				break;

				default:
				break;
			}
		};

		this.onKeyUp = function(keycode){
			 switch(keycode){
			 	//return
			 	case 13:
			 	break;

			 	//space
			 	case 32:
			 	this.reproduce = false;
			 	break;

				//left
				case 37:
				this.rotation = 0;
				break;

				//up
				case 38:
				this.throttle = false;
				break;

				//right
				case 39:
				this.rotation = 0;
				break;

				//down
				case 40:
				
				break;

				default:
				break;
			}
		};
	}
}
