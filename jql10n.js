(function ( $ ) {
   
    //Initialize our default options.
    var _options = {
        path: "",
        dataFormat: //Only json is supported for now.
                                                'json',
        data: function () {
            //Cached data from last call to look up. this is where we keep resources
            return null;
        },
        //flag to bypass the cached data if it exists and redownload from server.
        overwriteData: false,
        lang: function () {
            nav = window.navigator;
            var langtouse;
            if (nav) {
                langtouse = nav.language || nav.userLanguage || nav.browserLanguage || "en-us";;
            }
            else {
                langtouse = "en-us";
            }
            return langtouse.toLowerCase();
        },
        //our query parameters.
        queryData: {},
        //Determines how content is written to the DOM.
        writeType: "other"
    };
 
    function storeData(data) {
        _options.data = data || _options.data;
    }
 
    //Translates based off of write settings
    function translator(elem, val) {
        if (_options.writeType == "prepend") {
            $(elem).prepend(val);
        }
        else if (_options.writeType == "append") {
            $(elem).append(val);
        }
        else {
            $(elem).html(val);
        }
    }
 
    function setOptions(opt) {
        //set properties of options from parameter
        for (o in opt) {
            if (!( typeof _options[o]  in ['undefined', 'object'] )) {
                _options[o] = opt[o];
            }
            //extend if this object is a subobject (i.e. queryData)
            else if (typeof _options.o === 'object' &&
                (typeof o === 'object' && o !== null)) {
                $.extend(_options.o, o);
            }
        }
        //Initialize language if it hasn't already been set.
        if (typeof _options.lang === 'function') {
            _options.lang = _options.lang();
        }
        //initialize language in querData if it hasn't been set yet
        _options.queryData.lang = _options.queryData.lang || _options.lang;
    }
 
    function translateElement(data) {
        rdata = data || _options.data;
        var rstring = null;
        if ($(this).attr('data-l10n')) {
            var v = $(this).attr('data-l10n');
            rstring = rdata[v];
        }
        else {
            rstring = rdata[$(this).attr('id')];
        }
        if (rstring !== undefined) {
            translator(this, rstring);
        }
        if (rdata !== _options.data) {
            storeData(rdata);
        }
    }
 
    function translatePage(data) {
        rdata = data || _options.data;
        $('[data-l10n]').each(function () {
            var v = $(this).attr('data-l10n');
            //Try to find the resource first
            var l = rdata[v];
            if (l !== undefined) {
                translator(this, l); //not sure if context remains in scope when passed to different functions.
            }
        });
        if (rdata !== _options.data) {
            storeData(rdata);
        }
    }
 
    function _throwError(data, jqxhr) {
        $.error("Error retreiving resources from server.  Server response " + jqxhr);
    }
               
    function __callServer(callback, ctx) {
        //set context if it needs to be set.
        if (ctx) {
            callback = $.proxy(callback, ctx);
        }
        if (_options.overwriteData || typeof _options.data === 'function') {
            $.ajax({
                url: _options.path,
                data: _options.queryData,
                dataType: _options.dataFormat,
                success: callback,
                error: _throwError
            });
        }
        else {
            callback();
        }
    }
               
    var methods = {
        init: function (options) {
            //Have to parse from array, older browsers don't support array like objects as arguments
            //in prototype apply method.
            setOptions(options);
            //Translates the whole page
            __callServer(translatePage);
        },
        translate: function (options) {
            setOptions(options);
            //Translates element in context, or dies trying.  Gotta make sure the right context is passed on this one.
            __callServer(translateElement, this);
        },
        get: function (options) {
            setOptions(options);
            __callServer(storeData);
        },
        set: function (options) {
            setOptions(options);
        }
    };
   
    //Add to jquery namespace.
    $.extend({
        jql10n: function (method, options) {
            if (methods.method) {
                //Weirdness of older browsers disallows array like objects from being passed in,
                //but when parsed become array like objects.  Whiskey Tango Foxtrot.
                return methods.method.apply(this, new Array(options));
            }
            else if (typeof method === 'object') {
                return methods.init.apply(this, new Array(method));
            }
            else {
                $.error('Method ' + method + ' not supported by jql10n');
            }
            return this;
        }
    });
 
    //called when chained to other elements/jquery functions.
    $.fn.jql10n = function (options) {
        var translatecall = methods.translate;
        if (options) {
            //see above for why we explicity pass options as array.
            return translatecall.apply(this, new Array(options));
        }
        else {
            return translatecall.apply(this);
        }
    };
 
})( jQuery );