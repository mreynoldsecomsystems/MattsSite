
var editor = {
    version: "1.0.0",
    commands: {},
    dom: {},
    toolbar: {},
    browser: {},
    INVISIBLE_SPACE: "\uFEFF",
    _editorID: '',
    _disabledControls: {},
    controls: {
        fontStyle: {
            underline: '',
            bold: '',
            italic: ''
        },
        fontFamily: '',
        foreColor: '',
        fontSize: '',
        allignment: {
            left: '',
            center: '',
            right: '',
            justified: ''
        },
        list: {
            orderedList: '',
            unorderedList: ''
        },
        link: {
            textLink: '',
            imageLink: ''
        }
    },
    EMPTY_FUNCTION: function () { },

    ELEMENT_NODE: 1,
    TEXT_NODE: 3,

    BACKSPACE_KEY: 8,
    ENTER_KEY: 13,
    ESCAPE_KEY: 27,
    SPACE_KEY: 32,
    DELETE_KEY: 46
}

var Base = function () { };
Base.extend = function (_instance, _static) {
    var extend = Base.prototype.extend;

    // build the prototype
    Base._prototyping = true;
    var proto = new this;
    extend.call(proto, _instance);
    proto.base = function () {
        // call this method from any other method to invoke that method's ancestor
    };
    delete Base._prototyping;

    // create the wrapper for the constructor function
    //var constructor = proto.constructor.valueOf(); //-dean
    var constructor = proto.constructor;
    var klass = proto.constructor = function () {
        if (!Base._prototyping) {
            if (this._constructing || this.constructor == klass) { // instantiation
                this._constructing = true;
                constructor.apply(this, arguments);
                delete this._constructing;
            } else if (arguments[0] != null) { // casting
                return (arguments[0].extend || extend).call(arguments[0], proto);
            }
        }
    };

    // build the class interface
    klass.ancestor = this;
    klass.extend = this.extend;
    klass.forEach = this.forEach;
    klass.implement = this.implement;
    klass.prototype = proto;
    klass.toString = this.toString;
    klass.valueOf = function (type) {
        //return (type == "object") ? klass : constructor; //-dean
        return (type == "object") ? klass : constructor.valueOf();
    };
    extend.call(klass, _static);
    // class initialisation
    if (typeof klass.init == "function") klass.init();
    return klass;
};

Base.prototype = {
    extend: function (source, value) {
        if (arguments.length > 1) { // extending with a name/value pair
            var ancestor = this[source];
            if (ancestor && (typeof value == "function") && // overriding a method?
                // the valueOf() comparison is to avoid circular references
				(!ancestor.valueOf || ancestor.valueOf() != value.valueOf()) &&
				/\bbase\b/.test(value)) {
                // get the underlying method
                var method = value.valueOf();
                // override
                value = function () {
                    var previous = this.base || Base.prototype.base;
                    this.base = ancestor;
                    var returnValue = method.apply(this, arguments);
                    this.base = previous;
                    return returnValue;
                };
                // point to the underlying method
                value.valueOf = function (type) {
                    return (type == "object") ? value : method;
                };
                value.toString = Base.toString;
            }
            this[source] = value;
        } else if (source) { // extending with an object literal
            var extend = Base.prototype.extend;
            // if this object has a customised extend method then use it
            if (!Base._prototyping && typeof this != "function") {
                extend = this.extend || extend;
            }
            var proto = { toSource: null };
            // do the "toString" and other methods manually
            var hidden = ["constructor", "toString", "valueOf"];
            // if we are prototyping then include the constructor
            var i = Base._prototyping ? 0 : 1;
            while (key = hidden[i++]) {
                if (source[key] != proto[key]) {
                    extend.call(this, key, source[key]);

                }
            }
            // copy each of the source object's properties to this object
            for (var key in source) {
                if (!proto[key]) extend.call(this, key, source[key]);
            }
        }
        return this;
    }
};

Base = Base.extend({
    constructor: function () {
        this.extend(arguments[0]);
    }
},
{
    ancestor: Object,
    version: "1.1",

    forEach: function (object, block, context) {
        for (var key in object) {
            if (this.prototype[key] === undefined) {
                block.call(context, object[key], key, object);
            }
        }
    },

    implement: function () {
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] == "function") {
                // if it's a function, call it
                arguments[i](this.prototype);
            } else {
                // add the interface using the extend method
                this.prototype.extend(arguments[i]);
            }
        }
        return this;
    },

    toString: function () {
        return String(this.valueOf());
    }
});

