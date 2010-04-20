/*
---
description: Generates a class that lazily loads the real class on first instantiation
license: LGPL
authors: ['Michael Ficarra']
requires: [Core,Array,Class,Options,Events]
provides: [LazyClass]
... */



var LazyClass = new Class({
	Implements: [Options,Events],
	options: {
		path: './{class}.js'
	},

	initialize: function(klass,options){
		this.klass = klass;
		this.setOptions(options||{});
		var that = this;
		return new Class(function(){
			that.load();
			var constructor = 'new '+klass+'(';
			for(var i=0; i<arguments.length; i++) {
				if(i>0) constructor += ',';
				constructor += 'arguments['+i+']';
			}
			constructor += ')';
			return eval(constructor);
		});
	},

	load: function(){
		new Request({
			method: 'get',
			url: this.options.path.substitute({'class':this.klass}),
			async: false,
			onFailure: function(xhr){
				this.fireEvent('failure');
			}.bind(this),
			onSuccess: function(js){
				eval(js);
				this.fireEvent('load',window[this.klass]);
			}.bind(this)
		}).send();
		return window[this.klass];
	}
});

LazyClass.prepare = function(){
	var args = $A(arguments),
		options = {};
	if(['object','hash'].contains($type(args.getLast()))) {
		options = args.getLast();
		args = args.slice(0,-1);
	}
	if($type(arguments[0])=='array') args = arguments[0];
	args.each(function(klass){
		window[klass] = new this(klass,options);
	},this);
};

/* Copyright 2010 Michael Ficarra
This program is distributed under the (very open)
terms of the GNU Lesser General Public License */
