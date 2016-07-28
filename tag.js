

function ObjType(type) {
	this.type = "type";
	this.name = type;
}
ObjType.prototype.compare = function() {
	
}
function ObjAttribute(options) {
	this.type = "attribute";
	this.$ = [];
	for(var key in options) {
		if(key!="type") {
			this[key] = options[key];
		}
	}
}
ObjAttribute.prototype.check = function() {
	var list = [];
	for(var key in this) {
		if(this.hasOwnProperty(key)) {
			if(key!="type" && key!="$") {
				list.push(key);
			}
		}
	}
	for(var x = 0; x < list.length;x++) {
		var check = false;
		for(var y = 0; y < this.$.length;y++) {
			if(this.$[y] == list[x]) {
				check = true;
				break;
			}
		}
		if(!check) {
			this.$.push(list[x]);
		}
	}
}
ObjAttribute.prototype.compare = function(target) {
	this.check();
	for(var x = 0; x < this.$.length;x++) {
		var check = false;
		var state = 0;
		if(this.$[x] != target.$[x]) {
			check = true;
		} else if(this.$[x] < target.$[x]) {
			check = true;
			state = -1;
		} else if(this.$[x] > target.$[x]) {
			check = true;
			state = 1;
		}
		if(check) {
			return [ check && state == 0 , state ];
		}
	}
	return 0;
}
function ObjTag(type,attrib) {
	attrib = attrib || {};
	this.type = "tag";
	this.value = [[new ObjType(type)],[new ObjAttribute(attrib)],[]];
	this.version = 1;
	this.date = new Date();
	Object.defineProperty(this,"$",{
		get : function() {
			return this.value[1][ this.value[1].length -1 ];
		}
	});
	Object.defineProperty(this,"attributes",{
		get : function() {
			return this.value[1][ this.value[1].length -1 ];
		}
	});
	Object.defineProperty(this,"typename",{
		get : function() {
			return this.value[0][ this.value[0].length-1 ].name;
		}
	});
}
ObjTag.prototype.pushType = function(type) {
	this.value[0].push(new ObjType(type));
}
ObjTag.prototype.popType = function() {
	if(this.value[0].length>1)
		return this.value[0].pop();
	return null;
}
ObjTag.prototype.pushAttributes = function(attrib) {
	this.value[1].push( new ObjAttribute(attrib) );
}
ObjTag.prototype.popAttributes = function() {
	if(this.value[0].length>1) 
		return this.value[0].pop();
	return null;
}
ObjTag.prototype.push = function(obj) {
	this.value[2].push(obj);
}
ObjTag.prototype.pop = function() {
	if(this.value[2].length>0)
		return this.value[2].pop();
	return null;
}
ObjTag.prototype.unshift = function(obj) {
	this.value[2].unshift(obj);
}
ObjTag.prototype.shift = function() {
	if(this.value[2].length>0)
		return this.value[2].shift();
	return null;
}
ObjTag.prototype.forEach = function(callback) {
	for(var x = 0; x < this.value[2].length;x++) {
		callback(this.value[2][x]);
	}
}
ObjTag.prototype.commit = function() {
	// check all attribs have a order
	for(var x = 0; x < this.value[1].length;x++) this.value[1][x].check();
	this.version += 1;
	this.date = new Date();
}
ObjTag.prototype.compare = function(obj_tag) {
	if( 
		this.value[0].length == obj_tag.value[0].length &&
		this.value[1].length == obj_tag.value[1].length &&
		this.value[2].length == obj_tag.value[2].length
	) {
		var state = 0;
		for(var x = 0; x < this.value[0].length;x++) {
			var r = this.value[0][x].compare( obj_tag.value[0][x] );
			if( r != 0 ) {
				return r*2;
			}
		}
		if(state==0) for(var x = 0; x < this.value[1].length;x++) {
			var r = this.value[0][x].compare( obj_tag.value[1][x] )
			if( r != 0 ) {
				return r*4;
			}
		}
		if(state==0) for(var x = 0; x < this.value[2].length;x++) {
			var r = this.value[0][x].compare( obj_tag.value[2][x] )
			if( r != 0 ) {
				return r*8;
			}
		}
		if(state==0) {
			return 0;
		}
	}
	return 0;
}
/*

// SAMPLE
var t = new ObjTag("rule",{value:1});
t.$.data = 10;
t.commit();
console.log(JSON.stringify(t));

*/