var _makeEditorArea = function (editorID, browserType) {
    var eTextArea = $(editorID);
    eTextArea.hide();
    var toolbar = document.createElement("div");
    toolbar.id = "toolbox";
    toolbar.style.height = "35px";

    var fontStyles = "<span id='fontStyle' style='display: inline-block;'>" +
                     "<input type='checkbox' id='bold' /><label for='bold'><b>B</b></label>" +
                     "<input type='checkbox' id='italic' /><label for='italic'><i>I</i></label>" +
                     "<input type='checkbox' id='underline' /><label for='underline'><u>U</u></label>" +
                     "</span>";
    var fontSize = '<span>' +
                   '<button id="fontSizeText">Default Size</button>' +
                   '<button id="fontSizeSelect" onclick="stayFocused">Select a font size</button>' +
                   '</span>' +
                   '<ul id="fontSize" style="width: 115px; max-height: 200px; overflow-x: scroll;">' +
                   '<li><a href="#">6</a></li>' +
                   '<li><a href="#">7</a></li>' +
                   '<li><a href="#">8</a></li>' +
                   '<li><a href="#">9</a></li>' +
                   '<li><a href="#">10</a></li>' +
                   '<li><a href="#">11</a></li>' +
                   '<li><a href="#">12</a></li>' +
                   '<li><a href="#">13</a></li>' +
                   '<li><a href="#">14</a></li>' +
                   '<li><a href="#">15</a></li>' +
                   '<li><a href="#">16</a></li>' +
                   '<li><a href="#">17</a></li>' +
                   '<li><a href="#">18</a></li>' +
                   '<li><a href="#">20</a></li>' +
                   '<li><a href="#">21</a></li>' +
                   '<li><a href="#">22</a></li>' +
                   '<li><a href="#">23</a></li>' +
                   '<li><a href="#">24</a></li>' +
                   '<li><a href="#">25</a></li>' +
                   '<li><a href="#">26</a></li>' +
                   '</ul>';
    var fontFam = '<span>' +
            '<button id="fontFamText">Default Font</button>' +
            '<button id="fontFamSelect">Select a font family</button>' +
        '</span>' +
        '<ul id="fontFam" style="max-height: 200px; max-width: 200px; overflow-x: auto;">' +
        '<li><a href="#" style="font-family: "Economica", sans-serif;" fontname=""Economica", sans-serif">Economica</a></li>' +
        '<li><a href="#" style="font-family: "Quintessential", cursive;" fontname=""Quintessential", cursive">Quintessential</a></li>' +
        '<li><a href="#" style="font-family: "Anaheim", sans-serif;" fontname=""Anaheim", sans-serif">Anaheim</a></li>' +
        '<li><a href="#" style="font-family: "Bad Script", cursive;" fontname=""Bad Script", cursive">Bad Script</a></li>' +
        '<li><a href="#" style="font-family: "Arimo", sans-serif;" fontname=""Arimo", sans-serif">Arimo</a></li>' +
        '<li><a href="#" style="font-family: "Frijole", cursive;" fontname=""Frijole", cursive">Frijole</a></li>' +
        '<li><a href="#" style="font-family: "Source Code Pro", sans-serif;" fontname=""Source Code Pro", sans-serif">Source Code Pro</a></li>' +
        '<li><a href="#" style="font-family: "Gloria Hallelujah", cursive;" fontname=""Gloria Hallelujah", cursive">Gloria Hallelujah</a></li>' +
        '<li><a href="#" style="font-family: "Calligraffitti", cursive;" fontname=""Calligraffitti", cursive">Calligraffitti</a></li>' +
        '<li><a href="#" style="font-family: "Clicker Script", cursive;" fontname=""Clicker Script", cursive">Clicker Script</a></li>' +
        '<li><a href="#" style="font-family: "Fjalla One", sans-serif;" fontname=""Fjalla One", sans-serif">Fjalla Ona</a></li>' +
        '<li><a href="#" style="font-family: "Geo", sans-serif;" fontname=""Geo", sans-serif">Geo</a></li>' +
        '<li><a href="#" style="font-family: "Open Sans", sans-serif;" fontname=""Open Sans", sans-serif">Open Sans</a></li>' +
        '<li><a href="#" style="font-family: "Roboto Condensed", sans-serif;" fontname=""Roboto Condensed", sans-serif">Roboto Condensed</a></li>' +
        '<li><a href="#" style="font-family: "Cuprum", sans-serif;" fontname=""Cuprum", sans-serif">Cuprum</a></li>' +
        '<li><a href="#" style="font-family: "Ewert", cursive;" fontname=""Ewert", cursive">Ewert</a></li>' +
        '<li><a href="#" style="font-family: "Marvel", sans-serif;" fontname=""Marvel", sans-serif">Marvel</a></li>' +
        '<li><a href="#" style="font-family: "Maven Pro", sans-serif;" fontname=""Maven Pro", sans-serif">Maven Pro</a></li>' +
        '<li><a href="#" style="font-family: "Nothing You Could Do", cursive;" fontname=""Nothing You Could Do", cursive">Nothing you could do</a></li>' +
        '<li><a href="#" style="font-family: "Dawning of a New Day", cursive;" fontname=""Dawning of a New Day", cursive">Dawning of a New Day</a></li>' +
        '<li><a href="#" style="font-family: "Advent Pro", sans-serif;" fontname=""Advent Pro", sans-serif">Advent Pro</a></li>' +
        '</ul>';
    var controls = fontStyles + fontSize + fontFam;
    $(toolbar).html(controls);
    var eDiv = document.createElement("div");
    eDiv.id = "messageBox";
    $(eDiv).append(toolbar);
    var editableContent = "<div id='editableContent' contentEditable='true' style='width: 100%; height: 100%;' class='content-edit'></div>";
    $(eDiv).append(editableContent);



    $(eDiv).insertAfter(eTextArea);

    $("#toolbox").contents().click(function () {
        $("#editableContent").focus();
    });

    $("#fontSizeSelect").click(function () {
        $("#editableContent").focus();
    });

    $("#bold").button().click(function () {
        window.getSelection();
        document.execCommand("Bold", false, false);
    });

    $("#italic").button().click(function () {
        window.getSelection();
        document.execCommand("Italic", false, false);
    });

    $("#underline").button().click(function () {
        window.getSelection();
        document.execCommand("Underline", false, false);
    });

    $("#fontStyle").buttonset();

    $("#editableContent").keypress(function (e) {
        if (e.which == 13) {
            paragraph();
        }
    });

    $("#fontSizeText").button().click(function (evt) {

    }).next().button({
        text: false,
        icons: {
            primary: "ui-icon-triangle-1-s"
        }
    }).click(function () {
        stayFocused();
        var menu = $(this).parent().next().show().position({
            my: "left top",
            at: "left bottom",
            of: this.previousElementSibling,
            offset: "-45 0"
        });
        $(document).one("click", function () {
            $("#editableContent").focus();
            menu.hide();
        });
        return false;
    }).parent().buttonset().next().hide().menu();

    $("#fontSize").find("a").click(function (evt) {
        var size = $(evt.target).text() + "px";
        var selection = window.getSelection();
        var e = document.execCommand("FontSize", false, 7);
        var range = selection.getRangeAt(0);
        var parent = range.commonAncestorContainer.parentNode;
        if (range.commonAncestorContainer.id == "editableContent" || parent.id == "editableContent") {
            $("#editableContainer").children("font")[0].css("font-size", size);
        } else {
            range.commonAncestorContainer.style.fontSize = size;
        }

        $("#fontSizeText").children("span").text($(evt.target).text());
        //$(.commonAncestorContainer.parentNode.parentElement).css("font-size", size);
    });

    $("#fontFam").find("a").click(function (evt) {
        var font = $(evt.target).attr("fontName");
        var selection = window.getSelection();
        document.execCommand("FontName", false, font);
        $("#fontFamText").children("span").text(font.split(",")[0].split("'").join(""));
    });

    $("#fontFamText").button().click(function (evt) {

    }).next().button({
        text: false,
        icons: {
            primary: "ui-icon-triangle-1-s"
        }
    }).click(function () {
        var menu = $(this).parent().next().show().position({
            my: "left top",
            at: "left bottom",
            of: this.previousElementSibling
        });
        $(document).one("click", function () {
            menu.hide();
        });
        return false;
    }).parent().buttonset().next().hide().menu();

    $("#messageBox").resizable();
    $("#messageBox").resize(function () {
        $("#messageBox").css("padding-bottom", "45px");
    });

    $("#editableContent").focusout(function (evt) {
        var e = $(evt.target);

    });

    $("#editableContent").click(function (evt) {
        //$("#toolbox").show().position({
        //    my: "center top",
        //    at: "center top",
        //    of: this,
        //    offset: "-30 -35"
        //});
    });
    return;
};

