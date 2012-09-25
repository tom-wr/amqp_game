require('./components');
require('./objectutil');

console.log('@ classes');

/*
* Player 
*
* Returns a new player object containing the default components
* 
*
* @params	attr {} *optional*  may contain any attributes to add
* 								to object or overwrite defaults
*/

module.exports = Player = function(attr){

	ObjUtil.extend( this, 	Component.WorldSpace, 
							Component.Active,
							Component.Stats,
							Component.Shape,
							Component.BodyParts,
							Component.Control		);

	ObjUtil.overwrite(this, attr);

}


/*
* Mob 
*
* Takes it's components and initiates attributes from the 
* corresponding mobTypes object
*
* @params 	attr {}	 	should contain a 'type' from mobType list
*/


module.exports = Mob = function(attr){

	//add each component stated in mobTypes
	var components = mobTypes[attr.type].components;
	for(var i=0, len= components.length; i<len ; i++ ){
		ObjUtil.extend(this, Component[components[i]]);
	}

	//add each attr stated in mobTypes
	for(var x in mobTypes[attr.type].attributes){
		ObjUtil.overwrite(this, mobTypes[attr.type].attributes);
	}

	// overwrite attr with arguments
	ObjUtil.overwrite(this, attr);

}

module.exports = Static = function(){

	ObjUtil.extend(this,	Component.WorldSpace);
}

var mobTypes = {


	/* Defaults
	* 
	*
	* Active
	*
	* acceleration 	= 250;
	* velocity 		= {x:0,y:0};
	* rotation 		= 0;
	* rotationSpeed = (Math.PI*2)/2;
	* throttle 		= false;
	* currentSpeed 	= 0;
	* speed 		= -3;
	*/


	snow: {	components: [	'WorldSpace', 
							'Active',
							'Shape'		
											],

			attributes: {
							throttle: false,
							speed:-3,
							shapes: {
										body: 	{	
													part: 'body',
													type: 'circle',
													vertices: [],
													radius: '2'
												}
									}
						}
	}, // end 'snow'

	zipper: {	components: [	'WorldSpace', 
								'Active',
								'Shape'		
											],

			attributes: {
							throttle: false,
							speed:-3,
							shapes: {
										body: 	{	
													part: 'body',
													type: 'circle',
													vertices: [],
													radius: '3'
												}
									}
						}
	}, // end 'zipper'

	egg: {	components: [	'WorldSpace',
							'Active',
							'Shape'
						],

			attributes: {	
							shapes: {
										body: 	{
													part: 'body',
													type: 'circle',
													vertices: [],
													radius: '5'
												}
									}
			}

	} // end egg

} //end mobTypes