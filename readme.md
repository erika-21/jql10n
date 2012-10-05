jql10n 
=====

jql10n is a Jquery plugin that provides an intuitive way to load localization resources from the server and automatically maps them to data-l10n attributes on the page. Alternatively, it can also translate selected elements.  Note this plugin does not do any actual translation or encoding, but rather assists in the loading of localized resources from the server.  Additionally, the resources are cached for future lookups and can even be used to load attributes of DOM elements.

Usage
=====

Translation is provided in one of two ways:  Globally or within a certain context.  So, for example, suppose you want to translate an entire page all at once.  This can be accomplished simply by putting the following on the page (preferrably near the bottom):

<code>$.jql10n({ path: 'path/to/resources/'});</code>


This will make an asynchronous GET call to the server to grab resources and send additional parameters, discussed below, in case additional server side evaluation is needed.  It also can take just a straight json file, assuming its permitted serveable content by your web server.  Currently, only JSON data is supported.

Once the data is loaded, it will then map all attributes that have a data-jql10n attribute to the key value in the resource list, and will load the value of this into html.  The exception to this is if the value is another object, in which case it maps the keys to the attributes of the element and the value will be what the attribute is supposed to be.  To help from melting your brain due to that poor explanation, consider this example: say we have an anchor, '<a data-jql10n="element" href="http://google.com" rel="Google for everyone!">Its Google!</a>', and we call '$.jql0n();' and get the following resource from the server:

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