(function ($) {
    var doc;
    if (window.getSelection) {
        doc = window.document;
    } else if (document.selection) {
        doc = document;
    }

    editor = Base.extend({
        init: function (id, disabledControls) {
            _editorID = editorID;
            var e = this, d = document, na = navigator, ua = na.userAgent, i, nl, n, base, p, v;

            e.isOpera = win.opera && opera.buildNumber;

            e.isWebKit = /WebKit/.test(ua);

            e.isIE = !e.isWebKit && !e.isOpera && (/MSIE/gi).test(ua) && (/Explorer/gi).test(na.appName);

            e.isIE6 = e.isIE && /MSIE [56]/.test(ua);
            if (e.isIE6) { e.browser == "IE6"; }

            e.isIE7 = e.isIE && /MSIE [7]/.test(ua);
            if (e.isIE7) { e.browser == "IE7"; }

            e.isIE8 = e.isIE && /MSIE [8]/.test(ua);
            if (e.isIE8) { e.browser == "IE8"; }

            e.isIE9 = e.isIE && /MSIE [9]/.test(ua);
            if (e.isIE9) { e.browser == "IE9"; }

            e.isIE10 = e.isIE && /MSIE [10]/.test(ua);
            if (e.isIE10) { e.browser == "IE10"; }

            e.isGecko = !e.isWebKit && /Gecko/.test(ua);
            if (e.isGecko) { e.browser == "Gecko"; }

            e.isMac = ua.indexOf('Mac') != -1;
            if (e.isMac) { e.browser == "Mac"; }

            e.isAir = /adobeair/i.test(ua);
            if (e.isAir) { e.browser == "AdobeAir"; }

            e.isIDevice = /(iPad|iPhone)/.test(ua);
            if (e.isIDevice) { e.browser == "iPhone_iPad"; }

            e.isIOS5 = e.isIDevice && ua.match(/AppleWebKit\/(\d*)/)[1] >= 534;
            if (e.isIOS5) { e.browser == "iOS5"; }

            _makeEditorArea(_editorID, e.browser);
        }
    }, false);

})(jQuery);



