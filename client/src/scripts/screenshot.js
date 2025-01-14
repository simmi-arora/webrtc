// Note: All libraries listed in this file are "external libraries" 
// ----  and has their own copyrights. Taken from "html2canvas" project.
"use strict";

function h2clog(e) {
    if (_html2canvas.logging && window.webrtcdev && window.webrtcdev.log) {
        window.webrtcdev.log(e)
    }
}

function backgroundBoundsFactory(e, t, n, r, i, s) {
    var o = _html2canvas.Util.getCSS(t, e, i),
        u, a, f, l;
    if (o.length === 1) {
        l = o[0];
        o = [];
        o[0] = l;
        o[1] = l
    }
    if (o[0].toString().indexOf("%") !== -1) {
        f = parseFloat(o[0]) / 100;
        a = n.width * f;
        if (e !== "backgroundSize") {
            a -= (s || r).width * f
        }
    } else {
        if (e === "backgroundSize") {
            if (o[0] === "auto") {
                a = r.width
            } else {
                if (o[0].match(/contain|cover/)) {
                    var c = _html2canvas.Util.resizeBounds(r.width, r.height, n.width, n.height, o[0]);
                    a = c.width;
                    u = c.height
                } else {
                    a = parseInt(o[0], 10)
                }
            }
        } else {
            a = parseInt(o[0], 10)
        }
    }
    if (o[1] === "auto") {
        u = a / r.width * r.height
    } else if (o[1].toString().indexOf("%") !== -1) {
        f = parseFloat(o[1]) / 100;
        u = n.height * f;
        if (e !== "backgroundSize") {
            u -= (s || r).height * f
        }
    } else {
        u = parseInt(o[1], 10)
    }
    return [a, u]
}

function h2czContext(e) {
    return {
        zindex: e,
        children: []
    }
}

function h2cRenderContext(e, t) {
    var n = [];
    return {
        storage: n,
        width: e,
        height: t,
        clip: function() {
            n.push({
                type: "function",
                name: "clip",
                arguments: arguments
            })
        },
        translate: function() {
            n.push({
                type: "function",
                name: "translate",
                arguments: arguments
            })
        },
        fill: function() {
            n.push({
                type: "function",
                name: "fill",
                arguments: arguments
            })
        },
        save: function() {
            n.push({
                type: "function",
                name: "save",
                arguments: arguments
            })
        },
        restore: function() {
            n.push({
                type: "function",
                name: "restore",
                arguments: arguments
            })
        },
        fillRect: function() {
            n.push({
                type: "function",
                name: "fillRect",
                arguments: arguments
            })
        },
        createPattern: function() {
            n.push({
                type: "function",
                name: "createPattern",
                arguments: arguments
            })
        },
        drawShape: function() {
            var e = [];
            n.push({
                type: "function",
                name: "drawShape",
                arguments: e
            });
            return {
                moveTo: function() {
                    e.push({
                        name: "moveTo",
                        arguments: arguments
                    })
                },
                lineTo: function() {
                    e.push({
                        name: "lineTo",
                        arguments: arguments
                    })
                },
                arcTo: function() {
                    e.push({
                        name: "arcTo",
                        arguments: arguments
                    })
                },
                bezierCurveTo: function() {
                    e.push({
                        name: "bezierCurveTo",
                        arguments: arguments
                    })
                },
                quadraticCurveTo: function() {
                    e.push({
                        name: "quadraticCurveTo",
                        arguments: arguments
                    })
                }
            }
        },
        drawImage: function() {
            n.push({
                type: "function",
                name: "drawImage",
                arguments: arguments
            })
        },
        fillText: function() {
            n.push({
                type: "function",
                name: "fillText",
                arguments: arguments
            })
        },
        setVariable: function(e, t) {
            n.push({
                type: "variable",
                name: e,
                arguments: t
            })
        }
    }
}

function getMouseXY(e) {
    if (IE) {
        coordX = event.clientX + document.body.scrollLeft;
        coordY = event.clientY + document.body.scrollTop
    } else {
        coordX = e.pageX;
        coordY = e.pageY
    }
    if (coordX < 0) {
        coordX = 0
    }
    if (coordY < 0) {
        coordY = 0
    }
    return true
}
var _html2canvas = {},
    previousElement, computedCSS, html2canvas;
