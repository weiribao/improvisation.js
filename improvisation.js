function Improvisation(){

	var registry = this.registry = {};

	Function.prototype.provide = function(name){
		registry[name] = this;
		return this;
	}

	Function.prototype.requires = function(){
		this.$requires = Array.prototype.slice.apply(arguments);
		return this;
	}

}

Improvisation.prototype.resolve = function(name){
	return this.registry[name]();
}

Improvisation.prototype.invoke = function(params){
	var impr = this;
	var fn, $requires;
	if(params instanceof Array){
		fn = params[params.length-1];
		$requires = params.slice(0, -1);
	} else {
		fn = params;
		$requires = fn.$requires;
	}
	var args = $requires.map(function(arg){
		return new impr.registry[arg];
	})
	return fn.apply(null, args);
}


// experiment
var impr = new Improvisation();

var Person = function(name){
	this.name = name;
}

var PersonProvider = function(){
	return new Person("Person" + Math.random());
}.provide("person");

Person.prototype.say = function(){
	console.log(this.name);
}

impr.invoke(["person", function(person){
	person.say();
}])

impr.invoke(["person", function(person){
	person.say();
}])