//var editor = (function (win) {
//    var _editorID;
//    var _makeEditorArea = function (editorID, browserType) {
//        var eTextArea = $(editorID);
//        eTextArea.hide();
//        var toolbar = document.createElement("div");
//        toolbar.id = "toolbox";
//        toolbar.style.height = "35px";

//        var fontStyles = "<span id='fontStyle' style='display: inline-block;'>" +
//                         "<input type='checkbox' id='bold' /><label for='bold'><b>B</b></label>" +
//                         "<input type='checkbox' id='italic' /><label for='italic'><i>I</i></label>" +
//                         "<input type='checkbox' id='underline' /><label for='underline'><u>U</u></label>" +
//                         "</span>";
//        var fontSize = '<span>' +
//                       '<button id="fontSizeText">Default Size</button>' +
//                       '<button id="fontSizeSelect" onclick="stayFocused">Select a font size</button>' +
//                       '</span>' +
//                       '<ul id="fontSize" style="width: 115px; max-height: 200px; overflow-x: scroll;">' +
//                       '<li><a href="#">6</a></li>' +
//                       '<li><a href="#">7</a></li>' +
//                       '<li><a href="#">8</a></li>' +
//                       '<li><a href="#">9</a></li>' +
//                       '<li><a href="#">10</a></li>' +
//                       '<li><a href="#">11</a></li>' +
//                       '<li><a href="#">12</a></li>' +
//                       '<li><a href="#">13</a></li>' +
//                       '<li><a href="#">14</a></li>' +
//                       '<li><a href="#">15</a></li>' +
//                       '<li><a href="#">16</a></li>' +
//                       '<li><a href="#">17</a></li>' +
//                       '<li><a href="#">18</a></li>' +
//                       '<li><a href="#">20</a></li>' +
//                       '<li><a href="#">21</a></li>' +
//                       '<li><a href="#">22</a></li>' +
//                       '<li><a href="#">23</a></li>' +
//                       '<li><a href="#">24</a></li>' +
//                       '<li><a href="#">25</a></li>' +
//                       '<li><a href="#">26</a></li>' +
//                       '</ul>';
//        var fontFam = '<span>' +
//                '<button id="fontFamText">Default Font</button>' +
//                '<button id="fontFamSelect">Select a font family</button>' +
//            '</span>' +
//            '<ul id="fontFam" style="max-height: 200px; max-width: 200px; overflow-x: auto;">' +
//            '<li><a href="#" style="font-family: "Economica", sans-serif;" fontname=""Economica", sans-serif">Economica</a></li>' +
//            '<li><a href="#" style="font-family: "Quintessential", cursive;" fontname=""Quintessential", cursive">Quintessential</a></li>' +
//            '<li><a href="#" style="font-family: "Anaheim", sans-serif;" fontname=""Anaheim", sans-serif">Anaheim</a></li>' +
//            '<li><a href="#" style="font-family: "Bad Script", cursive;" fontname=""Bad Script", cursive">Bad Script</a></li>' +
//            '<li><a href="#" style="font-family: "Arimo", sans-serif;" fontname=""Arimo", sans-serif">Arimo</a></li>' +
//            '<li><a href="#" style="font-family: "Frijole", cursive;" fontname=""Frijole", cursive">Frijole</a></li>' +
//            '<li><a href="#" style="font-family: "Source Code Pro", sans-serif;" fontname=""Source Code Pro", sans-serif">Source Code Pro</a></li>' +
//            '<li><a href="#" style="font-family: "Gloria Hallelujah", cursive;" fontname=""Gloria Hallelujah", cursive">Gloria Hallelujah</a></li>' +
//            '<li><a href="#" style="font-family: "Calligraffitti", cursive;" fontname=""Calligraffitti", cursive">Calligraffitti</a></li>' +
//            '<li><a href="#" style="font-family: "Clicker Script", cursive;" fontname=""Clicker Script", cursive">Clicker Script</a></li>' +
//            '<li><a href="#" style="font-family: "Fjalla One", sans-serif;" fontname=""Fjalla One", sans-serif">Fjalla Ona</a></li>' +
//            '<li><a href="#" style="font-family: "Geo", sans-serif;" fontname=""Geo", sans-serif">Geo</a></li>' +
//            '<li><a href="#" style="font-family: "Open Sans", sans-serif;" fontname=""Open Sans", sans-serif">Open Sans</a></li>' +
//            '<li><a href="#" style="font-family: "Roboto Condensed", sans-serif;" fontname=""Roboto Condensed", sans-serif">Roboto Condensed</a></li>' +
//            '<li><a href="#" style="font-family: "Cuprum", sans-serif;" fontname=""Cuprum", sans-serif">Cuprum</a></li>' +
//            '<li><a href="#" style="font-family: "Ewert", cursive;" fontname=""Ewert", cursive">Ewert</a></li>' +
//            '<li><a href="#" style="font-family: "Marvel", sans-serif;" fontname=""Marvel", sans-serif">Marvel</a></li>' +
//            '<li><a href="#" style="font-family: "Maven Pro", sans-serif;" fontname=""Maven Pro", sans-serif">Maven Pro</a></li>' +
//            '<li><a href="#" style="font-family: "Nothing You Could Do", cursive;" fontname=""Nothing You Could Do", cursive">Nothing you could do</a></li>' +
//            '<li><a href="#" style="font-family: "Dawning of a New Day", cursive;" fontname=""Dawning of a New Day", cursive">Dawning of a New Day</a></li>' +
//            '<li><a href="#" style="font-family: "Advent Pro", sans-serif;" fontname=""Advent Pro", sans-serif">Advent Pro</a></li>' +
//            '</ul>';
//        var controls = fontStyles + fontSize + fontFam;
//        $(toolbar).html(controls);
//        var eDiv = document.createElement("div");
//        eDiv.id = "messageBox";
//        $(eDiv).append(toolbar);
//        var editableContent = "<div id='editableContent' contentEditable='true' style='width: 100%; height: 100%;' class='content-edit'></div>";
//        $(eDiv).append(editableContent);



