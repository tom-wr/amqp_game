/*
 * objectutil.js
 *
 * provides functions for manipulation of objects
 *
 */

console.log('@ objectUtil');

module.exports = ObjUtil = {

	extend: function(o){
		if(Array.isArray(arguments[1])){
			for(var i=0; i<arguments[1].length; i++){
				var component = new Component[i]();
				for(var x in component){
					o[x] = component[x];
				}
			}
		} else {
			for(var i = 1; i<arguments.length; i++){
				var component =  new arguments[i]();
				for(var x in component){
					o[x] = component[x];
				}
			}
		}
		return o;
	},

	remove: function(o){
		var targetObject = o;
		for(var i=1; i<arguments.length; i++){
			var component = new arguments[i]();
			for(var x in component){
				delete targetObject[x]; 
			}
		}
		return targetObject;
	},

	merge: function(o, p){
		for(var x in p){
			if(!o[x]){
				o[x] = p[x];
			}
		}
		return o;
	},

	overwrite: function(o, p){
		for(var x in p){
			o[x] = p[x];
		}
		return o;
	}
	
}