_html2canvas.Util = {};
_html2canvas.Util.trimText = function(e) {
    return function(t) {
        if (e) {
            return e.apply(t)
        } else {
            return ((t || "") + "").replace(/^\s+|\s+$/g, "")
        }
    }
}(String.prototype.trim);
_html2canvas.Util.parseBackgroundImage = function(e) {
    var t = " \r\n	",
        n, r, i, s, o, u = [],
        a, f = 0,
        l = 0,
        c, h;
    var p = function() {
        if (n) {
            if (r.substr(0, 1) === '"') {
                r = r.substr(1, r.length - 2)
            }
            if (r) {
                h.push(r)
            }
            if (n.substr(0, 1) === "-" && (s = n.indexOf("-", 1) + 1) > 0) {
                i = n.substr(0, s);
                n = n.substr(s)
            }
            u.push({
                prefix: i,
                method: n.toLowerCase(),
                value: o,
                args: h
            })
        }
        h = [];
        n = i = r = o = ""
    };
    p();
    for (var d = 0, v = e.length; d < v; d++) {
        a = e[d];
        if (f === 0 && t.indexOf(a) > -1) {
            continue
        }
        switch (a) {
            case '"':
                if (!c) {
                    c = a
                } else if (c === a) {
                    c = null
                }
                break;
            case "(":
                if (c) {
                    break
                } else if (f === 0) {
                    f = 1;
                    o += a;
                    continue
                } else {
                    l++
                }
                break;
            case ")":
                if (c) {
                    break
                } else if (f === 1) {
                    if (l === 0) {
                        f = 0;
                        o += a;
                        p();
                        continue
                    } else {
                        l--
                    }
                }
                break;
            case ",":
                if (c) {
                    break
                } else if (f === 0) {
                    p();
                    continue
                } else if (f === 1) {
                    if (l === 0 && !n.match(/^url$/i)) {
                        h.push(r);
                        r = "";
                        o += a;
                        continue
                    }
                }
                break
        }
        o += a;
        if (f === 0) {
            n += a
        } else {
            r += a
        }
    }
    p();
    return u
};
_html2canvas.Util.Bounds = function(t) {
    var n, r = {};
    if (t.getBoundingClientRect) {
        n = t.getBoundingClientRect();
        r.top = n.top;
        r.bottom = n.bottom || n.top + n.height;
        r.left = n.left;
        r.width = n.width || n.right - n.left;
        r.height = n.height || n.bottom - n.top;
        return r
    }
};
_html2canvas.Util.getCSS = function(e, t, n) {
    function s(t, n) {
        var r = e.runtimeStyle && e.runtimeStyle[t],
            i, s = e.style;
        if (!/^-?[0-9]+\.?[0-9]*(?:px)?$/i.test(n) && /^-?\d/.test(n)) {
            i = s.left;
            if (r) {
                e.runtimeStyle.left = e.currentStyle.left
            }
            s.left = t === "fontSize" ? "1em" : n || 0;
            n = s.pixelLeft + "px";
            s.left = i;
            if (r) {
                e.runtimeStyle.left = r
            }
        }
        if (!/^(thin|medium|thick)$/i.test(n)) {
            return Math.round(parseFloat(n)) + "px"
        }
        return n
    }
    var r, i = t.match(/^background(Size|Position)$/);
    if (previousElement !== e) {
        computedCSS = document.defaultView.getComputedStyle(e, null)
    }
    r = computedCSS[t];
    if (i) {
        r = (r || "").split(",");
        r = r[n || 0] || r[0] || "auto";
        r = _html2canvas.Util.trimText(r).split(" ");
        if (t === "backgroundSize" && (!r[0] || r[0].match(/cover|contain|auto/))) {} else {
            r[0] = r[0].indexOf("%") === -1 ? s(t + "X", r[0]) : r[0];
            if (r[1] === undefined) {
                if (t === "backgroundSize") {
                    r[1] = "auto";
                    return r
                } else {
                    r[1] = r[0]
                }
            }
            r[1] = r[1].indexOf("%") === -1 ? s(t + "Y", r[1]) : r[1]
        }
    } else if (/border(Top|Bottom)(Left|Right)Radius/.test(t)) {
        var o = r.split(" ");
        if (o.length <= 1) {
            o[1] = o[0]
        }
        o[0] = parseInt(o[0], 10);
        o[1] = parseInt(o[1], 10);
        r = o
    }
    return r
};
_html2canvas.Util.resizeBounds = function(e, t, n, r, i) {
    var s = n / r,
        o = e / t,
        u, a;
    if (!i || i === "auto") {
        u = n;
        a = r
    } else {
        if (s < o ^ i === "contain") {
            a = r;
            u = r * o
        } else {
            u = n;
            a = n / o
        }
    }
    return {
        width: u,
        height: a
    }
};
_html2canvas.Util.BackgroundPosition = function(e, t, n, r, i) {
    var s = backgroundBoundsFactory("backgroundPosition", e, t, n, r, i);
    return {
        left: s[0],
        top: s[1]
    }
};
_html2canvas.Util.BackgroundSize = function(e, t, n, r) {
    var i = backgroundBoundsFactory("backgroundSize", e, t, n, r);
    return {
        width: i[0],
        height: i[1]
    }
};
_html2canvas.Util.Extend = function(e, t) {
    for (var n in e) {
        if (e.hasOwnProperty(n)) {
            t[n] = e[n]
        }
    }
    return t
};
_html2canvas.Util.Children = function(e) {
    var t;
    try {
        t = e.nodeName && e.nodeName.toUpperCase() === "IFRAME" ? e.contentDocument || e.contentWindow.document : function(e) {
            var t = [];
            if (e !== null) {
                (function(e, t) {
                    var n = e.length,
                        r = 0;
                    if (typeof t.length === "number") {
                        for (var i = t.length; r < i; r++) {
                            e[n++] = t[r]
                        }
                    } else {
                        while (t[r] !== undefined) {
                            e[n++] = t[r++]
                        }
                    }
                    e.length = n;
                    return e
                })(t, e)
            }
            return t
        }(e.childNodes)
    } catch (n) {
        h2clog("html2canvas.Util.Children failed with exception: " + n.message);
        t = []
    }
    return t
};
_html2canvas.Util.Font = function() {
    var e = {};
    return function(t, n, r) {
        if (e[t + "-" + n] !== undefined) {
            return e[t + "-" + n]
        }
        var i = r.createElement("div"),
            s = r.createElement("img"),
            o = r.createElement("span"),
            u = "Hidden Text",
            a, f, l;
        i.style.visibility = "hidden";
        i.style.fontFamily = t;
        i.style.fontSize = n;
        i.style.margin = 0;
        i.style.padding = 0;
        r.body.appendChild(i);
        s.src = "data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACwAAAAAAQABAAACAkQBADs=";
        s.width = 1;
        s.height = 1;
        s.style.margin = 0;
        s.style.padding = 0;
        s.style.verticalAlign = "baseline";
        o.style.fontFamily = t;
        o.style.fontSize = n;
        o.style.margin = 0;
        o.style.padding = 0;
        o.appendChild(r.createTextNode(u));
        i.appendChild(o);
        i.appendChild(s);
        a = s.offsetTop - o.offsetTop + 1;
        i.removeChild(o);
        i.appendChild(r.createTextNode(u));
        i.style.lineHeight = "normal";
        s.style.verticalAlign = "super";
        f = s.offsetTop - i.offsetTop + 1;
        l = {
            baseline: a,
            lineWidth: 1,
            middle: f
        };
        e[t + "-" + n] = l;
        r.body.removeChild(i);
        return l
    }
}();
(function() {
    _html2canvas.Generate = {};
    var e = [/^(-webkit-linear-gradient)\(([a-z\s]+)([\w\d\.\s,%\(\)]+)\)$/, /^(-o-linear-gradient)\(([a-z\s]+)([\w\d\.\s,%\(\)]+)\)$/, /^(-webkit-gradient)\((linear|radial),\s((?:\d{1,3}%?)\s(?:\d{1,3}%?),\s(?:\d{1,3}%?)\s(?:\d{1,3}%?))([\w\d\.\s,%\(\)\-]+)\)$/, /^(-moz-linear-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?))([\w\d\.\s,%\(\)]+)\)$/, /^(-webkit-radial-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?)),\s(\w+)\s([a-z\-]+)([\w\d\.\s,%\(\)]+)\)$/, /^(-moz-radial-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?)),\s(\w+)\s?([a-z\-]*)([\w\d\.\s,%\(\)]+)\)$/, /^(-o-radial-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?)),\s(\w+)\s([a-z\-]+)([\w\d\.\s,%\(\)]+)\)$/];
    _html2canvas.Generate.parseGradient = function(t, n) {
        var r, i, s = e.length,
            o, u, a, f, l, c, h, p, d, v;
        for (i = 0; i < s; i += 1) {
            o = t.match(e[i]);
            if (o) {
                break
            }
        }
        if (o) {
            switch (o[1]) {
                case "-webkit-linear-gradient":
                case "-o-linear-gradient":
                    r = {
                        type: "linear",
                        x0: null,
                        y0: null,
                        x1: null,
                        y1: null,
                        colorStops: []
                    };
                    a = o[2].match(/\w+/g);
                    if (a) {
                        f = a.length;
                        for (i = 0; i < f; i += 1) {
                            switch (a[i]) {
                                case "top":
                                    r.y0 = 0;
                                    r.y1 = n.height;
                                    break;
                                case "right":
                                    r.x0 = n.width;
                                    r.x1 = 0;
                                    break;
                                case "bottom":
                                    r.y0 = n.height;
                                    r.y1 = 0;
                                    break;
                                case "left":
                                    r.x0 = 0;
                                    r.x1 = n.width;
                                    break
                            }
                        }
                    }
                    if (r.x0 === null && r.x1 === null) {
                        r.x0 = r.x1 = n.width / 2
                    }
                    if (r.y0 === null && r.y1 === null) {
                        r.y0 = r.y1 = n.height / 2
                    }
                    a = o[3].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)(?:\s\d{1,3}(?:%|px))?)+/g);
                    if (a) {
                        f = a.length;
                        l = 1 / Math.max(f - 1, 1);
                        for (i = 0; i < f; i += 1) {
                            c = a[i].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%|px)?/);
                            if (c[2]) {
                                u = parseFloat(c[2]);
                                if (c[3] === "%") {
                                    u /= 100
                                } else {
                                    u /= n.width
                                }
                            } else {
                                u = i * l
                            }
                            r.colorStops.push({
                                color: c[1],
                                stop: u
                            })
                        }
                    }
                    break;
                case "-webkit-gradient":
                    r = {
                        type: o[2] === "radial" ? "circle" : o[2],
                        x0: 0,
                        y0: 0,
                        x1: 0,
                        y1: 0,
                        colorStops: []
                    };
                    a = o[3].match(/(\d{1,3})%?\s(\d{1,3})%?,\s(\d{1,3})%?\s(\d{1,3})%?/);
                    if (a) {
                        r.x0 = a[1] * n.width / 100;
                        r.y0 = a[2] * n.height / 100;
                        r.x1 = a[3] * n.width / 100;
                        r.y1 = a[4] * n.height / 100
                    }
                    a = o[4].match(/((?:from|to|color-stop)\((?:[0-9\.]+,\s)?(?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)\))+/g);
                    if (a) {
                        f = a.length;
                        for (i = 0; i < f; i += 1) {
                            c = a[i].match(/(from|to|color-stop)\(([0-9\.]+)?(?:,\s)?((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\)/);
                            u = parseFloat(c[2]);
                            if (c[1] === "from") {
                                u = 0
                            }
                            if (c[1] === "to") {
                                u = 1
                            }
                            r.colorStops.push({
                                color: c[3],
                                stop: u
                            })
                        }
                    }
                    break;
                case "-moz-linear-gradient":
                    r = {
                        type: "linear",
                        x0: 0,
                        y0: 0,
                        x1: 0,
                        y1: 0,
                        colorStops: []
                    };
                    a = o[2].match(/(\d{1,3})%?\s(\d{1,3})%?/);
                    if (a) {
                        r.x0 = a[1] * n.width / 100;
                        r.y0 = a[2] * n.height / 100;
                        r.x1 = n.width - r.x0;
                        r.y1 = n.height - r.y0
                    }
                    a = o[3].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)(?:\s\d{1,3}%)?)+/g);
                    if (a) {
                        f = a.length;
                        l = 1 / Math.max(f - 1, 1);
                        for (i = 0; i < f; i += 1) {
                            c = a[i].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%)?/);
                            if (c[2]) {
                                u = parseFloat(c[2]);
                                if (c[3]) {
                                    u /= 100
                                }
                            } else {
                                u = i * l
                            }
                            r.colorStops.push({
                                color: c[1],
                                stop: u
                            })
                        }
                    }
                    break;
                case "-webkit-radial-gradient":
                case "-moz-radial-gradient":
                case "-o-radial-gradient":
                    r = {
                        type: "circle",
                        x0: 0,
                        y0: 0,
                        x1: n.width,
                        y1: n.height,
                        cx: 0,
                        cy: 0,
                        rx: 0,
                        ry: 0,
                        colorStops: []
                    };
                    a = o[2].match(/(\d{1,3})%?\s(\d{1,3})%?/);
                    if (a) {
                        r.cx = a[1] * n.width / 100;
                        r.cy = a[2] * n.height / 100
                    }
                    a = o[3].match(/\w+/);
                    c = o[4].match(/[a-z\-]*/);
                    if (a && c) {
                        switch (c[0]) {
                            case "farthest-corner":
                            case "cover":
                            case "":
                                h = Math.sqrt(Math.pow(r.cx, 2) + Math.pow(r.cy, 2));
                                p = Math.sqrt(Math.pow(r.cx, 2) + Math.pow(r.y1 - r.cy, 2));
                                d = Math.sqrt(Math.pow(r.x1 - r.cx, 2) + Math.pow(r.y1 - r.cy, 2));
                                v = Math.sqrt(Math.pow(r.x1 - r.cx, 2) + Math.pow(r.cy, 2));
                                r.rx = r.ry = Math.max(h, p, d, v);
                                break;
                            case "closest-corner":
                                h = Math.sqrt(Math.pow(r.cx, 2) + Math.pow(r.cy, 2));
                                p = Math.sqrt(Math.pow(r.cx, 2) + Math.pow(r.y1 - r.cy, 2));
                                d = Math.sqrt(Math.pow(r.x1 - r.cx, 2) + Math.pow(r.y1 - r.cy, 2));
                                v = Math.sqrt(Math.pow(r.x1 - r.cx, 2) + Math.pow(r.cy, 2));
                                r.rx = r.ry = Math.min(h, p, d, v);
                                break;
                            case "farthest-side":
                                if (a[0] === "circle") {
                                    r.rx = r.ry = Math.max(r.cx, r.cy, r.x1 - r.cx, r.y1 - r.cy)
                                } else {
                                    r.type = a[0];
                                    r.rx = Math.max(r.cx, r.x1 - r.cx);
                                    r.ry = Math.max(r.cy, r.y1 - r.cy)
                                }
                                break;
                            case "closest-side":
                            case "contain":
                                if (a[0] === "circle") {
                                    r.rx = r.ry = Math.min(r.cx, r.cy, r.x1 - r.cx, r.y1 - r.cy)
                                } else {
                                    r.type = a[0];
                                    r.rx = Math.min(r.cx, r.x1 - r.cx);
                                    r.ry = Math.min(r.cy, r.y1 - r.cy)
                                }
                                break
                        }
                    }
                    a = o[5].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)(?:\s\d{1,3}(?:%|px))?)+/g);
                    if (a) {
                        f = a.length;
                        l = 1 / Math.max(f - 1, 1);
                        for (i = 0; i < f; i += 1) {
                            c = a[i].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%|px)?/);
                            if (c[2]) {
                                u = parseFloat(c[2]);
                                if (c[3] === "%") {
                                    u /= 100
                                } else {
                                    u /= n.width
                                }
                            } else {
                                u = i * l
                            }
                            r.colorStops.push({
                                color: c[1],
                                stop: u
                            })
                        }
                    }
                    break
            }
        }
        return r
    };
    _html2canvas.Generate.Gradient = function(e, t) {
        if (t.width === 0 || t.height === 0) {
            return
        }
        var n = document.createElement("canvas"),
            r = n.getContext("2d"),
            i, s, o, u;
        n.width = t.width;
        n.height = t.height;
        i = _html2canvas.Generate.parseGradient(e, t);
        if (i) {
            if (i.type === "linear") {
                s = r.createLinearGradient(i.x0, i.y0, i.x1, i.y1);
                for (o = 0, u = i.colorStops.length; o < u; o += 1) {
                    try {
                        s.addColorStop(i.colorStops[o].stop, i.colorStops[o].color)
                    } catch (a) {
                        h2clog(["failed to add color stop: ", a, "; tried to add: ", i.colorStops[o], "; stop: ", o, "; in: ", e])
                    }
                }
                r.fillStyle = s;
                r.fillRect(0, 0, t.width, t.height)
            } else if (i.type === "circle") {
                s = r.createRadialGradient(i.cx, i.cy, 0, i.cx, i.cy, i.rx);
                for (o = 0, u = i.colorStops.length; o < u; o += 1) {
                    try {
                        s.addColorStop(i.colorStops[o].stop, i.colorStops[o].color)
                    } catch (a) {
                        h2clog(["failed to add color stop: ", a, "; tried to add: ", i.colorStops[o], "; stop: ", o, "; in: ", e])
                    }
                }
                r.fillStyle = s;
                r.fillRect(0, 0, t.width, t.height)
            } else if (i.type === "ellipse") {
                var f = document.createElement("canvas"),
                    l = f.getContext("2d"),
                    c = Math.max(i.rx, i.ry),
                    h = c * 2,
                    p;
                f.width = f.height = h;
                s = l.createRadialGradient(i.rx, i.ry, 0, i.rx, i.ry, c);
                for (o = 0, u = i.colorStops.length; o < u; o += 1) {
                    try {
                        s.addColorStop(i.colorStops[o].stop, i.colorStops[o].color)
                    } catch (a) {
                        h2clog(["failed to add color stop: ", a, "; tried to add: ", i.colorStops[o], "; stop: ", o, "; in: ", e])
                    }
                }
                l.fillStyle = s;
                l.fillRect(0, 0, h, h);
                r.fillStyle = i.colorStops[o - 1].color;
                r.fillRect(0, 0, n.width, n.height);
                r.drawImage(f, i.cx - i.rx, i.cy - i.ry, 2 * i.rx, 2 * i.ry)
            }
        }
        return n
    };
    _html2canvas.Generate.ListAlpha = function(e) {
        var t = "",
            n;
        do {
            n = e % 26;
            t = String.fromCharCode(n + 64) + t;
            e = e / 26
        } while (e * 26 > 26);
        return t
    };
    _html2canvas.Generate.ListRoman = function(e) {
        var t = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"],
            n = [1e3, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
            r = "",
            i, s = t.length;
        if (e <= 0 || e >= 4e3) {
            return e
        }
        for (i = 0; i < s; i += 1) {
            while (e >= n[i]) {
                e -= n[i];
                r += t[i]
            }
        }
        return r
    }
})();
_html2canvas.Parse = function(e, t) {
    function c() {
        return Math.max(Math.max(i.body.scrollWidth, i.documentElement.scrollWidth), Math.max(i.body.offsetWidth, i.documentElement.offsetWidth), Math.max(i.body.clientWidth, i.documentElement.clientWidth))
    }

    function h() {
        return Math.max(Math.max(i.body.scrollHeight, i.documentElement.scrollHeight), Math.max(i.body.offsetHeight, i.documentElement.offsetHeight), Math.max(i.body.clientHeight, i.documentElement.clientHeight))
    }

    function p(e, t) {
        var n = parseInt(a(e, t), 10);
        return isNaN(n) ? 0 : n
    }

    function d(e, t, n, i, s, o) {
        if (o !== "transparent") {
            e.setVariable("fillStyle", o);
            e.fillRect(t, n, i, s);
            r += 1
        }
    }

    function v(e, t) {
        switch (t) {
            case "lowercase":
                return e.toLowerCase();
            case "capitalize":
                return e.replace(/(^|\s|:|-|\(|\))([a-z])/g, function(e, t, n) {
                    if (e.length > 0) {
                        return t + n.toUpperCase()
                    }
                });
            case "uppercase":
                return e.toUpperCase();
            default:
                return e
        }
    }

    function m(e) {
        return /^(normal|none|0px)$/.test(e)
    }

    function g(e, t, n, i) {
        if (e !== null && _html2canvas.Util.trimText(e).length > 0) {
            i.fillText(e, t, n);
            r += 1
        }
    }

    function y(e, t, n, r) {
        var s = false,
            o = a(t, "fontWeight"),
            u = a(t, "fontFamily"),
            f = a(t, "fontSize");
        switch (parseInt(o, 10)) {
            case 401:
                o = "bold";
                break;
            case 400:
                o = "normal";
                break
        }
        e.setVariable("fillStyle", r);
        e.setVariable("font", [a(t, "fontStyle"), a(t, "fontVariant"), o, f, u].join(" "));
        e.setVariable("textAlign", s ? "right" : "left");
        if (n !== "none") {
            return _html2canvas.Util.Font(u, f, i)
        }
    }

    function b(e, t, n, r, i) {
        switch (t) {
            case "underline":
                d(e, n.left, Math.round(n.top + r.baseline + r.lineWidth), n.width, 1, i);
                break;
            case "overline":
                d(e, n.left, Math.round(n.top), n.width, 1, i);
                break;
            case "line-through":
                d(e, n.left, Math.ceil(n.top + r.middle + r.lineWidth), n.width, 1, i);
                break
        }
    }

    function w(e, t, n, r) {
        var i;
        if (s.rangeBounds) {
            if (n !== "none" || _html2canvas.Util.trimText(t).length !== 0) {
                i = E(t, e.node, e.textOffset)
            }
            e.textOffset += t.length
        } else if (e.node && typeof e.node.nodeValue === "string") {
            var o = r ? e.node.splitText(t.length) : null;
            i = S(e.node);
            e.node = o
        }
        return i
    }

    function E(e, t, n) {
        var r = i.createRange();
        r.setStart(t, n);
        r.setEnd(t, n + e.length);
        return r.getBoundingClientRect()
    }

    function S(e) {
        var t = e.parentNode,
            n = i.createElement("wrapper"),
            r = e.cloneNode(true);
        n.appendChild(e.cloneNode(true));
        t.replaceChild(n, e);
        var s = _html2canvas.Util.Bounds(n);
        t.replaceChild(r, n);
        return s
    }

    function x(e, n, r) {
        var i = r.ctx,
            s = a(e, "color"),
            o = a(e, "textDecoration"),
            u = a(e, "textAlign"),
            f, l, c = {
                node: n,
                textOffset: 0
            };
        if (_html2canvas.Util.trimText(n.nodeValue).length > 0) {
            n.nodeValue = v(n.nodeValue, a(e, "textTransform"));
            u = u.replace(["-webkit-auto"], ["auto"]);
            l = !t.letterRendering && /^(left|right|justify|auto)$/.test(u) && m(a(e, "letterSpacing")) ? n.nodeValue.split(/(\b| )/) : n.nodeValue.split("");
            f = y(i, e, o, s);
            if (t.chinese) {
                l.forEach(function(e, t) {
                    if (/.*[\u4E00-\u9FA5].*$/.test(e)) {
                        e = e.split("");
                        e.unshift(t, 1);
                        l.splice.apply(l, e)
                    }
                })
            }
            l.forEach(function(e, t) {
                var n = w(c, e, o, t < l.length - 1);
                if (n) {
                    g(e, n.left, n.bottom, i);
                    b(i, o, n, f, s)
                }
            })
        }
    }

    function T(e, t) {
        var n = i.createElement("boundelement"),
            r, s;
        n.style.display = "inline";
        r = e.style.listStyleType;
        e.style.listStyleType = "none";
        n.appendChild(i.createTextNode(t));
        e.insertBefore(n, e.firstChild);
        s = _html2canvas.Util.Bounds(n);
        e.removeChild(n);
        e.style.listStyleType = r;
        return s
    }

    function N(e) {
        var t = -1,
            n = 1,
            r = e.parentNode.childNodes;
        if (e.parentNode) {
            while (r[++t] !== e) {
                if (r[t].nodeType === 1) {
                    n++
                }
            }
            return n
        } else {
            return -1
        }
    }

    function C(e, t) {
        var n = N(e),
            r;
        switch (t) {
            case "decimal":
                r = n;
                break;
            case "decimal-leading-zero":
                r = n.toString().length === 1 ? n = "0" + n.toString() : n.toString();
                break;
            case "upper-roman":
                r = _html2canvas.Generate.ListRoman(n);
                break;
            case "lower-roman":
                r = _html2canvas.Generate.ListRoman(n).toLowerCase();
                break;
            case "lower-alpha":
                r = _html2canvas.Generate.ListAlpha(n).toLowerCase();
                break;
            case "upper-alpha":
                r = _html2canvas.Generate.ListAlpha(n);
                break
        }
        r += ". ";
        return r
    }

    function k(e, t, n) {
        var r, i, s = t.ctx,
            o = a(e, "listStyleType"),
            u;
        if (/^(decimal|decimal-leading-zero|upper-alpha|upper-latin|upper-roman|lower-alpha|lower-greek|lower-latin|lower-roman)$/i.test(o)) {
            i = C(e, o);
            u = T(e, i);
            y(s, e, "none", a(e, "color"));
            if (a(e, "listStylePosition") === "inside") {
                s.setVariable("textAlign", "left");
                r = n.left
            } else {
                return
            }
            g(i, r, u.bottom, s)
        }
    }

    function L(t) {
        var n = e[t];
        if (n && n.succeeded === true) {
            return n.img
        } else {
            return false
        }
    }

    function A(e, t) {
        var n = Math.max(e.left, t.left),
            r = Math.max(e.top, t.top),
            i = Math.min(e.left + e.width, t.left + t.width),
            s = Math.min(e.top + e.height, t.top + t.height);
        return {
            left: n,
            top: r,
            width: i - n,
            height: s - r
        }
    }

    function O(e, t) {
        var n;
        if (!t) {
            n = h2czContext(0);
            return n
        }
        if (e !== "auto") {
            n = h2czContext(e);
            t.children.push(n);
            return n
        }
        return t
    }

    function M(e, t, n, r, i) {
        var s = p(t, "paddingLeft"),
            o = p(t, "paddingTop"),
            u = p(t, "paddingRight"),
            a = p(t, "paddingBottom");
        W(e, n, 0, 0, n.width, n.height, r.left + s + i[3].width, r.top + o + i[0].width, r.width - (i[1].width + i[3].width + s + u), r.height - (i[0].width + i[2].width + o + a))
    }

    function _(e) {
        return ["Top", "Right", "Bottom", "Left"].map(function(t) {
            return {
                width: p(e, "border" + t + "Width"),
                color: a(e, "border" + t + "Color")
            }
        })
    }

    function D(e) {
        return ["TopLeft", "TopRight", "BottomRight", "BottomLeft"].map(function(t) {
            return a(e, "border" + t + "Radius")
        })
    }

    function H(e, t, n, r) {
        var i = function(e, t, n) {
            return {
                x: e.x + (t.x - e.x) * n,
                y: e.y + (t.y - e.y) * n
            }
        };
        return {
            start: e,
            startControl: t,
            endControl: n,
            end: r,
            subdivide: function(s) {
                var o = i(e, t, s),
                    u = i(t, n, s),
                    a = i(n, r, s),
                    f = i(o, u, s),
                    l = i(u, a, s),
                    c = i(f, l, s);
                return [H(e, o, f, c), H(c, l, a, r)]
            },
            curveTo: function(e) {
                e.push(["bezierCurve", t.x, t.y, n.x, n.y, r.x, r.y])
            },
            curveToReversed: function(r) {
                r.push(["bezierCurve", n.x, n.y, t.x, t.y, e.x, e.y])
            }
        }
    }

    function B(e, t, n, r, i, s, o) {
        if (t[0] > 0 || t[1] > 0) {
            e.push(["line", r[0].start.x, r[0].start.y]);
            r[0].curveTo(e);
            r[1].curveTo(e)
        } else {
            e.push(["line", s, o])
        }
        if (n[0] > 0 || n[1] > 0) {
            e.push(["line", i[0].start.x, i[0].start.y])
        }
    }

    function j(e, t, n, r, i, s, o) {
        var u = [];
        if (t[0] > 0 || t[1] > 0) {
            u.push(["line", r[1].start.x, r[1].start.y]);
            r[1].curveTo(u)
        } else {
            u.push(["line", e.c1[0], e.c1[1]])
        }
        if (n[0] > 0 || n[1] > 0) {
            u.push(["line", s[0].start.x, s[0].start.y]);
            s[0].curveTo(u);
            u.push(["line", o[0].end.x, o[0].end.y]);
            o[0].curveToReversed(u)
        } else {
            u.push(["line", e.c2[0], e.c2[1]]);
            u.push(["line", e.c3[0], e.c3[1]])
        }
        if (t[0] > 0 || t[1] > 0) {
            u.push(["line", i[1].end.x, i[1].end.y]);
            i[1].curveToReversed(u)
        } else {
            u.push(["line", e.c4[0], e.c4[1]])
        }
        return u
    }

    function F(e, t, n) {
        var r = e.left,
            i = e.top,
            s = e.width,
            o = e.height,
            u = t[0][0],
            a = t[0][1],
            f = t[1][0],
            l = t[1][1],
            c = t[2][0],
            h = t[2][1],
            p = t[3][0],
            d = t[3][1],
            v = s - f,
            m = o - c,
            g = s - h,
            y = o - d;
        return {
            topLeftOuter: P(r, i, u, a).topLeft.subdivide(.5),
            topLeftInner: P(r + n[3].width, i + n[0].width, Math.max(0, u - n[3].width), Math.max(0, a - n[0].width)).topLeft.subdivide(.5),
            topRightOuter: P(r + v, i, f, l).topRight.subdivide(.5),
            topRightInner: P(r + Math.min(v, s + n[3].width), i + n[0].width, v > s + n[3].width ? 0 : f - n[3].width, l - n[0].width).topRight.subdivide(.5),
            bottomRightOuter: P(r + g, i + m, h, c).bottomRight.subdivide(.5),
            bottomRightInner: P(r + Math.min(g, s + n[3].width), i + Math.min(m, o + n[0].width), Math.max(0, h - n[1].width), Math.max(0, c - n[2].width)).bottomRight.subdivide(.5),
            bottomLeftOuter: P(r, i + y, p, d).bottomLeft.subdivide(.5),
            bottomLeftInner: P(r + n[3].width, i + y, Math.max(0, p - n[3].width), Math.max(0, d - n[2].width)).bottomLeft.subdivide(.5)
        }
    }

    function I(e, t, n, r, i) {
        var s = a(e, "backgroundClip"),
            o = [];
        switch (s) {
            case "content-box":
            case "padding-box":
                B(o, r[0], r[1], t.topLeftInner, t.topRightInner, i.left + n[3].width, i.top + n[0].width);
                B(o, r[1], r[2], t.topRightInner, t.bottomRightInner, i.left + i.width - n[1].width, i.top + n[0].width);
                B(o, r[2], r[3], t.bottomRightInner, t.bottomLeftInner, i.left + i.width - n[1].width, i.top + i.height - n[2].width);
                B(o, r[3], r[0], t.bottomLeftInner, t.topLeftInner, i.left + n[3].width, i.top + i.height - n[2].width);
                break;
            default:
                B(o, r[0], r[1], t.topLeftOuter, t.topRightOuter, i.left, i.top);
                B(o, r[1], r[2], t.topRightOuter, t.bottomRightOuter, i.left + i.width, i.top);
                B(o, r[2], r[3], t.bottomRightOuter, t.bottomLeftOuter, i.left + i.width, i.top + i.height);
                B(o, r[3], r[0], t.bottomLeftOuter, t.topLeftOuter, i.left, i.top + i.height);
                break
        }
        return o
    }

    function q(e, t, n) {
        var r = t.left,
            i = t.top,
            s = t.width,
            o = t.height,
            u, a, f, l, c, h, p = D(e),
            d = F(t, p, n),
            v = {
                clip: I(e, d, n, p, t),
                borders: []
            };
        for (u = 0; u < 4; u++) {
            if (n[u].width > 0) {
                a = r;
                f = i;
                l = s;
                c = o - n[2].width;
                switch (u) {
                    case 0:
                        c = n[0].width;
                        h = j({
                            c1: [a, f],
                            c2: [a + l, f],
                            c3: [a + l - n[1].width, f + c],
                            c4: [a + n[3].width, f + c]
                        }, p[0], p[1], d.topLeftOuter, d.topLeftInner, d.topRightOuter, d.topRightInner);
                        break;
                    case 1:
                        a = r + s - n[1].width;
                        l = n[1].width;
                        h = j({
                            c1: [a + l, f],
                            c2: [a + l, f + c + n[2].width],
                            c3: [a, f + c],
                            c4: [a, f + n[0].width]
                        }, p[1], p[2], d.topRightOuter, d.topRightInner, d.bottomRightOuter, d.bottomRightInner);
                        break;
                    case 2:
                        f = f + o - n[2].width;
                        c = n[2].width;
                        h = j({
                            c1: [a + l, f + c],
                            c2: [a, f + c],
                            c3: [a + n[3].width, f],
                            c4: [a + l - n[2].width, f]
                        }, p[2], p[3], d.bottomRightOuter, d.bottomRightInner, d.bottomLeftOuter, d.bottomLeftInner);
                        break;
                    case 3:
                        l = n[3].width;
                        h = j({
                            c1: [a, f + c + n[2].width],
                            c2: [a, f],
                            c3: [a + l, f + n[0].width],
                            c4: [a + l, f + c]
                        }, p[3], p[0], d.bottomLeftOuter, d.bottomLeftInner, d.topLeftOuter, d.topLeftInner);
                        break
                }
                v.borders.push({
                    args: h,
                    color: n[u].color
                })
            }
        }
        return v
    }

    function R(e, t) {
        var n = e.drawShape();
        t.forEach(function(e, t) {
            n[t === 0 ? "moveTo" : e[0] + "To"].apply(null, e.slice(1))
        });
        return n
    }

    function U(e, t, n) {
        if (n !== "transparent") {
            e.setVariable("fillStyle", n);
            R(e, t);
            e.fill();
            r += 1
        }
    }

    function z(e, t, n) {
        var r = i.createElement("valuewrap"),
            s = ["lineHeight", "textAlign", "fontFamily", "color", "fontSize", "paddingLeft", "paddingTop", "width", "height", "border", "borderLeftWidth", "borderTopWidth"],
            o, f;
        s.forEach(function(t) {
            try {
                r.style[t] = a(e, t)
            } catch (n) {
                h2clog("html2canvas: Parse: Exception caught in renderFormValue: " + n.message)
            }
        });
        r.style.borderColor = "black";
        r.style.borderStyle = "solid";
        r.style.display = "block";
        r.style.position = "absolute";
        if (/^(submit|reset|button|text|password)$/.test(e.type) || e.nodeName === "SELECT") {
            r.style.lineHeight = a(e, "height")
        }
        r.style.top = t.top + "px";
        r.style.left = t.left + "px";
        o = e.nodeName === "SELECT" ? (e.options[e.selectedIndex] || 0).text : e.value;
        if (!o) {
            o = e.placeholder
        }
        f = i.createTextNode(o);
        r.appendChild(f);
        u.appendChild(r);
        x(e, f, n);
        u.removeChild(r)
    }

    function W(e) {
        e.drawImage.apply(e, Array.prototype.slice.call(arguments, 1));
        r += 1
    }

    function X(e, t) {
        var n = window.getComputedStyle(e, t);
        if (!n || !n.content || n.content === "none" || n.content === "-moz-alt-content") {
            return
        }
        var r = n.content + "",
            i = r.substr(0, 1);
        if (i === r.substr(r.length - 1) && i.match(/'|"/)) {
            r = r.substr(1, r.length - 2)
        }
        var s = r.substr(0, 3) === "url",
            o = document.createElement(s ? "img" : "span");
        o.className = f + "-before " + f + "-after";
        Object.keys(n).filter(V).forEach(function(e) {
            o.style[e] = n[e]
        });
        if (s) {
            o.src = _html2canvas.Util.parseBackgroundImage(r)[0].args[0]
        } else {
            o.innerHTML = r
        }
        return o
    }

    function V(e) {
        return isNaN(window.parseInt(e, 10))
    }

    function $(e, t) {
        var n = X(e, ":before"),
            r = X(e, ":after");
        if (!n && !r) {
            return
        }
        if (n) {
            e.className += " " + f + "-before";
            e.parentNode.insertBefore(n, e);
            st(n, t, true);
            e.parentNode.removeChild(n);
            e.className = e.className.replace(f + "-before", "").trim()
        }
        if (r) {
            e.className += " " + f + "-after";
            e.appendChild(r);
            st(r, t, true);
            e.removeChild(r);
            e.className = e.className.replace(f + "-after", "").trim()
        }
    }

    function J(e, t, n, r) {
        var i = Math.round(r.left + n.left),
            s = Math.round(r.top + n.top);
        e.createPattern(t);
        e.translate(i, s);
        e.fill();
        e.translate(-i, -s)
    }

    function K(e, t, n, r, i, s, o, u) {
        var a = [];
        a.push(["line", Math.round(i), Math.round(s)]);
        a.push(["line", Math.round(i + o), Math.round(s)]);
        a.push(["line", Math.round(i + o), Math.round(u + s)]);
        a.push(["line", Math.round(i), Math.round(u + s)]);
        R(e, a);
        e.save();
        e.clip();
        J(e, t, n, r);
        e.restore()
    }

    function Q(e, t, n) {
        d(e, t.left, t.top, t.width, t.height, n)
    }

    function G(e, t, n, r, i) {
        var s = _html2canvas.Util.BackgroundSize(e, t, r, i),
            o = _html2canvas.Util.BackgroundPosition(e, t, r, i, s),
            u = a(e, "backgroundRepeat").split(",").map(function(e) {
                return e.trim()
            });
        r = Z(r, s);
        u = u[i] || u[0];
        switch (u) {
            case "repeat-x":
                K(n, r, o, t, t.left, t.top + o.top, 99999, r.height);
                break;
            case "repeat-y":
                K(n, r, o, t, t.left + o.left, t.top, r.width, 99999);
                break;
            case "no-repeat":
                K(n, r, o, t, t.left + o.left, t.top + o.top, r.width, r.height);
                break;
            default:
                J(n, r, o, {
                    top: t.top,
                    left: t.left,
                    width: r.width,
                    height: r.height
                });
                break
        }
    }

    function Y(e, t, n) {
        var r = a(e, "backgroundImage"),
            i = _html2canvas.Util.parseBackgroundImage(r),
            s, o = i.length;
        while (o--) {
            r = i[o];
            if (!r.args || r.args.length === 0) {
                continue
            }
            var u = r.method === "url" ? r.args[0] : r.value;
            s = L(u);
            if (s) {
                G(e, t, n, s, o)
            } else {
                h2clog("html2canvas: Error loading background:", r)
            }
        }
    }

    function Z(e, t) {
        if (e.width === t.width && e.height === t.height) {
            return e
        }
        var n, r = i.createElement("canvas");
        r.width = t.width;
        r.height = t.height;
        n = r.getContext("2d");
        W(n, e, 0, 0, e.width, e.height, 0, 0, t.width, t.height);
        return r
    }

    function et(e, t, n) {
        var r = a(t, "opacity") * (n ? n.opacity : 1);
        e.setVariable("globalAlpha", r);
        return r
    }

    function tt(e, n, r) {
        var i = h2cRenderContext(!n ? c() : r.width, !n ? h() : r.height),
            s = {
                ctx: i,
                zIndex: O(a(e, "zIndex"), n ? n.zIndex : null),
                opacity: et(i, e, n),
                cssPosition: a(e, "position"),
                borders: _(e),
                clip: n && n.clip ? _html2canvas.Util.Extend({}, n.clip) : null
            };
        if (t.useOverflow === true && /(hidden|scroll|auto)/.test(a(e, "overflow")) === true && /(BODY)/i.test(e.nodeName) === false) {
            s.clip = s.clip ? A(s.clip, r) : r
        }
        s.zIndex.children.push(s);
        return s
    }

    function nt(e, t, n) {
        var r = {
            left: t.left + e[3].width,
            top: t.top + e[0].width,
            width: t.width - (e[1].width + e[3].width),
            height: t.height - (e[0].width + e[2].width)
        };
        if (n) {
            r = A(r, n)
        }
        return r
    }

    function rt(e, t, n) {
        var r = _html2canvas.Util.Bounds(e),
            i, s = o.test(e.nodeName) ? "#efefef" : a(e, "backgroundColor"),
            u = tt(e, t, r),
            f = u.borders,
            l = u.ctx,
            c = nt(f, r, u.clip),
            h = q(e, r, f);
        R(l, h.clip);
        l.save();
        l.clip();
        if (c.height > 0 && c.width > 0) {
            Q(l, r, s);
            Y(e, c, l)
        }
        l.restore();
        h.borders.forEach(function(e) {
            U(l, e.args, e.color)
        });
        if (!n) {
            $(e, u)
        }
        switch (e.nodeName) {
            case "IMG":
                if (i = L(e.getAttribute("src"))) {
                    M(l, e, i, r, f)
                } else {
                    h2clog("html2canvas: Error loading <img>:" + e.getAttribute("src"))
                }
                break;
            case "INPUT":
                if (/^(text|url|email|submit|button|reset)$/.test(e.type) && (e.value || e.placeholder).length > 0) {
                    z(e, r, u)
                }
                break;
            case "TEXTAREA":
                if ((e.value || e.placeholder || "").length > 0) {
                    z(e, r, u)
                }
                break;
            case "SELECT":
                if ((e.options || e.placeholder || "").length > 0) {
                    z(e, r, u)
                }
                break;
            case "LI":
                k(e, u, c);
                break;
            case "VIDEO":
                var p = document.createElement("canvas");
                p.width = e.videoWidth || e.clientWidth || 320;
                p.height = e.videoHeight || e.clientHeight || 240;
                var d = p.getContext("2d");
                d.drawImage(e, 0, 0, p.width, p.height);
                M(l, p, p, r, f);
                break;
            case "CANVAS":
                M(l, e, e, r, f);
                break
        }
        return u
    }

    function it(e) {
        return a(e, "display") !== "none" && a(e, "visibility") !== "hidden" && !e.hasAttribute("data-html2canvas-ignore")
    }

    function st(e, t, n) {
        if (it(e)) {
            t = rt(e, t, n) || t;
            if (!o.test(e.nodeName)) {
                if (e.tagName == "IFRAME") e = e.contentDocument;
                _html2canvas.Util.Children(e).forEach(function(r) {
                    if (r.nodeType === 1) {
                        st(r, t, n)
                    } else if (r.nodeType === 3) {
                        x(e, r, t)
                    }
                })
            }
        }
    }

    function ot(e, t) {
        function o(e) {
            var t = _html2canvas.Util.Children(e),
                n = t.length,
                r, i, u, a, f;
            for (f = 0; f < n; f += 1) {
                a = t[f];
                if (a.nodeType === 3) {
                    s += a.nodeValue.replace(/</g, "&lt;").replace(/>/g, "&gt;")
                } else if (a.nodeType === 1) {
                    if (!/^(script|meta|title)$/.test(a.nodeName.toLowerCase())) {
                        s += "<" + a.nodeName.toLowerCase();
                        if (a.hasAttributes()) {
                            r = a.attributes;
                            u = r.length;
                            for (i = 0; i < u; i += 1) {
                                s += " " + r[i].name + '="' + r[i].value + '"'
                            }
                        }
                        s += ">";
                        o(a);
                        s += "</" + a.nodeName.toLowerCase() + ">"
                    }
                }
            }
        }
        var n = new Image,
            r = c(),
            i = h(),
            s = "";
        o(e);
        n.src = ["data:image/svg+xml,", "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='" + r + "' height='" + i + "'>", "<foreignObject width='" + r + "' height='" + i + "'>", "<html xmlns='http://www.w3.org/1999/xhtml' style='margin:0;'>", s.replace(/\#/g, "%23"), "</html>", "</foreignObject>", "</svg>"].join("");
        n.onload = function() {
            t.svgRender = n
        }
    }

    function ut() {
        var e = rt(n, null);
        if (s.svgRendering) {
            ot(document.documentElement, e)
        }
        Array.prototype.slice.call(n.children, 0).forEach(function(t) {
            st(t, e)
        });
        e.backgroundColor = a(document.documentElement, "backgroundColor");
        u.removeChild(l);
        return e
    }
    var n = t.elements === undefined ? document.body : t.elements[0],
        r = 0,
        i = n.ownerDocument,
        s = _html2canvas.Util.Support(t, i),
        o = new RegExp("(" + t.ignoreElements + ")"),
        u = i.body,
        a = _html2canvas.Util.getCSS,
        f = "___html2canvas___pseudoelement",
        l = i.createElement("style");
    l.innerHTML = "." + f + '-before:before { content: "" !important; display: none !important; }' + "." + f + '-after:after { content: "" !important; display: none !important; }';
    u.appendChild(l);
    e = e || {};
    var P = function(e) {
        return function(t, n, r, i) {
            var s = r * e,
                o = i * e,
                u = t + r,
                a = n + i;
            return {
                topLeft: H({
                    x: t,
                    y: a
                }, {
                    x: t,
                    y: a - o
                }, {
                    x: u - s,
                    y: n
                }, {
                    x: u,
                    y: n
                }),
                topRight: H({
                    x: t,
                    y: n
                }, {
                    x: t + s,
                    y: n
                }, {
                    x: u,
                    y: a - o
                }, {
                    x: u,
                    y: a
                }),
                bottomRight: H({
                    x: u,
                    y: n
                }, {
                    x: u,
                    y: n + o
                }, {
                    x: t + s,
                    y: a
                }, {
                    x: t,
                    y: a
                }),
                bottomLeft: H({
                    x: u,
                    y: a
                }, {
                    x: u - s,
                    y: a
                }, {
                    x: t,
                    y: n + o
                }, {
                    x: t,
                    y: n
                })
            }
        }
    }(4 * ((Math.sqrt(2) - 1) / 3));
    return ut()
};
_html2canvas.Preload = function(e) {
    function p(e) {
        l.href = e;
        l.href = l.href;
        var t = l.protocol + l.host;
        return t === n
    }

    function d() {
        h2clog("html2canvas: start: images: " + t.numLoaded + " / " + t.numTotal + " (failed: " + t.numFailed + ")");
        if (!t.firstRun && t.numLoaded >= t.numTotal) {
            h2clog("Finished loading images: # " + t.numTotal + " (failed: " + t.numFailed + ")");
            if (typeof e.complete === "function") {
                e.complete(t)
            }
        }
    }

    function v(n, r, i) {
        var o, a = e.proxy,
            f;
        l.href = n;
        n = l.href;
        o = "html2canvas_" + s++;
        i.callbackname = o;
        if (a.indexOf("?") > -1) {
            a += "&"
        } else {
            a += "?"
        }
        a += "url=" + encodeURIComponent(n) + "&callback=" + o;
        f = u.createElement("script");
        window[o] = function(e) {
            if (e.substring(0, 6) === "error:") {
                i.succeeded = false;
                t.numLoaded++;
                t.numFailed++;
                d()
            } else {
                S(r, i);
                r.src = e
            }
            window[o] = undefined;
            try {
                delete window[o]
            } catch (n) {}
            f.parentNode.removeChild(f);
            f = null;
            delete i.script;
            delete i.callbackname
        };
        f.setAttribute("type", "text/javascript");
        f.setAttribute("src", a);
        i.script = f;
        window.document.body.appendChild(f)
    }

    function m(e, t) {
        var n = window.getComputedStyle(e, t),
            i = n.content;
        if (i.substr(0, 3) === "url") {
            r.loadImage(_html2canvas.Util.parseBackgroundImage(i)[0].args[0])
        }
        w(n.backgroundImage, e)
    }

    function g(e) {
        m(e, ":before");
        m(e, ":after")
    }

    function y(e, n) {
        var r = _html2canvas.Generate.Gradient(e, n);
        if (r !== undefined) {
            t[e] = {
                img: r,
                succeeded: true
            };
            t.numTotal++;
            t.numLoaded++;
            d()
        }
    }

    function b(e) {
        return e && e.method && e.args && e.args.length > 0
    }

    function w(e, t) {
        var n;
        _html2canvas.Util.parseBackgroundImage(e).filter(b).forEach(function(e) {
            if (e.method === "url") {
                r.loadImage(e.args[0])
            } else if (e.method.match(/\-?gradient$/)) {
                if (n === undefined) {
                    n = _html2canvas.Util.Bounds(t)
                }
                y(e.value, n)
            }
        })
    }

    function E(e) {
        var t = false;
        try {
            _html2canvas.Util.Children(e).forEach(function(e) {
                E(e)
            })
        } catch (n) {}
        try {
            t = e.nodeType
        } catch (r) {
            t = false;
            h2clog("html2canvas: failed to access some element's nodeType - Exception: " + r.message)
        }
        if (t === 1 || t === undefined) {
            g(e);
            try {
                w(_html2canvas.Util.getCSS(e, "backgroundImage"), e)
            } catch (n) {
                h2clog("html2canvas: failed to get background-image - Exception: " + n.message)
            }
            w(e)
        }
    }

    function S(n, r) {
        n.onload = function() {
            if (r.timer !== undefined) {
                window.clearTimeout(r.timer)
            }
            t.numLoaded++;
            r.succeeded = true;
            n.onerror = n.onload = null;
            d()
        };
        n.onerror = function() {
            if (n.crossOrigin === "anonymous") {
                window.clearTimeout(r.timer);
                if (e.proxy) {
                    var i = n.src;
                    n = new Image;
                    r.img = n;
                    n.src = i;
                    v(n.src, n, r);
                    return
                }
            }
            t.numLoaded++;
            t.numFailed++;
            r.succeeded = false;
            n.onerror = n.onload = null;
            d()
        }
    }
    var t = {
            numLoaded: 0,
            numFailed: 0,
            numTotal: 0,
            cleanupDone: false
        },
        n, r, i, s = 0,
        o = e.elements[0] || document.body,
        u = o.ownerDocument,
        a = u.images,
        f = a.length,
        l = u.createElement("a"),
        c = function(e) {
            return e.crossOrigin !== undefined
        }(new Image),
        h;
    l.href = window.location.href;
    n = l.protocol + l.host;
    r = {
        loadImage: function(n) {
            var r, i;
            if (n && t[n] === undefined) {
                r = new Image;
                if (n.match(/data:image\/.*;base64,/i)) {
                    r.src = n.replace(/url\(['"]{0,}|['"]{0,}\)$/ig, "");
                    i = t[n] = {
                        img: r
                    };
                    t.numTotal++;
                    S(r, i)
                } else if (p(n) || e.allowTaint === true) {
                    i = t[n] = {
                        img: r
                    };
                    t.numTotal++;
                    S(r, i);
                    r.src = n
                } else if (c && !e.allowTaint && e.useCORS) {
                    r.crossOrigin = "anonymous";
                    i = t[n] = {
                        img: r
                    };
                    t.numTotal++;
                    S(r, i);
                    r.src = n;
                    r.customComplete = function() {
                        if (!this.img.complete) {
                            this.timer = window.setTimeout(this.img.customComplete, 100)
                        } else {
                            this.img.onerror()
                        }
                    }.bind(i);
                    r.customComplete()
                } else if (e.proxy) {
                    i = t[n] = {
                        img: r
                    };
                    t.numTotal++;
                    v(n, r, i)
                }
            }
        },
        cleanupDOM: function(n) {
            var r, i;
            if (!t.cleanupDone) {
                if (n && typeof n === "string") {
                    h2clog("html2canvas: Cleanup because: " + n)
                } else {
                    h2clog("html2canvas: Cleanup after timeout: " + e.timeout + " ms.")
                }
                for (i in t) {
                    if (t.hasOwnProperty(i)) {
                        r = t[i];
                        if (typeof r === "object" && r.callbackname && r.succeeded === undefined) {
                            window[r.callbackname] = undefined;
                            try {
                                delete window[r.callbackname]
                            } catch (s) {}
                            if (r.script && r.script.parentNode) {
                                r.script.setAttribute("src", "about:blank");
                                r.script.parentNode.removeChild(r.script)
                            }
                            t.numLoaded++;
                            t.numFailed++;
                            h2clog("html2canvas: Cleaned up failed img: '" + i + "' Steps: " + t.numLoaded + " / " + t.numTotal)
                        }
                    }
                }
                if (window.stop !== undefined) {
                    window.stop()
                } else if (document.execCommand !== undefined) {
                    document.execCommand("Stop", false)
                }
                if (document.close !== undefined) {
                    document.close()
                }
                t.cleanupDone = true;
                if (!(n && typeof n === "string")) {
                    d()
                }
            }
        },
        renderingDone: function() {
            if (h) {
                window.clearTimeout(h)
            }
        }
    };
    if (e.timeout > 0) {
        h = window.setTimeout(r.cleanupDOM, e.timeout)
    }
    h2clog("html2canvas: Preload starts: finding background-images");
    t.firstRun = true;
    E(o);
    h2clog("html2canvas: Preload: Finding images");
    for (i = 0; i < f; i += 1) {
        r.loadImage(a[i].getAttribute("src"))
    }
    t.firstRun = false;
    h2clog("html2canvas: Preload: Done.");
    if (t.numTotal === t.numLoaded) {
        d()
    }
    return r
};
_html2canvas.Renderer = function(e, t) {
    function n(e) {
        var t = [];
        var n = function(e) {
            var r = [],
                i = [];
            e.children.forEach(function(e) {
                if (e.children && e.children.length > 0) {
                    r.push(e);
                    i.push(e.zindex)
                } else {
                    t.push(e)
                }
            });
            i.sort(function(e, t) {
                return e - t
            });
            i.forEach(function(e) {
                var t;
                r.some(function(n, r) {
                    t = r;
                    return n.zindex === e
                });
                n(r.splice(t, 1)[0])
            })
        };
        n(e.zIndex);
        return t
    }

    function r(e) {
        var n;
        if (typeof t.renderer === "string" && _html2canvas.Renderer[e] !== undefined) {
            n = _html2canvas.Renderer[e](t)
        } else if (typeof e === "function") {
            n = e(t)
        } else {
            throw new Error("Unknown renderer")
        }
        if (typeof n !== "function") {
            throw new Error("Invalid renderer defined")
        }
        return n
    }
    return r(t.renderer)(e, t, document, n(e), _html2canvas)
};
_html2canvas.Util.Support = function(e, t) {
    function n() {
        var e = new Image,
            n = t.createElement("canvas"),
            r = n.getContext === undefined ? false : n.getContext("2d");
        if (r === false) {
            return false
        }
        n.width = n.height = 10;
        e.src = ["data:image/svg+xml,", "<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'>", "<foreignObject width='10' height='10'>", "<div xmlns='http://www.w3.org/1999/xhtml' style='width:10;height:10;'>", "sup", "</div>", "</foreignObject>", "</svg>"].join("");
        try {
            r.drawImage(e, 0, 0);
            n.toDataURL()
        } catch (i) {
            return false
        }
        h2clog("html2canvas: Parse: SVG powered rendering available");
        return true
    }

    function r() {
        var e, n, r, i, s = false;
        if (t.createRange) {
            e = t.createRange();
            if (e.getBoundingClientRect) {
                n = t.createElement("boundtest");
                n.style.height = "123px";
                n.style.display = "block";
                t.body.appendChild(n);
                e.selectNode(n);
                r = e.getBoundingClientRect();
                i = r.height;
                if (i === 123) {
                    s = true
                }
                t.body.removeChild(n)
            }
        }
        return s
    }
    return {
        rangeBounds: r(),
        svgRendering: e.svgRendering && n()
    }
};
window.html2canvas = function(e, t) {
    e = e.length ? e : [e];
    var n, r, i = {
        logging: false,
        elements: e,
        background: "#fff",
        proxy: null,
        timeout: 0,
        useCORS: false,
        allowTaint: false,
        svgRendering: false,
        ignoreElements: "IFRAME|OBJECT|PARAM",
        useOverflow: true,
        letterRendering: false,
        chinese: false,
        width: null,
        height: null,
        taintTest: true,
        renderer: "Canvas"
    };
    i = _html2canvas.Util.Extend(t, i);
    _html2canvas.logging = i.logging;
    i.complete = function(e) {
        if (typeof i.onpreloaded === "function") {
            if (i.onpreloaded(e) === false) {
                return
            }
        }
        n = _html2canvas.Parse(e, i);
        if (typeof i.onparsed === "function") {
            if (i.onparsed(n) === false) {
                return
            }
        }
        r = _html2canvas.Renderer(n, i);
        if (typeof i.onrendered === "function") {
            if (typeof i.grabMouse != "undefined" && !i.grabMouse) {
                i.onrendered(r)
            } else {
                var t = new Image(25, 25);
                t.onload = function() {
                    r.getContext("2d").drawImage(t, coordX, coordY, 25, 25);
                    i.onrendered(r)
                };
                t.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAZCAYAAAAxFw7TAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjExR/NCNwAAAzZJREFUSEut1EtME1EUANBiTTFaivRDKbaFFgiILgxx0bQllYItYKFIgEYoC2oEwqeCC4gG1xg2dmEwEQMJujIxwQ24wA2uCFAB3SBBfqWuyqd/CuV634QSPgOFxElu+mZye+a++948BgAw/mccYAwGIyY7O1vR3NzSiuMLX5GiDoO8tLQ0QzAYDLW1tT2/qEgHJslk8rKtLU9odzcMTU3N7RdB6UBhRkZG6fz8QrCuzgJutwfq6xtazovSgunp6SUOhzPI5XJBr9fD9nYojHjDeVA6MJH0EMGARCIBRKC8vJygO2ZzrSUaSgumpqY+cDjWAlJpCgWSMJlMiO6EqqpMtWehtKBUKi1eXV3zI3wAEhQrJJUGseJHp6G0IE61CKfsl8lkR0CCWiyPAXeU32AwVNChdKAAwUIEfXK5/ARI0IaGRkS3vXp9ofE4SguKxWL92tpfH642LUjQ1lYr+P0Bt1abX3wYPQv04n48FSRoe/sz8Pn8G7m5uboISgfyk5OT72OF3szMzBMgk8k88qyjowPW1zddCoVCS1BaUCQSEdCTlZV18GcOh0ONq6trYGbmJ0xMTO3Z7dMwPj4B4XAYXC7XhkqlKqAFBQJBAS6KB08dClEqlTA8/JUak5cEAkHo6nppMxqN7ZWVVZ0GQ0lnRUXlC6VSVXoamI+gm/RQKEyChYU/u5gYUqvVFDo09AVsNttrHMdh3MAQYyRhxNIeX3y+QLu0tLKlVufC5OQU9Pa+/TgwMPCpv7+fAouKigG/pFX81qV4H4PBwrh8Wg95eOUtLi5vLi+v4FSHRzExRafTNZJ7NptNobOzs2C1Wp+eZx/yEhIS8jwer99ut//icOJvk+mwWCzF3NzvebPZTIF4+ILd/mMcx1ei7UOeUCjUjY19n8YvRYPJVzG4GGk9PT3vRkZGKJDH44PT6STTfxgNjGez4+4idg8Tr+8nx+KvNCcnx4y926mpMUNf33vY2wPo7n71JhpImszer4x5KFmE4zujo98m3W6ve3Dww2eNRvMEW3GLrG4kj26Vj/c5ch+Pg5t4ApXhopFWSDASMcjzg+siIKmWVJm839Nr+Hvp+Nsj4D+5Hdf43ZzjNQAAAABJRU5ErkJggg=="
            }
        }
    };
    window.setTimeout(function() {
        _html2canvas.Preload(i)
    }, 0);
    return {
        render: function(e, t) {
            return _html2canvas.Renderer(e, _html2canvas.Util.Extend(t, i))
        },
        parse: function(e, t) {
            return _html2canvas.Parse(e, _html2canvas.Util.Extend(t, i))
        },
        preload: function(e) {
            return _html2canvas.Preload(_html2canvas.Util.Extend(e, i))
        },
        log: h2clog
    }
};
window.html2canvas.log = h2clog;
window.html2canvas.Renderer = {
    Canvas: undefined
};
_html2canvas.Renderer.Canvas = function(e) {
    function o(e, t) {
        e.beginPath();
        t.forEach(function(t) {
            e[t.name].apply(e, t["arguments"])
        });
        e.closePath()
    }

    function u(e) {
        if (n.indexOf(e["arguments"][0].src) === -1) {
            i.drawImage(e["arguments"][0], 0, 0);
            try {
                i.getImageData(0, 0, 1, 1)
            } catch (s) {
                r = t.createElement("canvas");
                i = r.getContext("2d");
                return false
            }
            n.push(e["arguments"][0].src)
        }
        return true
    }

    function a(e) {
        return e === "transparent" || e === "rgba(0, 0, 0, 0)"
    }

    function f(t, n) {
        switch (n.type) {
            case "variable":
                t[n.name] = n["arguments"];
                break;
            case "function":
                if (n.name === "createPattern") {
                    if (n["arguments"][0].width > 0 && n["arguments"][0].height > 0) {
                        try {
                            t.fillStyle = t.createPattern(n["arguments"][0], "repeat")
                        } catch (r) {
                            h2clog("html2canvas: Renderer: Error creating pattern", r.message)
                        }
                    }
                } else if (n.name === "drawShape") {
                    o(t, n["arguments"])
                } else if (n.name === "drawImage") {
                    if (n["arguments"][8] > 0 && n["arguments"][7] > 0) {
                        if (!e.taintTest || e.taintTest && u(n)) {
                            t.drawImage.apply(t, n["arguments"])
                        }
                    }
                } else {
                    t[n.name].apply(t, n["arguments"])
                }
                break
        }
    }
    e = e || {};
    var t = document,
        n = [],
        r = document.createElement("canvas"),
        i = r.getContext("2d"),
        s = e.canvas || t.createElement("canvas");
    return function(e, t, n, r, i) {
        var o = s.getContext("2d"),
            u, l, c, h, p, d;
        s.width = s.style.width = t.width || e.ctx.width;
        s.height = s.style.height = t.height || e.ctx.height;
        d = o.fillStyle;
        o.fillStyle = a(e.backgroundColor) && t.background !== undefined ? t.background : e.backgroundColor;
        o.fillRect(0, 0, s.width, s.height);
        o.fillStyle = d;
        if (t.svgRendering && e.svgRender !== undefined) {
            o.drawImage(e.svgRender, 0, 0)
        } else {
            for (l = 0, c = r.length; l < c; l += 1) {
                u = r.splice(0, 1)[0];
                u.canvasPosition = u.canvasPosition || {};
                o.textBaseline = "bottom";
                if (u.clip) {
                    o.save();
                    o.beginPath();
                    o.rect(u.clip.left, u.clip.top, u.clip.width, u.clip.height);
                    o.clip()
                }
                if (u.ctx.storage) {
                    u.ctx.storage.forEach(f.bind(null, o))
                }
                if (u.clip) {
                    o.restore()
                }
            }
        }
        h2clog("html2canvas: Renderer: Canvas renderer done - returning canvas obj");
        c = t.elements.length;
        if (c === 1) {
            if (typeof t.elements[0] === "object" && t.elements[0].nodeName !== "BODY") {
                p = i.Util.Bounds(t.elements[0]);
                h = n.createElement("canvas");
                h.width = p.width;
                h.height = p.height;
                o = h.getContext("2d");
                o.drawImage(s, p.left, p.top, p.width, p.height, 0, 0, p.width, p.height);
                s = null;
                return h
            }
        }
        return s
    }
};
(function() {
    var e = 0,
        t = ["ms", "moz", "webkit", "o"];
    for (var n = 0; n < t.length && !window.requestAnimationFrame; ++n) {
        window.requestAnimationFrame = window[t[n] + "RequestAnimationFrame"];
        window.cancelAnimationFrame = window[t[n] + "CancelAnimationFrame"] || window[t[n] + "RequestCancelAnimationFrame"]
    }
    if (!window.requestAnimationFrame) window.requestAnimationFrame = function(t, n) {
        var r = (new Date).getTime();
        var i = Math.max(0, 16 - (r - e));
        var s = window.setTimeout(function() {
            t(r + i)
        }, i);
        e = r + i;
        return s
    };
    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(e) {
        clearTimeout(e)
    }
})();
var IE = document.all ? true : false;
if (!IE) document.captureEvents(Event.MOUSEMOVE);
document.addEventListener("mousemove", getMouseXY, false);
var coordX = 0;
var coordY = 0