//        $(eDiv).insertAfter(eTextArea);

//        $("#toolbox").contents().click(function () {
//            $("#editableContent").focus();
//        });

//        $("#fontSizeSelect").click(function () {
//            $("#editableContent").focus();
//        });

//        $("#bold").button().click(function () {
//            window.getSelection();
//            document.execCommand("Bold", false, false);
//        });

//        $("#italic").button().click(function () {
//            window.getSelection();
//            document.execCommand("Italic", false, false);
//        });

//        $("#underline").button().click(function () {
//            window.getSelection();
//            document.execCommand("Underline", false, false);
//        });

//        $("#fontStyle").buttonset();

//        $("#editableContent").keypress(function (e) {
//            if (e.which == 13) {
//                paragraph();
//            }
//        });

//        $("#fontSizeText").button().click(function (evt) {

//        }).next().button({
//            text: false,
//            icons: {
//                primary: "ui-icon-triangle-1-s"
//            }
//        }).click(function () {
//            stayFocused();
//            var menu = $(this).parent().next().show().position({
//                my: "left top",
//                at: "left bottom",
//                of: this.previousElementSibling,
//                offset: "-45 0"
//            });
//            $(document).one("click", function () {
//                $("#editableContent").focus();
//                menu.hide();
//            });
//            return false;
//        }).parent().buttonset().next().hide().menu();

