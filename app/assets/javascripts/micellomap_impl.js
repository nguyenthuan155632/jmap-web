micello.maps.version = "0.5293";
micello.maps.PROTOCOL = "http";
if (location.protocol == "https:") {
    micello.maps.PROTOCOL = "https"
}
micello.maps.LEGACY_HOST_URL = micello.maps.PROTOCOL + "://mfs.micello.com";
micello.maps.MFS_HOST_URL = micello.maps.PROTOCOL + "://mfs.micello.com";
micello.maps.COM_SERVICE_URL = micello.maps.PROTOCOL + "://maps.micello.com/comdata";
micello.maps.NAV_PROP_MAP_URL = micello.maps.MFS_HOST_URL + "/ms/v1/mfile/meta/navpropmap/v5/Standard";
micello.maps.NAV_STRINGS_URL = micello.maps.MFS_HOST_URL + "/ms/v1/mfile/meta/strings/v5/nav/Standard";
micello.msgs = new Array();
micello.logDiv = null;
micello.log = function(a) {
    if (this.logDiv) {
        console.log(a);
        this.msgs.push(a);
        this.logDiv.innerHTML = a + "<br>" + this.logDiv.innerHTML
    }
};
micello.getScriptPath = function(a, f) {
    for (i = 0; i < a.length; i++) {
        var c = a[i].src;
        var b = c.length - f.length;
        if (c.substr(b) == f) {
            return c.substr(0, b)
        }
    }
    return null
};
micello.getScriptUrl = function() {
    var a = document.getElementsByTagName("script");
    var f = ["micellomap_impl.js", "combined.js", "micello.js", "micellomap.css"];
    var c;
    var b;
    for (c = 0; c < f.length; c++) {
        b = micello.getScriptPath(a, f[c]);
        if (b != null) {
            return b
        }
    }
    micello.maps.errorHandler("Error: api context not found!");
    return ""
};
micello.SCRIPT_URL = 'http://maps.micello.com/webmap/v0/v0.5293/';
if (!micello) {
    micello = {}
}
if (!micello.maps) {
    micello.mapstruct = {}
}
micello.maps.shapetype = {};
micello.maps.shapetype.NONE = 0;
micello.maps.shapetype.PATH = 2;
micello.maps.geomtype = {};
micello.maps.geomtype.NONE = 0;
micello.maps.geomtype.LINE = 1;
micello.maps.geomtype.AREA = 2;
micello.maps.geomtype.LINEAR_AREA = 3;
micello.maps.path = {};
micello.maps.path.MOVE_TO = 0;
micello.maps.path.LINE_TO = 1;
micello.maps.path.QUAD_TO = 2;
micello.maps.path.CUBE_TO = 3;
micello.maps.path.CLOSE = 4;
micello.maps.labeltype = {};
micello.maps.labeltype.NONE = 0;
micello.maps.labeltype.TEXT = 1;
micello.maps.labeltype.ICON = 2;
micello.maps.labeltype.IMAGE = 3;
micello.maps.labeltype.GEOM = 4;
micello.maps.markertype = {};
micello.maps.markertype.NONE = 0;
micello.maps.markertype.NAMED = 1;
micello.maps.markertype.IMAGE = 2;
micello.maps.popuptype = {};
micello.maps.popuptype.MENU = 1;
micello.maps.popuptype.INFOWINDOW = 2;
micello.maps.infoentrytype = {};
micello.maps.infoentrytype.PHONE = 1;
micello.maps.infoentrytype.EMAIL = 2;
micello.maps.infoentrytype.URL = 3;
micello.maps.infoentrytype.ADDRESS = 4;
micello.maps.infoentrytype.GENERAL = 5;
micello.maps.ZList = function(a) {
    this.head = {
        next: null,
        prev: null,
        list: a,
        zi: 0
    };
    this.iter = null
};
micello.maps.ZList.prototype.add = function(c) {
    if (c.zi == 0) {
        alert("illegal zindex");
        return
    }
    var f = this.head;
    var b = null;
    while ((f) && (f.zi < c.zi)) {
        b = f;
        f = f.next
    }
    if ((f) && (f.zi == c.zi)) {
        f.list.push(c)
    } else {
        var a = {
            next: f,
            prev: b,
            list: [c],
            zi: c.zi
        };
        if (b != null) {
            b.next = a
        } else {
            this.head = a
        }
        if (f != null) {
            f.prev = a
        }
    }
};
micello.maps.ZList.prototype.remove = function(f, b) {
    var j = this.head;
    var g;
    var a;
    var c;
    while (j) {
        if (j.zi != 0) {
            g = j.list;
            for (a = 0; a < g.length; a++) {
                c = g[a][b];
                if (f == c) {
                    var h = g[a];
                    g.splice(a, 1);
                    return h
                }
            }
        }
        j = j.next
    }
    return null
};
micello.maps.ZList.prototype.start = function() {
    this.iter = this.head
};
micello.maps.ZList.prototype.currentList = function() {
    if (this.iter) {
        return this.iter.list
    } else {
        return null
    }
};
micello.maps.ZList.prototype.currentZi = function() {
    if (this.iter) {
        return this.iter.zi
    } else {
        return null
    }
};
micello.maps.ZList.prototype.next = function() {
    if (this.iter) {
        this.iter = this.iter.next
    }
};
micello.maps.MapGUI = function(g, f) {
    this.mapControl = g;
    this.outsideContainer = document.getElementById(f);
    if (!this.outsideContainer) {
        alert("Map container not found");
        return
    }
    var b = document.createElement("div");
    b.setAttribute("id", "micello-map");
    b.style.position = "relative";
    b.style.display = "block";
    b.style.left = "0px";
    b.style.top = "0px";
    b.style.width = "100%";
    b.style.height = "100%";
    b.style.overflow = "hidden";
    b.style.outline = "0px none #ffffff";
    b.setAttribute("tabindex", -1);
    this.outsideContainer.appendChild(b);
    b.mapTarget = true;
    this.viewportElement = b;
    var a = document.createElement("div");
    a.style.position = "absolute";
    a.style.display = "block";
    a.style.left = "0px";
    a.style.top = "0px";
    a.style.overflow = "visible";
    micello.maps.MapGUI.detectTransformName(a);
    a.mapTarget = true;
    this.viewportElement.appendChild(a);
    this.mapElement = a;
    var c = this;
    b.onmousedown = function(h) {
        c.onMouseDown(h)
    };
    b.onmouseup = function(h) {
        c.onMouseUp(h)
    };
    b.onmousemove = function(h) {
        c.onMouseMove(h)
    };
    b.ontouchstart = function(h) {
        c.onTouchStart(h)
    };
    b.ontouchmove = function(h) {
        c.onTouchMove(h)
    };
    b.ontouchend = function(h) {
        c.onTouchEnd(h)
    };
    b.onkeydown = function(h) {
        c.onKeyDown(h)
    };
    b.onkeyup = function(h) {
        c.onKeyUp(h)
    };
    b.addEventListener("DOMMouseScroll", function(h) {
        c.onMouseWheel(h)
    }, false);
    b.addEventListener("mousewheel", function(h) {
        c.onMouseWheel(h)
    }, false);
    window.onresize = function() {
        c.onResize()
    };
    this.UI_FONT = "Arial";
    this.UI_FONT_FALLBACK = "Arial";
    this.ui = document.createElement("div");
    this.ui.setAttribute("id", "ui-all");
    this.ui.style.fontFamily = this.UI_FONT;
    this.ui.onmousemove = function(h) {
        c.conditionalUI()
    };
    this.ui.addEventListener("DOMMouseScroll", function(h) {
        c.onMouseWheel(h)
    }, false);
    this.ui.addEventListener("mousewheel", function(h) {
        c.onMouseWheel(h)
    }, false);
    this.viewportElement.appendChild(this.ui);
    this.UISections = new Array;
    this.grid = new Array("left top", "left center", "left bottom", "center top", "center center", "center bottom", "right top", "right center", "right bottom");
    this.gridDefaults = new Array();
    this.gridDefaults.name = "left top";
    this.gridDefaults.levels = "left top";
    this.gridDefaults.zoom = "center bottom";
    this.gridDefaults.compass = "right top";
    this.gridDefaults.geo = "right bottom";
    this.ui.name = null;
    this.NAME_VIEW = "conditional";
    this.NAME_POSITION = this.gridDefaults.name;
    this.NAME_COLOR = "#909090";
    this.DRAWING_COLOR = "#909090";
    this.DRAWING_BG = "#ffffff";
    this.DRAWING_ACTIVE_BG = "#006bb7";
    this.DRAWING_ACTIVE_COLOR = "#ffffff";
    this.DRAWING_HOVER_BG = "#f5f4f4";
    this.DRAWING_HOVER_COLOR = "#909090";
    this.ui.drawings = {};
    this.ui.zoom = null;
    this.ZOOM_VIEW = "conditional";
    this.ZOOM_POSITION = this.gridDefaults.zoom;
    this.ZOOM_COLOR = "#909090";
    this.ZOOM_BG = "#ffffff";
    this.ZOOM_BG_ACTIVE = "#006bb7";
    this.ZOOM_BG_ACTIVE_COLOR = "#ffffff";
    this.ZOOM_HOVER_BG_COLOR = "#f2f2f2";
    this.ZOOM_HOVER_COLOR = "#909090";
    this.ZOOM_DISPLAY = "h";
    this.ui.levels = null;
    this.LEVELS_VIEW = "conditional";
    this.LEVELS_POSITION = this.gridDefaults.levels;
    this.LEVELS_COLOR = "#909090";
    this.LEVELS_BG = "#ffffff";
    this.LEVELS_BG_ACTIVE = "#006bb7";
    this.LEVELS_ACTIVE_COLOR = "#fff";
    this.LEVELS_HOVER_BG_COLOR = "#f5f4f4";
    this.LEVELS_HOVER_COLOR = "#909090";
    this.ui.geo = null;
    this.GEO_VIEW = "conditional";
    this.GEO_SCALE_WIDTH = 55;
    this.GEO_UNITS = "standard";
    this.GEO_POSITION = this.gridDefaults.geo;
    this.GEO_UNITS_TOGGLE = "on";
    this.GEO_ORIENT_TOGGLE = "on";
    this.KEY_COMMANDS = true;
    this.ui.reg = {};
    this.activePinch = false;
    this.pinchCenter = null;
    this.pinchStartDistance = null;
    this.pinchEndDistance = null;
    this.pinchScale = null;
    this.backButton = null;
    this.backActive = false;
    this.createMouseShield();
    this.startX = 0;
    this.startY = 0;
    this.moveX = 0;
    this.moveY = 0;
    this.startPan = false;
    this.startZoom = false;
    this.startTarget = null;
    this.moved = false;
    this.lastTouch = null;
    this.conditionalAction = null;
    this.fadeInterval = new Array;
    this.fadeItems = new Array;
    this.heightMarker = new Array;
    this.widthMarker = new Array;
    this.data = null;
    this.view = null;
    this.mapCanvas = null
};
micello.maps.MapGUI.prototype.showLoading = function() {
    document.getElementById("micello-map").style.backgroundImage = "url('" + micello.maps.request.LOADING_URL + "')"
};
micello.maps.MapGUI.prototype.hideLoading = function() {
    document.getElementById("micello-map").style.backgroundImage = "none"
};
micello.maps.MapGUI.MOVE_LIMIT = 2;
micello.maps.MapGUI.CONTROL_ZINDEX = 101;
micello.maps.MapGUI.POPUP_ZINDEX = 110;
micello.maps.MapGUI.MIN_THRESHOLD = 400;
micello.maps.MapGUI.transformName = null;
micello.maps.MapGUI.originTransformName = null;
micello.maps.MapGUI.detectTransformName = function(a) {
    a.style.webkitTransform = "scale(1.0)";
    if (a.style.cssText.search("transform") >= 0) {
        micello.maps.MapGUI.setCssScale = micello.maps.MapGUI.setWebkitCssScale;
        micello.maps.MapGUI.setCssOrigin = micello.maps.MapGUI.setWebkitCssOrigin;
        return
    }
    if (a.style.MozTransform == "") {
        micello.maps.MapGUI.setCssScale = micello.maps.MapGUI.setMozCssScale;
        micello.maps.MapGUI.setCssOrigin = micello.maps.MapGUI.setMozCssOrigin;
        return
    }
    a.style.msTransform = "scale(1.0)";
    if (a.style.cssText.search("transform") >= 0) {
        micello.maps.MapGUI.setCssScale = micello.maps.MapGUI.setMsCssScale;
        micello.maps.MapGUI.setCssOrigin = micello.maps.MapGUI.setMsCssOrigin;
        return
    }
};
micello.maps.MapGUI.prototype.onResize = function() {
    var c = this.viewportElement.offsetWidth;
    var a = this.viewportElement.offsetHeight;
    if ((this.mapCanvas.lastViewportHeight != a) || (this.mapCanvas.lastViewportWidth != c)) {
        this.mapCanvas.drawMap()
    }
    var b = this.data.getCurrentDrawing();
    if (b) {
        this.createUI(b);
        var f = this.data.getCurrentLevel();
        this.UILevelsCorrection(f)
    }
};
micello.maps.MapGUI.prototype.onMouseDown = function(b) {
    var a = b.target;
    if ((!a) || (!a.mapTarget)) {
        return
    }
    b.cancelBubble = true;
    if (b.stopPropogation) {
        b.stopPropogation()
    }
    if (!this.view) {
        return
    }
    this.startTarget = a;
    this.shield.style.display = "block";
    this.startX = b.pageX;
    this.startY = b.pageY;
    this.startPan = true;
    this.startZoom = false;
    this.moveX = 0;
    this.moveY = 0;
    mapGui.fadeOut("ui-drawings")
};
micello.maps.MapGUI.prototype.onMouseUp = function(b) {
    startTarget = null;
    var a = b.target;
    if ((!a) || (!a.mapTarget)) {
        return
    }
    b.cancelBubble = true;
    if (b.stopPropogation) {
        b.stopPropogation()
    }
    this.shield.style.display = "none";
    if ((Math.abs(this.moveX) <= micello.maps.MapGUI.MOVE_LIMIT) && (Math.abs(this.moveY) <= micello.maps.MapGUI.MOVE_LIMIT)) {
        if (b.target.nodeName == "DIV" || b.target.nodeName == "CANVAS" || b.target.nodeName == "IMG") {
            startTarget = this.startTarget;
            this.fireMouseClick()
        }
    }
    this.startPan = false;
    this.startZoom = false;
    this.moved = false;
    this.startTarget = null
};
micello.maps.MapGUI.prototype.onMouseOut = function(b) {
    var a = b.target;
    if ((!a) || (!a.mapTarget)) {
        return
    }
    b.cancelBubble = true;
    if (b.stopPropogation) {
        b.stopPropogation()
    }
    if (this.moved) {
        this.startPan = false;
        this.moved = false
    }
};
micello.maps.MapGUI.prototype.onMouseMove = function(b) {
    var a = b.target;
    if ((!a) || (!a.mapTarget)) {
        return
    }
    b.cancelBubble = true;
    if (b.stopPropogation) {
        b.stopPropogation()
    }
    if (this.startPan) {
        this.view.translate(b.pageX - this.startX, b.pageY - this.startY);
        this.moveX += b.pageX - this.startX;
        this.moveY += b.pageY - this.startY;
        this.startX = b.pageX;
        this.startY = b.pageY;
        this.moved = true
    }
    this.conditionalUI()
};
micello.maps.MapGUI.prototype.onTouchStart = function(b) {
    var c = true;
    var a;
    for (a = 0; a < b.touches.length; a++) {
        if ((!b.touches[a].target) || (!b.touches[a].target.mapTarget)) {
            c = false
        }
    }
    if (b.touches.length == 1) {
        if (!c) {
            this.startPan = false;
            this.startZoom = false;
            return
        }
        b.preventDefault();
        this.startPan = true;
        this.startZoom = false;
        this.startX = b.touches[0].clientX;
        this.startY = b.touches[0].clientY;
        this.moveX = 0;
        this.moveY = 0;
        this.startTarget = b.touches[0].target;
        this.moved = false
    } else {
        if ((b.touches.length == 2) && (c)) {
            this.startPan = false;
            this.startZoom = true;
            this.startX = (b.touches[0].clientX + b.touches[1].clientX) / 2;
            this.startY = (b.touches[0].clientY + b.touches[1].clientY) / 2;
            this.moved = false
        } else {
            this.startPan = false;
            this.startZoom = false
        }
    }
    mapGui.fadeOut("ui-drawings");
    this.conditionalUI()
};
micello.maps.MapGUI.prototype.onTouchMove = function(c) {
    if (c.touches.length == 2) {
        if (this.activePinch == false) {
            this.pinchCenter = [((c.touches[0].clientX + c.touches[1].clientX) / 2), ((c.touches[0].clientY + c.touches[1].clientY) / 2)];
            this.pinchStartDistance = Math.sqrt(Math.pow(Math.abs(c.touches[0].clientX - c.touches[1].clientX), 2) + Math.pow(Math.abs(c.touches[0].clientY - c.touches[1].clientY), 2));
            this.pinchScale = 1;
            this.activePinch = true
        } else {
            this.pinchEndDistance = Math.sqrt(Math.pow(Math.abs(c.touches[0].clientX - c.touches[1].clientX), 2) + Math.pow(Math.abs(c.touches[0].clientY - c.touches[1].clientY), 2));
            this.pinchScale = this.pinchEndDistance / this.pinchStartDistance
        }
        c.preventDefault();
        this.zoomCssPreview(this.pinchScale, this.pinchCenter[0], this.pinchCenter[1])
    }
    if ((!this.startPan) || (c.touches.length != 1)) {
        return
    }
    c.preventDefault();
    var b = c.touches[0].clientX - this.startX;
    var a = c.touches[0].clientY - this.startY;
    this.view.translate(b, a);
    this.moveX += b;
    this.moveY += a;
    this.startX = c.touches[0].clientX;
    this.startY = c.touches[0].clientY;
    this.moved = true;
    this.conditionalUI()
};
micello.maps.MapGUI.prototype.onTouchEnd = function(b) {
    if (this.activePinch == true) {
        this.zoomFromPinch(this.pinchScale, this.pinchCenter[0], this.pinchCenter[1]);
        this.pinchScale = null;
        this.activePinch = false
    }
    if (b.touches.length > 0) {
        return
    }
    b.preventDefault();
    var c = this;
    startTarget = this.startTarget;
    if ((this.startPan) && (Math.abs(this.moveX) <= micello.maps.MapGUI.MOVE_LIMIT) && (Math.abs(this.moveY) <= micello.maps.MapGUI.MOVE_LIMIT)) {
        var a = new Date().getTime();
        delta = a - this.lastTouch;
        if (delta < 150 && delta > 0) {
            this.zoomIn();
            clearTimeout(action)
        } else {
            this.lastTouch = a;
            action = setTimeout(function(f) {
                c.fireMouseClick();
                clearTimeout(action)
            }, 150)
        }
    }
    this.startPan = false;
    this.moved = false;
    this.startTarget = null;
    this.lastTouch = a;
    this.conditionalUI()
};
micello.maps.MapGUI.prototype.onTouchCancel = function(a) {
    a.preventDefault();
    this.startPan = false;
    this.moved = false
};
micello.maps.MapGUI.prototype.zoomCssPreview = function(j, a, k) {
    var c = a;
    var b = k;
    for (var h = this.mapElement; h != null; h = h.offsetParent) {
        c -= h.offsetLeft;
        b -= h.offsetTop
    }
    var g = 100 * c / this.mapElement.clientWidth;
    var f = 100 * b / this.mapElement.clientHeight;
    micello.maps.MapGUI.setCssOrigin(this.mapElement, g, f);
    micello.maps.MapGUI.setCssScale(this.mapElement, j)
};
micello.maps.MapGUI.prototype.zoomFromPinch = function(f, b, h) {
    var a = 0;
    var g = 0;
    for (var c = this.mapElement; c != null; c = c.offsetParent) {
        a += c.offsetLeft;
        g += c.offsetTop
    }
    zoomScale = f * this.view.getZoom();
    this.zoomEnhancement(b, h, zoomScale, false);
    this.view.setZoom(zoomScale, b - a, h - g)
};
micello.maps.MapGUI.prototype.onKeyDown = function(a) {
    if (!this.KEY_COMMANDS) {
        return
    }
    switch (a.keyCode) {
        case 187:
            a.preventDefault();
            this.zoomIn();
            break;
        case 189:
            a.preventDefault();
            this.zoomOut();
            break;
        case 40:
            a.preventDefault();
            this.view.translate(0, -15);
            break;
        case 39:
            a.preventDefault();
            this.view.translate(-15, 0);
            break;
        case 38:
            a.preventDefault();
            this.view.translate(0, 15);
            break;
        case 37:
            a.preventDefault();
            this.view.translate(15, 0);
            break;
        case 80:
        case 76:
            a.preventDefault();
            drawing = this.data.getCurrentDrawing();
            level = this.data.getCurrentLevel();
            if (drawing.l.length > 1) {
                for (l = 0; l < drawing.l.length; l++) {
                    if (level.id === drawing.l[l].id) {
                        if (a.keyCode === 76) {
                            if (drawing.l[l - 1] !== undefined) {
                                this.data.setLevel(drawing.l[l - 1])
                            } else {
                                this.data.setLevel(drawing.l[drawing.l.length - 1])
                            }
                        }
                        if (a.keyCode === 80) {
                            if (drawing.l[l + 1] !== undefined) {
                                this.data.setLevel(drawing.l[l + 1])
                            } else {
                                this.data.setLevel(drawing.l[0])
                            }
                        }
                    }
                }
            }
            break;
        case 68:
            a.preventDefault();
            community = this.data.getCommunity();
            drawing = this.data.getCurrentDrawing();
            if (community.d.length > 1) {
                for (d = 0; d < community.d.length; d++) {
                    if (drawing.id === community.d[d].id) {
                        if (community.d[d + 1] !== undefined) {
                            this.data.setDrawing(community.d[d + 1])
                        } else {
                            this.data.setDrawing(community.d[0])
                        }
                    }
                }
            }
            break
    }
};
micello.maps.MapGUI.prototype.onKeyUp = function(a) {};
micello.maps.MapGUI.prototype.onMouseWheel = function(g) {
    var f = g.target;
    if (f.parentElement.id == "ui-drawings-list" || f.parentElement.className == "ui_drawing" || f.parentElement.className == "ui_drawing_name" || f.id == "ui-drawings" || f.id == "ui-drawings-container") {
        mapGui.ui.drwLst.onMouseWheel(g);
        return
    }
    if (f.parentElement.className == "ui_levels_floor_name") {
        mapGui.ui.levelsFlrs.onMouseWheel(g)
    }
    if (f.id == "ui-levels-scroll-container" || f.id == "ui-levels-scroll-button" || f.className == "ui_levels_floor" || f.className.indexOf("ui_levels_floor") != -1 || f.className == "ui_levels_floor_name" || f.parentElement.className == "ui_levels_floor_name" || f.id == "ui-levels-floors-wrapper") {
        mapGui.ui.levelsFlrs.onMouseWheel(g);
        return
    }
    g.preventDefault();
    if (!f || f.nodeName.toUpperCase() == "DIV") {
        return
    }
    if (g.detail) {
        g.wheelDelta = -g.detail / 3
    }
    var c = this.view.getZoom();
    var j = 0;
    if (g.wheelDelta > 0) {
        j = c * 1.25
    } else {
        j = c * 0.75
    }
    var a = 0;
    var h = 0;
    for (var b = this.mapElement; b != null; b = b.offsetParent) {
        a += b.offsetLeft;
        h += b.offsetTop
    }
    this.zoomEnhancement(g.clientX - a, g.clientY - h, j, false);
    this.view.setZoom(j, g.clientX - a, g.clientY - h);
    this.conditionalUI()
};
micello.maps.MapGUI.prototype.zoomEnhancement = function(f, c, g, h) {
    this.NAME_ENTITY_ENHANCEMENT = "off";
    if (this.NAME_ENTITY_ENHANCEMENT == "off") {
        return
    }
    var m = this.view.canvasToMapX(f, c);
    var k = this.view.canvasToMapY(f, c);
    var j = this.data.getCurrentLevel();
    var n = this.data.getCurrentDrawing();
    var a = this.data.getCommunity();
    geomClick = this.mapCanvas.hitCheck(j.g, m, k);
    if (this.NAME_VIEW != "off") {
        if (geomClick) {
            if (geomClick.nm) {
                this.ui.name.innerHTML = n.nm + '<div id="ui-entity-enhancement">' + geomClick.nm + "</div>"
            } else {
                this.ui.name.innerHTML = n.nm
            }
        } else {
            this.ui.name.innerHTML = n.nm
        }
    }
    if (h && geomClick) {
        if (g > 10) {
            if (geomClick.did) {
                for (var b = 0; b < a.d.length; b++) {
                    if (a.d[b].id == geomClick.did) {
                        this.view.setZoom(2, f, c);
                        mapGui.setDrawing(a.d[b])
                    }
                }
            }
        }
    }
};
micello.maps.MapGUI.prototype.fireMouseClick = function() {
    var a = 0;
    var f = 0;
    this.startTarget = startTarget;
    for (var b = this.mapElement; b != null; b = b.offsetParent) {
        a += b.offsetLeft;
        f += b.offsetTop
    }
    var c;
    if (this.startTarget) {
        c = this.startTarget.mapObject
    }
    if (this.mapCanvas) {
        this.mapCanvas.clickMouse(this.startX - a, this.startY - f, c)
    }
};
micello.maps.MapGUI.prototype.zoomIn = function() {
    if (this.view) {
        cntrPointX = this.viewportElement.offsetWidth / 2 - this.view.mapXInViewport;
        cntrPointY = this.viewportElement.offsetHeight / 2 - this.view.mapYInViewport;
        zoomScale = this.view.getZoom();
        this.zoomEnhancement(cntrPointX, cntrPointY, zoomScale, false);
        this.view.zoomIn()
    }
};
micello.maps.MapGUI.prototype.zoomOut = function() {
    if (this.view) {
        cntrPointX = this.viewportElement.offsetWidth / 2 - this.view.mapXInViewport;
        cntrPointY = this.viewportElement.offsetHeight / 2 - this.view.mapYInViewport;
        zoomScale = this.view.getZoom();
        this.zoomEnhancement(cntrPointX, cntrPointY, zoomScale, false);
        this.view.zoomOut()
    }
};
micello.maps.MapGUI.prototype.setLevel = function(a) {
    if (this.data) {
        this.data.setLevel(a)
    }
};
micello.maps.MapGUI.prototype.setDrawing = function(a) {
    if (this.data) {
        if (a != this.data.getCurrentDrawing()) {
            this.data.setDrawing(a)
        }
    }
};
micello.maps.MapGUI.prototype.createMouseShield = function() {
    var b = document.createElement("div");
    this.shield = b;
    this.viewportElement.appendChild(b);
    b.style.position = "absolute";
    b.style.top = "0px";
    b.style.left = "0px";
    b.style.width = "100%";
    b.style.height = "100%";
    b.style.display = "none";
    b.style.zIndex = 999999;
    b.mapTarget = true;
    var a = this;
    b.onmousedown = function(c) {
        a.onMouseDown(c)
    };
    b.onmouseup = function(c) {
        a.onMouseUp(c)
    };
    b.onmousemove = function(c) {
        a.onMouseMove(c)
    };
    b.onmouseout = function(c) {
        a.onMouseOut(c)
    };
    b.ontouchstart = function(c) {
        a.onTouchStart(c)
    };
    b.ontouchmove = function(c) {
        a.onTouchMove(c)
    };
    b.ontouchend = function(c) {
        a.onTouchEnd(c)
    }
};
micello.maps.MapGUI.prototype.updateLevel = function(a) {
    this.UILevelsCorrection(a)
};
micello.maps.MapGUI.prototype.updateDrawing = function(a) {
    this.createUI(a)
};
micello.maps.MapGUI.prototype.updateCommunity = function(a) {};
micello.maps.MapGUI.prototype.closeCommunity = function() {
    this.destroyUI()
};
micello.maps.MapGUI.setCssScale = null;
micello.maps.MapGUI.setCssOrigin = null;
micello.maps.MapGUI.setWebkitCssScale = function(a, b) {
    a.style.webkitTransform = "scale(" + b + ")"
};
micello.maps.MapGUI.setMozCssScale = function(a, b) {
    a.style.MozTransform = "scale(" + b + ")"
};
micello.maps.MapGUI.setMsCssScale = function(a, b) {
    a.style.msTransform = "scale(" + b + ")"
};
micello.maps.MapGUI.setWebkitCssOrigin = function(b, c, a) {
    b.style.webkitTransformOrigin = c + "% " + a + "%"
};
micello.maps.MapGUI.setMozCssOrigin = function(b, c, a) {
    b.style.MozTransformOrigin = c + "% " + a + "%"
};
micello.maps.MapGUI.setMsCssOrigin = function(b, c, a) {
    b.style.msTransformOrigin = c + "% " + a + "%"
};
micello.maps.MapGUI.prototype.createUI = function(a) {
    community = this.data.getCommunity();
    this.UIName(community);
    this.UIZoom(community);
    this.UILevels(a);
    this.UIGeo(a, community);
    this.determinePosition();
    this.UIDrawings(a);
    this.attribution()
};
micello.maps.MapGUI.prototype.destroyUI = function(a) {
    this.removeElement("ui-name");
    this.removeElement("ui-drawings");
    this.removeElement("ui-drawings-icon");
    this.removeElement("ui-zoom");
    this.removeElement("ui-levels");
    this.removeElement("ui-geo")
};
micello.maps.MapGUI.prototype.UIGeo = function(g, a) {
    this.removeElement("ui-geo");
    if (this.GEO_VIEW != "on" && this.GEO_VIEW != "conditional") {
        return false
    }
    this.ui.geo = document.createElement("div");
    this.ui.geo.setAttribute("id", "ui-geo");
    this.ui.geo.className = "ui_element";
    this.ui.geo.style.width = "105px";
    this.ui.geo.style.fontFamily = this.UI_FONT + ", " + this.UI_FONT_FALLBACK;
    this.determinePositionArraySetup("geo", this.GEO_POSITION, 100, 15);
    this.ui.appendChild(this.ui.geo);
    this.UIReg("ui-geo", this.GEO_VIEW);
    this.ui.map_scale = document.createElement("div");
    this.ui.map_scale.setAttribute("id", "ui_scale");
    this.ui.map_scale.style.borderBottom = "1px solid #999";
    this.ui.map_scale.style.position = "absolute";
    this.ui.map_scale.style.bottom = "4px";
    this.ui.map_scale.style.zIndex = micello.maps.MapGUI.CONTROL_ZINDEX + 4;
    this.ui.map_scale_text = document.createElement("p");
    this.ui.map_scale_text.setAttribute("id", "ui-scale-text");
    this.ui.map_scale_text.style.color = "#999";
    this.ui.map_scale_text.style.fontWeight = "bold";
    this.ui.map_scale_text.style.margin = "0px";
    this.ui.map_scale_text.style.textAlign = "center";
    this.updateMapScale(g);
    this.ui.map_scale.appendChild(this.ui.map_scale_text);
    this.ui.geo.appendChild(this.ui.map_scale);
    if (this.GEO_UNITS_TOGGLE == "on") {
        this.ui.map_scale.style.cursor = "pointer";
        var c = this;
        changeUnits = function() {
            if (c.GEO_UNITS == "standard") {
                c.GEO_UNITS = "metric"
            } else {
                c.GEO_UNITS = "standard"
            }
            c.updateMapScale(g)
        };
        this.ui.map_scale.onclick = function() {
            changeUnits()
        };
        this.ui.map_scale.ontouchstart = function(j) {
            j.preventDefault();
            changeUnits()
        }
    }
    if (this.view.customView) {
        this.ui.geo.style.width = "60px";
        return false
    }
    if (this.compassCache) {
        this.ui.geo.appendChild(this.compassCache)
    } else {
        this.ui.compass = document.createElement("canvas");
        this.ui.compass.setAttribute("id", "ui-compass");
        this.ui.COMPASS_MAX = 50;
        this.ui.compass.width = this.ui.COMPASS_MAX;
        this.ui.compass.height = this.ui.COMPASS_MAX;
        this.ui.compass.style.styleFloat = "right";
        this.ui.compass.style.cssFloat = "right";
        this.ui.compass.style.position = "relative";
        this.ui.compass.style.bottom = "-10px";
        this.ui.compass.style.zIndex = micello.maps.MapGUI.CONTROL_ZINDEX + 4;
        this.drawCompass(g.ar, this.ui.compass);
        this.ui.geo.appendChild(this.ui.compass);
        this.compassCache = this.ui.compass
    }
    if (this.GEO_ORIENT_TOGGLE == "on") {
        this.ui.compass.style.cursor = "pointer";
        this.ui.compass.title = "Change Orientation";
        var c = this;
        var b = function(k, j) {
            delete c.compassCache;
            if (j.northAtTop) {
                j.northAtTop = false
            } else {
                j.northAtTop = true
            }
            k.setDrawing(k.currentDrawing, k.currentLevel.id)
        };
        var h = this.data;
        var f = this.mapControl.view;
        this.ui.compass.onclick = function() {
            b(h, f)
        };
        this.ui.compass.ontouchstart = function(j) {
            j.preventDefault();
            b(h, f)
        }
    }
};
micello.maps.MapGUI.prototype.updateMapScale = function(z) {
    var p = (z.t[1] * 0) + (z.t[3] * 0) + (z.t[5]);
    var u = (z.t[0] * 0) + (z.t[2] * 0) + (z.t[4]);
    var v = (z.t[1] * z.w) + (z.t[3] * z.h) + (z.t[5]);
    var s = (z.t[0] * z.w) + (z.t[2] * z.h) + (z.t[4]);
    var m;
    var r;
    var b;
    var k;
    switch (this.GEO_UNITS) {
        case "standard":
            this.ui.map_scale.title = "Switch to Metric";
            m = 3959;
            b = 5280;
            r = "ft";
            k = [1, 2, 5, 10, 15, 20, 25, 30, 40, 50, 100, 200, 500];
            break;
        case "metric":
            this.ui.map_scale.title = "Switch to Standard";
            m = 6371;
            b = 1000;
            r = "m";
            k = [1, 3, 5, 10, 20, 30, 40, 50, 100];
            break;
        default:
            m = 3959;
            b = 5280;
            r = "ft";
            k = [1, 2, 5, 10, 15, 20, 25, 30, 40, 50, 100, 200, 500]
    }
    var n = (Math.PI / 180);
    var q = (v - p) * n;
    var o = (s - u) * n;
    var j = p * n;
    var g = v * n;
    var y = Math.sin(q / 2) * Math.sin(q / 2) + Math.sin(o / 2) * Math.sin(o / 2) * Math.cos(j) * Math.cos(g);
    var x = 2 * Math.atan2(Math.sqrt(y), Math.sqrt(1 - y));
    var w = m * x;
    var f = Math.sqrt(Math.pow(z.w, 2) + Math.pow(z.h, 2));
    var h = (((w / f) / this.view.scale) * this.GEO_SCALE_WIDTH) * b;
    var t = 0;
    for (var y in k) {
        if (h > k[y]) {
            t = k[y];
            continue
        } else {
            break
        }
    }
    if (t == 0) {
        this.ui.map_scale.style.display = "none"
    } else {
        this.ui.map_scale.style.width = (this.GEO_SCALE_WIDTH / (h / t)) + "px";
        this.ui.map_scale_text.innerHTML = t + "" + r
    }
};
micello.maps.MapGUI.prototype.drawCompass = function(f, c) {
    var h = c.width / this.ui.COMPASS_MAX;
    var g = c.getContext("2d");
    g.translate(c.width / 2, c.height / 2);
    var a = new Image();
    a.src = micello.SCRIPT_URL + "resources/compass_n.png";
    var j = (this.view.northAtTop) ? true : false;
    a.onload = function() {
        var b = a.width * h;
        var m = a.height * h;
        g.drawImage(a, b / -2, m / -2, b, m);
        if (!j) {
            g.rotate(-f)
        }
        var k = new Image();
        k.src = micello.SCRIPT_URL + "resources/compass_arrow4.png";
        k.onload = function() {
            var n = k.width * h;
            var o = k.height * h;
            g.drawImage(k, n / -2, o / -2, n, o)
        }
    }
};
micello.maps.MapGUI.prototype.UIName = function(a) {
    this.removeElement("ui-name");
    this.removeElement("ui-drawings");
    this.removeElement("ui-drawings-icon");
    if (this.NAME_VIEW != "on" && this.NAME_VIEW != "conditional") {
        return false
    }
    this.ui.NAME_MAX = 18;
    this.ui.NAME_MIN = 11;
    var b = this.viewportElement.clientWidth;
    this.ui.name = document.createElement("div");
    this.ui.name.setAttribute("id", "ui-name");
    this.ui.name.className = "ui_element";
    this.ui.name.style.whiteSpace = "pre";
    var c = b * 0.04;
    if (c > this.ui.NAME_MAX) {
        c = this.ui.NAME_MAX
    }
    if (c < this.ui.NAME_MIN) {
        c = this.ui.NAME_MIN
    }
    this.ui.name.style.fontSize = c + "px";
    this.ui.name.style.fontFamily = this.UI_FONT + ", " + this.UI_FONT_FALLBACK;
    this.ui.nameTxt = document.createElement("div");
    this.ui.nameTxt.setAttribute("id", "ui-name-text");
    this.ui.nameTxt.style.color = this.NAME_COLOR;
    this.ui.nameTxt.innerHTML = a.nm;
    this.ui.name.appendChild(this.ui.nameTxt);
    if (this.NAME_POSITION == "right top") {
        this.ui.name.style.textAlign = "right"
    }
    this.determinePositionArraySetup("name", this.NAME_POSITION, 1, 30);
    this.ui.appendChild(this.ui.name);
    this.UIReg("ui-name", this.NAME_VIEW)
};
micello.maps.MapGUI.prototype.UIDrawings = function(f) {
    if (this.NAME_VIEW != "on" && this.NAME_VIEW != "conditional") {
        this.ui.DRAWINGS_VIEW = "off";
        return false
    }
    mapData = this.data;
    community = this.data.getCommunity();
    if (community.d.length < 2) {
        this.ui.DRAWINGS_VIEW = "off";
        return false
    }
    this.ui.HEIGHTINCREMENT_MAX = 50;
    this.ui.HEIGHTINCREMENT_MIN = 40;
    var a = this.viewportElement.clientHeight;
    var c;
    mapGui = this;
    var h = this.ui;
    heightManager = 0;
    heightIncrement = Math.round(a * 0.05);
    if (heightIncrement > this.ui.HEIGHTINCREMENT_MAX) {
        heightIncrement = this.ui.HEIGHTINCREMENT_MAX
    }
    if (heightIncrement < this.ui.HEIGHTINCREMENT_MIN) {
        heightIncrement = this.ui.HEIGHTINCREMENT_MIN
    }
    if (community.d.length > 2) {
        drwShow = heightIncrement * 3
    } else {
        drwShow = heightIncrement * 2
    }
    iconWidth = 30;
    iconHeight = 30;
    iconBuffer = iconWidth / 2;
    lvlArwWdth = 15;
    totalMoved = 0;
    downSpace = this.availSpace(this.NAME_POSITION, "h");
    widthSpace = this.availSpace(this.NAME_POSITION, "w");
    var b = false;
    h = this.ui;
    this.ui.name.style.cursor = "pointer";
    this.ui.name.style.height = iconHeight + "px";
    this.ui.drawings = document.createElement("div");
    this.ui.drawings.setAttribute("id", "ui-drawings");
    this.ui.drawings.className = "ui_element";
    this.ui.drawings.style.top = this.ui.name.offsetTop + iconHeight + iconHeight * 0.25 + "px";
    this.ui.drawings.style.display = "none";
    this.ui.drawings.style.fontFamily = this.UI_FONT + ", " + this.UI_FONT_FALLBACK;
    this.ui.drwCtr = document.createElement("div");
    this.ui.drwCtr.setAttribute("id", "ui-drawings-container");
    this.ui.drwCtr.className = "roundTop roundBottom ui-shadow ";
    if (iconWidth + iconBuffer + this.ui.name.offsetWidth > this.viewportElement.clientWidth - widthSpace.taken) {
        drwWidth = this.viewportElement.clientWidth - widthSpace.taken
    } else {
        drwWidth = (this.ui.name.offsetWidth + iconWidth + iconBuffer) - lvlArwWdth
    }
    this.ui.drawings.style.width = drwWidth + "px";
    this.ui.drawings.style.zIndex = micello.maps.MapGUI.CONTROL_ZINDEX + 4;
    this.ui.drwCtr.style.width = drwWidth + "px";
    this.ui.drwCtr.style.zIndex = micello.maps.MapGUI.CONTROL_ZINDEX + 4;
    drwLstWidth = drwWidth + "px";
    this.ui.drwLst = document.createElement("div");
    this.ui.drwLst.setAttribute("id", "ui-drawings-list");
    this.ui.drwLst.style.width = drwLstWidth;
    this.ui.drwLst.style.zIndex = micello.maps.MapGUI.CONTROL_ZINDEX + 3;
    this.ui.drwLstEventHandler = function(k) {
        c = mapData.getCommunity();
        for (var j = 0; j < c.d.length; j++) {
            if (k == c.d[j].id) {
                mapGui.fadeOut("ui-drawings");
                mapGui.setDrawing(c.d[j])
            }
        }
    };
    drwLstClkEventHandler = function(j) {
        return function() {
            h.drwLstEventHandler(j)
        }
    };
    drawingItem = null;
    for (var g = 0; g < community.d.length; g++) {
        drawingItem = document.createElement("div");
        drawingItem.setAttribute("id", "ui-drawings-" + community.d[g].id);
        drawingItem.setAttribute("drawing", community.d[g].id);
        drawingItem.className = "ui_drawing";
        drawingItem.style.zIndex = micello.maps.MapGUI.CONTROL_ZINDEX + 2;
        drawingItem.style.height = heightIncrement + "px";
        drawingItem.style.top = heightManager + "px";
        heightManager += heightIncrement;
        drawingItem.style.left = 0;
        drawingItem.style.width = drwLstWidth;
        drawingItem.style.borderBottom = "1px solid #999";
        if (f.id == community.d[g].id) {
            drawingItem.style.backgroundColor = this.DRAWING_ACTIVE_BG;
            drawingItem.style.color = this.DRAWING_ACTIVE_COLOR
        } else {
            drawingItem.style.backgroundColor = this.DRAWING_BG;
            drawingItem.style.color = this.DRAWING_COLOR;
            drawingItem.onmouseover = function(j) {
                this.style.backgroundColor = mapGui.DRAWING_HOVER_BG;
                this.style.color = mapGui.DRAWING_HOVER_COLOR
            };
            drawingItem.onmouseout = function(j) {
                this.style.backgroundColor = mapGui.DRAWING_BG;
                this.style.color = mapGui.DRAWING_COLOR
            }
        }
        drawingName = document.createElement("div");
        drawingName.style.zIndex = micello.maps.MapGUI.CONTROL_ZINDEX + 1;
        drawingName.setAttribute("drawing", community.d[g].id);
        drawingName.innerHTML = community.d[g].nm;
        drawingName.className = "ui_drawing_name";
        drawingName.style.top = heightIncrement / 4 + "px";
        drawingName.style.left = "3px";
        drawingItem.appendChild(drawingName);
        drawingItem.onclick = drwLstClkEventHandler(community.d[g].id);
        this.ui.drwLst.appendChild(drawingItem)
    }
    this.ui.drawings.style.height = drwShow + heightIncrement + "px";
    this.ui.drwCtr.style.height = drwShow + "px";
    this.ui.drwLst.style.height = heightManager + "px";
    this.ui.drawings.style.fontSize = this.ui.name.style.fontSize;
    this.ui.drawings.appendChild(this.ui.drwLst);
    this.ui.appendChild(this.ui.drawings);
    this.ui.drwIcn = document.createElement("div");
    this.ui.drwIcn.setAttribute("id", "ui-drawings-icon");
    this.ui.drwIcn.style.border = "1px solid #999";
    this.ui.drwIcn.style.backgroundColor = "#fff";
    this.ui.drwIcn.style.width = iconWidth + "px";
    this.ui.drwIcn.style.height = iconHeight + "px";
    this.ui.drwIcn.className = "ui_element ui-shadow";
    this.ui.drwIcnImg = document.createElement("img");
    this.ui.drwIcnImg.src = micello.SCRIPT_URL + "resources/drawingsIcon.png";
    this.ui.drwIcnImg.style.width = "50%";
    this.ui.drwIcnImg.style.height = "50%";
    this.ui.drwIcnImg.style.position = "absolute";
    this.ui.drwIcnImg.style.top = iconHeight / 2.8 + "px";
    this.ui.drwIcnImg.style.left = iconWidth / 3.9 + "px";
    this.ui.drwIcn.appendChild(this.ui.drwIcnImg);
    drwLstSetHandler = function() {
        return function() {
            mapGui.fadeIn("ui-drawings")
        }
    };
    drwAction = setTimeout(function(j) {
        mapGui.ui.drwIcn.ontouchend = drwLstSetHandler();
        mapGui.ui.name.ontouchend = drwLstSetHandler();
        mapGui.ui.name.onmouseover = drwLstSetHandler();
        mapGui.ui.drwIcn.onmouseover = drwLstSetHandler();
        clearTimeout(drwAction)
    }, 200);
    this.ui.drwIcn.style.top = this.ui.name.style.top;
    if (this.NAME_POSITION == "left top") {
        this.ui.drwIcn.style.left = this.ui.name.offsetLeft + "px";
        this.ui.drawings.style.left = this.ui.name.offsetLeft + "px";
        this.ui.name.style.left = this.ui.name.offsetLeft + (iconWidth + iconBuffer) + "px";
        if (this.ui.name.offsetWidth + iconWidth + iconBuffer > this.viewportElement.clientWidth - widthSpace.taken) {
            this.ui.name.style.width = (this.viewportElement.clientWidth - widthSpace.taken) - (this.viewportElement.clientWidth * 0.025) - (iconWidth + iconBuffer) + "px";
            this.ui.nameTxt.style.width = this.ui.name.style.width;
            this.ui.name.style.whiteSpace = ""
        }
    }
    if (this.NAME_POSITION == "right top") {
        this.ui.name.style.left = this.ui.name.offsetLeft - (iconWidth + iconBuffer) + "px";
        this.ui.drawings.style.left = this.ui.name.offsetLeft + "px";
        this.ui.drwIcn.style.left = this.ui.name.offsetLeft + this.ui.name.offsetWidth + iconBuffer + "px";
        if (this.ui.name.offsetWidth + iconWidth + iconBuffer > this.viewportElement.clientWidth - widthSpace.taken) {
            this.ui.name.style.width = this.viewportElement.clientWidth - widthSpace.taken - (this.viewportElement.clientWidth * 0.025) - (iconWidth + iconBuffer) + "px";
            this.ui.nameTxt.style.width = this.ui.name.style.width;
            this.ui.name.style.left = widthSpace.taken + "px";
            this.ui.drawings.style.left = widthSpace.taken + "px";
            this.ui.drawings.style.width = this.ui.name.offsetWidth + iconWidth + "px";
            this.ui.drwIcn.style.left = this.ui.name.offsetLeft + this.ui.name.offsetWidth + iconBuffer + "px";
            this.ui.name.style.whiteSpace = ""
        }
        this.ui.drwCtr.style.left = lvlArwWdth + "px";
        this.ui.drwLst.style.width = this.ui.drawings.style.width;
        this.ui.drwCtr.style.width = this.ui.drawings.style.width
    }
    this.ui.drwLst.ondragstart = function() {
        return false
    };
    this.ui.drwLst.onMouseWheel = function(j) {
        j.preventDefault();
        h = mapGui.ui;
        if (j.detail) {
            j.wheelDelta = -j.detail / 3
        }
        if (j.wheelDelta < 0) {
            newScale = h.drwLst.offsetTop - heightIncrement / 2
        } else {
            newScale = h.drwLst.offsetTop + heightIncrement / 2
        }
        h.drwLst.style.left = 0;
        h.drwLst.style.top = newScale + "px";
        mapGui.UIDrawingListContain(h);
        mapGui.UIDrawingArrowToggle();
        mapGui.conditionalUI()
    };
    viewportElement = this.viewportElement;
    this.ui.drawings.ontouchstart = function(j) {
        j.preventDefault();
        j.stopPropagation();
        startPos = j.touches[0].pageY;
        b = true;
        totalMoved = 0
    };
    this.ui.drawings.ontouchmove = function(j) {
        if (j.touches.length == 1) {
            j.preventDefault();
            var k = j.touches[0];
            h.drwLst.style.left = 0;
            fingerMoved = startPos - k.pageY;
            totalMoved += fingerMoved;
            startPos = k.pageY;
            h.drwLst.style.top = h.drwLst.offsetTop - fingerMoved + "px";
            mapGui.UIDrawingListContain(h);
            mapGui.UIDrawingArrowToggle();
            mapGui.conditionalUI()
        }
    };
    this.ui.drawings.ontouchend = function(k) {
        if ((b) && (Math.abs(totalMoved) <= micello.maps.MapGUI.MOVE_LIMIT)) {
            var j = k.target.getAttribute("drawing");
            if (j) {
                h.drwLstEventHandler(j)
            }
        }
        b = false
    };
    this.ui.drawings.appendChild(this.ui.drwCtr);
    this.ui.drwCtr.appendChild(this.ui.drwLst);
    this.ui.appendChild(this.ui.drwIcn);
    this.ui.nameTxt.innerHTML = f.nm;
    this.ui.drawings.currDraw = f.id;
    this.UIDrawingArrow();
    this.UIReg("ui-drawings-icon", this.NAME_VIEW);
    if (this.NAME_VIEW == "conditional") {
        this.UIReg("ui-drawings", "conditional_hidden")
    }
};
micello.maps.MapGUI.prototype.UIDrawingListContain = function(a) {
    if (a.drwLst.offsetTop > 0) {
        a.drwLst.style.top = "0px"
    }
    if ((a.drwLst.offsetTop + a.drwLst.offsetHeight) <= (a.drwCtr.offsetTop + a.drwCtr.offsetHeight)) {
        a.drwLst.style.top = (a.drwCtr.offsetTop + a.drwCtr.offsetHeight) - a.drwLst.offsetHeight + "px"
    }
};
micello.maps.MapGUI.prototype.UIDrawingArrow = function() {
    mapGui = this;
    ui = this.ui;
    this.ui.drwArwUp = document.createElement("div");
    this.ui.drwArwUp.setAttribute("id", "ui-drawings-arrow-up");
    this.ui.drwArwUp.style.width = lvlArwWdth + "px";
    this.ui.drwArwUp.style.top = "0px";
    if (this.NAME_POSITION == "right top") {
        this.ui.drwArwUp.style.left = "0px"
    } else {
        this.ui.drwArwUp.style.left = drwWidth + "px"
    }
    this.ui.drwArwUp.style.height = "40px";
    this.ui.drwArwUp.style.display = "none";
    this.ui.drwArwUp.style.zIndex = micello.maps.MapGUI.CONTROL_ZINDEX + 6;
    this.ui.drawings.appendChild(this.ui.drwArwUp);
    this.ui.drwArwUpImg = document.createElement("img");
    this.ui.drwArwUpImg.src = micello.SCRIPT_URL + "resources/arrowUp.png";
    this.ui.drwArwUpImg.style.width = "60%";
    this.ui.drwArwUpImg.style.position = "absolute";
    this.ui.drwArwUpImg.style.top = "0px";
    this.ui.drwArwUpImg.style.left = "5px";
    this.ui.drwArwUp.appendChild(this.ui.drwArwUpImg);
    this.ui.drwArwUp.onclick = function(a) {
        newScale = ui.drwLst.offsetTop + heightIncrement / 2;
        ui.drwLst.style.left = 0;
        ui.drwLst.style.top = newScale + "px";
        mapGui.UIDrawingListContain(ui);
        mapGui.UIDrawingArrowToggle()
    };
    this.ui.drwArwDn = document.createElement("div");
    this.ui.drwArwDn.setAttribute("id", "ui-drawings-arrow-down");
    this.ui.drwArwDn.style.width = lvlArwWdth + "px";
    this.ui.drwArwDn.style.top = drwShow - 20 + "px";
    if (this.NAME_POSITION == "right top") {
        this.ui.drwArwDn.style.left = "0px"
    } else {
        this.ui.drwArwDn.style.left = drwWidth + "px"
    }
    this.ui.drwArwDn.style.height = "40px";
    this.ui.drwArwDn.style.display = "none";
    this.ui.drwArwDn.style.zIndex = micello.maps.MapGUI.CONTROL_ZINDEX + 6;
    this.ui.drawings.appendChild(this.ui.drwArwDn);
    this.ui.drwArwDnImg = document.createElement("img");
    this.ui.drwArwDnImg.src = micello.SCRIPT_URL + "resources/arrowDwn.png";
    this.ui.drwArwDnImg.style.width = "60%";
    this.ui.drwArwDnImg.style.height = "60%";
    this.ui.drwArwDnImg.style.position = "absolute";
    this.ui.drwArwDnImg.style.top = "0px";
    this.ui.drwArwDnImg.style.left = "5px";
    this.ui.drwArwDn.appendChild(this.ui.drwArwDnImg);
    this.ui.drwArwDn.onclick = function(a) {
        newScale = ui.drwLst.offsetTop - heightIncrement / 2;
        ui.drwLst.style.left = 0;
        ui.drwLst.style.top = newScale + "px";
        mapGui.UIDrawingListContain(ui);
        mapGui.UIDrawingArrowToggle()
    };
    this.UIDrawingArrowToggle()
};
micello.maps.MapGUI.prototype.UIDrawingArrowToggle = function() {
    mapGui = this;
    if (heightManager > drwShow && (this.ui.drwLst.offsetTop + heightManager) != (this.ui.drwCtr.offsetTop + this.ui.drwCtr.offsetHeight)) {
        this.UIDrawingCond = setTimeout(function(a) {
            mapGui.fadeIn("ui-drawings-arrow-down");
            clearTimeout(mapGui.UIDrawingCond)
        }, 750)
    } else {
        this.UIDrawingCond = setTimeout(function(a) {
            mapGui.fadeOut("ui-drawings-arrow-down");
            clearTimeout(mapGui.UIDrawingCond)
        }, 750)
    }
    if (this.ui.drwLst.offsetTop < 0) {
        this.UIDrawingCond = setTimeout(function(a) {
            mapGui.fadeIn("ui-drawings-arrow-up");
            clearTimeout(mapGui.UIDrawingCond)
        }, 750)
    } else {
        this.UIDrawingCond = setTimeout(function(a) {
            mapGui.fadeOut("ui-drawings-arrow-up");
            clearTimeout(mapGui.UIDrawingCond)
        }, 750)
    }
};
micello.maps.MapGUI.prototype.UIZoom = function(b) {
    this.removeElement("ui-zoom");
    if (this.ZOOM_VIEW != "on" && this.ZOOM_VIEW != "conditional") {
        return false
    }
    var g = this.ui;
    this.ui.ZOOM_H_MAX_WIDTH = 90;
    this.ui.ZOOM_H_MAX_HEIGHT = 45;
    this.ui.ZOOM_H_MIN_WIDTH = 60;
    this.ui.ZOOM_H_MIN_HEIGHT = 30;
    this.ui.ZOOM_V_MAX_WIDTH = 50;
    this.ui.ZOOM_V_MAX_HEIGHT = 80;
    this.ui.ZOOM_V_MIN_WIDTH = 50;
    this.ui.ZOOM_V_MIN_HEIGHT = 60;
    this.ui.zoom = document.createElement("div");
    this.ui.zoom.setAttribute("id", "ui-zoom");
    this.ui.zoom.className = "ui_element ui-shadow";
    this.ui.zoom.style.border = "1px solid " + this.ZOOM_COLOR;
    this.ui.zoom.style.backgroundColor = this.ZOOM_BG;
    this.ui.zoom.style.whiteSpace = "nowrap";
    this.ui.zoom.style.overflow = "hidden";
    this.ui.zmIn = document.createElement("div");
    this.ui.zmIn.setAttribute("id", "ui-zoom-in");
    this.ui.zmIn.style.color = this.ZOOM_COLOR;
    this.ui.zmIn.style.overflow = "hidden";
    this.ui.zmIn.style.backgroundColor = this.ZOOM_BG;
    this.ui.zmIn.innerHTML = "+";
    this.ui.zoom.appendChild(this.ui.zmIn);
    this.ui.zmOut = document.createElement("div");
    this.ui.zmOut.setAttribute("id", "ui-zoom-out");
    this.ui.zmOut.style.color = this.ZOOM_COLOR;
    this.ui.zmOut.style.backgroundColor = this.ZOOM_BG;
    this.ui.zmOut.style.overflow = "hidden";
    this.ui.zmOut.innerHTML = "-";
    this.ui.zoom.appendChild(this.ui.zmOut);
    zmClkStyle = function(k) {
        var j = document.getElementById(k.target.id);
        j.style.backgroundColor = mapGui.ZOOM_BG_ACTIVE;
        j.style.color = mapGui.ZOOM_BG_ACTIVE_COLOR
    };
    zmClkStyleRestore = function(k) {
        var j = document.getElementById(k.target.id);
        j.style.backgroundColor = mapGui.ZOOM_BG;
        j.style.color = mapGui.ZOOM_COLOR
    };
    this.ui.zmIn.onmouseover = function(j) {
        this.style.backgroundColor = mapGui.ZOOM_HOVER_BG_COLOR;
        this.style.color = mapGui.ZOOM_HOVER_COLOR
    };
    this.ui.zmIn.onmouseout = function(j) {
        this.style.backgroundColor = mapGui.ZOOM_BG;
        this.style.color = mapGui.ZOOM_COLOR
    };
    this.ui.zmIn.onclick = function(k) {
        zmClkStyle(k);
        mapGui.zoomIn();
        var j = k;
        setTimeout(function() {
            zmClkStyleRestore(j)
        }, 500)
    };
    this.ui.zmIn.ontouchstart = function(j) {
        j.preventDefault();
        zmClkStyle(j)
    };
    this.ui.zmIn.ontouchend = function(j) {
        j.preventDefault();
        zmClkStyleRestore(j);
        mapGui.zoomIn()
    };
    this.ui.zmOut.onmouseover = function(j) {
        this.style.backgroundColor = mapGui.ZOOM_HOVER_BG_COLOR;
        this.style.color = mapGui.ZOOM_HOVER_COLOR
    };
    this.ui.zmOut.onmouseout = function(j) {
        this.style.backgroundColor = mapGui.ZOOM_BG;
        this.style.color = mapGui.ZOOM_COLOR
    };
    this.ui.zmOut.onclick = function(k) {
        zmClkStyle(k);
        mapGui.zoomOut();
        var j = k;
        setTimeout(function() {
            zmClkStyleRestore(j)
        }, 500)
    };
    this.ui.zmOut.ontouchstart = function(j) {
        j.preventDefault();
        zmClkStyle(j)
    };
    this.ui.zmOut.ontouchend = function(j) {
        j.preventDefault();
        zmClkStyleRestore(j);
        mapGui.zoomOut()
    };
    var f = this.viewportElement.clientWidth;
    var a = this.viewportElement.clientHeight;
    var c;
    var h;
    switch (this.ZOOM_DISPLAY) {
        case "v":
            h = a * 0.35;
            c = 0;
            if (h > this.ui.ZOOM_V_MAX_HEIGHT) {
                h = this.ui.ZOOM_V_MAX_HEIGHT
            }
            if (h < this.ui.ZOOM_V_MIN_HEIGHT) {
                h = this.ui.ZOOM_V_MIN_HEIGHT
            }
            c = h / 2.55;
            this.ui.zmIn.style.lineHeight = h / 2 + "px";
            this.ui.zmIn.style.width = c + "px";
            this.ui.zmIn.style.height = h / 2 + "px";
            this.ui.zmIn.className = "roundTop";
            this.ui.zmIn.style.borderBottom = "1px solid " + this.ZOOM_COLOR;
            this.ui.zmIn.style.fontSize = h / 3 + "px";
            this.ui.zmOut.style.lineHeight = h / 2.25 + "px";
            this.ui.zmOut.style.width = c + "px";
            this.ui.zmOut.style.height = h / 2 + "px";
            this.ui.zmOut.className = "roundBottom";
            this.ui.zmOut.style.fontSize = h / 2.5 + "px";
            this.ui.zoom.className += " roundBottom roundTop ";
            break;
        case "h":
        default:
            c = Math.ceil(f * 0.25);
            h = 0;
            if (c > this.ui.ZOOM_H_MAX_WIDTH) {
                c = this.ui.ZOOM_H_MAX_WIDTH
            }
            if (c < this.ui.ZOOM_H_MIN_WIDTH) {
                c = this.ui.ZOOM_H_MIN_WIDTH
            }
            h = c / 4;
            if (h > this.ui.ZOOM_H_MAX_HEIGHT) {
                h = this.ui.ZOOM_H_MAX_HEIGHT
            }
            if (h < this.ui.ZOOM_H_MIN_HEIGHT) {
                h = this.ui.ZOOM_H_MIN_HEIGHT
            }
            this.ui.zmIn.style.lineHeight = h + "px";
            inoutWidth = c / 2;
            this.ui.zmIn.style.width = (inoutWidth) + "px";
            this.ui.zmIn.style.height = h + "px";
            this.ui.zmIn.style.borderRight = "1px solid " + this.ZOOM_COLOR;
            this.ui.zmIn.style.fontSize = c / 3 + "px";
            this.ui.zmOut.style.fontSize = c / 2.5 + "px";
            this.ui.zmOut.style.lineHeight = (h) - (h * 0.13) + "px";
            this.ui.zmOut.style.width = (inoutWidth) + "px";
            this.ui.zmOut.style.marginRight = "-2px";
            this.ui.zmOut.style.height = h + "px";
            break
    }
    totalWidth = c;
    this.ui.zoom.style.width = totalWidth + "px";
    this.ui.zoom.style.height = h + "px";
    this.determinePositionArraySetup("zoom", this.ZOOM_POSITION, 100, 15);
    this.ui.appendChild(this.ui.zoom);
    this.UIReg("ui-zoom", this.ZOOM_VIEW);
    return true
};
micello.maps.MapGUI.prototype.UILevels = function(a) {
    this.removeElement("ui-levels");
    if (a.l.length == 1) {
        return
    }
    if (this.LEVELS_VIEW != "on" && this.LEVELS_VIEW != "conditional") {
        return false
    }
    community = this.data.getCommunity();
    this.ui.levels = document.createElement("div");
    this.ui.levels.setAttribute("id", "ui-levels");
    this.ui.levels.className = "ui_element";
    this.ui.levels.style.fontFamily = this.UI_FONT + ", " + this.UI_FONT_FALLBACK;
    var b = this.ui;
    this.UILevelsLarge(a, b);
    this.determinePositionArraySetup("levels", this.LEVELS_POSITION, 200, 15);
    this.ui.appendChild(this.ui.levels);
    this.UIReg("ui-levels", this.LEVELS_VIEW)
};
micello.maps.MapGUI.prototype.UILevelsContain = function() {
    if (this.ui.levelsFlrs.offsetTop > 0) {
        this.ui.levelsFlrs.style.top = "0px"
    }
    if ((this.ui.levelsFlrs.offsetTop + this.ui.levelsFlrs.offsetHeight) <= (this.ui.levelsWrp.offsetTop + this.ui.levelsWrp.offsetHeight)) {
        this.ui.levelsFlrs.style.top = (this.ui.levelsWrp.offsetTop + this.ui.levelsWrp.offsetHeight) - this.ui.levelsFlrs.offsetHeight + "px"
    }
};
micello.maps.MapGUI.prototype.UILevelsCorrection = function(c) {
    mapGui = this;
    if (this.LEVELS_VIEW != "on" && this.LEVELS_VIEW != "conditional") {
        return false
    }
    if (!this.ui.levels) {
        return false
    }
    var m = this.viewportElement.clientHeight;
    var b = this.ui.levels.offsetTop;
    var f = this.ui.levels.offsetHeight;
    var g;
    nodeList = document.getElementsByClassName("ui_levels_floor");
    for (cnt = 0; cnt < nodeList.length; cnt++) {
        nodeList[cnt].style.backgroundColor = mapGui.LEVELS_BG;
        nodeList[cnt].style.color = mapGui.LEVELS_COLOR;
        mapGui.addClass(nodeList[cnt], "ui_levels_unselected")
    }
    element = document.getElementById("ui-levels-floor-" + c.id);
    if (element) {
        mapGui.removeClass(element, "ui_levels_unselected");
        element.style.backgroundColor = mapGui.LEVELS_BG_ACTIVE;
        element.style.color = mapGui.LEVELS_ACTIVE_COLOR
    }
    g = this.availSpace(this.LEVELS_POSITION, "h");
    var a = (m - b) - (g.taken + g.taken * 0.9);
    if (parseInt(this.ui.levelsFlrs.style.height) > a) {
        var k = (a / 2) - (35 / 2);
        var j = -(parseInt(element.style.top) - k);
        if (j > 0) {
            j = 0
        }
        var h = -(parseInt(this.ui.levelsFlrs.style.height) - a);
        if (j < h) {
            j = h
        }
        this.ui.levelsFlrs.style.top = j + "px"
    }
    this.conditionalUI();
    if (a < floorHeight * 2) {
        a = floorHeight * 2
    }
    if (f > a) {
        lvlFlrH = a;
        this.ui.levels.style.height = lvlFlrH + "px";
        this.ui.levels.style.height = lvlFlrH + "px";
        this.ui.levelsCtr.style.height = lvlFlrH + "px";
        this.ui.levelsWrp.style.height = lvlFlrH + "px";
        this.ui.lvlArwDn.style.top = lvlFlrH - 20 + "px";
        this.UILevelArrowToggleCond = setTimeout(function(n) {
            mapGui.UILevelArrowToggle();
            clearTimeout(mapGui.UILevelArrowToggleCond)
        }, 1000)
    }
};
micello.maps.MapGUI.prototype.UILevelsLarge = function(b, f) {
    f.LEVELS_V_MAX_WIDTH = 50;
    f.LEVELS_V_MAX_HEIGHT = 250;
    f.LEVELS_V_MIN_WIDTH = 50;
    f.LEVELS_V_MIN_HEIGHT = 150;
    var a = this.viewportElement.clientHeight;
    var g = a * 0.45;
    var c = 0;
    if (g > f.LEVELS_V_MAX_HEIGHT) {
        g = f.LEVELS_V_MAX_HEIGHT
    }
    if (g < f.LEVELS_V_MIN_HEIGHT) {
        g = f.LEVELS_V_MIN_HEIGHT
    }
    c = g / 4;
    if (c > f.LEVELS_V_MAX_WIDTH) {
        c = f.LEVELS_V_MAX_WIDTH
    }
    if (c < f.LEVELS_V_MIN_WIDTH) {
        c = f.LEVELS_V_MIN_WIDTH
    }
    floorHeight = 35;
    floorHeightManager = 0;
    lvlFlrH = floorHeight * b.l.length;
    lvlWidth = 30;
    lvlWrpWidth = lvlWidth;
    lvlStartScroll = false;
    startLvlScroll = false;
    lvlClick = false;
    lvlBtnScroll = false;
    arwWdth = 15;
    mapGui = this;
    mapData = this.data;
    nameShortened = null;
    f = this.ui;
    f.levels.style.width = c + "px";
    f.levels.style.zIndex = micello.maps.MapGUI.CONTROL_ZINDEX + 1;
    f.levelsCtr = document.createElement("div");
    f.levelsCtr.setAttribute("id", "ui-levels-floors-container");
    f.levelsCtr.style.width = lvlWrpWidth + "px";
    f.levels.appendChild(f.levelsCtr);
    f.levelsWrp = document.createElement("div");
    f.levelsWrp.setAttribute("id", "ui-levels-floors-wrapper");
    f.levelsWrp.style.width = lvlWrpWidth + "px";
    f.levelsWrp.className += " roundTop roundBottom ui-shadow ";
    if (this.LEVELS_POSITION == "right top") {
        f.levelsWrp.style.left = arwWdth + "px"
    } else {
        f.levelsWrp.style.left = "0px"
    }
    f.levelsWrp.style.border = "1px solid " + this.LEVELS_COLOR;
    f.levels.appendChild(f.levelsWrp);
    f.levelsFlrs = document.createElement("div");
    f.levelsFlrs.setAttribute("id", "ui-levels-floors");
    f.levelsFlrs.style.color = this.LEVELS_COLOR;
    f.levelsFlrs.style.width = lvlWrpWidth + "px";
    f.levelsFlrs.style.left = 0;
    f.levelsFlrs.style.top = 0;
    f.levelsFlrs.style.zIndex = micello.maps.MapGUI.CONTROL_ZINDEX + 2;
    f.levelsWrp.appendChild(f.levelsFlrs);
    f.lvlLstEventHandler = function(h) {
        nodeList = document.getElementsByClassName("ui_levels_floor");
        for (cnt = 0; cnt < nodeList.length; cnt++) {
            nodeList[cnt].style.backgroundColor = mapGui.LEVELS_BG;
            nodeList[cnt].style.color = mapGui.LEVELS_COLOR;
            mapGui.addClass(nodeList[cnt], "ui_levels_unselected")
        }
        currDraw = mapData.getCurrentDrawing();
        for (cnt = 0; cnt < currDraw.l.length; cnt++) {
            element = document.getElementById("ui-levels-floor-" + h);
            if (currDraw.l[cnt].id == h) {
                mapGui.setLevel(currDraw.l[cnt]);
                mapGui.removeClass(element, "ui_levels_unselected");
                element.style.backgroundColor = mapGui.LEVELS_BG_ACTIVE;
                element.style.color = mapGui.LEVELS_ACTIVE_COLOR
            }
        }
    };
    lvlListClckEventHandler = function(h) {
        return function() {
            f.lvlLstEventHandler(h)
        }
    };
    for (cnt = b.l.length - 1; cnt >= 0; cnt--) {
        floor = document.createElement("div");
        floor.setAttribute("id", "ui-levels-floor-" + b.l[cnt].id);
        floor.setAttribute("level", b.l[cnt].id);
        floor.className = "ui_levels_floor ui_levels_unselected";
        floor.style.height = floorHeight + "px";
        floor.style.top = floorHeightManager + "px";
        floor.style.backgroundColor = this.LEVELS_BG;
        floorHeightManager += floorHeight;
        floor.style.width = lvlWrpWidth + "px";
        if (cnt != b.l.length - 1) {
            floor.style.borderTop = "1px solid #f2f2f2"
        }
        floor.onclick = lvlListClckEventHandler(b.l[cnt].id);
        floor.onmouseover = function(h) {
            if (mapGui.hasClass(this, "ui_levels_unselected")) {
                this.style.backgroundColor = mapGui.LEVELS_HOVER_BG_COLOR;
                this.style.color = mapGui.LEVELS_HOVER_COLOR
            }
        };
        floor.onmouseout = function(h) {
            if (mapGui.hasClass(this, "ui_levels_unselected")) {
                this.style.backgroundColor = mapGui.LEVELS_BG;
                this.style.color = mapGui.LEVELS_COLOR
            }
        };
        floor.style.zIndex = micello.maps.MapGUI.CONTROL_ZINDEX + 3;
        floorName = document.createElement("div");
        floorName.setAttribute("id", "ui-levels-floor-" + b.l[cnt].id);
        floorName.setAttribute("level", b.l[cnt].id);
        floorName.className = "ui_levels_floor_name";
        floorName.style.fontSize = lvlWrpWidth * 0.6 + "px";
        nameShortened = b.l[cnt].nm.substring(0, 2);
        floorName.innerHTML = nameShortened;
        if (nameShortened.length == 1) {
            floorName.style.left = lvlWrpWidth * 0.3 + "px"
        }
        if (nameShortened.length == 2) {
            floorName.style.left = lvlWrpWidth * 0.15 + "px"
        }
        floorName.style.top = floorHeight * 0.25 + "px";
        floorName.style.zIndex = micello.maps.MapGUI.CONTROL_ZINDEX + 1;
        floor.appendChild(floorName);
        f.levelsFlrs.appendChild(floor)
    }
    f.levels.style.height = lvlFlrH + "px";
    f.levelsCtr.style.height = lvlFlrH + "px";
    f.levelsFlrs.style.height = floorHeightManager + "px";
    f.levelsWrp.style.height = lvlFlrH + "px";
    f.levelsFlrs.onMouseWheel = function(h) {
        h.preventDefault();
        h.cancelBubble = true;
        if (h.stopPropogation) {
            h.stopPropogation()
        }
        f = mapGui.ui;
        if (h.detail) {
            h.wheelDelta = -h.detail / 3
        }
        btnMove = (floorHeight / floorHeightManager) * 700;
        if (h.wheelDelta < 0) {
            newLvlScale = f.levelsFlrs.offsetTop - btnMove
        } else {
            newLvlScale = f.levelsFlrs.offsetTop + btnMove
        }
        f.levelsFlrs.style.left = 0;
        f.levelsFlrs.style.top = newLvlScale + "px";
        mapGui.UILevelsContain();
        mapGui.UILevelArrowToggle();
        mapGui.conditionalUI()
    };
    viewportElement = this.viewportElement;
    this.ui.levels.ontouchstart = function(h) {
        h.preventDefault();
        startLvlPos = h.touches[0].pageY;
        startLvlScroll = true;
        totalMoved = 0
    };
    this.ui.levels.ontouchmove = function(h) {
        if (h.touches.length == 1) {
            h.preventDefault();
            var j = h.touches[0];
            f.levelsFlrs.style.left = 0;
            if (startLvlScroll == true) {
                fingerMoved = startLvlPos - j.pageY;
                totalMoved += fingerMoved;
                startLvlPos = j.pageY;
                f.levelsFlrs.style.top = f.levelsFlrs.offsetTop - fingerMoved + "px";
                mapGui.UILevelsContain()
            }
            mapGui.UILevelArrowToggle();
            mapGui.conditionalUI()
        }
    };
    this.ui.levels.ontouchend = function(j) {
        if ((startLvlScroll) && (Math.abs(totalMoved) <= micello.maps.MapGUI.MOVE_LIMIT)) {
            var h = j.target.getAttribute("level");
            if (h) {
                f.lvlLstEventHandler(h)
            }
        }
        startLvlScroll = false
    };
    this.UILevelsArrow()
};
micello.maps.MapGUI.prototype.UILevelsArrow = function() {
    mapGui = this;
    ui = this.ui;
    this.ui.lvlArwUp = document.createElement("div");
    this.ui.lvlArwUp.setAttribute("id", "ui-levels-arrow-up");
    this.ui.lvlArwUp.style.width = arwWdth + "px";
    this.ui.lvlArwUp.style.top = "0px";
    if (this.LEVELS_POSITION == "left top") {
        this.ui.lvlArwUp.style.left = lvlWidth * 1.1 + "px"
    } else {
        this.ui.lvlArwUp.style.left = "0px"
    }
    this.ui.lvlArwUp.style.height = "40px";
    this.ui.lvlArwUp.style.display = "none";
    this.ui.lvlArwUp.style.zIndex = micello.maps.MapGUI.CONTROL_ZINDEX + 6;
    this.ui.levels.appendChild(this.ui.lvlArwUp);
    this.ui.lvlArwUpImg = document.createElement("img");
    this.ui.lvlArwUpImg.src = micello.SCRIPT_URL + "resources/arrowUp.png";
    this.ui.lvlArwUpImg.style.width = "60%";
    this.ui.lvlArwUpImg.style.position = "absolute";
    this.ui.lvlArwUpImg.style.top = "0px";
    this.ui.lvlArwUpImg.style.left = "5px";
    this.ui.lvlArwUp.appendChild(this.ui.lvlArwUpImg);
    this.ui.lvlArwUp.onclick = function(a) {
        newScale = ui.levelsFlrs.offsetTop + floorHeight / 2;
        ui.levelsFlrs.style.left = 0;
        ui.levelsFlrs.style.top = newScale + "px";
        mapGui.UILevelsContain();
        mapGui.UILevelArrowToggle()
    };
    this.ui.lvlArwDn = document.createElement("div");
    this.ui.lvlArwDn.setAttribute("id", "ui-levels-arrow-down");
    this.ui.lvlArwDn.style.width = arwWdth + "px";
    this.ui.lvlArwDn.style.top = lvlFlrH - 20 + "px";
    if (this.LEVELS_POSITION == "left top") {
        this.ui.lvlArwDn.style.left = lvlWidth * 1.1 + "px"
    } else {
        this.ui.lvlArwDn.style.left = "0px"
    }
    this.ui.lvlArwDn.style.height = "40px";
    this.ui.lvlArwDn.style.display = "none";
    this.ui.lvlArwDn.style.zIndex = micello.maps.MapGUI.CONTROL_ZINDEX + 6;
    this.ui.levels.appendChild(this.ui.lvlArwDn);
    this.ui.lvlArwDnImg = document.createElement("img");
    this.ui.lvlArwDnImg.src = micello.SCRIPT_URL + "resources/arrowDwn.png";
    this.ui.lvlArwDnImg.style.width = "60%";
    this.ui.lvlArwDnImg.style.position = "absolute";
    this.ui.lvlArwDnImg.style.top = "0px";
    this.ui.lvlArwDnImg.style.left = "5px";
    this.ui.lvlArwDn.appendChild(this.ui.lvlArwDnImg);
    this.ui.lvlArwDn.onclick = function(a) {
        newScale = ui.levelsFlrs.offsetTop - floorHeight / 2;
        ui.levelsFlrs.style.left = 0;
        ui.levelsFlrs.style.top = newScale + "px";
        mapGui.UILevelsContain();
        mapGui.UILevelArrowToggle()
    };
    this.UILevelArrowToggle()
};
micello.maps.MapGUI.prototype.UILevelArrowToggle = function() {
    mapGui = this;
    if (floorHeightManager > lvlFlrH && ((this.ui.levelsFlrs.offsetTop + floorHeightManager != this.ui.levelsWrp.offsetTop + this.ui.levelsWrp.offsetHeight))) {
        this.UILevelCondDwnIn = setTimeout(function(a) {
            mapGui.fadeIn("ui-levels-arrow-down");
            clearTimeout(mapGui.UILevelCondDwnIn)
        }, 750)
    } else {
        this.UILevelCondDwnOut = setTimeout(function(a) {
            mapGui.fadeOut("ui-levels-arrow-down");
            clearTimeout(mapGui.UILevelCondDwnOut)
        }, 750)
    }
    if (this.ui.levelsFlrs.offsetTop < 0) {
        this.UILevelCondUpIn = setTimeout(function(a) {
            mapGui.fadeIn("ui-levels-arrow-up");
            clearTimeout(mapGui.UILevelCondUpIn)
        }, 750)
    } else {
        this.UILevelCondUpOut = setTimeout(function(a) {
            mapGui.fadeOut("ui-levels-arrow-up");
            clearTimeout(mapGui.UILevelCondUpOut)
        }, 750)
    }
};
micello.maps.MapGUI.prototype.determinePositionArraySetup = function(b, a, f, c) {
    if (this.UISections[a] == undefined) {
        this.UISections[a] = new Array
    }
    for (i = 0; i < this.UISections[a].length; i++) {
        if (this.UISections[a][i]["item"] == b) {
            return
        }
    }
    itemStore = new Array;
    itemStore.item = b;
    itemStore.weight = f;
    itemStore.margin = c;
    this.UISections[a].push(itemStore);
    this.UISections[a].sort(function(h, g) {
        return h.weight - g.weight
    })
};
micello.maps.MapGUI.prototype.determinePosition = function() {
    var g = this.viewportElement.clientWidth;
    var b = this.viewportElement.clientHeight;
    var j = 0;
    var a;
    var f = 15;
    var h;
    this.heightMarker = new Array;
    this.positionExceptions();
    for (var c = 0; c < this.grid.length; c++) {
        tmpPos = this.grid[c];
        if (!this.heightMarker[tmpPos]) {
            this.heightMarker[tmpPos] = 20
        }
        if (!this.widthMarker[tmpPos]) {
            this.widthMarker[tmpPos] = 10
        }
    }
    for (position in this.UISections) {
        switch (position) {
            case "left top":
            case "center top":
            case "right top":
            case "left center":
            case "center center":
            case "right center":
                for (cnt = 0; cnt < this.UISections[position].length; cnt++) {
                    j = 0;
                    a = this.heightMarker[position];
                    h = this.UISections[position][cnt].item;
                    margin = this.UISections[position][cnt].margin;
                    if (!margin) {
                        margin = f
                    }
                    switch (position) {
                        case "left top":
                            this.ui[h].style.top = a + "px";
                            this.ui[h].style.left = g * 0.025 + "px";
                            break;
                        case "left center":
                            j = b / 2;
                            j -= j * 0.1;
                            this.ui[h].style.top = a + j + "px";
                            this.ui[h].style.left = g * 0.025 + "px";
                            break;
                        case "center top":
                            this.ui[h].style.top = a + "px";
                            this.ui[h].style.left = (g / 2) - this.ui[h].offsetWidth / 2 + "px";
                            break;
                        case "center center":
                            j = b / 2;
                            j -= j * 0.1;
                            this.ui[h].style.top = (a + j) + "px";
                            this.ui[h].style.left = (g / 2) - this.ui[h].offsetWidth / 2 + "px";
                            break;
                        case "right top":
                            this.ui[h].style.top = a + "px";
                            this.ui[h].style.left = g - this.ui[h].offsetWidth - g * 0.025 + "px";
                            break;
                        case "right center":
                            j = b / 2;
                            j -= j * 0.1;
                            this.ui[h].style.top = (a + j) + "px";
                            this.ui[h].style.left = g - this.ui[h].offsetWidth - g * 0.025 + "px";
                            break
                    }
                    this.heightMarker[position] += this.ui[h].offsetHeight + margin;
                    if (this.ui[h].offsetWidth > this.widthMarker[position]) {
                        this.widthMarker[position] = this.ui[h].offsetWidth
                    }
                }
                break;
            case "left bottom":
            case "center bottom":
            case "right bottom":
                for (cnt = this.UISections[position].length - 1; cnt >= 0; cnt--) {
                    j = 0;
                    a = this.heightMarker[position];
                    h = this.UISections[position][cnt].item;
                    margin = this.UISections[position][cnt].margin;
                    if (!margin) {
                        margin = f
                    }
                    switch (position) {
                        case "left bottom":
                            this.ui[h].style.top = (b - (a + this.ui[h].offsetHeight)) + "px";
                            this.ui[h].style.left = g * 0.025 + "px";
                            break;
                        case "center bottom":
                            this.ui[h].style.top = (b - (a + this.ui[h].offsetHeight)) + "px";
                            this.ui[h].style.left = (g / 2) - this.ui[h].offsetWidth / 2 + "px";
                            break;
                        case "right bottom":
                            this.ui[h].style.top = (b - (a + this.ui[h].offsetHeight)) + "px";
                            this.ui[h].style.left = g - this.ui[h].offsetWidth - g * 0.025 + "px";
                            break
                    }
                    this.heightMarker[position] += this.ui[h].offsetHeight + margin;
                    if (this.ui[h].offsetWidth > this.widthMarker[position]) {
                        this.widthMarker[position] = this.ui[h].offsetWidth
                    }
                }
                break
        }
    }
};
micello.maps.MapGUI.prototype.positionExceptions = function() {
    var a;
    for (position in this.UISections) {
        if (typeof this.UISections[position] !== "array") {
            continue
        }
        for (cnt = 0; cnt < this.UISections[position].length; cnt++) {
            item = this.UISections[position][cnt].item;
            switch (item) {
                case "name":
                    if (position != "left top" && position != "right top") {
                        a = this.UISections[position][cnt];
                        this.UISections[position].splice(cnt, 1);
                        this.NAME_POSITION = this.gridDefaults.name;
                        this.determinePositionArraySetup(a.item, this.gridDefaults.name, a.weight, a.margin)
                    }
                    break;
                case "zoom":
                    if (position == "center center" || !this.inArray(this.grid, position)) {
                        a = this.UISections[position][cnt];
                        this.UISections[position].splice(cnt, 1);
                        this.ZOOM_POSITION = this.gridDefaults.zoom;
                        this.determinePositionArraySetup(a.item, this.gridDefaults.zoom, a.weight, a.margin)
                    }
                    break;
                case "levels":
                    if (position != "left top" && position != "right top") {
                        a = this.UISections[position][cnt];
                        this.UISections[position].splice(cnt, 1);
                        this.LEVELS_POSITION = this.gridDefaults.levels;
                        this.determinePositionArraySetup(a.item, this.gridDefaults.levels, a.weight, a.margin)
                    }
                    break;
                case "geo":
                    if (position != "right bottom" && position != "right top") {
                        a = this.UISections[position][cnt];
                        this.UISections[position].splice(cnt, 1);
                        this.GEO_POSITION = this.gridDefaults.geo;
                        this.determinePositionArraySetup(a.item, this.gridDefaults.geo, a.weight, a.margin)
                    }
                    break
            }
        }
    }
};
micello.maps.MapGUI.prototype.attribution = function() {
    if (!this.attrib) {
        this.attrib = document.createElement("div");
        this.attrib.style.position = "absolute";
        this.attrib.style.width = "100px";
        this.attrib.style.color = "#006bb7";
        this.attrib.style.height = "10px";
        this.attrib.style.display = "block !important";
        this.attrib.style.cssText += " display:block !important ";
        this.attrib.style.display = "block";
        this.attrib.style.visibility = "visible";
        this.attrib.style.margin = "0";
        this.attrib.style.padding = "0";
        this.attrib.style.fontSize = "80%";
        this.attrib.innerHTML = "Map Data &copy;Micello";
        this.viewportElement.appendChild(this.attrib)
    }
    var a = this.viewportElement.offsetWidth;
    var b = this.viewportElement.offsetHeight;
    this.attrib.style.top = b - 17 + "px";
    this.attrib.style.left = a - 100 + "px"
};
micello.maps.MapGUI.prototype.removeElement = function(a) {
    tobeRemoved = document.getElementById(a);
    if (tobeRemoved) {
        tobeRemoved.onmouseover = null;
        tobeRemoved.onclick = null;
        this.ui.removeChild(tobeRemoved)
    }
};
micello.maps.MapGUI.prototype.fadeOut = function(b) {
    if (typeof this.fadeItems.out == "undefined") {
        this.fadeItems.out = new Array
    }
    var g = document.getElementById(b);
    if (!g) {
        return
    }
    if (g.style.display == "none") {
        return
    }
    var f = "out";
    var c = this;
    var a = this.fadeInterval.length;
    if (!this.fadeItems.out[b]) {
        this.fadeItems.out[b] = true;
        this.fadeInterval[a] = setInterval(function() {
            c.UIFade(g, f, a, b)
        }, 20)
    }
};
micello.maps.MapGUI.prototype.fadeIn = function(b) {
    if (typeof this.fadeItems["in"] == "undefined") {
        this.fadeItems["in"] = new Array
    }
    var g = document.getElementById(b);
    if (!g) {
        return
    }
    if (g.style.display != "none") {
        return
    }
    var f = "in";
    var c = this;
    g.style.opacity = 0;
    g.style.filter = "alpha(opacity=0)";
    g.style.display = "block";
    var a = this.fadeInterval.length;
    if (!this.fadeItems["in"][b]) {
        this.fadeItems["in"][b] = true;
        this.fadeInterval[a] = setInterval(function() {
            c.UIFade(g, f, a, b)
        }, 20)
    }
};
micello.maps.MapGUI.prototype.UIFade = function(f, c, a, b) {
    if (typeof this.UIFade.fadeSet == "undefined") {
        this.UIFade.fadeSet = new Array;
        this.UIFade.fadeReal = new Array
    }
    if (typeof this.UIFade.fadeSet[a] == "undefined") {
        this.UIFade.fadeSet[a] = 0;
        this.UIFade.fadeReal[a] = 1
    }
    this.UIFade.fadeSet[a] += 0.1;
    if (c == "in") {
        this.UIFade.fadeReal[a] = this.UIFade.fadeSet[a]
    }
    if (c == "out") {
        this.UIFade.fadeReal[a] = this.UIFade.fadeReal[a] - 0.1
    }
    f.style.opacity = this.UIFade.fadeReal[a];
    f.style.filter = "alpha(opacity=" + this.UIFade.fadeReal[a] * 100 + ")";
    if (this.UIFade.fadeSet[a] >= 1) {
        if (c == "in") {
            f.style.display = "block"
        }
        if (c == "out") {
            f.style.display = "none"
        }
        clearInterval(this.fadeInterval[a]);
        delete this.fadeInterval[a];
        delete this.fadeItems[c][b];
        delete this.UIFade.fadeSet[a];
        delete this.UIFade.fadeReal[a]
    }
};
micello.maps.MapGUI.prototype.availSpace = function(c, a) {
    var b = new Array();
    b.avail = 0;
    b.taken = 0;
    switch (true) {
        case (c == "right top" && a == "h"):
            b.avail = this.heightMarker["right top"] - (this.heightMarker["right center"] + this.heightMarker["right bottom"]);
            b.taken = this.heightMarker["right center"] + this.heightMarker["right bottom"];
            break;
        case (c == "left top" && a == "h"):
            b.avail = this.heightMarker["left top"] - (this.heightMarker["left center"] + this.heightMarker["left bottom"]);
            b.taken = this.heightMarker["left center"] + this.heightMarker["left bottom"];
            break;
        case (c == "right top" && a == "w"):
            b.avail = this.widthMarker["right top"] - (this.widthMarker["center top"] + this.widthMarker["left top"]);
            b.taken = this.widthMarker["center top"] + this.widthMarker["left top"];
            break;
        case (c == "left top" && a == "w"):
            b.avail = this.widthMarker["left top"] - (this.widthMarker["center top"] + this.widthMarker["right top"]);
            b.taken = this.widthMarker["center top"] + this.widthMarker["right top"];
            break
    }
    if (b.avail == undefined) {
        b.avail = 0
    }
    if (b.taken == undefined) {
        b.taken = 0
    }
    return b
};
micello.maps.MapGUI.prototype.addClass = function(b, a) {
    if (!this.hasClass(b, a)) {
        b.className += " " + a
    }
};
micello.maps.MapGUI.prototype.hasClass = function(b, a) {
    return b.className && new RegExp("(^|\\s)" + a + "(\\s|$)").test(b.className)
};
micello.maps.MapGUI.prototype.removeClass = function(c, a) {
    if (this.hasClass(c, a)) {
        var b = new RegExp("(\\s|^)" + a + "(\\s|$)");
        c.className = c.className.replace(b, " ")
    }
};
micello.maps.MapGUI.prototype.inArray = function(a, b) {
    for (i = 0; i < a.length; i++) {
        if (b == a[i]) {
            return true
        }
    }
    return false
};
micello.maps.MapGUI.prototype.hexCheck = function(a) {
    if (a.charAt(0) != "#") {
        return "#" + a
    }
    return a
};
micello.maps.MapGUI.prototype.error = function(b) {
    var a = this;
    this.ui.error = document.createElement("div");
    this.ui.error.setAttribute("id", "ui-error");
    this.ui.errorClose = document.createElement("div");
    this.ui.errorClose.setAttribute("id", "ui-error-close");
    this.ui.errorClose.innerHTML = "x";
    this.ui.error.appendChild(this.ui.errorClose);
    this.ui.errorCloseMsg = document.createElement("div");
    this.ui.errorCloseMsg.setAttribute("id", "ui-error-mesg");
    this.ui.errorCloseMsg.innerHTML = b;
    this.ui.error.appendChild(this.ui.errorCloseMsg);
    this.ui.errorClose.onclick = function(c) {
        a.fadeOut("ui-error")
    };
    this.ui.error.style.display = "none";
    this.viewportElement.appendChild(this.ui.error)
};
micello.maps.MapGUI.prototype.UIReg = function(a, b) {
    this.ui.reg[a] = b
};
micello.maps.MapGUI.prototype.conditionalUI = function() {
    var a;
    var b = this;
    if (this.conditionalAction) {
        clearTimeout(this.conditionalAction);
        for (a in this.ui.reg) {
            xChk = document.getElementById(a);
            if (!xChk) {
                continue
            }
            if (this.ui.reg[a] == "conditional" && xChk.style.display == "none") {
                this.fadeIn(a)
            }
        }
    }
    this.conditionalAction = setTimeout(function(c) {
        for (a in b.ui.reg) {
            if (b.ui.reg[a] == "conditional" || b.ui.reg[a] == "conditional_hidden") {
                b.fadeOut(a)
            }
        }
        clearTimeout(b.conditionalAction)
    }, 4000)
};
micello.maps.MapData = function(c, a, f, b) {
    this.mapControl = c;
    this.view = a;
    this.mapCanvas = f;
    this.mapGUI = b;
    this.community = null;
    this.currentDrawing = null;
    this.ti = null;
    this.currentLevel = null;
    this.geomMap = null;
    this.levelMap = null;
    this.drawingMap = null;
    this.groupMap = null;
    this.event = {};
    this.unloadedMOverlays = [];
    this.unloadedGOverlays = [];
    this.unloadedInlays = [];
    this.nextId = micello.maps.MapData.INITIAL_ID
};
micello.maps.MapData.DEFAULT_ZINDEX = 1;
micello.maps.MapData.INITIAL_ID = -1;
micello.maps.MapData.DEFAULT_THEME_NAME = "General";
micello.maps.MapData.prototype.mxyToLatLon = function(f, b) {
    if (!this.ti) {
        return null
    }
    var a = f * this.ti.mxToLat + b * this.ti.myToLat + this.ti.lat0;
    var c = f * this.ti.mxToLon + b * this.ti.myToLon + this.ti.lon0;
    return [a, c]
};
micello.maps.MapData.prototype.latLonToMxy = function(b, f) {
    if (!this.ti) {
        return null
    }
    b -= this.ti.lat0;
    f -= this.ti.lon0;
    var c = b * this.ti.latToMx + f * this.ti.lonToMx;
    var a = b * this.ti.latToMy + f * this.ti.lonToMy;
    return [c, a]
};
micello.maps.MapData.prototype.getCommunity = function() {
    return this.community
};
micello.maps.MapData.prototype.getCurrentDrawing = function() {
    return this.currentDrawing
};
micello.maps.MapData.prototype.getCurrentLevel = function() {
    return this.currentLevel
};
micello.maps.MapData.prototype.loadCommunity = function(g, a, b) {
    var h = this;
    var f = function(j) {
        h.setCommunity(j, a, b);
        h.mapGUI.hideLoading()
    };
    if (this.community) {
        var c = this.currentLevel;
        this.community = null;
        this.initCommunity();
        if (c) {
            this.mapCanvas.updatelevel(null, c)
        }
        this.view.updateDrawing(null);
        this.mapGUI.closeCommunity();
        this.event.comLoad = 1;
        if (this.mapChanged) {
            this.mapChanged(this.event)
        }
        this.event.drawChange = 0;
        this.event.comLoad = 0;
        this.event.drawLoad = 0
    }
    this.mapGUI.showLoading();
    micello.maps.request.loadCommunity(g, f)
};
micello.maps.MapData.prototype.setDrawing = function(h, j) {
    if (!h) {
        return
    }
    this.currentDrawing = h;
    this.transformInfo = null;
    var n = this;
    var o = this.currentDrawing.l;
    if (!o) {
        this.event.drawNew = true;
        var m = function(p) {
            n.updateDrawing(p, j);
            n.mapGUI.hideLoading()
        };
        this.mapGUI.showLoading();
        micello.maps.request.loadDrawing(h.id, m, this.community.cid);
        var f = this.currentLevel;
        this.currentLevel = null;
        if (f) {
            this.mapCanvas.updatelevel(null, f)
        }
        return
    }
    this.initTransform();
    var a;
    var k = -999999;
    if (o) {
        var g;
        var b = o.length;
        for (g = 0; g < b; g++) {
            var c = o[g];
            if (j) {
                if (c.id == j) {
                    a = c;
                    break
                }
            } else {
                if (c.z < 0) {
                    if (c.z > k) {
                        a = c;
                        k = c.z
                    }
                } else {
                    if ((c.z < k) || (k < 0)) {
                        a = c;
                        k = c.z
                    }
                }
            }
        }
    }
    if (!a) {
        micello.maps.onMapError("Display level not found")
    }
    this.event.drawChange = 1;
    this.view.updateDrawing(this.currentDrawing);
    this.mapGUI.updateDrawing(this.currentDrawing);
    this.setLevel(a)
};
micello.maps.MapData.prototype.setLevel = function(b) {
    var a = this.currentLevel;
    this.currentLevel = b;
    this.mapGUI.updateLevel(this.currentLevel, a);
    this.mapCanvas.updatelevel(this.currentLevel, a);
    if (this.mapChanged) {
        this.mapChanged(this.event);
        this.event.drawChange = 0;
        this.event.comLoad = 0;
        this.event.drawLoad = 0
    }
};
micello.maps.MapData.prototype.getGeometryLevel = function(a) {
    var b = this.geomMap[a];
    if (b) {
        return b.pl
    } else {
        return null
    }
};
micello.maps.MapData.prototype.addMarkerOverlay = function(b, j) {
    if (!this.community) {
        return
    }
    if (!b.aid) {
        b.aid = this.createId()
    }
    if (b.lid) {
        var k = null;
        var h = this.levelMap[b.lid];
        if (h) {
            k = h.l;
            this.addMarkerToLevel(b, k)
        } else {
            if (!b.x) {
                b.x = 1;
                this.unloadedMOverlays.push(b)
            }
        }
    } else {
        if (b.id) {
            var a = null;
            if (!j) {
                a = this.getGeometryGroupList(b.id)
            }
            if (a != null) {
                var f;
                var c;
                var g;
                for (f = 0; f < a.length; f++) {
                    c = a[f];
                    if (c.id != b.id) {
                        g = this.getCopy(b);
                        g.id = c.id
                    } else {
                        g = b
                    }
                    this.addMarkerToGeom(g)
                }
            } else {
                this.addMarkerToGeom(b)
            }
        } else {
            micello.maps.onMapError("Level info missing");
            return
        }
    }
};
micello.maps.MapData.prototype.removeMarkerOverlay = function(c, p) {
    if (!this.community) {
        return
    }
    var m;
    var a;
    var g;
    var j;
    var k;
    var f = this.community.d.length;
    for (var b = 0; b < f; b++) {
        m = this.community.d[b];
        if (m.l) {
            for (var n = 0; n < m.l.length; n++) {
                a = m.l[n];
                g = a.m;
                if (g) {
                    for (var o = 0; o < g.length; o++) {
                        j = g[o];
                        k = p ? j.anm : j.aid;
                        if (k == c) {
                            g.splice(o, 1);
                            o--;
                            this.mapCanvas.removeMarker(j)
                        }
                    }
                }
            }
        }
    }
    var h = 0;
    while (h < this.unloadedMOverlays.length) {
        j = this.unloadedMOverlays[h];
        k = p ? j.anm : j.aid;
        if (k == c) {
            this.unloadedMOverlays.splice(h, 1);
            delete j.x
        } else {
            h++
        }
    }
};
micello.maps.MapData.prototype.addGeometryOverlay = function(a) {
    if (!this.community) {
        return
    }
    if (!a.lid) {
        micello.maps.onMapError("missing overlay level");
        return
    }
    if ((!a.zi) || ((a.zi >= 0) && (a.zi < 1))) {
        a.zi = micello.maps.MapData.DEFAULT_ZINDEX
    }
    if (!a.id) {
        a.aid = this.createId();
        a.id = a.aid
    } else {
        if (a.id > micello.maps.MapData.INITIAL_ID) {
            micello.maps.onMapError("Invalid overlay id");
            return
        }
        if (a.id != a.aid) {
            micello.maps.onMapError("Format error on geometry overlay.");
            return
        }
        var b = this.geomMap[a.id];
        if (b) {
            this.removeGeometryOverlay(b.aid)
        }
    }
    var c = this.levelMap[a.lid];
    if (c) {
        var f = c.l;
        if (a.x) {
            delete a.x
        }
        this.addToObjectMap(a, f);
        f.gList.add(a);
        this.mapCanvas.invalidateGeom(a, a.lid, a.zi)
    } else {
        if (!a.x) {
            a.x = 1;
            this.unloadedGOverlays.push(a)
        }
    }
};
micello.maps.MapData.prototype.removeGeometryOverlay = function(f, q) {
    if (!this.community) {
        return
    }
    var n;
    var b;
    var p;
    var k;
    var g = q ? "anm" : "aid";
    var j;
    var c = this.community.d.length;
    for (j = 0; j < c; j++) {
        n = this.community.d[j];
        if (n.l) {
            var o;
            var a = n.l.length;
            for (o = 0; o < a; o++) {
                b = n.l[o];
                p = b.gList;
                do {
                    k = p.remove(f, g);
                    if (k) {
                        this.removeFromObjectMap(k);
                        this.mapCanvas.invalidateGeom(k, k.lid, k.zi)
                    }
                } while (k)
            }
        }
    }
    var m;
    var h;
    j = 0;
    while (j < this.unloadedGOverlays.length) {
        h = this.unloadedGOverlays[j];
        m = q ? h.anm : h.aid;
        if (m == f) {
            this.unloadedGOverlays.splice(j, 1);
            delete h.x
        } else {
            j++
        }
    }
};
micello.maps.MapData.prototype.addInlay = function(g, h) {
    if (!this.community) {
        return
    }
    if (!g.id) {
        micello.maps.onMapError("missing inlay id");
        return
    }
    if (!g.aid) {
        g.aid = this.createId()
    }
    if (!g.zi) {
        g.zi = micello.maps.MapData.DEFAULT_ZINDEX
    }
    var b = null;
    if (!h) {
        b = this.getGeometryGroupList(g.id)
    }
    if (b != null) {
        var f;
        var c;
        var a;
        for (f = 0; f < b.length; f++) {
            c = b[f];
            if (c.id != g.id) {
                a = this.getCopy(g);
                a.id = c.id
            } else {
                a = g
            }
            this.addIndividualInlay(a)
        }
    } else {
        this.addIndividualInlay(g)
    }
};
micello.maps.MapData.prototype.removeInlay = function(f, u) {
    if (!this.community) {
        return
    }
    var w;
    var a;
    var c;
    var p;
    var t;
    var b;
    var o = this.community.d.length;
    var n;
    var g;
    for (var m = 0; m < o; m++) {
        w = this.community.d[m];
        if (w.l) {
            t = w.l.length;
            for (var j = 0; j < t; j++) {
                a = w.l[j];
                n = a.gList;
                for (n.start();
                    ((c = n.currentList()) != null); n.next()) {
                    g = n.currentZi();
                    b = c.length;
                    for (var k = 0; k < b; k++) {
                        p = c[k];
                        var r = p;
                        var s = null;
                        while (r) {
                            r = this.getRemoveReplaceGeom(r, f, u);
                            if (r) {
                                s = r
                            }
                        }
                        if (s) {
                            c[k] = s;
                            this.mapCanvas.invalidateGeom(p, a.id, g);
                            this.mapCanvas.invalidateGeom(s, a.id, g)
                        }
                    }
                }
            }
        }
    }
    var q = 0;
    var v;
    var h;
    while (q < this.unloadedInlays.length) {
        h = this.unloadedInlays[q];
        v = u ? h.anm : h.aid;
        if (v == f) {
            this.unloadedInlays.splice(q, 1);
            delete h.x
        } else {
            q++
        }
    }
};
micello.maps.MapData.prototype.removeAnnotation = function(a) {
    this.removeInlay(a, true);
    this.removeGeometryOverlay(a, true);
    this.removeMarkerOverlay(a, true)
};
micello.maps.MapData.prototype.setCommunity = function(a, b, h) {
    if (a == null) {
        micello.maps.onMapError("null community!");
        return
    }
    this.community = a;
    this.initCommunity();
    var j = a.d;
    if (j == null) {
        micello.maps.onMapError("no drawings!");
        return
    }
    var c;
    var g;
    var f;
    if (b) {
        f = j.length;
        for (g = 0; g < f; g++) {
            if (j[g].id == b) {
                c = j[g]
            }
        }
    }
    if (!c) {
        f = j.length;
        for (g = 0; g < f; g++) {
            if (j[g].r) {
                c = j[g]
            }
        }
    }
    if (!c) {
        micello.maps.onMapError("no root drawing found");
        this.currentDrawing = null;
        return
    }
    this.event.comLoad = 1;
    this.mapGUI.updateCommunity(this.community);
    this.setDrawing(c, h)
};
micello.maps.MapData.prototype.updateDrawing = function(a, f) {
    if ((!this.community) || (!this.community.d) || (!a)) {
        return
    }
    var g = this.community.d;
    var h;
    var c;
    var b = g.length;
    for (c = 0; c < b; c++) {
        h = g[c];
        if (h.id == a.id) {
            g[c] = a;
            break
        }
    }
    this.event.drawLoad = 1;
    this.initDrawing(a);
    this.checkGeometryOverlays();
    this.checkMarkerOverlays();
    this.checkInlays();
    this.mapGUI.updateCommunity(this.community);
    this.setDrawing(a, f)
};
micello.maps.MapData.prototype.checkGeometryOverlays = function() {
    var a;
    var b = 0;
    while (b < this.unloadedGOverlays.length) {
        a = this.unloadedGOverlays[b];
        this.addGeometryOverlay(a);
        if (!a.x) {
            this.unloadedGOverlays.splice(b, 1)
        } else {
            b++
        }
    }
};
micello.maps.MapData.prototype.checkInlays = function() {
    var b;
    var a = 0;
    while (a < this.unloadedInlays.length) {
        b = this.unloadedInlays[a];
        this.addInlay(b);
        if (!b.x) {
            this.unloadedInlays.splice(a, 1)
        } else {
            a++
        }
    }
};
micello.maps.MapData.prototype.checkMarkerOverlays = function() {
    var a;
    var b = 0;
    while (b < this.unloadedMOverlays.length) {
        a = this.unloadedMOverlays[b];
        this.addMarkerOverlay(a);
        if (!a.x) {
            this.unloadedMOverlays.splice(b, 1)
        } else {
            b++
        }
    }
};
micello.maps.MapData.prototype.addMarkerToGeom = function(a) {
    var c = this.geomMap[a.id];
    if (c) {
        var b = c.g;
        if (b.l) {
            a.mx = b.l[0];
            a.my = b.l[1]
        } else {
            return
        }
        var f = c.pl;
        if (f) {
            a.lid = f.id;
            this.addMarkerToLevel(a, f)
        }
    } else {
        if (!a.x) {
            a.x = 1;
            this.unloadedMOverlays.push(a)
        }
    }
};
micello.maps.MapData.prototype.addMarkerToLevel = function(a, b) {
    if (a.x) {
        delete a.x
    }
    if (!b.m) {
        b.m = [a]
    } else {
        b.m.push(a)
    }
    this.mapCanvas.addMarker(a)
};
micello.maps.MapData.prototype.addIndividualInlay = function(j) {
    var a = this.getGeometryLevel(j.id);
    if (a) {
        if (j.x) {
            delete j.x
        }
        var g;
        var c;
        var b;
        var h;
        var k = a.gList;
        var m;
        for (k.start();
            ((g = k.currentList()) != null); k.next()) {
            m = k.currentZi();
            b = g.length;
            for (h = 0; h < b; h++) {
                c = g[h];
                if (c.id == j.id) {
                    var f = this.getAddReplaceGeom(c, j);
                    if (f) {
                        g[h] = f;
                        this.mapCanvas.invalidateGeom(c, a.id, m);
                        this.mapCanvas.invalidateGeom(f, a.id, m)
                    }
                    break
                }
            }
        }
    } else {
        if (!j.x) {
            j.x = 1;
            this.unloadedInlays.push(j)
        }
    }
};
micello.maps.MapData.prototype.getAddReplaceGeom = function(c, g) {
    if ((c.base) && (c.base.i.zi >= g.zi)) {
        var a = this.getAddReplaceGeom(c.base.g, g);
        if (a) {
            var b = c.base.i;
            var f = this.applyInlay(a, b);
            return f
        } else {
            return null
        }
    } else {
        return this.applyInlay(c, g)
    }
};
micello.maps.MapData.prototype.applyInlay = function(c, f) {
    var a = this.getCopy(c);
    var b;
    for (b in f) {
        a[b] = f[b]
    }
    a.base = {
        g: c,
        i: f
    };
    return a
};
micello.maps.MapData.prototype.getCopy = function(c) {
    var a = new Object();
    var b;
    for (b in c) {
        a[b] = c[b]
    }
    return a
};
micello.maps.MapData.prototype.getRemoveReplaceGeom = function(c, h, b) {
    if (c.base) {
        var g = b ? c.base.i.anm : c.base.i.aid;
        if (g == h) {
            var f = c.base.i;
            f.proc = false;
            return c.base.g
        } else {
            var a = this.getRemoveReplaceGeom(c.base.g, h, b);
            if (a) {
                var j = this.applyInlay(a, c.base.i);
                return j
            }
        }
    }
    return null
};
micello.maps.MapData.prototype.initCommunity = function() {
    this.currentLevel = null;
    this.currentDrawing = null;
    this.geomMap = {};
    this.levelMap = {};
    this.drawingMap = {};
    this.groupMap = {};
    this.unloadedMOverlays = [];
    this.unloadedGOverlays = [];
    this.unloadedInlays = [];
    var c;
    if ((this.community) && (this.community.d)) {
        var b;
        var a = this.community.d.length;
        for (b = 0; b < a; b++) {
            c = this.community.d[b];
            this.initDrawing(c)
        }
    }
};
micello.maps.MapData.prototype.initDrawing = function(h) {
    var a;
    var j;
    var f;
    this.drawingMap[h.id] = h;
    if (h.l) {
        var c;
        var b = h.l.length;
        for (c = 0; c < b; c++) {
            a = h.l[c];
            if (a.id) {
                this.levelMap[a.id] = {
                    l: a,
                    d: h
                };
                if (a.g) {
                    a.gList = new micello.maps.ZList(a.g);
                    var m;
                    var k = a.g.length;
                    for (m = 0; m < k; m++) {
                        j = a.g[m];
                        this.initShape(j);
                        if (j.id) {
                            f = this.geomMap[j.id];
                            if (!f) {
                                f = {
                                    g: j
                                };
                                this.geomMap[j.id] = f
                            }
                            if (j.r) {
                                f.ml = a
                            } else {
                                f.pl = a
                            }
                            if (j.gid) {
                                f = this.groupMap[j.gid];
                                if (f) {
                                    f.push(j)
                                } else {
                                    f = [j];
                                    this.groupMap[j.gid] = f
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
micello.maps.MapData.prototype.initTransform = function() {
    var c = {};
    var b = this.currentDrawing.t;
    c.mxToLon = b[0];
    c.myToLon = b[2];
    c.mxToLat = b[1];
    c.myToLat = b[3];
    c.lon0 = b[4];
    c.lat0 = b[5];
    var a = c.mxToLon * c.myToLat - c.mxToLat * c.myToLon;
    c.lonToMx = c.myToLat / a;
    c.lonToMy = -c.mxToLat / a;
    c.latToMx = -c.myToLon / a;
    c.latToMy = c.mxToLon / a;
    this.ti = c
};
micello.maps.MapData.prototype.initShape = function(a) {
    if (a.st == null) {
        if (a.shp) {
            a.st = 2
        } else {
            a.st = 0
        }
    }
    if (a.gt == null) {
        if (a.st != 0) {
            a.gt = 2
        } else {
            a.gt = 0
        }
    }
};
micello.maps.MapData.prototype.addToObjectMap = function(b, c) {
    if (!b.id) {
        return
    }
    this.initShape(b);
    var a = this.geomMap[b.id];
    if (!a) {
        a = {
            g: b
        };
        this.geomMap[b.id] = a
    }
    a.pl = c;
    if (b.gid) {
        a = this.groupMap[b.gid];
        if (a) {
            a.push(b)
        } else {
            a = [b];
            this.groupMap[b.gid] = a
        }
    }
};
micello.maps.MapData.prototype.removeFromObjectMap = function(a) {
    if (!a.id) {
        return
    }
    delete this.geomMap[a.id];
    if (a.gid) {
        delete this.groupMap[a.gid]
    }
};
micello.maps.MapData.prototype.getGeometryGroupList = function(a) {
    var b = this.geomMap[a];
    var c = null;
    if (b) {
        c = b.g
    }
    if ((c) && (c.gid)) {
        return this.groupMap[c.gid]
    } else {
        return null
    }
};
micello.maps.MapData.prototype.createId = function() {
    return this.nextId--
};
micello.maps.MapCanvas = function(b, a) {
    this.mapControl = b;
    this.view = null;
    this.data = null;
    this.mapElement = a;
    this.tileMap = {};
    this.mapTheme = null;
    this.themeDrawing = null;
    this.themeList = [];
    this.overrideTheme = null;
    this.themeFamily = "Modern";
    this.popups = [];
    this.onMapClick = null;
    this.getTheme = micello.maps.request.loadTheme;
    this.MAP_FONT = "Arial, Helvetica, sans-serif";
    this.MAP_FONT_CAPS = false;
    this.MAP_FONT_MIN = 14;
    this.MAP_FONT_MAX = 14;
    this.MIN_TEXT_SCALE = null;
    this.MAX_TEXT_SCALE = null;
    this.LABEL_BG_COLOR = "#ffffff";
    this.LABEL_BG_PADDING = 3;
    this.LABEL_BG_MARGIN = 3;
    this.LABEL_BG_RADIUS = 3;
    this.LABEL_BG_STROKE_COLOR = "#666666";
    this.LABEL_BG_SHADOW_COLOR = "#666666";
    this.LABEL_BG_SHADOW_BLUR = 3;
    this.LABEL_BG_SHADOW_XOFF = 1;
    this.LABEL_BG_SHADOW_YOFF = 1;
    this.TILE_SIZE = 256;
    this.DRAW_WAIT = 10;
    this.TILE_FACTOR = 2;
    this.IMAGE_DRAW_WAIT = 500;
    this.SHADOW_COLOR = "#333333";
    this.SHADOW_X = 2;
    this.SHADOW_Y = 2;
    this.SHADOW_BLUR = 3;
    this.minMapX = 0;
    this.minMapY = 0;
    this.maxMapX = 0;
    this.maxMapY = 0;
    this.baseAngleRad = 0;
    this.TEXT_FLIP_BIAS = 5 * Math.PI / 180;
    this.SQAURE_TOL = 0.1;
    this.MAX_SQAURE = Math.PI / 4;
    this.MIN_SQAURE = -Math.PI / 4;
    this.DELTA_SQAURE = Math.PI / 2;
    this.MAX_RECT = Math.PI / 2 + this.TEXT_FLIP_BIAS;
    this.MIN_RECT = -Math.PI / 2 + this.TEXT_FLIP_BIAS;
    this.DELTA_RECT = Math.PI
};
micello.maps.MapCanvas.DEFAULT_MARKER_ZI = 1;
micello.maps.MapCanvas.prototype.createPopup = function() {
    var a = new micello.maps.MapPopup(this, this.mapElement, this.view);
    this.popups.push(a);
    return a
};
micello.maps.MapCanvas.prototype.removePopup = function(a) {
    a.setActive(false);
    var c;
    var b = this.popups.length;
    for (c = 0; c < b; c++) {
        if (this.popups[c] == a) {
            this.popups.splice(c, 1)
        }
    }
};
micello.maps.MapCanvas.prototype.addTheme = function(a) {
    this.themeList.push(a)
};
micello.maps.MapCanvas.prototype.clearThemes = function() {
    this.themeList = []
};
micello.maps.MapCanvas.prototype.getThemes = function() {
    return this.themeList
};
micello.maps.MapCanvas.prototype.setOverrideTheme = function(a) {
    this.overrideTheme = a
};
micello.maps.MapCanvas.prototype.setThemeFamily = function(a) {
    this.themeFamily = a
};
micello.maps.MapCanvas.prototype.getThemeFamily = function() {
    return this.themeFamily
};
micello.maps.MapCanvas.prototype.drawMap = function() {
    micello.maps.asynchDraw.waitDraw(this, this.DRAW_WAIT, this.mapControl.mapName)
};
micello.maps.MapCanvas.prototype.addMarker = function(a) {
    if (!a.mr) {
        return
    }
    var f;
    if (a.mt == micello.maps.markertype.NAMED) {
        if ((this.mapTheme) && (this.mapTheme.loaded)) {
            f = this.mapTheme.getMarker(a.mr);
            if (f.src.substr(0, 4) == "http") {
                srcTmp = f.src.split(":");
                f.src = micello.maps.PROTOCOL + ":" + srcTmp[1]
            }
        }
    } else {
        if (a.mt == micello.maps.markertype.IMAGE) {
            f = a.mr
        }
    }
    if (f) {
        var b = document.createElement("img");
        b.src = f.src;
        b.mapTarget = true;
        b.mapObject = a;
        b.onmousedown = function(g) {
            if (g.preventDefault) {
                g.preventDefault()
            }
        };
        a.cx = 0;
        a.cy = 0;
        if (f.ox != null) {
            a.ox = f.ox
        } else {
            a.ox = 0
        }
        if (f.oy != null) {
            a.oy = f.oy
        } else {
            a.oy = 0
        }
        if (a.zi == null) {
            a.zi = micello.maps.MapCanvas.DEFAULT_MARKER_ZI
        }
        a.element = b;
        b.style.position = "absolute";
        b.style.zIndex = a.zi;
        b.style.top = "0px";
        b.style.left = "0px";
        a.visible = true;
        var c = this.data.getCurrentLevel();
        this.updateMarker(a, c);
        this.mapElement.appendChild(b)
    }
};
micello.maps.MapCanvas.prototype.updateMarker = function(c, f) {
    if ((!f) || (f.id != c.lid)) {
        if (c.visible) {
            c.visible = false;
            c.element.style.display = "none"
        }
    } else {
        if (!c.visible) {
            c.visible = true;
            c.element.style.display = "block"
        }
        var b = this.view.mapToCanvasX(c.mx, c.my);
        var a = this.view.mapToCanvasY(c.mx, c.my);
        if ((b != c.cx) || (a != c.cy)) {
            c.element.style.left = String(b - c.ox) + "px";
            c.element.style.top = String(a - c.oy) + "px";
            c.cx = b;
            c.cy = a
        }
    }
};
micello.maps.MapCanvas.prototype.removeMarker = function(a) {
    if (a.element) {
        this.mapElement.removeChild(a.element)
    }
    delete a.element
};
micello.maps.MapCanvas.prototype.getMarkerCenterX = function(a) {
    if ((!a.ox) || (!a.element)) {
        return Number.NaN
    }
    return a.mx - a.ox + a.element.offsetWidth / 2
};
micello.maps.MapCanvas.prototype.getMarkerCenterY = function(a) {
    if ((!a.oy) || (!a.element)) {
        return Number.NaN
    }
    return a.my - a.oy + a.element.offsetHeight / 2
};
micello.maps.MapCanvas.prototype.updateDomOverlays = function(f, c) {
    var b;
    var g;
    var a = this.popups.length;
    for (b = 0; b < a; b++) {
        this.popups[b].update()
    }
    if (f) {
        g = f.m;
        if (g) {
            a = g.length;
            for (b = 0; b < a; b++) {
                this.updateMarker(g[b], f)
            }
        }
    }
    if (c) {
        g = c.m;
        if (g) {
            a = g.length;
            for (b = 0; b < a; b++) {
                this.updateMarker(g[b], f)
            }
        }
    }
};
micello.maps.MapCanvas.prototype.invalidateGeom = function(b, f, h) {
    if (!b.mm) {
        this.loadGeomMinMax(b)
    }
    var c;
    var g = false;
    for (var a in this.tileMap) {
        c = this.tileMap[a];
        if ((c.lid == f) && (!c.invalid) && (c.mapIntersects(b.mm))) {
            c.invalid = true;
            if (c.connected) {
                g = true
            }
        }
    }
    if (g) {
        this.drawMap()
    }
};
micello.maps.MapCanvas.prototype.updatelevel = function(b, a) {
    this.updateDomOverlays(b, a);
    if (b) {
        this.drawMap()
    } else {
        this.clearCanvas()
    }
};
micello.maps.MapCanvas.prototype.onPan = function(b, a, f, c) {
    if ((b < this.minPixX) || (a < this.minPixY) || (f > this.maxPixX) || (c > this.maxPixY)) {
        this.drawMap()
    }
};
micello.maps.MapCanvas.prototype.onZoom = function() {
    this.prepareZoomCache();
    this.updateDomOverlays(this.data.getCurrentLevel(), null);
    this.drawMap()
};
micello.maps.MapCanvas.prototype.prepareZoomCache = function() {
    if (micello.maps.MapGUI.setCssScale) {
        this.zoomCached = true;
        var b = this.view.getZoom();
        for (var a in this.tileMap) {
            c = this.tileMap[a];
            if (c.connected) {
                c.setZoomCache(b)
            }
        }
    } else {
        var c;
        for (var a in this.tileMap) {
            c = this.tileMap[a];
            if (c.connected) {
                c.disconnect()
            }
        }
    }
};
micello.maps.MapCanvas.prototype.clearZoomCache = function() {
    if (micello.maps.MapGUI.setCssScale) {
        this.zoomCached = false;
        for (var a in this.tileMap) {
            tile = this.tileMap[a];
            if (tile.zoomCache) {
                tile.clearZoomCache(true)
            }
        }
    }
};
micello.maps.MapCanvas.prototype.drawMapExe = function() {
    var r = false;
    var b = this.data.getCurrentLevel();
    if (!b) {
        return
    }
    var H = this.data.getCurrentDrawing();
    if (this.themeDrawing != H) {
        this.loadTheme(H);
        return
    }
    var o = this.mapElement.offsetWidth;
    var g = this.mapElement.offsetHeight;
    var u = this.view.getViewportWidth();
    var h = this.view.getViewportHeight();
    var F = this.view.getViewportX();
    if (F < 0) {
        F = 0
    }
    var E = this.view.getViewportY();
    if (E < 0) {
        E = 0
    }
    var f = F + u;
    if (f > o) {
        f = o
    }
    var c = E + h;
    if (c > g) {
        c = g
    }
    var D = Math.floor(F / this.TILE_SIZE);
    var B = Math.floor(E / this.TILE_SIZE);
    var C = Math.floor(f / this.TILE_SIZE);
    var A = Math.floor(c / this.TILE_SIZE);
    this.minPixX = D * this.TILE_SIZE;
    this.minPixY = B * this.TILE_SIZE;
    this.maxPixX = (C + 1) * this.TILE_SIZE;
    this.maxPixY = (A + 1) * this.TILE_SIZE;
    var k = (C - D + 1) * (A - B + 1) * this.TILE_FACTOR;
    var I;
    var G;
    var m = new Date().getTime();
    var j = null;
    var s;
    var q;
    var w = null;
    for (var p = D; p <= C; p++) {
        for (var n = B; n <= A; n++) {
            I = micello.maps.MapTile.getKey(this.view, b.id, p, n);
            G = this.tileMap[I];
            if (G) {
                G.timeStamp = m;
                if (G.zoomCache) {
                    G.clearZoomCache(false)
                }
                if (G.invalid) {
                    if (!j) {
                        j = G
                    }
                } else {
                    if (!G.connected) {
                        G.connect()
                    }
                }
            } else {
                s = p;
                q = n;
                w = I
            }
        }
    }
    if ((this.zoomCached) && (!j) && (!w)) {
        this.clearZoomCache()
    }
    var a;
    var z = null;
    var t = 0;
    for (var v in this.tileMap) {
        t++;
        G = this.tileMap[v];
        if ((G.timeStamp < m) && (!G.zoomCache)) {
            if (G.connected) {
                G.disconnect()
            }
            if ((!z) || (G.timeStamp < a)) {
                a = G.timeStamp;
                z = G
            }
        }
    }
    if (j) {
        this.drawTile(j);
        r = true
    } else {
        if (w != null) {
            if ((!z) || (t < k)) {
                z = new micello.maps.MapTile(this.mapElement, this.TILE_SIZE, this.TILE_SIZE, 0)
            } else {
                delete this.tileMap[z.key]
            }
            z.init(this.view, b.id, s, q);
            this.tileMap[z.key] = z;
            this.drawTile(z);
            r = true
        }
    }
    if (r) {
        this.drawMap()
    }
};
micello.maps.MapCanvas.prototype.clearCanvas = function() {
    for (var a in this.tileMap) {
        tile = this.tileMap[a];
        if (tile.connected) {
            tile.disconnect()
        }
    }
};
micello.maps.MapCanvas.prototype.drawTile = function(h) {
    var j = this.data.getCurrentLevel();
    if ((!j) || (j.id != h.lid)) {
        return
    }
    if (this.view.getZoomInt() != h.zoomInt) {
        return
    }
    h.canvas.width = h.canvas.width;
    var b = h.canvas.getContext("2d");
    if (this.MIN_TEXT_SCALE != null) {
        this.MAP_FONT_MIN = this.MIN_TEXT_SCALE * 10
    }
    if (this.MAX_TEXT_SCALE != null) {
        this.MAP_FONT_MAX = this.MAX_TEXT_SCALE * 10
    }
    this.MAP_FONT_MIN = parseInt(this.MAP_FONT_MIN);
    this.MAP_FONT_MAX = parseInt(this.MAP_FONT_MAX);
    b.font = this.MAP_FONT_MAX + "px " + this.MAP_FONT + ", arial";
    b.lineJoin = "round";
    b.lineCap = "round";
    if (b) {
        var f = this.view.getM2C();
        var a = this.view.getC2M();
        b.translate(-h.elementX, -h.elementY);
        b.transform(f[0], f[1], f[2], f[3], f[4], f[5]);
        var c;
        var g = j.gList;
        for (g.start();
            ((c = g.currentList()) != null); g.next()) {
            this.render(b, c, h)
        }
        b.transform(a[0], a[1], a[2], a[3], a[4], a[5]);
        b.translate(h.elementX, h.elementY)
    }
    h.invalid = false;
    if (!h.connected) {
        h.connect()
    }
};
micello.maps.MapCanvas.prototype.render = function(x, k, f) {
    if ((!this.mapTheme) || (!this.mapTheme.loaded)) {
        return
    }
    var S = k.length;
    var H = f.scale;
    for (var ad = 0; ad < S; ad++) {
        var n = k[ad];
        if (!n.mm) {
            this.loadGeomMinMax(n)
        }
        if ((n.mm) && (!f.mapIntersects(n.mm))) {
            continue
        }
        if (n.st == 2) {
            var W;
            if (n.os) {
                W = n.os
            } else {
                W = this.mapTheme.getStyle(n.t)
            }
            if (W == undefined) {
                W = this.mapTheme.getStyle("Object")
            }
            if (W == undefined) {
                continue
            }
            this.renderPath(x, n, W, H, f)
        }
    }
    for (var ad = 0; ad < S; ad++) {
        var n = k[ad];
        if ((n.mm) && (!f.mapIntersects(n.mm))) {
            continue
        }
        var v = n.lt;
        var ae = n.lr;
        var aj = n.l;
        if ((aj != null) && (ae != undefined)) {
            if (!v) {
                v = 1
            }
            var t = aj[2];
            var r = aj[3];
            var z = aj[4];
            if (t <= 0) {
                t = 1
            }
            if (r <= 0) {
                r = 1
            }
            var N;
            var af;
            var o = null;
            var M = null;
            var O = null;
            var L = null;
            var j = null;
            var u;
            var s;
            if (v == 1) {
                if (n.os) {
                    W = n.os
                } else {
                    W = this.mapTheme.getStyle(n.t)
                }
                if (!W) {
                    continue
                }
                M = W.t;
                if (!M) {
                    continue
                }
                O = W.label;
                if (this.MAP_FONT_CAPS) {
                    ae = ae.toUpperCase()
                }
                var A = n.tc;
                if ((!A) || (A.lr != ae)) {
                    var P = x.measureText(ae);
                    var K = P.width;
                    var E = this.MAP_FONT_MAX;
                    if (O) {
                        var X = (O.margin != undefined) ? parseInt(O.margin) : this.LABEL_BG_MARGIN;
                        var V = (O.padding != undefined) ? parseInt(O.padding) : this.LABEL_BG_PADDING;
                        K += (X * 2) + (V * 2);
                        E += (X * 2) + (V * 2)
                    }
                    A = {
                        lr: ae,
                        w1: K,
                        h1: E,
                        margin: X,
                        padding: V
                    };
                    var T = ae.length / 2;
                    var I = -1;
                    var Q;
                    var R = null;
                    var ai;
                    var ag;
                    while ((ag = ae.indexOf(" ", I + 1)) >= 0) {
                        I = ag;
                        Q = Math.abs(ag - T);
                        if (R) {
                            if (Q < ai) {
                                R = I;
                                ai = Q
                            }
                        } else {
                            R = I;
                            ai = Q
                        }
                    }
                    if (R) {
                        var G = ae.substr(0, R);
                        var D = ae.substr(R + 1, ae.length);
                        var ac = x.measureText(G).width;
                        var aa = x.measureText(D).width;
                        var J = ac > aa ? ac : aa;
                        var C = 2 * this.MAP_FONT_MAX;
                        if (O) {
                            J += (X * 2) + (V * 2);
                            C += (X * 2) + (V * 2)
                        }
                        var ab = this.getScaleFactor(t, r, K, E);
                        var Z = this.getScaleFactor(t, r, J, C);
                        if (Z > ab) {
                            A.sc = 1 / ab;
                            A.sa = G;
                            A.sb = D;
                            A.w2 = J;
                            A.h2 = C
                        }
                    }
                    n.tc = A
                }
                if ((A.sc)) {
                    N = A.w2;
                    af = A.h2;
                    ae = A.sa;
                    L = A.sb
                } else {
                    N = A.w1;
                    af = A.h1
                }
                X = A.margin;
                V = A.padding;
                u = 0;
                s = 0
            } else {
                if ((v == 2) || (v == 4)) {
                    if (v == 2) {
                        o = this.mapTheme.getIcon(ae)
                    } else {
                        o = ae
                    }
                    if (!o) {
                        continue
                    }
                    N = o.w;
                    af = o.h;
                    u = -N / 2;
                    s = -af / 2
                } else {
                    if (v == 3) {
                        if ((!n.imgInfo) || (n.imgInfo.labRef != ae)) {
                            var a = {};
                            a.pending = [f];
                            a.img = new Image();
                            a.labRef = ae;
                            n.imgInfo = a;
                            var ah = this;
                            a.img.imgInfo = a;
                            n.imgInfo.img.onload = function() {
                                var c = this.imgInfo;
                                ah.updateImages(c)
                            };
                            a.img.src = ae;
                            j = null
                        } else {
                            if (n.imgInfo.pending) {
                                if (!this.arrayContains(n.imgInfo.pending, f)) {
                                    n.imgInfo.pending.push(f)
                                }
                                j = null
                            } else {
                                j = n.imgInfo.img;
                                N = j.width;
                                af = j.height;
                                u = -N / 2;
                                s = -af / 2
                            }
                        }
                    }
                }
            }
            if (N <= 0) {
                N = 1
            }
            if (af <= 0) {
                af = 1
            }
            var g = this.getScaleFactor(t, r, N, af);
            var q = ((Math.abs(af / N - 1) < this.SQAURE_TOL) || (Math.abs(r / t - 1) < this.SQUARE_TOL));
            var B = false;
            if (v == 1) {
                var U = g * H;
                // if (U * this.MAP_FONT_MAX < this.MAP_FONT_MIN) {
                //     continue
                // }
                if (U > 1) {
                    g = 1 / H;
                    B = (N * g < r)
                }
            }
            if (B) {
                z = this.baseAngleRad
            } else {
                var b = z - this.baseAngleRad;
                if (q) {
                    while (b > this.MAX_SQAURE) {
                        b -= this.DELTA_SQAURE;
                        z -= this.DELTA_SQAURE
                    }
                    while (b < this.MIN_SQAURE) {
                        b += this.DELTA_SQAURE;
                        z += this.DELTA_SQAURE
                    }
                } else {
                    while (b > this.MAX_RECT) {
                        b -= this.DELTA_RECT;
                        z -= this.DELTA_RECT
                    }
                    while (b < this.MIN_RECT) {
                        b += this.DELTA_RECT;
                        z += this.DELTA_RECT
                    }
                }
            }
            x.translate(aj[0], aj[1]);
            x.rotate(z);
            if(v!=1) {
                x.scale(g, g);
            }
            x.translate(u, s);
            if (M) {
                if (O) {
                    this.drawLabelBackground(x, N, af, X, V, O)
                }
                x.fillStyle = M;
                x.textAlign = "center";
                x.textBaseline = "middle";
                if (L) {
                    x.fillText(ae, 0, -this.MAP_FONT_MAX / 2);
                    x.fillText(L, 0, this.MAP_FONT_MAX / 2)
                } else {
                    x.fillText(ae, 0, 0)
                }
            } else {
                if (o) {
                    var F;
                    var Y = o.g.length;
                    for (F = 0; F < Y; F++) {
                        var y = o.g[F];
                        if (y.os) {
                            W = y.os
                        } else {
                            W = this.mapTheme.getStyle(y.t)
                        }
                        if (!W) {
                            continue
                        }
                        this.renderPath(x, y, W, H)
                    }
                } else {
                    if (j) {
                        x.drawImage(j, 0, 0)
                    }
                }
            }
            x.translate(-u, -s);
            if(v!=1) {
                x.scale(1 / g, 1 / g);
            }
            x.rotate(-z);
            x.translate(-aj[0], -aj[1])
        }
    }
};
micello.maps.MapCanvas.prototype.getScaleFactor = function(h, b, c, a) {
    var g = h / c;
    var f = b / a;
    return (g > f) ? f : g
};
micello.maps.MapCanvas.prototype.drawLabelBackground = function(o, k, f, c, b, n) {
    o.fillStyle = (n.m) ? n.m : this.LABEL_BG_COLOR;
    var a = (n.radius != undefined) ? parseInt(n.radius) : this.LABEL_BG_RADIUS;
    k = k - (c * 2);
    f = f - (c * 2);
    var j = -(k / 2) - (b / 2);
    var g = -(f / 2) - (b / 2);
    o.beginPath();
    o.moveTo(j + a, g);
    o.lineTo(j + (k + b) - a, g);
    o.quadraticCurveTo(j + (k + b), g, j + (k + b), g + a);
    o.lineTo(j + (k + b), g + (f + b) - a);
    o.quadraticCurveTo(j + (k + b), g + (f + b), j + (k + b) - a, g + (f + b));
    o.lineTo(j + a, g + (f + b));
    o.quadraticCurveTo(j, g + (f + b), j, g + (f + b) - a);
    o.lineTo(j, g + a);
    o.quadraticCurveTo(j, g, j + a, g);
    o.closePath();
    if (n.shadow) {
        if (n.shadow == true) {
            o.shadowColor = this.LABEL_BG_SHADOW_COLOR;
            o.shadowBlur = this.LABEL_BG_SHADOW_BLUR;
            o.shadowOffsetX = this.LABEL_BG_SHADOW_XOFF;
            o.shadowOffsetY = this.LABEL_BG_SHADOW_YOFF
        } else {
            if (n.shadow == false) {
                o.shadowColor = "rgba(0,0,0,0.0)"
            } else {
                o.shadowColor = n.shadow[0];
                o.shadowBlur = n.shadow[1];
                o.shadowOffsetX = n.shadow[2];
                o.shadowOffsetY = n.shadow[3]
            }
        }
    } else {
        o.shadowColor = "rgba(0,0,0,0.0)"
    }
    o.fill();
    o.shadowColor = "rgba(0,0,0,0.0)";
    if (n.o) {
        o.strokeStyle = n.o;
        o.stroke()
    }
};
micello.maps.MapCanvas.prototype.renderPath = function(q, k, a, c, g) {
    var m = k.gt;
    if (m == undefined) {
        m = 2
    }
    var t = k.gw;
    var u = k.shp;
    var o;
    q.beginPath();
    var b = u.length;
    for (var f = 0; f < b; f++) {
        o = u[f];
        switch (o[0]) {
            case 0:
                q.moveTo(o[1], o[2]);
                break;
            case 1:
                q.lineTo(o[1], o[2]);
                break;
            case 2:
                q.quadraticCurveTo(o[1], o[2], o[3], o[4]);
                break;
            case 3:
                q.bezierCurveTo(o[1], o[2], o[3], o[4], o[5], o[6]);
                break;
            case 4:
                q.closePath();
                break
        }
    }
    if (m == 2) {
        if (a.shadow != undefined && a.shadow != false) {
            var r = a.shadow;
            if (r === true) {
                q.shadowColor = this.SHADOW_COLOR;
                q.shadowBlur = this.SHADOW_BLUR * (c * 1.5);
                q.shadowOffsetX = this.SHADOW_X * (c + 1);
                q.shadowOffsetY = this.SHADOW_Y * (c + 1)
            } else {
                q.shadowColor = r[0];
                q.shadowBlur = r[1] * (c * 2);
                q.shadowOffsetX = r[2] * (c + 1);
                q.shadowOffsetY = r[3] * (c + 1)
            }
        }
        if (a.m != undefined) {
            q.fillStyle = a.m;
            q.fill()
        }
        q.shadowColor = "rgba(0,0,0,0)";
        if (a.img != undefined && a.img != false) {
            if (!a.pattern && !a.error) {
                var p = {};
                p.pending = [g];
                p.img = new Image();
                var n = this;
                p.img.onload = function() {
                    n.updateImages(p)
                };
                if (a.img == true) {
                    p.img.src = micello.maps.SCRIPT_URL + "/webmap/patterns/" + k.t + ".png"
                } else {
                    if (a.img.substr(0, 4)) {
                        srcTmp = a.img.split(":");
                        finalUrl = micello.maps.PROTOCOL + ":" + srcTmp[1]
                    } else {
                        finalUrl = micello.maps.PROTOCOL + "://" + a.img
                    }
                    p.img.src = finalUrl
                }
                a.error = false;
                p.img.onerror = function(s) {
                    a.error = true
                };
                try {
                    var j = q.createPattern(p.img, "repeat")
                } catch (h) {}
                a.pattern = j
            }
            if (a.pattern) {
                q.fillStyle = a.pattern;
                q.fill()
            }
        }
        if ((a.o != undefined) && (a.w)) {
            q.strokeStyle = a.o;
            q.lineWidth = a.w / c;
            q.stroke()
        }
    } else {
        if (m == 3) {
            if (a.m != undefined) {
                q.strokeStyle = a.m;
                q.lineWidth = t;
                q.stroke()
            }
        } else {
            if (m == 1) {
                if ((a.m != undefined) && (a.w)) {
                    q.strokeStyle = a.m;
                    q.lineWidth = a.w / c;
                    q.stroke()
                }
            } else {
                micello.maps.onMapError("other geom type: " + m)
            }
        }
    }
};
micello.maps.MapCanvas.prototype.clickMouse = function(g, f, a) {
    var j = this.view.canvasToMapX(g, f);
    var h = this.view.canvasToMapY(g, f);
    var b = this.data.getCurrentLevel();
    if (!a) {
        var k;
        var c;
        var m = b.gList;
        for (m.start();
            ((c = m.currentList()) != null); m.next()) {
            k = this.hitCheck(c, j, h);
            if (k) {
                a = k
            }
        }
    }
    if (this.onMapClick) {
        this.onMapClick(j, h, a)
    }
};
micello.maps.MapCanvas.prototype.hitCheck = function(c, m, j) {
    var g = null;
    var f;
    var b = c.length;
    for (f = 0; f < b; f++) {
        var h = c[f];
        var k = h.gt;
        if ((k != 2) && (k != 0)) {
            continue
        }
        if ((h.shp) || ((h.l) && ((!h.shp) || (h.el)))) {
            if (!h.mm) {
                this.loadGeomMinMax(h)
            }
            if ((m > h.mm[0][0]) && (j > h.mm[0][1]) && (m < h.mm[1][0]) && (j < h.mm[1][1])) {
                var a = false;
                if (h.shp) {
                    if (micello.geom.pathHit(h.shp, m, j)) {
                        a = true
                    }
                }
                if ((h.l) && ((!h.shp) || (h.el))) {
                    if (micello.geom.rotRectHit(h.l, m, j)) {
                        a = true
                    }
                }
                if (a) {
                    g = h
                }
            }
        }
    }
    return g
};
micello.maps.MapCanvas.prototype.updateImages = function(f) {
    var c = f.pending;
    if (!c) {
        return
    }
    delete f.pending;
    var a;
    var b;
    for (a = 0; a < c.length; a++) {
        b = c[a];
        b.invalid = true
    }
    micello.maps.asynchDraw.waitDraw(this, this.IMAGE_DRAW_WAIT, this.mapControl.mapName)
};
micello.maps.MapCanvas.prototype.check = function(c, a) {
    var b;
    for (b = 0; b < c.length; b++) {
        if (c[b] == a) {
            return
        }
    }
    c.push(a)
};
micello.maps.MapCanvas.prototype.loadTheme = function(k) {
    var g;
    var f;
    var a;
    var c;
    if (k) {
        if (k.mts) {
            c = k.mts.length;
            a = new Array(c);
            for (g = 0; g < c; g++) {
                a[g] = k.mts[g][0]
            }
        } else {
            if (k.mt) {
                a = k.mt.split("|");
                this.check(a, "General");
                this.check(a, "Traffic");
                this.check(a, "Outdoor");
                c = a.length
            } else {
                micello.maps.onMapError("Map format error");
                return
            }
        }
        this.mapTheme = new micello.maps.MapTheme(a);
        this.themeDrawing = k
    } else {
        return
    }
    var n;
    var h = false;
    var m;
    for (f = 0; f < c; f++) {
        h = false;
        m = a[f];
        for (g = 0; g < this.themeList.length; g++) {
            n = this.themeList[g];
            if (n.mt == m) {
                this.mapTheme.placeTheme(n);
                h = true
            }
        }
        if (!h) {
            var o = this;
            var b = function(j) {
                o.onThemeLoaded(j)
            };
            this.getTheme(b, m, this.themeFamily)
        }
    }
    if (this.overrideTheme) {
        this.mapTheme.insertTheme(this.overrideTheme, 0)
    }
    if (this.mapTheme.loaded) {
        this.mapThemeLoaded()
    }
};
micello.maps.MapCanvas.prototype.onThemeLoaded = function(a) {
    this.themeList.push(a);
    if (this.mapTheme) {
        this.mapTheme.placeTheme(a);
        if (this.mapTheme.loaded) {
            this.mapThemeLoaded()
        }
    }
};
micello.maps.MapCanvas.prototype.mapThemeLoaded = function() {
    if (this.mapTheme) {
        var m = this.data.getCommunity();
        if (!m) {
            return
        }
        var c;
        var b;
        var j;
        var k;
        var a;
        var h;
        for (c = 0; c < m.d.length; c++) {
            j = m.d[c];
            if (!j.l) {
                continue
            }
            for (b = 0; b < j.l.length; b++) {
                l = j.l[k];
                for (k = 0; k < j.l.length; k++) {
                    a = j.l[k];
                    var g = a.m;
                    if (g) {
                        var f = g.length;
                        for (h = 0; h < f; h++) {
                            if (!g[h].element) {
                                this.addMarker(g[h])
                            }
                        }
                    }
                }
            }
        }
        this.drawMap()
    }
};
micello.maps.MapCanvas.prototype.loadGeomMinMax = function(a) {
    var b = micello.geom.getInvalidMinMax();
    if (a.shp) {
        micello.geom.loadPathMinMax(a.shp, b)
    }
    if ((a.l) && ((!a.shp) || (a.el))) {
        micello.geom.loadRotRectMinMax(a.l, b)
    }
    a.mm = b
};
micello.maps.MapCanvas.prototype.arrayContains = function(b, f) {
    var c;
    for (c = 0; c < b.length; c++) {
        if (b[c] == f) {
            return true
        }
    }
    return false
};
micello.maps.asynchDraw = {
    maps: {},
    waitDraw: function(c, a, b) {
        var f = this.maps[b];
        if (!f) {
            f = {};
            f.active = false;
            this.maps[b] = f
        }
        if (!f.active) {
            f.active = true;
            f.mapCanvas = c;
            setTimeout("micello.maps.asynchDraw.drawMap('" + b + "')", a)
        }
    },
    drawMap: function(a) {
        var b = this.maps[a];
        if (!b) {
            return
        }
        b.active = false;
        b.mapCanvas.drawMapExe()
    }
};
micello.maps.MapTile = function(b, c, a, f) {
    this.mapElement = b;
    this.canvas = document.createElement("canvas");
    this.canvas.style.position = "absolute";
    this.canvas.style.zIndex = f;
    this.canvas.style.display = "none";
    this.canvas.mapTarget = true;
    this.mapElement.appendChild(this.canvas);
    this.width = c;
    this.height = a;
    this.canvas.width = c;
    this.canvas.height = a;
    this.invalid = true;
    this.connected = false;
    this.clearZoomCache(false)
};
micello.maps.MapTile.prototype.init = function(a, b, f, c) {
    this.lid = b;
    this.zoomInt = a.getZoomInt();
    this.tileX = f;
    this.tileY = c;
    this.elementX = f * this.width;
    this.elementY = c * this.height;
    this.elementMaxX = this.elementX + this.width;
    this.elementMaxY = this.elementY + this.height;
    this.setMinMax(a);
    this.scale = a.getZoom();
    this.key = micello.maps.MapTile.getKey(a, b, f, c);
    this.invalid = true;
    this.connected = false;
    this.zoomCache = false
};
micello.maps.MapTile.prototype.setMinMax = function(a) {
    this.minX = a.canvasToMapX(this.elementX, this.elementY);
    this.minY = a.canvasToMapY(this.elementX, this.elementY);
    this.maxX = this.minX;
    this.maxY = this.minY;
    this.updateMinMax(a, this.elementMaxX, this.elementY);
    this.updateMinMax(a, this.elementX, this.elementMaxY);
    this.updateMinMax(a, this.elementMaxX, this.elementMaxY)
};
micello.maps.MapTile.prototype.updateMinMax = function(f, a, g) {
    var c = f.canvasToMapX(a, g);
    if (c < this.minX) {
        this.minX = c
    }
    if (c > this.maxX) {
        this.maxX = c
    }
    var b = f.canvasToMapY(a, g);
    if (b < this.minY) {
        this.minY = b
    }
    if (b > this.maxY) {
        this.maxY = b
    }
};
micello.maps.MapTile.getKey = function(a, b, f, c) {
    return b + "|" + a.getZoomInt() + "|" + f + "|" + c
};
micello.maps.MapTile.prototype.disconnect = function() {
    this.canvas.style.display = "none";
    this.connected = false
};
micello.maps.MapTile.prototype.connect = function() {
    this.canvas.style.left = this.elementX + "px";
    this.canvas.style.top = this.elementY + "px";
    this.canvas.style.display = "block";
    this.connected = true
};
micello.maps.MapTile.prototype.mapIntersects = function(a) {
    return ((this.minX < a[1][0]) && (this.minY < a[1][1]) && (this.maxX > a[0][0]) && (this.maxY > a[0][1]))
};
micello.maps.MapTile.prototype.setZoomCache = function(b) {
    if (micello.maps.MapGUI.setCssScale) {
        this.zoomCache = true;
        var a = b / this.scale;
        micello.maps.MapGUI.setCssScale(this.canvas, a);
        this.canvas.style.left = (a * this.elementX + (a - 1) * this.width / 2) + "px";
        this.canvas.style.top = (a * this.elementY + (a - 1) * this.width / 2) + "px"
    }
};
micello.maps.MapTile.prototype.clearZoomCache = function(a) {
    if (micello.maps.MapGUI.setCssScale) {
        this.zoomCache = false;
        micello.maps.MapGUI.setCssScale(this.canvas, 1);
        if (a) {
            this.disconnect()
        }
    }
};
micello.maps.MapTheme = function(a) {
    this.themeNames = a;
    this.themes = new Array(a.length);
    this.loaded = false
};
micello.maps.MapTheme.prototype.placeTheme = function(c) {
    var b = this.themeNames.length;
    var f = true;
    for (var a = 0; a < b; a++) {
        if (c.mt == this.themeNames[a]) {
            this.themes[a] = c
        }
        if (!this.themes[a]) {
            f = false
        }
    }
    if (f) {
        this.loaded = true
    }
};
micello.maps.MapTheme.prototype.insertTheme = function(b, a) {
    this.themes.splice(a, 0, b);
    this.themeNames.splice(a, 0, "ot")
};
micello.maps.MapTheme.prototype.getStyle = function(b) {
    var f = this.themeNames.length;
    var g;
    var a;
    for (var c = 0; c < f; c++) {
        g = this.themes[c];
        if ((g) && (g.s)) {
            a = g.s[b];
            if (a) {
                return a
            }
        }
    }
    return null
};
micello.maps.MapTheme.prototype.getIcon = function(b) {
    var f = this.themeNames.length;
    var g;
    var a;
    for (var c = 0; c < f; c++) {
        g = this.themes[c];
        if ((g) && (g.ic)) {
            a = g.ic[b];
            if (a) {
                return a
            }
        }
    }
    return null
};
micello.maps.MapTheme.prototype.getMarker = function(b) {
    var f = this.themeNames.length;
    var g;
    var a;
    for (var c = 0; c < f; c++) {
        g = this.themes[c];
        if ((g) && (g.m)) {
            a = g.m[b];
            if (a) {
                return a
            }
        }
    }
    return null
};
micello.maps.MapView = function(f, b, a, g, c) {
    this.mapControl = f;
    this.mapCanvas = g;
    this.mapGUI = c;
    this.viewport = b;
    this.mapElement = a;
    this.mapXInViewport = 0;
    this.mapYInViewport = 0;
    this.scale = 0;
    this.zoomInt = 0;
    this.setQuantizedScale(1);
    this.m2c = [1, 0, 0, 1, 0, 0];
    this.c2m = [1, 0, 0, 1, 0, 0];
    this.baseM2C = [1, 0, 0, 1];
    this.baseC2M = [1, 0, 0, 1];
    this.baseOffM = [0, 0];
    this.baseOffC = [0, 0];
    this.northAtTop = false;
    this.customView = false;
    this.onViewChange = null;
    this.event = {};
    this.defaultMapX = 0;
    this.defaultMapY = 0;
    this.defaultW = 0;
    this.defaultH = 0;
    this.drawingSet = false;
    this.offsetXFraction = 0.5;
    this.offsetYFraction = 0.5;
    this.minWidthFraction = 1;
    this.minHeightFraction = 1
};
micello.maps.MapView.prototype.translate = function(b, a) {
    var f = this.mapXInViewport + b;
    var c = this.mapYInViewport + a;
    if ((f + this.baseWidth * this.scale < this.viewport.offsetWidth * this.offsetXFraction) || (f > this.viewport.offsetWidth * this.offsetXFraction) || (c + this.baseHeight * this.scale < this.viewport.offsetHeight * this.offsetYFraction) || (c > this.viewport.offsetHeight * this.offsetYFraction)) {
        return
    }
    this.mapXInViewport = f;
    this.mapYInViewport = c;
    this.mapElement.style.left = this.mapXInViewport + "px";
    this.mapElement.style.top = this.mapYInViewport + "px";
    this.mapCanvas.onPan(-this.mapXInViewport, -this.mapYInViewport, -this.mapXInViewport + this.viewport.offsetWidth, -this.mapYInViewport + this.viewport.offsetHeight);
    if (this.onViewChange) {
        this.event.pan = 1;
        this.event.zoom = 0;
        this.onViewChange(this.event)
    }
};
micello.maps.MapView.prototype.zoomIn = function(b, a) {
    this.setZoom(this.scale * 2, b, a)
};
micello.maps.MapView.prototype.zoomOut = function(b, a) {
    this.setZoom(this.scale / 2, b, a)
};
micello.maps.MapView.prototype.setZoom = function(b, k, j) {
    if ((b * this.baseWidth < this.viewport.offsetWidth * this.minWidthFraction) && (b * this.baseHeight < this.viewport.offsetHeight * this.minHeightFraction)) {
        var m = this.viewport.offsetWidth * this.minWidthFraction / this.baseWidth;
        var h = this.viewport.offsetHeight * this.minHeightFraction / this.baseHeight;
        b = (h < m) ? h : m
    }
    if (!k) {
        k = this.viewport.offsetWidth * this.offsetXFraction - this.mapXInViewport;
        j = this.viewport.offsetHeight * this.offsetYFraction - this.mapYInViewport
    }
    if (b <= 0) {
        b = 1
    }
    var g = this.scale;
    this.setQuantizedScale(b);
    this.setTransformScale();
    var a = Math.ceil(this.baseWidth * this.scale);
    var n = Math.ceil(this.baseHeight * this.scale);
    var f = k * this.scale / g;
    var c = j * this.scale / g;
    this.mapXInViewport += k - f;
    this.mapYInViewport += j - c;
    if (this.mapXInViewport + a < this.viewport.offsetWidth * this.offsetXFraction) {
        this.mapXInViewport = this.viewport.offsetWidth * this.offsetXFraction - a
    } else {
        if (this.mapXInViewport > this.viewport.offsetWidth * this.offsetXFraction) {
            this.mapXInViewport = this.viewport.offsetWidth * this.offsetXFraction
        }
    }
    if (this.mapYInViewport + n < this.viewport.offsetHeight * this.offsetYFraction) {
        this.mapYInViewport = this.viewport.offsetHeight * this.offsetYFraction - n
    } else {
        if (this.mapYInViewport > this.viewport.offsetHeight * this.offsetYFraction) {
            this.mapYInViewport = this.viewport.offsetHeight * this.offsetYFraction
        }
    }
    micello.maps.MapGUI.setCssOrigin(this.mapElement, 0, 0);
    micello.maps.MapGUI.setCssScale(this.mapElement, 1);
    this.mapElement.style.width = a + "px";
    this.mapElement.style.height = n + "px";
    this.mapElement.style.left = this.mapXInViewport + "px";
    this.mapElement.style.top = this.mapYInViewport + "px";
    this.mapCanvas.onZoom();
    if (this.mapGUI.MAP_SCALE_VIEW != "off") {
        this.mapGUI.onResize()
    }
    if (this.onViewChange) {
        this.event.pan = 0;
        this.event.zoom = 1;
        this.onViewChange(this.event)
    }
};
micello.maps.MapView.prototype.setView = function(f, c, b, a) {
    this.defaultMapX = f;
    this.defaultMapY = c;
    this.defaultW = b;
    this.defaultH = a;
    this.resetView();
    this.mapCanvas.onZoom();
    if (this.onViewChange) {
        this.event.pan = 0;
        this.event.zoom = 1;
        this.onViewChange(this.event)
    }
};
micello.maps.MapView.prototype.recenter = function(h, g) {
    var f = this.scale * h;
    var b = this.scale * g;
    var c = this.viewport.offsetWidth * this.offsetXFraction - this.mapXInViewport;
    var a = this.viewport.offsetHeight * this.offsetYFraction - this.mapYInViewport;
    this.translate(c - f, a - b)
};
micello.maps.MapView.prototype.getZoom = function() {
    return this.scale
};
micello.maps.MapView.prototype.getZoomInt = function() {
    return this.zoomInt
};
micello.maps.MapView.prototype.home = function() {
    this.resetView();
    this.mapCanvas.onZoom();
    if (this.onViewChange) {
        this.event.pan = 0;
        this.event.zoom = 1;
        this.onViewChange(this.event)
    }
};
micello.maps.MapView.prototype.getViewportWidth = function() {
    return this.viewport.clientWidth
};
micello.maps.MapView.prototype.getViewportHeight = function() {
    return this.viewport.clientHeight
};
micello.maps.MapView.prototype.canvasToMapX = function(b, a) {
    return this.c2m[0] * b + this.c2m[2] * a + this.c2m[4]
};
micello.maps.MapView.prototype.canvasToMapY = function(b, a) {
    return this.c2m[1] * b + this.c2m[3] * a + this.c2m[5]
};
micello.maps.MapView.prototype.mapToCanvasX = function(b, a) {
    return this.m2c[0] * b + this.m2c[2] * a + this.m2c[4]
};
micello.maps.MapView.prototype.mapToCanvasY = function(b, a) {
    return this.m2c[1] * b + this.m2c[3] * a + this.m2c[5]
};
micello.maps.MapView.prototype.viewportToMapX = function(b, a) {
    return this.canvasToMapX(b - this.mapXInViewport, a - this.mapYInViewport)
};
micello.maps.MapView.prototype.viewportToMapY = function(b, a) {
    return this.canvasToMapY(b - this.mapXInViewport, a - this.mapYInViewport)
};
micello.maps.MapView.prototype.getViewportX = function() {
    return -this.mapXInViewport
};
micello.maps.MapView.prototype.getViewportY = function() {
    return -this.mapYInViewport
};
micello.maps.MapView.prototype.getM2C = function() {
    return this.m2c
};
micello.maps.MapView.prototype.getC2M = function() {
    return this.c2m
};
micello.maps.MapView.prototype.updateDrawing = function(c) {
    if ((c) && (this.northAtTop) && (c.ar)) {
        this.setBaseAngRad(-c.ar)
    } else {
        if (!this.customView) {
            this.setBaseAngRad(0)
        }
    }
    var f;
    for (f = 0; f < 4; f++) {
        this.m2c[f] = this.baseM2C[f];
        this.c2m[f] = this.baseC2M[f]
    }
    this.m2c[4] = 0;
    this.m2c[5] = 0;
    this.c2m[4] = 0;
    this.c2m[5] = 0;
    if (!c) {
        this.baseWidth = 0;
        this.baseHeight = 0;
        this.defaultMapX = 0;
        this.defaultMapY = 0;
        this.defaultW = 0;
        this.defaultH = 0;
        this.drawingSet = false
    } else {
        var b = [];
        b.push([this.mapToCanvasX(c.w, 0), this.mapToCanvasY(c.w, 0)]);
        b.push([this.mapToCanvasX(0, c.h), this.mapToCanvasY(0, c.h)]);
        b.push([this.mapToCanvasX(c.w, c.h), this.mapToCanvasY(c.w, c.h)]);
        var a = 0;
        var j = 0;
        var h = 0;
        var g = 0;
        for (f = 0; f < 3; f++) {
            if (a > b[f][0]) {
                a = b[f][0]
            }
            if (j > b[f][1]) {
                j = b[f][1]
            }
            if (h < b[f][0]) {
                h = b[f][0]
            }
            if (g < b[f][1]) {
                g = b[f][1]
            }
        }
        this.baseOffM[0] = -a;
        this.baseOffM[1] = -j;
        this.baseWidth = h - a;
        this.baseHeight = g - j;
        this.baseOffC[0] = -this.canvasToMapX(-a, -j);
        this.baseOffC[1] = -this.canvasToMapY(-a, -j);
        if (c.v) {
            this.defaultMapX = c.v.cx;
            this.defaultMapY = c.v.cy;
            this.defaultW = c.v.w;
            this.defaultH = c.v.h
        } else {
            this.defaultMapX = c.w / 2;
            this.defaultMapY = c.h / 2;
            this.defaultW = this.baseWidth;
            this.defaultH = this.baseHeight
        }
        this.drawingSet = true
    }
    this.resetView()
};
micello.maps.MapView.prototype.resetView = function() {
    if ((this.drawingSet) && (this.defaultW > 0) && (this.defaultH > 0)) {
        var c = (this.offsetXFraction > 0.5) ? 2 * (1 - this.offsetXFraction) : 2 * this.offsetXFraction;
        var j = (this.offsetYFraction > 0.5) ? 2 * (1 - this.offsetYFraction) : 2 * this.offsetYFraction;
        var b = this.viewport.clientWidth * c / this.defaultW;
        var g = this.viewport.clientHeight * j / this.defaultH;
        var h = (b > g) ? g : b;
        this.setQuantizedScale(h)
    } else {
        this.setQuantizedScale(1)
    }
    this.setTransformScale();
    var f = this.baseWidth * this.scale;
    var a = this.baseHeight * this.scale;
    this.mapXInViewport = this.viewport.offsetWidth * this.offsetXFraction - this.mapToCanvasX(this.defaultMapX, this.defaultMapY);
    this.mapYInViewport = this.viewport.offsetHeight * this.offsetYFraction - this.mapToCanvasY(this.defaultMapX, this.defaultMapY);
    this.mapElement.style.width = f + "px";
    this.mapElement.style.height = a + "px";
    this.mapElement.style.left = this.mapXInViewport + "px";
    this.mapElement.style.top = this.mapYInViewport + "px"
};
micello.maps.MapView.prototype.setTransformScale = function() {
    var a;
    for (a = 0; a < 4; a++) {
        this.m2c[a] = this.baseM2C[a] * this.scale;
        this.c2m[a] = this.baseC2M[a] / this.scale
    }
    for (a = 0; a < 2; a++) {
        this.m2c[4 + a] = this.baseOffM[a] * this.scale;
        this.c2m[4 + a] = this.baseOffC[a]
    }
};
micello.maps.MapView.SCALE_QUANT = 65536;
micello.maps.MapView.prototype.setQuantizedScale = function(a) {
    this.zoomInt = Math.floor(a * micello.maps.MapView.SCALE_QUANT);
    this.scale = this.zoomInt / micello.maps.MapView.SCALE_QUANT
};
micello.maps.MapView.prototype.setBaseAngRad = function(a) {
    while (a > Math.PI) {
        a -= 2 * Math.PI
    }
    while (a < -Math.PI) {
        a += 2 * Math.PI
    }
    var f = Math.cos(a);
    var b = Math.sin(a);
    this.baseM2C = [f, -b, b, f];
    this.baseC2M = [f, b, -b, f];
    this.mapCanvas.baseAngleRad = a
};
micello.maps.MapView.prototype.setTopNorth = function(a) {
    this.northAtTop = a;
    this.customView = false
};
micello.maps.MapView.prototype.setBaseTransform = function(b, c) {
    var a = Math.sqrt(b[0] * b[3] - b[1] * b[2]);
    this.baseM2C[0] = b[0] / a;
    this.baseM2C[1] = b[1] / a;
    this.baseM2C[2] = b[2] / a;
    this.baseM2C[3] = b[3] / a;
    this.baseC2M[0] = this.baseM2C[3];
    this.baseC2M[1] = -this.baseM2C[1];
    this.baseC2M[2] = -this.baseM2C[2];
    this.baseC2M[3] = this.baseM2C[0];
    this.customView = true;
    this.mapCanvas.baseAngleRad = c
};
micello.maps.MapPopup = function(c, b, a) {
    this.mapCanvas = c;
    this.view = a;
    this.isActive = false;
    this.isVisible = false;
    this.containerX = 0;
    this.containerX = 0;
    this.data = null;
    this.parentElement = b;
    this.mainDiv = null
};
micello.maps.MapPopup.MAX_FRACTION = 0.6;
micello.maps.MapPopup.MAX_WIDTH = 300;
micello.maps.MapPopup.MAX_HEIGHT = 300;
micello.maps.MapPopup.INFO_CLOSE_MARGIN = 5;
micello.maps.MapPopup.MENU_CLOSE_MARGIN = 5;
micello.maps.MapPopup.prototype.setData = function(a) {
    this.data = a;
    if (this.mainDiv != null) {
        this.parentElement.removeChild(this.mainDiv);
        this.mainDiv = null
    }
    if (a.type == micello.maps.popuptype.MENU) {
        this.createMenuPopup(a)
    } else {
        if (a.type == micello.maps.popuptype.INFOWINDOW) {
            this.createInfoPopup(a)
        }
    }
};
micello.maps.MapPopup.prototype.exeCmd = function(a) {
    a.func()
};
micello.maps.MapPopup.prototype.update = function() {
    var a = this.mapCanvas.data.getCurrentLevel();
    if ((!a) || (!this.isActive)) {
        this.setVisible(false);
        return
    }
    if (this.data) {
        if (a.id != this.data.lid) {
            this.setVisible(false)
        } else {
            this.setVisible(true);
            var c = this.view.mapToCanvasX(this.data.mapX, this.data.mapY);
            var b = this.view.mapToCanvasY(this.data.mapX, this.data.mapY);
            if (this.data.ox) {
                c -= this.data.ox
            }
            if (this.data.oy) {
                b -= this.data.oy
            }
            var h = this.parentElement.clientHeight;
            var f = this.parentElement.clientWidth;
            var k = Math.floor(this.parentElement.clientWidth / 2);
            var j = 20;
            var g = this.parentElement.clientWidth - 20;
            var m = Math.floor(this.mainDiv.clientWidth / 2) - 5;
            if ((this.containerX != c) || (this.containerY != b)) {
                this.mainDiv.style.bottom = String(h - b) + "px";
                this.mainDiv.style.left = String(c - 20) + "px";
                this.containerX = c;
                this.containerY = b
            }
        }
    }
};
micello.maps.MapPopup.prototype.setActive = function(a) {
    this.isActive = a;
    this.update()
};
micello.maps.MapPopup.prototype.setVisible = function(a) {
    if (this.isVisible != a) {
        if (a) {
            this.mainDiv.style.display = "block";
            this.isVisible = true
        } else {
            this.mainDiv.style.display = "none";
            this.isVisible = false
        }
    }
};
micello.maps.MapPopup.prototype.createMenuPopup = function(g) {
    var a = this;
    this.mainDiv = document.createElement("div");
    this.mainDiv.className = "menu";
    this.mainDiv.style.position = "absolute";
    this.mainDiv.style.zIndex = micello.maps.MapGUI.POPUP_ZINDEX;
    this.mainDiv.style.bottom = "0px";
    this.mainDiv.style.left = "0px";
    this.containerX = 0;
    this.containerY = 0;
    this.menuWrapperDiv = document.createElement("div");
    this.menuWrapperDiv.className = "menuWrapper";
    this.mainDiv.appendChild(this.menuWrapperDiv);
    var n = document.createElement("ul");
    n.className = "menuTable";
    n.className += " micello-rounded";
    n.className += " micello-pop-shadow";
    if (g.title) {
        var o = document.createElement("li");
        o.className = "menuTitle";
        o.innerHTML = g.title;
        n.appendChild(o);
        var b = document.createElement("img");
        b.className = "menuClose";
        b.src = micello.maps.request.CLOSE_URL;
        b.onclick = function() {
            a.setActive(false)
        };
        b.ontouchstart = function() {
            a.setActive(false)
        };
        o.appendChild(b)
    }
    if (g.commands) {
        var h;
        var c = g.commands.length;
        for (h = 0; h < c; h++) {
            var m = document.createElement("li");
            m.className = "menuItem";
            var f = g.commands[h];
            var k = document.createElement("a");
            k.className = "menuLink";
            k.href = "";
            k.innerHTML = f.name;
            k.cmd = f;
            k.onclick = function() {
                a.setActive(false);
                this.cmd.func();
                return false
            };
            k.ontouchstart = function(p) {
                p.preventDefault();
                a.setActive(false);
                this.cmd.func();
                return false
            };
            m.appendChild(k);
            n.appendChild(m)
        }
    }
    var j = document.createElement("div");
    j.className = "menuTip";
    n.appendChild(j);
    this.menuWrapperDiv.appendChild(n);
    this.mainDiv.style.display = "none";
    this.isVisible = false;
    this.parentElement.appendChild(this.mainDiv)
};
micello.maps.MapPopup.prototype.createInfoPopup = function(c) {
    this.mainDiv = document.createElement("div");
    this.mainDiv.className = "infoOut";
    this.mainDiv.setAttribute("id", "infoDiv");
    this.mainDiv.style.position = "absolute";
    this.mainDiv.style.zIndex = micello.maps.MapGUI.POPUP_ZINDEX;
    this.mainDiv.style.bottom = "0px";
    this.mainDiv.style.left = "0px";
    this.containerX = 0;
    this.containerY = 0;
    this.wrapperDiv = document.createElement("div");
    this.wrapperDiv.className = "infoWrapper";
    this.mainDiv.appendChild(this.wrapperDiv);
    var f = document.createElement("div");
    f.className = "infoBack";
    f.className += " micello-rounded";
    f.className += " micello-pop-shadow";
    this.wrapperDiv.appendChild(f);
    this.mainDiv.mapTarget = true;
    var n = document.createElement("div");
    n.className = "infoIn";
    var h = this.view.getViewportWidth();
    var g = this.view.getViewportHeight();
    var k = Math.floor(h * micello.maps.MapPopup.MAX_FRACTION);
    if (k > micello.maps.MapPopup.MAX_WIDTH) {
        k = micello.maps.MapPopup.MAX_WIDTH
    }
    var m = Math.floor(g * micello.maps.MapPopup.MAX_FRACTION);
    if (m > micello.maps.MapPopup.MAX_HEIGHT) {
        m = micello.maps.MapPopup.MAX_HEIGHT
    }
    n.style.maxWidth = k + "px";
    n.style.maxHeight = m + "px";
    f.appendChild(n);
    var j = document.createElement("div");
    j.className = "menuTip";
    this.wrapperDiv.appendChild(j);
    if (c.html) {
        if (c.html.tagName) {
            n.appendChild(c.html)
        } else {
            n.innerHTML = c.html
        }
    }
    var a = this;
    var b = document.createElement("img");
    b.className = "infoClose";
    b.src = micello.maps.request.CLOSE_URL;
    b.onclick = function() {
        a.setActive(false)
    };
    b.ontouchstart = function(o) {
        a.setActive(false)
    };
    f.appendChild(b);
    this.mainDiv.style.display = "none";
    this.isVisible = false;
    this.parentElement.appendChild(this.mainDiv)
};
micello.geom = {};
micello.geom.linearRoots = function(f, c, g) {
    if (f == 0) {
        return 0
    } else {
        g[0] = -c / f;
        return 1
    }
};
micello.geom.quadraticRoots = function(g, f, m, h) {
    if (g == 0) {
        return micello.geom.linearRoots(f, m, h)
    }
    var k = f * f - 4 * g * m;
    if (k < 0) {
        return 0
    } else {
        var j = -f / (2 * g);
        k = Math.sqrt(k) / (2 * g);
        h[0] = j + k;
        h[1] = j - k;
        return 2
    }
};
micello.geom.cubicRoots = function(o, m, j, f, g) {
    if (o != 0) {
        m = m / o;
        j = j / o;
        f = f / o;
        o = 1
    } else {
        return micello.geom.quadraticRoots(m, j, f, g)
    }
    var p = m / (3 * o);
    var n = 1 / (3 * o);
    var k = 2 * m * m * m - 9 * o * m * j + 27 * o * o * f;
    var q = m * m - 3 * o * j;
    var h = k * k - 4 * q * q * q;
    if (h > 0) {
        return micello.geom.caseOne(p, n, k, h, g)
    } else {
        if (h == 0) {
            return micello.geom.caseTwo(p, n, k, g)
        } else {
            return micello.geom.caseThree(p, n, k, h, g)
        }
    }
};
micello.geom.caseOne = function(k, j, h, g, f) {
    var c = Math.sqrt(g);
    var b = micello.geom.cubeRoot(0.5 * (h + c));
    var a = micello.geom.cubeRoot(0.5 * (h - c));
    f[0] = -k - j * b - j * a;
    return 1
};
micello.geom.caseTwo = function(g, f, c, b) {
    var a = micello.geom.cubeRoot(0.5 * c);
    b[0] = -g - 2 * f * a;
    b[2] = b[1] = -g + f * a;
    return 3
};
micello.geom.caseThree = function(p, o, n, m, k) {
    var a = Math.sqrt(-m);
    var b = Math.atan2(a, n);
    var f = 0.5 * Math.sqrt(n * n - m);
    var j = b / 3;
    var h = j + 2 * Math.PI / 3;
    var g = j - 2 * Math.PI / 3;
    var c = micello.geom.cubeRoot(f);
    k[0] = -p - 2 * o * c * Math.cos(j);
    k[1] = -p - 2 * o * c * Math.cos(h);
    k[2] = -p - 2 * o * c * Math.cos(g);
    return 3
};
micello.geom.cubeRoot = function(a) {
    if (a == 0) {
        return 0
    } else {
        if (a > 0) {
            return Math.exp(Math.log(a) / 3)
        } else {
            return -Math.exp(Math.log(-a) / 3)
        }
    }
};
micello.geom.intersectLine = function(b, g, a, f, h, k) {
    if (b == a) {
        return 0
    } else {
        var j = (h - b) / (a - b);
        if ((j >= 0) && (j < 1)) {
            var c = (f - g) * j + g;
            if (c > k) {
                return 1
            } else {
                return 0
            }
        } else {
            return 0
        }
    }
};
micello.geom.intersectQuad = function(g, p, c, o, a, n, b, m) {
    var k = new Array(2);
    var r = 0;
    var j = micello.geom.quadraticRoots((a - 2 * c + g), (c - g), (g - b), k);
    for (var h = 0; h < j; h++) {
        var f = k[h];
        if ((f >= 0) && (f < 1)) {
            var q = (n - 2 * o + p) * f * f + 2 * (o - p) * f + p;
            if (q > m) {
                r++
            }
        }
    }
    return r
};
micello.geom.intersectCube = function(h, r, f, q, c, p, a, n, b, o) {
    var m = new Array(3);
    var t = 0;
    var k = micello.geom.cubicRoots((a - 3 * c + 3 * f - h), 3 * (c - 2 * f + h), 3 * (f - h), (h - b), m);
    for (var j = 0; j < k; j++) {
        var g = m[j];
        if ((g >= 0) && (g < 1)) {
            var s = (n - 3 * p + 3 * q - r) * g * g * g + 3 * (p - 2 * q + r) * g * g + 3 * (q - r) * g + r;
            if (s > o) {
                t++
            }
        }
    }
    return t
};
micello.geom.cubeMinMax = function(h, f, b, a, p, j) {
    var n = new Array(5);
    var m = micello.geom.quadraticRoots(3 * (a - 3 * b + 3 * f - h), 6 * (b - 2 * f + h), 3 * (f - h), n);
    n[m++] = 0;
    n[m++] = 1;
    var o = p ? 0 : 1;
    for (var k = 0; k < m; k++) {
        var g = n[k];
        if ((g >= 0) && (g <= 1)) {
            var c = (a - 3 * b + 3 * f - h) * g * g * g + 3 * (b - 2 * f + h) * g * g + 3 * (f - h) * g + h;
            if (c < j[0][o]) {
                j[0][o] = c
            }
            if (c > j[1][o]) {
                j[1][o] = c
            }
        }
    }
};
micello.geom.quadMinMax = function(g, c, a, o, h) {
    var m = new Array(4);
    var k = micello.geom.linearRoots(2 * (a - 2 * c + g), 2 * (c - g), m);
    m[k++] = 0;
    m[k++] = 1;
    var n = o ? 0 : 1;
    for (var j = 0; j < k; j++) {
        var f = m[j];
        if ((f >= 0) && (f <= 1)) {
            var b = (a - 2 * c + g) * f * f + 2 * (c - g) * f + g;
            if (b < h[0][n]) {
                h[0][n] = b
            }
            if (b > h[1][n]) {
                h[1][n] = b
            }
        }
    }
};
micello.geom.lineMinMax = function(b, a, f, c) {
    var g = f ? 0 : 1;
    if (b < c[0][g]) {
        c[0][g] = b
    }
    if (b > c[1][g]) {
        c[1][g] = b
    }
    if (a < c[0][g]) {
        c[0][g] = a
    }
    if (a > c[1][g]) {
        c[1][g] = a
    }
};
micello.geom.pathHit = function(o, j, h) {
    var m;
    var b = o.length;
    var a = 0;
    var n = 0;
    var k = 0;
    var f = null;
    var c = null;
    for (var g = 0; g < b; g++) {
        m = o[g];
        switch (m[0]) {
            case 0:
                n = m[1];
                k = m[2];
                if ((f) && (c)) {
                    if ((n != f) || (k != c)) {
                        a += micello.geom.intersectLine(n, k, f, c, j, h)
                    }
                }
                f = n;
                c = k;
                break;
            case 1:
                a += micello.geom.intersectLine(n, k, m[1], m[2], j, h);
                n = m[1];
                k = m[2];
                break;
            case 2:
                a += micello.geom.intersectQuad(n, k, m[1], m[2], m[3], m[4], j, h);
                n = m[3];
                k = m[4];
                break;
            case 3:
                a += micello.geom.intersectCube(n, k, m[1], m[2], m[3], m[4], m[5], m[6], j, h);
                n = m[5];
                k = m[6];
                break;
            case 4:
                if ((f) && (c)) {
                    if ((n != f) || (k != c)) {
                        a += micello.geom.intersectLine(n, k, f, c, j, h)
                    }
                }
                break
        }
    }
    return ((a & 1) != 0)
};
micello.geom.getInvalidMinMax = function() {
    return [
        [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
        [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY]
    ]
};
micello.geom.loadPathMinMax = function(h, g) {
    var b;
    var a = h.length;
    var f = 0;
    var c = 0;
    for (var j = 0; j < a; j++) {
        b = h[j];
        switch (b[0]) {
            case 0:
                f = b[1];
                c = b[2];
                if (!g) {
                    g = [
                        [f, c],
                        [f, c]
                    ]
                }
                break;
            case 1:
                micello.geom.lineMinMax(f, b[1], true, g);
                micello.geom.lineMinMax(c, b[2], false, g);
                f = b[1];
                c = b[2];
                break;
            case 2:
                micello.geom.quadMinMax(f, b[1], b[3], true, g);
                micello.geom.quadMinMax(c, b[2], b[4], false, g);
                f = b[3];
                c = b[4];
                break;
            case 3:
                micello.geom.cubeMinMax(f, b[1], b[3], b[5], true, g);
                micello.geom.cubeMinMax(c, b[2], b[4], b[6], false, g);
                f = b[5];
                c = b[6];
                break
        }
    }
    return g
};
micello.geom.rotRectHit = function(b, j, g) {
    var k = j - b[0];
    var h = g - b[1];
    var a = Math.cos(b[4]);
    var m = Math.sin(b[4]);
    var f = -m;
    var c = a;
    return ((Math.abs(k * a + h * m) <= b[2] / 2) && (Math.abs(k * f + h * c) <= b[3] / 2))
};
micello.geom.loadRotRectMinMax = function(j, h) {
    var n = Math.cos(j[4]);
    var o = Math.sin(j[4]);
    var m = (Math.abs(n * j[2]) + Math.abs(o * j[3])) / 2;
    var k = (Math.abs(o * j[2]) + Math.abs(n * j[3])) / 2;
    var g = j[0] - m;
    var f = j[1] - k;
    var b = j[0] + m;
    var a = j[1] + k;
    if (!h) {
        h = [
            [g, f],
            [b, a]
        ]
    } else {
        h[0][0] = Math.min(g, h[0][0]);
        h[0][1] = Math.min(f, h[0][1]);
        h[1][0] = Math.max(b, h[1][0]);
        h[1][1] = Math.max(a, h[1][1])
    }
    return h
};
micello.maps.request = {};
micello.maps.request.LOGO_URL = micello.SCRIPT_URL + "/resources/logo.png";
micello.maps.request.CLOSE_URL = micello.SCRIPT_URL + "/resources/close10.png";
micello.maps.request.CALLOUT_URL = micello.SCRIPT_URL + "/resources/callout34.png";
micello.maps.request.LOADING_URL = micello.SCRIPT_URL + "/resources/mload.gif";
micello.maps.request.lang = undefined;
micello.maps.request.path = {};
micello.maps.request.loadTheme = function(c, f, a) {
    var g = micello.maps.request.getMfsParams();
    var b = micello.maps.MFS_HOST_URL + "/ms/v1/mfile/meta/theme/v4/" + a + "/" + f + "?" + g;
    micello.maps.request.doRequest(b, c, micello.maps.onMapError, "GET")
};
micello.maps.request.loadCommunity = function(c, b) {
    var h = micello.maps.request.getMfsLang();
    var g = micello.maps.request.getMfsParams();
    var f = micello.maps.request.pathHandler(micello.maps.request.path);
    var a = micello.maps.MFS_HOST_URL + "/ms/v1/mfile/map/" + c + f + "/v3_map/com-map/" + h + "?" + g;
    micello.maps.request.doRequest(a, b, micello.maps.onMapError, "GET")
};
micello.maps.request.loadDrawing = function(a, c, f) {
    var j = micello.maps.request.getMfsLang();
    var h = micello.maps.request.getMfsParams();
    var g = micello.maps.request.pathHandler(micello.maps.request.path);
    var b = micello.maps.MFS_HOST_URL + "/ms/v1/mfile/map/" + f + g + "/v3_map/drawing-map/" + a + "/" + j + "?" + h;
    micello.maps.request.doRequest(b, c, micello.maps.onMapError, "GET")
};
micello.maps.request.pathHandler = function(b) {
    if (b.subpath) {
        return b.subpath
    }
    var a = "/mv/";
    if (b.mv) {
        a += b.mv
    } else {
        a += "-"
    }
    a += "/ev/";
    if (b.ev) {
        a += b.ev
    } else {
        a += "-"
    }
    if (b.alt) {
        a += b.alt
    } else {
        a += "/preselected"
    }
    return a
};
micello.maps.request.loadInfo = function(h, j, g) {
    if ((h) && (h.id)) {
        var f = function(n) {
            j(h, n)
        };
        var k = "gid=" + h.id + "&" + micello.maps.request.getMfsParams();
        var m = micello.maps.request.pathHandler(micello.maps.request.path);
        var c = "/map/" + g + m;
        var b = micello.maps.request.getMfsLang();
        var a = micello.maps.COM_SERVICE_URL + "/detailv3" + c + "/" + b + "?" + k;
        micello.maps.request.doRequest(a, f, micello.maps.onMapError, "GET")
    }
};
micello.maps.request.routeRequest = function(n, r, o, p, g, f) {
    if ((n) && (r) && (o)) {
        var q = micello.maps.request.getMfsParams();
        var c;
        var k;
        var t = {};
        t.type = "route";
        t.form = "v3";
        t.start = r;
        t.end = o;
        t.navPropMapUrl = micello.maps.NAV_PROP_MAP_URL + "?" + q;
        t.navStringsUrl = micello.maps.NAV_STRINGS_URL + "?" + q;
        if (g) {
            t.enhanced = true
        }
        if (f) {
            t.adjusts = f
        }
        var m = JSON.stringify(t);
        var j = function(u) {
            if (u.msg) {
                micello.maps.onMapError(u.msg)
            }
            if (u.annotation) {
                p(u.annotation)
            }
        };
        var s = micello.maps.request.pathHandler(micello.maps.request.path);
        var h = "/map/" + n + s;
        var b = micello.maps.request.getMfsLang();
        var a = micello.maps.COM_SERVICE_URL + "/route" + h + "/" + b + "?" + q;
        micello.maps.request.doRequest(a, j, micello.maps.onMapError, "POST", m)
    }
};
micello.maps.request.getRouteLocation = function(b) {
    var a = '{"t":"';
    a += b.t;
    a += '",';
    if (b.t == "gid") {
        a += '"gid":' + b.gid;
        if (b.lid) {
            a += ',"lid":' + b.lid
        }
        if (b.alt) {
            a += ',"alt":' + this.getRouteLocation(b.alt)
        }
        a += "}"
    } else {
        if (b.t == "mc") {
            a += '"mx":' + b.mx;
            a += ',"my":' + b.my;
            a += ',"lid":' + b.lid;
            a += "}"
        }
    }
    return a
};
micello.maps.request.userInput = function(h, c, a) {
    if (h) {
        var g = function(j) {
            micello.maps.mapproblem.onSuccess()
        };
        var f = function(j) {
            micello.maps.mapproblem.onFailure()
        };
        var b = micello.maps.LEGACY_HOST_URL + "/v3_java/userinput/problem/community/" + a.cid;
        if (c) {
            b += "/geom/" + c.id
        }
        b += "?" + micello.maps.request.getStdParams();
        micello.maps.request.doRequest(b, g, f, "POST", h)
    }
};
micello.maps.request.doRequest = function(url, onDownload, onFailure, httpMethod, body) {
    var xmlhttp;
    var doIe = false;
    if (window.XDomainRequest) {
        xmlhttp = new XDomainRequest();
        xmlhttp.timeout = 10000;
        doIe = true
    } else {
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest()
        } else {
            onFailure("This browser is not supported.");
            return
        }
    }
    if (!doIe) {
        xmlhttp.dataManager = this;
        xmlhttp.onreadystatechange = function() {
            var msg;
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var data = eval("(" + xmlhttp.responseText + ")");
                if (data.error) {
                    msg = "Error in request: " + data.error;
                    onFailure(msg)
                } else {
                    onDownload(data)
                }
            } else {
                if (xmlhttp.readyState == 4 && xmlhttp.status >= 400) {
                    msg = "Error in http request. Status: " + xmlhttp.status;
                    onFailure(msg)
                }
            }
        }
    } else {
        xmlhttp.onload = function() {
            var data = eval("(" + xmlhttp.responseText + ")");
            if (data.error) {
                msg = "Error in request: " + data.error;
                onFailure(msg)
            } else {
                onDownload(data)
            }
        };
        xmlhttp.onerror = function() {
            msg = "Error in http request. Status: " + xmlhttp.status;
            onFailure(msg)
        };
        xmlhttp.ontimeout = function() {
            return
        };
        xmlhttp.onprogress = function() {
            return
        }
    }
    xmlhttp.open(httpMethod, url, true);
    if (!doIe) {
        if (httpMethod == "POST") {
            xmlhttp.setRequestHeader("Content-Type", "text/plain")
        }
    }
    if (!doIe) {
        xmlhttp.send(body)
    } else {
        setTimeout(function() {
            xmlhttp.send(body)
        }, 0)
    }
};
micello.maps.request.getMfsParams = function() {
    return "key=" + micello.maps.key
};
micello.maps.request.getMfsLang = function() {
    return micello.maps.request.lang ? micello.maps.request.lang : "-"
};
micello.maps.request.errorHandler = function(a) {
    document.getElementById("micello-map").style.backgroundImage = "none";
    e = document.createElement("div");
    e.innerHTML = "Micello Map: " + a;
    e.setAttribute("id", "micello-map-msg");
    e.style.top = 0;
    e.style.left = 0;
    e.style.padding = "7px";
    e.style.border = "1px solid #666";
    e.style.backgroundColor = "#fff";
    e.style.position = "absolute";
    document.body.appendChild(e);
    setTimeout(function(b) {
        eM = document.getElementById("micello-map-msg");
        eM.style.display = "none"
    }, 7000)
};
micello.maps.onMapError = micello.maps.request.errorHandler;
micello.maps.mapproblem = {};
micello.maps.mapproblem.getProblemReportHTML = function(b, a) {
    micello.maps.mapproblem.geom = a;
    micello.maps.mapproblem.mapControl = b;
    mapGUI = b.getMapGUI();
    var c = document.createElement("div");
    c.setAttribute("id", "mapproblem");
    mpTitle = document.createElement("div");
    mpTitle.setAttribute("id", "mapproblem-title");
    mpTitle.innerHTML = "Report a Problem";
    c.appendChild(mpTitle);
    if ((a) && (a.nm)) {
        mpSubTitle = document.createElement("div");
        mpSubTitle.setAttribute("id", "mapproblem-subtitle");
        mpSubTitle.innerHTML += a.nm;
        c.appendChild(mpSubTitle)
    }
    mpDesc = document.createElement("div");
    mpDesc.setAttribute("id", "mapproblem-desc");
    mpDesc.innerHTML = "Do you see something that requires attention? ";
    c.appendChild(mpDesc);
    mpTextArea = document.createElement("div");
    mpTextArea.setAttribute("id", "mapproblem-textarea");
    c.appendChild(mpTextArea);
    mpTextAreaActual = document.createElement("textarea");
    mpTextAreaActual.setAttribute("id", "_prob_text");
    mpTextArea.appendChild(mpTextAreaActual);
    mpTextAreaActual.focus();
    mpButton = document.createElement("div");
    mpButton.setAttribute("id", "mapproblem-button");
    mpButton.innerHTML = "Send Report";
    mpButton.onclick = function() {
        micello.maps.mapproblem.submitAction()
    };
    mpButton.ontouchend = function() {
        micello.maps.mapproblem.submitAction()
    };
    mpTextArea.appendChild(mpButton);
    mpTextAreaActual.onfocus = function() {
        mapGUI.KEY_COMMANDS = false
    };
    mpTextAreaActual.onblur = function() {
        mapGUI.KEY_COMMANDS = true
    };
    return c
};
micello.maps.mapproblem.submitAction = function() {
    var b = document.getElementById("_prob_text");
    var a = b.value;
    if (!a) {
        mpDesc = document.getElementById("mapproblem-desc");
        mpDesc.innerHTML = '<span class="mapproblem-error">Please enter a message</span>';
        return false
    }
    mpButton = document.getElementById("mapproblem-button");
    mpButton.onclick = false;
    mpButton.ontouchend = false;
    mpButton.innerHTML = "Sending...";
    mpButton.style.backgroundColor = "#ccc";
    mpButton.style.color = "#fff";
    micello.maps.mapproblem.submitProblemInfo()
};
micello.maps.mapproblem.submitProblemInfo = function() {
    var f = document.getElementById("_prob_text");
    var c = f.value;
    var a = null;
    var b = micello.maps.mapproblem.geom;
    a = micello.maps.mapproblem.mapControl.getMapData().getCommunity();
    micello.maps.request.userInput(c, b, a)
};
micello.maps.mapproblem.onSuccess = function() {
    var a = document.getElementById("mapproblem");
    a.innerHTML = "";
    mpTitle = document.createElement("div");
    mpTitle.setAttribute("id", "mapproblem-title");
    mpTitle.innerHTML = "Thank You!";
    a.appendChild(mpTitle);
    mpDesc = document.createElement("div");
    mpDesc.setAttribute("id", "mapproblem-desc");
    mpDesc.innerHTML = "We have received your map feedback and we will address your submission as soon as possible. ";
    a.appendChild(mpDesc);
    mpButton = document.createElement("div");
    mpButton.setAttribute("id", "mapproblem-button-complete");
    mpButton.innerHTML = "I'm Done";
    mpButton.onclick = function() {
        micello.maps.mapproblem.mapControl.hideInfoWindow()
    };
    mpButton.ontouchend = function() {
        micello.maps.mapproblem.mapControl.hideInfoWindow()
    };
    a.appendChild(mpButton)
};
micello.maps.mapproblem.onFailure = function() {
    var a = document.getElementById("mapproblem");
    a.innerHTML = "";
    mpTitle = document.createElement("div");
    mpTitle.setAttribute("id", "mapproblem-title");
    mpTitle.innerHTML = "We Had A Problem";
    a.appendChild(mpTitle);
    mpDesc = document.createElement("div");
    mpDesc.setAttribute("id", "mapproblem-desc");
    mpDesc.innerHTML = "Your submission unfortunately did not go through successfully. Please try again.";
    a.appendChild(mpDesc)
};
micello.maps.MapControl = function(a) {
    if (!micello.maps.key) {
        micello.maps.onMapError("You must have a Micello Map Key to user the Micello Map API.");
        return
    }
    this.mapName = a;
    this.createControl(a);
    this.selectInlay = {
        id: 0,
        zi: micello.maps.MapControl.SELECT_ZINDEX,
        t: "Selected",
        anm: "slct"
    };
    this.popup = this.mapCanvas.createPopup();
    var b = this;
    this.mapCanvas.onMapClick = function(f, c, g) {
        b.onMapClick(f, c, g)
    };
    this.doSelectAction = this.defaultSelectAction;
    this.showInfo = this.showDefaultInfoWindow;
    this.selected = null;
    this.highlighted = false;
    this.routeTo = null;
    this.routeFrom = null;
    this.routeActive = false;
    this.routeOverlay = null;
    this.popupFlags = micello.maps.MapControl.SHOW_ALL;
    this.doEnhancedRoute = false
};
micello.maps.MapControl.SELECT_ZINDEX = 9999;
micello.maps.MapControl.SHOW_INFO = 1;
micello.maps.MapControl.SHOW_INSIDE = 2;
micello.maps.MapControl.SHOW_NAV = 4;
micello.maps.MapControl.SHOW_REPORT = 8;
micello.maps.MapControl.SHOW_ALL = 15;
micello.maps.MapControl.MAX_URL_LENGTH = 25;
micello.maps.MapControl.prototype.getMapData = function() {
    return this.data
};
micello.maps.MapControl.prototype.getMapView = function() {
    return this.view
};
micello.maps.MapControl.prototype.getMapCanvas = function() {
    return this.mapCanvas
};
micello.maps.MapControl.prototype.getMapGUI = function() {
    return this.mapGUI
};
micello.maps.MapControl.prototype.requestNavToGeom = function(f, g, b) {
    var c = {};
    c.t = "gid";
    if (f.gid) {
        c.gid = f.gid
    } else {
        c.gid = f.id
    }
    if ((b) && (g)) {
        c.lid = g
    }
    if ((f.l) && (g)) {
        c.alt = {};
        c.alt.t = "mc";
        c.alt.mx = f.l[0];
        c.alt.my = f.l[1];
        c.alt.lid = g
    }
    var a = [];
    a.push(c);
    this.requestNavTo(a)
};
micello.maps.MapControl.prototype.requestNavFromGeom = function(c, g, a) {
    var b = {};
    b.t = "gid";
    if (c.gid) {
        b.gid = c.gid
    } else {
        b.gid = c.id
    }
    if ((a) && (g)) {
        b.lid = g
    }
    if ((c.l) && (g)) {
        b.alt = {};
        b.alt.t = "mc";
        b.alt.mx = c.l[0];
        b.alt.my = c.l[1];
        b.alt.lid = g
    }
    var f = [];
    f.push(b);
    this.requestNavFrom(f)
};
micello.maps.MapControl.prototype.requestNavTo = function(a) {
    this.data.removeAnnotation("route");
    this.routeTo = a;
    this.setRouteMarker(true);
    if ((this.routeTo) && (this.routeFrom) && (this.routeTo.gid == this.routeFrom.gid) && (this.routeTo.gid)) {
        this.routeFrom = null
    } else {
        if (this.routeFrom) {
            this.setRouteMarker(false);
            this.getRoute()
        }
    }
};
micello.maps.MapControl.prototype.requestNavFrom = function(a) {
    this.data.removeAnnotation("route");
    this.routeFrom = a;
    this.setRouteMarker(false);
    if ((this.routeTo) && (this.routeFrom) && (this.routeTo.gid == this.routeFrom.gid) && (this.routeTo.gid)) {
        this.routeTo = null
    } else {
        if (this.routeTo) {
            this.setRouteMarker(true);
            this.getRoute()
        }
    }
};
micello.maps.MapControl.prototype.clearRoute = function() {
    this.routeTo = null;
    this.routeFrom = null;
    this.routeActive = false;
    this.data.removeAnnotation("route")
};
micello.maps.MapControl.prototype.setRouteAdjustments = function(a) {
    this.adjustments = a
};
micello.maps.MapControl.prototype.getRouteAdjustments = function() {
    return this.adjustments
};
micello.maps.MapControl.prototype.setDoEnhancedRoute = function(a) {
    this.doEnhancedRoute = a
};
micello.maps.MapControl.prototype.getDoEnhancedRoute = function() {
    return this.doEnhancedRoute
};
micello.maps.MapControl.prototype.getRoute = function() {
    if ((this.routeTo) && (this.routeFrom)) {
        this.routeActive = true;
        var b = this;
        var c = this.data.getCommunity().cid;
        var a = function(f) {
            b.data.removeAnnotation("route");
            b.showAnnotation(f, "route")
        };
        micello.maps.request.routeRequest(c, this.routeFrom, this.routeTo, a, this.doEnhancedRoute, this.adjustments)
    }
};
micello.maps.MapControl.prototype.setRouteMarker = function(c) {
    var b = null;
    var f;
    var g;
    if (c) {
        g = this.routeTo;
        f = "RouteEnd"
    } else {
        g = this.routeFrom;
        f = "RouteStart"
    }
    if ((g != null) && (g.length == 1)) {
        b = g[0].gid;
        if (b) {
            var a = {
                id: b,
                mr: f,
                mt: 1,
                anm: "route"
            };
            this.data.addMarkerOverlay(a, true)
        }
    }
};
micello.maps.MapControl.prototype.reportProb = function(b) {
    var a = micello.maps.mapproblem.getProblemReportHTML(this, b);
    this.showInfoWindow(b, a);
    var c = document.getElementById("_prob_text");
    c.focus()
};
micello.maps.MapControl.prototype.showPopupMenu = function(g, f, a) {
    var b = new Object();
    b.type = micello.maps.popuptype.MENU;
    b.title = f;
    b.commands = a;
    var c = false;
    if ((g.gt) || (g.lt)) {
        c = this.loadGeomLocationInfo(g, b)
    } else {
        if (g.mt) {
            c = this.loadMarkerLocationInfo(g, b)
        }
    }
    if (c) {
        this.popup.setData(b);
        this.popup.setActive(true);
        return true
    } else {
        this.popup.setActive(false);
        return false
    }
};
micello.maps.MapControl.prototype.showInfoWindow = function(f, a) {
    var b = new Object();
    b.type = micello.maps.popuptype.INFOWINDOW;
    b.html = a;
    var c = false;
    if ((f.gt) || (f.lt)) {
        c = this.loadGeomLocationInfo(f, b)
    } else {
        if (f.mt) {
            c = this.loadMarkerLocationInfo(f, b)
        }
    }
    if (c) {
        this.popup.setData(b);
        this.popup.setActive(true);
        return true
    } else {
        this.popup.setActive(false);
        return false
    }
};
micello.maps.MapControl.prototype.hideInfoWindow = function() {
    this.popup.setActive(false)
};
micello.maps.MapControl.prototype.defaultSelectAction = function(a) {
    if (!a) {
        this.popup.setActive(false)
    } else {
        if (a.pdat) {
            this.showPopupMenu(a, a.pdat.title, a.pdat.commands)
        } else {
            if (a.idat) {
                this.showInfoWindow(a, a.idat)
            } else {
                if (a.p) {
                    this.showDefaultGeomPopup(a)
                } else {
                    this.popup.setActive(false)
                }
            }
        }
    }
};
micello.maps.MapControl.prototype.showDefaultGeomPopup = function(b) {
    var f = b.nm;
    var g = this.data.getCurrentLevel();
    var c;
    if (g) {
        c = g.id
    } else {
        g = null
    }
    var a = new Array();
    if (this.popupFlags & micello.maps.MapControl.SHOW_INFO) {
        this.loadInfoCmd(b, a)
    }
    if (this.popupFlags & micello.maps.MapControl.SHOW_INSIDE) {
        this.loadInsideCmd(b, a)
    }
    if (this.popupFlags & micello.maps.MapControl.SHOW_NAV) {
        this.loadNavCmd(b, c, a)
    }
    if (this.popupFlags & micello.maps.MapControl.SHOW_REPORT) {
        this.loadInputCmd(b, a)
    }
    this.showPopupMenu(b, f, a)
};
micello.maps.MapControl.prototype.showDefaultInfoWindow = function(b) {
    var a = this.data.getCommunity();
    if (!a) {
        return
    }
    if ((b) && (b.id) && (b.id > 0) && (b.l)) {
        var f = this;
        var c = function(g, h) {
            f.processInfo(g, h)
        };
        micello.maps.request.loadInfo(b, c, a.cid)
    }
    this.popup.setActive(false)
};
micello.maps.MapControl.prototype.loadGeomLocationInfo = function(a, b) {
    var c = this.data.getGeometryLevel(a.id);
    if (!c) {
        return false
    }
    b.lid = c.id;
    b.ox = 0;
    b.oy = 10;
    if (!a.l) {
        return false
    }
    b.mapX = a.l[0];
    b.mapY = a.l[1];
    return true
};
micello.maps.MapControl.prototype.loadMarkerLocationInfo = function(a, b) {
    b.mapX = a.mx;
    b.mapY = a.my;
    b.ox = 0;
    b.oy = a.oy;
    b.lid = a.lid;
    if ((isFinite(b.mapX)) && (isFinite(b.mapY)) || (b.lid)) {
        return true
    } else {
        return false
    }
};
micello.maps.MapControl.prototype.centerOnGeom = function(a, b) {
    if (!a) {
        return
    }
    if (!b) {
        b = 0
    }
    if (!a.mm) {
        this.mapCanvas.loadGeomMinMax(a)
    }
    this.view.defaultMapX = (a.mm[1][0] + a.mm[0][0]) / 2;
    this.view.defaultMapY = (a.mm[1][1] + a.mm[0][1]) / 2;
    this.view.defaultW = 2 * (a.mm[1][0] - a.mm[0][0]) + b;
    this.view.defaultH = 2 * (a.mm[1][1] - a.mm[0][1]) + b;
    this.view.resetView();
    this.mapCanvas.onZoom();
    if (this.onViewChange) {
        this.event.pan = 0;
        this.event.zoom = 1;
        this.onViewChange(this.event)
    }
};
micello.maps.MapControl.prototype.processInfo = function(f, b) {
    var h = null;
    if (f.nm) {
        h = f.nm
    } else {
        if ((f.lt == 1) && (f.lr)) {
            h = f.lr
        }
    }
    var n;
    var k;
    var g = 0;
    var m = document.createElement("table");
    m.className = "infoTable";
    if (h) {
        n = m.insertRow(g++);
        k = n.insertCell(0);
        k.className = "infoTitle";
        k.colSpan = "2";
        k.innerHTML = h
    }
    if (b.results) {
        var c;
        var j;
        var a = null;
        for (c = 0; c < b.results.length; c++) {
            j = b.results[c];
            a = j.type;
            if (a == null) {
                a = micello.maps.infoentrytype.GENERAL
            }
            n = m.insertRow(g++);
            k = n.insertCell(0);
            k.className = "infoItemNm";
            k.innerHTML = j.name;
            k = n.insertCell(1);
            k.className = "infoItemVal";
            if (a == micello.maps.infoentrytype.PHONE) {
                k.appendChild(this.getPhoneLink(j.value))
            } else {
                if (a == micello.maps.infoentrytype.EMAIL) {
                    k.appendChild(this.getEmailLink(j.value))
                } else {
                    if (a == micello.maps.infoentrytype.URL) {
                        k.appendChild(this.getHttpLink(j.value))
                    } else {
                        k.innerHTML = j.value
                    }
                }
            }
        }
    }
    this.showInfoWindow(f, m)
};
micello.maps.MapControl.prototype.initMapPlugin = function(a) {
    a.mapControl = this;
    a.mapGUI = this.getMapGUI();
    a.mapCanvas = this.getMapCanvas();
    a.mapData = this.getMapData();
    a.mapView = this.getMapView()
};
micello.maps.MapControl.prototype.loadInfoCmd = function(b, a) {
    if ((b.id > 0) && (b.i)) {
        var f = this;
        var c = {
            name: "Info",
            func: function() {
                f.showInfo(b)
            }
        };
        a.push(c)
    }
};
micello.maps.MapControl.prototype.loadInsideCmd = function(b, a) {
    var f = this;
    var c;
    if (b.cid) {
        c = {
            name: "Go Inside",
            func: function() {
                f.toEmbeddedCom(b)
            }
        };
        a.push(c)
    } else {
        if (b.did) {
            c = {
                name: "Go Inside",
                func: function() {
                    f.toEmbeddedDraw(b)
                }
            };
            a.push(c)
        }
    }
};
micello.maps.MapControl.prototype.loadNavCmd = function(b, c, a) {
    if (b.id) {
        var g = this;
        var f = {
            name: "Navigate To",
            func: function() {
                g.requestNavToGeom(b, c, true)
            }
        };
        a.push(f);
        f = {
            name: "Navigate From",
            func: function() {
                g.requestNavFromGeom(b, c, true)
            }
        };
        a.push(f);
        if (this.routeActive) {
            f = {
                name: "Clear Route",
                func: function() {
                    g.clearRoute()
                }
            };
            a.push(f)
        }
    }
};
micello.maps.MapControl.prototype.loadInputCmd = function(b, a) {
    if (b.id) {
        var f = this;
        var c = {
            name: "Report a problem",
            func: function() {
                f.reportProb(b)
            }
        };
        a.push(c)
    }
};
micello.maps.MapControl.prototype.toEmbeddedCom = function(b) {
    var a = this.data.getCommunity();
    var c = b.did;
    if ((c) && (c != a.id)) {
        this.data.loadCommunity(c, b.did, b.lid)
    } else {
        micello.maps.onMapError("Unknown error - go inside failed")
    }
};
micello.maps.MapControl.prototype.toEmbeddedDraw = function(f) {
    var a = this.data.getCommunity();
    var g = f.did;
    if ((a) && (a.d) && (g)) {
        var c;
        var b = a.d.length;
        for (c = 0; c < b; c++) {
            var h = a.d[c];
            if (h.id == g) {
                this.data.setDrawing(h, f.lid)
            }
        }
    } else {
        micello.maps.onMapError("Unknown error - go inside failed")
    }
};
micello.maps.MapControl.prototype.onMapClick = function(b, a, c) {
    if ((c != null) && ((c.pdat) || (c.idat) || (c.p))) {
        if (c != this.selected) {
            this.selectObject(c)
        }
    } else {
        if (this.selected != null) {
            this.deselectObject()
        }
    }
    if (this.doSelectAction) {
        this.doSelectAction(c)
    }
};
micello.maps.MapControl.prototype.selectObject = function(a) {
    if (this.highlighted) {
        this.data.removeInlay("slct", true)
    }
    if ((a.id) && (a.gt == micello.maps.geomtype.AREA)) {
        this.selectInlay.id = a.id;
        this.data.addInlay(this.selectInlay);
        this.highlighted = true
    } else {
        this.highlighted = false
    }
    this.selected = a
};
micello.maps.MapControl.prototype.deselectObject = function() {
    if (this.highlighted) {
        this.data.removeInlay("slct", true)
    }
    this.selected = null;
    this.highlighted = false
};
micello.maps.MapControl.prototype.showAnnotation = function(j, b) {
    var f = j.g;
    var a = j.i;
    var g = j.m;
    var h;
    var c;
    if (f) {
        for (c = 0; c < f.length; c++) {
            h = f[c];
            if (b) {
                h.anm = b
            }
            this.data.addGeometryOverlay(h)
        }
    }
    if (a) {
        for (c = 0; c < a.length; c++) {
            h = a[c];
            if (b) {
                h.anm = b
            }
            this.data.addGeometryOverlay(h)
        }
    }
    if (g) {
        for (c = 0; c < g.length; c++) {
            h = g[c];
            if (b) {
                h.anm = b
            }
            this.data.addMarkerOverlay(h)
        }
    }
};
micello.maps.MapControl.prototype.getPhoneLink = function(a) {
    var b = "tel:" + a.replace(/[^\d]/g, "");
    return this.getUrlLink(b, a, false)
};
micello.maps.MapControl.prototype.getEmailLink = function(a) {
    var b = "mailto:" + a;
    return this.getUrlLink(b, a, false)
};
micello.maps.MapControl.prototype.getHttpLink = function(a) {
    var c = a.substr(0, 7).toLowerCase();
    if (c != "http://") {
        a = "http://" + a
    }
    var b;
    b = (a.length > micello.maps.MapControl.MAX_URL_LENGTH) ? "<em>click to open</em>" : a;
    return this.getUrlLink(a, b, true)
};
micello.maps.MapControl.prototype.getUrlLink = function(a, f, c) {
    var b = document.createElement("a");
    b.href = a;
    if (c) {
        b.target = "_blank"
    }
    b.innerHTML = f;
    return b
};
micello.maps.MapControl.prototype.createControl = function(c) {
    this.mapGUI = new micello.maps.MapGUI(this, c);
    var b = this.mapGUI.viewportElement;
    var a = this.mapGUI.mapElement;
    this.mapCanvas = new micello.maps.MapCanvas(this, a);
    this.view = new micello.maps.MapView(this, b, a, this.mapCanvas, this.mapGUI);
    this.data = new micello.maps.MapData(this, this.view, this.mapCanvas, this.mapGUI);
    this.mapGUI.mapCanvas = this.mapCanvas;
    this.mapGUI.data = this.data;
    this.mapGUI.view = this.view;
    this.mapCanvas.data = this.data;
    this.mapCanvas.view = this.view
};
if (micello.maps.initCallback) {
    micello.maps.initCallback()
};