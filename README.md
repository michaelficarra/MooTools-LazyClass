Footnotes
=========

Generates a class that lazily fetches and loads the real class on
first instantiation. Provides an extremely minimal and seamless API
that should require no changes to existing code in most situations.


How To Use
----------

Instantiate a new `LazyClass` by passing its constructor the name of
the class to generate.

	var TestClass = new LazyClass('TestClass');

A nearly empty class will be generated and assigned to TestClass.
This is called the "prepared" state. The real class has not been
loaded yet, but TestClass may be used just as if it has. On the first
attempt to instantiate a TestClass instance, the class will be
fetched with an XmlHttpRequest. TestClass will be redifined and
replaced with the real TestClass, and the initial request for an
instance of TestClass will return an instance of the real TestClass.

	new TestClass('abc',123);

### load
On-demand load. If the class has been prepared already but not
instantiated and the user decides they need the class to be loaded
now, `load()` will pull the source of the prepared class and replace
the reference to it with the real one. This is most useful for
accessing class methods, which will not exist in the prepared class,
nor load the class when an attempt is made to call them (unless
explicitly defined in the options).

	TestClass = TestClass.load();
	// or just
	TestClass.load();

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

### path *(default: "./{class}.js")*

### scope *(default: window)*

### classMethods *(default: [])*



Known Issues
------------

Due to the same-origin policy on the XmlHttpRequest object, classes
need to be served from the same domain as the page running the
javascript. Manipulation of `document.domain` can allow classes to be
loaded from different domains that share a [second-level domain](http://en.wikipedia.org/wiki/Second-level_domain)
for now. This should be good enough for most problems.

There are some hack workarounds for this, and a solution is planned.
Suggestions or contributions are welcome. Note that the method used
must synchronously request, download, and execute javascript from a
remote host (preferably without same-origin restrictions), so a
simple solution like [Utilities.Assets.javascript](http://mootools.net/docs/more/Utilities/Assets#Asset:javascript)
will not work.


Additional Info
---------------

I am always open for feature requests or any feedback.
I can be reached at [Github](http://github.com/michaelficarra).
