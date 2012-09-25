/*
 * world.js
 *
 * Handles functions that influence the game world physics of 
 * the game using Box2DWeb game engine
 *
 */

require('../lib/Box2dWeb');
require('./constants');
require('./entities');
require('./logic');

console.log('@ world');

var   	b2Vec2 = Box2D.Common.Math.b2Vec2
    ,	b2BodyDef = Box2D.Dynamics.b2BodyDef
    ,	b2Body = Box2D.Dynamics.b2Body
    ,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
    ,	b2Fixture = Box2D.Dynamics.b2Fixture
    ,	b2World = Box2D.Dynamics.b2World
    ,	b2MassData = Box2D.Collision.Shapes.b2MassData
    ,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
    ,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
    ,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw
    ,	b2Math = Box2D.Common.Math.b2Math
    ,	b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef
    ,	b2ContactListener = Box2D.Dynamics.b2ContactListener;


module.exports = World = {

	world: this.world = new b2World(new b2Vec2(0,0),true),
	destroyList: [],

	init: function(){

		console.log('||| the world has begun');
		this.createBoundaries();
		this.createContactListener();
		Logic.init();

		setInterval(this.update.bind(this), 50);

	},

	update: function(){

		this.moveEntities();
		this.world.Step(1/60 //frame-rate)
						, 10
						, 10
		);
		this.world.ClearForces();

		Logic.step();

		this.createEntities();
		this.destroyEntities();
		this.redefineFixtures();
		this.resetEntities();
	},

	createBoundaries: function(){

		var cWidth = Constants.canvas.width,
			cHeight = Constants.canvas.height,
			scale = Constants.scale,
			w = this.world;

		newBoundary( 0,		-500, 	800,	10, 	w );
		newBoundary( 800,	0, 		10, 	500, 	w );
		newBoundary( 0, 	500, 	800, 	10,		w );
		newBoundary( -800, 	0, 		10, 	500, 	w );



		function newBoundary(x, y, width, height, world){
			
			var w = world;

			var fixDef = new b2FixtureDef;
			fixDef.density = 1.0;
			fixDef.friction = 0.5;
			fixDef.restitution = 0.2;

			var bodyDef = new b2BodyDef;
			bodyDef.type = b2Body.b2_staticBody;

			bodyDef.position.x = x/Constants.scale;
			bodyDef.position.y = y/Constants.scale;

			fixDef.shape = new b2PolygonShape;
			fixDef.shape.SetAsBox(width/Constants.scale, height/Constants.scale);

			w.CreateBody(bodyDef).CreateFixture(fixDef);

		}

	},

	createBody: function(entity){

		var world = this.world;
		entity.body = (function() {

			var body = createb2Body(entity,{'id':entity.id, 'part':'body', 'type':entity.type});
			createFixtures(entity.shapes, body);

			if(entity.bodyParts){
				createBodyParts(entity, body);
			}

			return body;

			function createb2Body(entity, data){
				var bodyDef = new b2BodyDef;
				bodyDef.type = b2Body.b2_dynamicBody;
				bodyDef.position.x = entity.position.x/Constants.scale;
				bodyDef.position.y = entity.position.y/Constants.scale;
				bodyDef.angle = entity.orientation;

				var newBody = world.CreateBody(bodyDef);
				newBody.SetUserData(data);
				
				return newBody;
			}

			function createb2Shape(vertices){


				var b2vertices = [];

				for(var i=0; i < vertices.length; i++){
					b2vertices[i] = new b2Vec2(vertices[i].x/Constants.scale, 
						vertices[i].y/Constants.scale);
				}

				var polygon = new b2PolygonShape();
				polygon.SetAsArray(b2vertices, b2vertices.length);

				return polygon;

			}

			function createFixtures(shapes, body){

				for(var shape in shapes) {
					var fixDef = new b2FixtureDef;
					fixDef.density = shape=='mouth' ? 0.5 : 1;
					fixDef.friction = 0.5;
					fixDef.resitution = 0.2;

					if(shapes[shape].type =='polygon'){
						fixDef.shape = new b2PolygonShape;
						fixDef.shape = createb2Shape(shapes[shape].vertices);

					} else {
						fixDef.shape = new b2CircleShape(shapes[shape].radius/Constants.scale);
					}

					body.CreateFixture(fixDef);

				}
				return body;
			}

			function createBodyParts(entity, mainBody){
				
				for(bodyPart in entity.bodyParts){
					var body = createb2Body(entity, {'id':entity.id, 'part':bodyPart, 'type':entity.type});
					createFixtures(entity.bodyParts, body);

					var jointDef = new b2WeldJointDef();
					
					jointDef.Initialize(mainBody, body, mainBody.GetWorldCenter().Copy());
					world.CreateJoint(jointDef);
				}
			}

		})();

		entity.updatePosition = function(){

			var pos = this.body.GetPosition();
			this.position.x = pos.x * Constants.scale;
			this.position.y = pos.y * Constants.scale;

			this.orientation = this.body.GetAngle();
			
		};
	},

	deleteBody: function(entity){
		var w = this.world;

		if(entity.body.GetJointList()){
			var other = entity.body.GetJointList().other;
			w.DestroyBody(other);
		}

		w.DestroyBody(entity.body);
	},

	destroyEntities: function(){
		while(this.destroyList.length){
			var entity = this.destroyList.pop();
			if(Entities.mobs[entity.id]){
				Entities.count[entity.type]--;
				this.deleteBody(Entities.mobs[entity.id]);
				delete Entities.mobs[entity.id];
			}	
		}

		while(Logic.createAndDestroy.destroy.length){
			var entity = Logic.createAndDestroy.destroy.pop();
			Entities.count[entity.type]--;
			this.deleteBody(entity);
			delete Entities.mobs[entity.id];
		}
	},

	resetEntities: function(){
		while(Logic.createAndDestroy.reset.length){

			var entity = Logic.createAndDestroy.reset.pop();
			var resetVec = new b2Vec2(0,0);

			entity.body.SetPosition(resetVec);
			entity.body.SetLinearVelocity(resetVec);
			entity.body.SetAngle(0);

			var jointBody = entity.body.GetJointList().other;
			jointBody.SetLinearVelocity(resetVec);
			jointBody.SetAngle(0);
			jointBody.SetPosition(resetVec);
			
		}
	},

	redefineFixtures: function(){
		while(Logic.createAndDestroy.mouth.length){
			var thisMouth = Logic.createAndDestroy.mouth.pop();
			var entity = Entities.players[thisMouth.id];
			var mouthBody = entity.body.GetJointList().other;
			
			console.log(mouthBody.GetUserData());
			mouthBody.DestroyFixture(mouthBody.GetFixtureList());
			this.redefineMouthFixture(thisMouth.id, mouthBody);

			//entity.body.DestroyFixture(entity.body.GetFixtureList());


		}
	},

	redefineMouthFixture: function(ID, body){
		var entity = Entities.players[ID];
		var vertices = entity.bodyParts.mouth.vertices;
		console.log(vertices);
		for(var i=0;i<vertices.length;i++){
			if(i==1){
				vertices[i].x = -3-entity.levels.mouth;
			} else if(i==2){
				vertices[i].x = 3+entity.levels.mouth;
			}
		}
		console.log(vertices);

		var fixDef = new b2FixtureDef;
		fixDef.density = 0.5;
		fixDef.friction = 0.5;
		fixDef.resitution = 0.2;

		var b2vertices = [];

		for(var i=0; i < vertices.length; i++){
			b2vertices[i] = new b2Vec2(vertices[i].x/Constants.scale, 
			vertices[i].y/Constants.scale);
		}

		var polygon = new b2PolygonShape();
		polygon.SetAsArray(b2vertices, b2vertices.length);
		fixDef.shape = polygon;

		body.CreateFixture(fixDef);

		Messages.shapeSnapshot();

	},

	createEntities: function(){
		while(Logic.createAndDestroy.create.length){
			var newEntity = Logic.createAndDestroy.create.pop();
			if(newEntity.type == 'egg'){
				var eggID = Entities.generateMobID();
				var egg = new Mob({	type:'egg', 
									id:eggID, 
									position:newEntity.position, 
									owner:newEntity.owner, 
									timeborn: new Date().getTime() });
				Entities.mobs[eggID] = egg;
				Logic.timer.eggs[eggID] = egg;
				this.createBody(egg);
			}
		}
	},

	moveEntities: function(){

		for(var player in Entities.players){
			var thisPlayer = Entities.players[player];

			this.moveEntity(thisPlayer);
			this.rotatePlayer(thisPlayer);
			//this.killOrthogonalVelocity(thisPlayer.body);

			thisPlayer.updatePosition();

		}

		for(var mob in Entities.mobs){
			var thisMob = Entities.mobs[mob];

			this.moveEntity(thisMob);
			thisMob.updatePosition();
		}
	},

	moveEntity: function(entity){

		if(entity.throttle){
			this.accelerate(entity);
		} else {
			this.decelerate(entity);
		}

	},

	rotatePlayer: function(player){

		if(player.rotation == -1){
			player.body.SetAngularVelocity(-player.rotationSpeed);
		} else if (player.rotation == 1){
			player.body.SetAngularVelocity(player.rotationSpeed);
		} else {
			player.body.SetAngularVelocity(0);
		}

	},

	accelerate: function(entity){

		var direction = entity.body.GetTransform().R.col2.Copy();
		direction.Multiply(entity.speed/Constants.scale);

		var vel = new b2Vec2(direction.x, direction.y);

		entity.body.ApplyForce(vel, entity.body.GetPosition());

	},

	decelerate: function(entity){

		entity.body.SetLinearDamping(0.80);

	},

	killOrthogonalVelocity: function(body){
		
		var localPoint = new b2Vec2(0,0);
		var velocity = body.GetLinearVelocityFromLocalPoint(localPoint);

		var sidewaysAxis = body.GetTransform().R.col2.Copy();
		sidewaysAxis.Multiply(b2Math.Dot(velocity, sidewaysAxis));

		body.SetLinearVelocity(sidewaysAxis);
	},

	createContactListener: function(){

		var destroyList = this.destroyList;

		var beginCallback = function(contact, destroyList){
			var a = contact.GetFixtureA().GetBody().GetUserData(),
				b = contact.GetFixtureB().GetBody().GetUserData();
			if(a != null && b!=null){
		        if(a.part == 'mouth'){

		        	switch(b.type){
		        		case 'snow':
		        		destroyList.push({'id':b.id, 'type':'snow', 'body':contact.GetFixtureB().GetBody()});
		        		Entities.players[a.id].belly += 1;
		        		break;

		        		case 'egg':
		        		Entities.mobs[b.id].owner = a.id;
		        		break;

		        		case 'zipper':
		        		destroyList.push({'id':b.id, 'type':'zipper', 'body':contact.GetFixtureB().GetBody()});
		        		Entities.players[a.id].belly += 2;
		        		break;

		        		default:
		        		break;
		        	}

		        } else if(b.part == 'mouth'){
		        	switch(a.type){
		        		case 'snow':
		        		destroyList.push({'id':a.id, 'type':'snow', 'body':contact.GetFixtureA().GetBody()});
		        		Entities.players[b.id].belly += 1;
		        		break;

		        		case 'egg':
		        		Entities.mobs[a.id].owner = b.id;
		        		break;

		        		case 'zipper':
		        		destroyList.push({'id':a.id, 'type':'zipper', 'body':contact.GetFixtureA().GetBody()});
		        		Entities.players[b.id].belly += 2;
		        		break;

		        		default:
		        		break;
		        	}
		        }
		    }
		}

		var listener = new Box2D.Dynamics.b2ContactListener;

	    listener.BeginContact = function(contact) {
	    	beginCallback(contact, destroyList);
	    }
	    listener.EndContact = function(contact) {
	    }
	    listener.PostSolve = function(contact, impulse) {
	        
	    }
	    listener.PreSolve = function(contact, oldManifold) {

	    }

    	this.world.SetContactListener(listener);
	}
}