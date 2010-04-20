/*
---
description: Generates a class that lazily loads the real class on first instantiation
license: LGPL
authors: ['Michael Ficarra']
requires: [Core,Array,Class,Options,Events,Utilities.Assets]
provides: [LazyClass]
... */

var LazyClass = new Class({
	Implements: [Options,Events],
	options: {
		path: '{class}.js'
	},

	initialize: function(klass,options){
		this.klass = klass;
		this.setOptions(options||{});
		var that = this;
		return new Class(function(){
			var klass = that.load();
			return new klass(arguments);
		});
	},

	load: function(){
		new Asset.javascript(
			this.options.path.substitute({'class':this.klass}),
			{
				onload: function(){
					this.fireEvent('load',window[this.klass])
				}
			}
		);
		return window[this.klass];
	}
});

/* Copyright 2010 Michael Ficarra
This program is distributed under the (very open)
terms of the GNU Lesser General Public License */
