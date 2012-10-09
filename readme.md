jql10n 
=====

jql10n is a Jquery plugin that provides an intuitive way to load localization resources from the server and automatically maps them to data-l10n attributes on the page. Alternatively, it can also translate selected elements.  Note this plugin does not do any actual translation or encoding, but rather assists in the loading of localized resources from the server.  Additionally, the resources are cached for future lookups and can even be used to load attributes of DOM elements.

Usage
=====

<code>$.jql10n('method', options);</code>

Translation is provided in one of two ways:  Globally or within a certain context.  So, for example, suppose you want to translate an entire page all at once.  This can be accomplished simply by putting the following on the page (preferrably near the bottom):

<code>$.jql10n({ path: 'path/to/resources/'});</code>


This will make an asynchronous GET call to the server to grab resources and send additional parameters, discussed below, in case additional server side evaluation is needed.  It also can take just a straight json file, assuming its permitted serveable content by your web server.  Currently, only JSON data is supported.

Once the data is loaded, it will then map all attributes that have a data-jql10n attribute to the key value in the resource list, and will load the value of this into html.  The exception to this is if the value is another object, in which case it maps the keys to the attributes of the element and the value will be what the attribute is supposed to be.  To help from melting your brain due to that poor explanation, consider this example: say we have an anchor, \<a data-jql10n="element" href="http://google.com" rel="Google for everyone!">Its Google!\</a> and we call '$.jql0n();' and get the following resource from the server:

<code>
 element : { 
  href: 'http://google.mx',
  rel: 'Google para todos gente!',
  html: 'Es Google!'
}
</code>

Pardon the poor spanish.  What this will do is set the html to 'Es Google!', the href to http://google.mx, and the rel to 'Muchas Google para todos gente!' for the element that has a data-jql10n attribute.  

Also, in the event only a single element needs to be translated, this can be done via chaining:


<code> $('#element').jql10n({ path: 'path/to/'resource'});</code>

or just:

<code>$('#element').jql10n();</code>

if the lookup resource has been called in a previous query.  What this will do is search first in the resources for a key named in the data-jql10n attribute in the element, if none exists or the element does not have a data-jql10n attribute it will then search the resources for a key based off the elements ID.  

Supported Methods
=================

init
----

Default method when jql10n is called directly from the jquery namespace (i.e. $.jql10n()). Thus, calling this method explicitly is not necessary.  This works in the following steps:

1.  Grabs all content from the server, OR, if resources have been retrieved uses cached lookup file (currently only JSON format is supported).
2.  Maps key in lookup file to jql10n attribute.
3.  Replaces, appends, or prepends depending on the writeType option (explained below). 
4.  If the value of the lookup entry is another object, it will load the elements attributes by mapping the attribute to the key (i.e. val: {href: 'http://Google.mx'}).  In this case, if you want the actual HTML replaced as well, you must specify an html key in the object, and the same rules apply for writeType.

It repeats this for all elements that have data-jql10n attributes.  If no key is found for the attribute, it simply skips that element.

translate
---------

Default method when jql10n is called from the context of a jquery element, i.e. $('#element').jql10n().  This works identical to init, with one exception: if the data-jql10n attribute does not exist on the called element, it will also attempt to lookup the resource by the elements ID.

get
---

When this method is specified, jql10n will attempt to retrieve the resources from the server, cache them, and use it for future translations.  Note that when the resources are loaded into cache, and the resources get loaded from the server, the new lookup file will overwrite the existing cached data.

set
---

This method will simply set/override the default options for future jql10n calls. 

Options
=======

Regardless of the method that is called, there is always an options parameter that can be passed to assist jql10n.  The following is a description of each option that can be called.

path
----

Probably the most important parameter.  This is the URL to your localization resources. Currently only JSON is supported, but if theres enough uproar for XML data or JSONP to be supported I'll put in the work.  Other than that, this could be a server side script or a raw json file, as long as valid json is being returned as this makes no attempt to validate the json being passed to it, so handle with care.  (NOTE: This will change in future commits)

dataFormat
----------

As mentioned above, many times, only json is supported, don't bother setting this parameter.

overwriteData
-------------

This is a boolean flag that indicates wether, if a call was previously made to get resources, if another call should be made to overwrite the existing resources.  Default is false, so if for whatever reason you need to get new resources from the server after making the first call to the server, you MUST specify this parameter as true.

lang
----

This is, by default, the language specified by the browser in lower case (e.g. "es-mx" or 'en-us').  This parameter gets sent by default every time a call to the server is made as a GET parameter called 'lang', creatively.  This parameter can be overriden if a different language than what the browser specifies is needed.

queryData
---------

Object that contains parameters to send to the server when retreiving resources.  By default only 'lang' is sent, but if you require more parameters, you can specify them in key value format.

writeType
---------

string option that specifies how the resource should be loaded into the element.  By default, the content is overwritten, however two other options are available: 'prepend' and 'append'.  As you might have guessed by their names, prepend will inject the content before the existing content, whereas append will, well, append it to the existing content. 

Bugs
====

If you find bugs, too bad.  Just joking, you know what to do.  Also open to suggestions as to how to make jql10n awesome.