//        $("#fontSize").find("a").click(function (evt) {
//            var size = $(evt.target).text() + "px";
//            var selection = window.getSelection();
//            var e = document.execCommand("FontSize", false, 7);
//            var range = selection.getRangeAt(0);
//            var parent = range.commonAncestorContainer.parentNode;
//            if (range.commonAncestorContainer.id == "editableContent" || parent.id == "editableContent") {
//                $("#editableContainer").children("font")[0].css("font-size", size);
//            } else {
//                range.commonAncestorContainer.style.fontSize = size;
//            }

//            $("#fontSizeText").children("span").text($(evt.target).text());
//            //$(.commonAncestorContainer.parentNode.parentElement).css("font-size", size);
//        });

//        $("#fontFam").find("a").click(function (evt) {
//            var font = $(evt.target).attr("fontName");
//            var selection = window.getSelection();
//            document.execCommand("FontName", false, font);
//            $("#fontFamText").children("span").text(font.split(",")[0].split("'").join(""));
//        });

//        $("#fontFamText").button().click(function (evt) {

//        }).next().button({
//            text: false,
//            icons: {
//                primary: "ui-icon-triangle-1-s"
//            }
//        }).click(function () {
//            var menu = $(this).parent().next().show().position({
//                my: "left top",
//                at: "left bottom",
//                of: this.previousElementSibling
//            });
//            $(document).one("click", function () {
//                menu.hide();
//            });
//            return false;
//        }).parent().buttonset().next().hide().menu();

//        $("#messageBox").resizable();
//        $("#messageBox").resize(function () {
//            $("#messageBox").css("padding-bottom", "45px");
//        });

//        $("#editableContent").focusout(function (evt) {
//            var e = $(evt.target);

//        });

//        $("#editableContent").click(function (evt) {
//            //$("#toolbox").show().position({
//            //    my: "center top",
//            //    at: "center top",
//            //    of: this,
//            //    offset: "-30 -35"
//            //});
//        });
//        return;
//    };

//    return {
//        browser: '',
//        init: function (editorID) {
//            _editorID = editorID;
//            var e = this, d = document, na = navigator, ua = na.userAgent, i, nl, n, base, p, v;

//            e.isOpera = win.opera && opera.buildNumber;

//            e.isWebKit = /WebKit/.test(ua);

//            e.isIE = !e.isWebKit && !e.isOpera && (/MSIE/gi).test(ua) && (/Explorer/gi).test(na.appName);

//            e.isIE6 = e.isIE && /MSIE [56]/.test(ua);
//            if (e.isIE6) { e.browser == "IE6"; }

//            e.isIE7 = e.isIE && /MSIE [7]/.test(ua);
//            if (e.isIE7) { e.browser == "IE7"; }

//            e.isIE8 = e.isIE && /MSIE [8]/.test(ua);
//            if (e.isIE8) { e.browser == "IE8"; }

//            e.isIE9 = e.isIE && /MSIE [9]/.test(ua);
//            if (e.isIE9) { e.browser == "IE9"; }

//            e.isIE10 = e.isIE && /MSIE [10]/.test(ua);
//            if (e.isIE10) { e.browser == "IE10"; }

//            e.isGecko = !e.isWebKit && /Gecko/.test(ua);
//            if (e.isGecko) { e.browser == "Gecko"; }

//            e.isMac = ua.indexOf('Mac') != -1;
//            if (e.isMac) { e.browser == "Mac"; }

//            e.isAir = /adobeair/i.test(ua);
//            if (e.isAir) { e.browser == "AdobeAir"; }

//            e.isIDevice = /(iPad|iPhone)/.test(ua);
//            if (e.isIDevice) { e.browser == "iPhone_iPad"; }

//            e.isIOS5 = e.isIDevice && ua.match(/AppleWebKit\/(\d*)/)[1] >= 534;
//            if (e.isIOS5) { e.browser == "iOS5"; }

//            _makeEditorArea(_editorID, e.browser)
//        }        

//    }

//    win.editor = editor;
//    return;

//})(window);

