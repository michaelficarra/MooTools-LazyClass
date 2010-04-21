Footnotes
=========

Generates a class that lazily fetches and loads the real class on
first instantiation. Provides an extremely minimal and seamless API
that should require no changes to existing code in most situations.


How To Use
----------

Instantiate a new `LazyClass` by passing its constructor the name of
the class to generate.

	var ClassName = new LazyClass('ClassName');

A nearly empty class will be generated and assigned to ClassName.
This is called the "prepared" state. The real class has not been
loaded yet, but ClassName may be used just as if it has. On the first
attempt to instantiate a ClassName instance, the class will be
fetched with an XmlHttpRequest. ClassName will be redifined and
replaced with the real ClassName, and the initial request for an
instance of ClassName will return an instance of the real ClassName.

	new ClassName('abc',123);

### load
On-demand load. If the class has been prepared already but not
instantiated and the user decides they need the class to be loaded
now, `load()` will pull the source of the prepared class and replace
the reference to it with the real one. This is most useful for
accessing class methods, which will not exist in the prepared class,
nor load the class when an attempt is made to call them (unless
explicitly defined in the options).

	ClassName = ClassName.load();
	// or just
	ClassName.load();

### LazyClass.prepare
A utility class method that creates prepared classes for each of the
passed Strings and defines them in the given scope (or window by
default).

	LazyClass.prepare('ClassName0','ClassName1','ClassName2');
	new ClassName0('some','args'); //causes class to be loaded

Arguments can also be given as an array. An options object may be
provided as the final parameter regardless.

	var classes = ['ClassName0','ClassName1','ClassName2'];
	var options = {
		path: '/js/{class}.class.js',
		scope: window.my.scope.obj
	};
	LazyClass.prepare(classes,options);


Options
-------

All options passed to LazyClass.prepare are passed straight through
to the LazyClass constructor for each class given to it. This is
useful for using the same options to prepare many classes.

### path *(default: "./{class}.js")*
A relative or absolute path to the source of the class to prepare.
`{class}` will be replaced with the String that was provided as the
class name. If the class was stored in the "js" folder in the root
directory of the web server and was of the extension ".class.js", use
the path option as show below.

	var ClassName = LazyClass('ClassName',{path:'/js/{class}.class.js'});

### scope *(default: window)*
The scope into which the class will be assigned and from which it
will be accessed.

	window.personalScope = {}
	var classes = ['ClassName0','ClassName1','ClassName2'];
	LazyClass.prepare(classes,{scope:window.personalScope});
	new personalScope.className2(0,1,2,3,4,5,6,7,8,9,'abc','def');

### classMethods *(default: [])*
Allows the class to be lazily loaded on a call of any of the given
class methods. In the following example, `classMethod` will invoke
the loading process and then return the return value of the real
class method.

	new LazyClass('ClassName',{classMethods:'classMethod'});
	ClassName.classMethod(7,8,9);


Known Issues
------------

Due to the same-origin policy on the XmlHttpRequest object, classes
need to be served from the same domain as the page running the
javascript. Manipulation of `document.domain` can allow classes to be
loaded from different domains that share a [second-level domain](http://en.wikipedia.org/wiki/Second-level_domain)
for now. This should be good enough for most problems.

There are some workarounds for this (most of which are gigantic
hacks), and a proper solution is planned. Suggestions or
contributions are welcome. Note that the method used must
synchronously request, download, and execute javascript from a remote
host (preferably without same-origin restrictions), so a simple
solution like [Utilities.Assets.javascript](http://mootools.net/docs/more/Utilities/Assets#Asset:javascript)
will not work.


Additional Info
---------------

I am always open for feature requests or any feedback.
I can be reached at [Github](http://github.com/michaelficarra).
