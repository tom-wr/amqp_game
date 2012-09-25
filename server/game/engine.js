require('./constants');

console.log('@ engine');

module.exports = Engine = {

	collisionCheck: function(positions){

		/*var updatedPosition = boundaryWallCheck(positions);
		return updatedPosition;*/

	},

	bodyUpdate: function(body, dt){
		
		this.updateBodyAcceleration(body, dt);
		this.updateBodyRotation(body, dt);
		this.applyBodyVelocity(body, dt);

	},

	updateBodyAcceleration: function(body, dt){

		if(body.throttle){
			this.accelerateBody(body, dt)
		} else {
			this.decelerateBody(body, dt)
		}
		
	},

	applyBodyVelocity: function(body, dt){
		var angle = body.orientation;

		body.velocity.x = (Math.sin(angle)) * body.currentSpeed;
		body.velocity.y = (Math.cos(angle)) * body.currentSpeed;
	
		var prevX = body.position.x,
			prevY = body.position.y;
	
		var futureX = body.position.x + (body.velocity.x * dt),
			futureY = body.position.y + (-body.velocity.y * dt);

		var newPosition = this.boundaryCollisionCheck({
			future: 	{x:futureX, y:futureY},
			previous: 	{x:prevX, 	y:prevY}
		})

		body.position = newPosition;
			
	},

	accelerateBody: function(body, dt){
		body.currentSpeed += body.acceleration * dt;
		if(body.currentSpeed > body.maxSpeed){
			this.decelerateBody(body, dt);
		}
	},

	decelerateBody: function(body, dt){
		body.currentSpeed -= body.acceleration *dt;
		if(body.currentSpeed < 0){
			body.currentSpeed = 0;
		}
	},

	updateBodyRotation: function(body, dt){
		if(body.rotation == 1){
			body.orientation += body.rotationSpeed * dt;
		} else if (body.rotation == -1){
			body.orientation -= body.rotationSpeed * dt;
		} else {
			body.orientation += 0;
		}
	},
	
	boundaryCollisionCheck: function(positions){

		if(positions.future.x < -Constants.world.width || 
			positions.future.x > Constants.world.width){

			positions.future.x = positions.previous.x;
		}
		if(positions.future.y < -Constants.world.width || 
			positions.future.y > Constants.world.width){

			positions.future.y = positions.previous.y;
		}
		return positions.future;
	}
}