/*
---
description: Generates a class that lazily loads the real class on first instantiation
license: LGPL
authors: ['Michael Ficarra']
requires: [Core,Array,Class,Options,Events,Request]
provides: [LazyClass]
... */

var LazyClass = new Class({
	Implements: [Options,Events],
	options: {
		path: './{class}.js',
		scope: window
	},

	initialize: function(klass,options){
		this.klass = klass;
		this.setOptions(options||{});
		var that = this;
		return new Class(function(){
			var klass = that.options.scope[that.klass];
			if(klass===undefined || klass===this.constructor) klass = that.load();
			var F = function(){};
			F.prototype = klass.prototype;
			var o = new F();
			klass.apply(o,$A(arguments));
			return o;
		});
	},

	load: function(){
		var klass,
			path = this.options.path.substitute({'class':this.klass});
		new Request({
			method: 'get',
			url: path,
			async: false,
			onFailure: function(xhr){
				/*var script = Asset.javascript(path,{
					onload: function(){
						
					}
				});*/
			}.bind(this),
			onSuccess: function(js){
				(new Function(js)).call(this.options.scope);
				klass = this.options.scope[this.klass] || window[this.klass]
				this.options.scope[this.klass] = klass;
				this.fireEvent('load',klass);
			}.bind(this)
		}).send();
		return klass;
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
		(options.scope || this.prototype.options.scope)[klass] = new this(klass,options);
	},this);
};

/* Copyright 2010 Michael Ficarra
This program is distributed under the (very open)
terms of the GNU Lesser General Public License */
