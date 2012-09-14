 (function ($) {

  //Initialize our default options.
  var _options = {
    url : function () {
        //Base url for calling to resource files.
        return null;
    },
    baseUrl : function () {
        //TODO:  In the future make a reasonable attempt to guess this.
        return null;
    }
    dataFormat : function () {
        //Only json is supported for now.
        return 'json';
    },
    data : function () {
        //Cached data from last call to look up
        return null;
    },
    lang : function () {
        nav = window.navigator;
        if (nav) {
            return nav.language.toLowerCase() || nav.userLanguage.toLowerCase() || nav.browserLanguage.toLowerCase() || "en-us";
        }
        else {
            return "en-US";
        }
    }, //Determines how content is written to the DOM.
        writeType : "prepend"
    };

  function setInternals(opts) {
        _options.url = opts.url || options.url;
        _options.baseUrl = opts.baseUrl || _options.baseUrl;
        //leave this commented for now until support for other formats is there.
        // _options.dataFormat = opts.dataFormat || _options.baseUrl;
        _options.lang = opts.lang || _options.lang;
  }

  function translateElement(data) {
    if (this.hasAttr('data-l10n')) {
        var v = this.attr('data-l10n');
    }
    else {
        $.error(this.toString() + " has no jql10n attribute ('data-jql10n')");
    }
  }

  function translatePage(data) {
  $('[data-l10n]').each(function () {
                            var v = $(this).attr('data-l10n');
                            //Try to find the resource first
                            var l = data.v;
                            if (typeof l !== 'undefined') {
                                if (_options.writeType == "prepend") {
                                    $(this).prepend(l);
                                }
                                else if (_options.writeType == "append") {
                                    $(this).append(l);
                                }
                                else {
                                    $(this).html(l);
                                }
                            }
                    });
  }

  function _throwError(data, jqxhr) {
  $.error("Error retreiving resources from server.  Server response " + jqxhr);
  }
  
  function __callServer(callback) {
  var callbase = _options.baseUrl || "";
  var fullurl = callbase + _options.suffixUrl;
  $.ajax({
         url: fullurl,
         data: _options.data,
         dataType: _options.dataFormat,
         success: callback,
         error: _throwError
         });
  }

  var methods = {
    init : function(options) {
    //Translates the whole page
    
    },
    translate : function(options) {
        //Translates element in context, or dies trying.
        
    }
    set : function(options) {
    //Sets options for future use.
    }
  }

  $.fn.jql10n = function (method, options) {
  if(  methods.method ) {
  return methods.method.apply(this, options);
  }
  else if ( typeof method === 'object' || ! method) {
  return methods.init.apply(this,options );
  }
  else {
  $.error('Method ' + method + ' not supported by jql10n');
  }
  return this;
  }
  })(jQuery);
