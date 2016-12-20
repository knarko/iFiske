/* eslint-disable */
(function() {
    if (!String.prototype.repeat) {
        String.prototype.repeat = function(count) {
            'use strict';
            if (this == null) {
                throw new TypeError('can\'t convert ' + this + ' to object');
            }
            var str = '' + this;
            count = +count;
            if (count != count) {
                count = 0;
            }
            if (count < 0) {
                throw new RangeError('repeat count must be non-negative');
            }
            if (count == Infinity) {
                throw new RangeError('repeat count must be less than infinity');
            }
            count = Math.floor(count);
            if (str.length == 0 || count == 0) {
                return '';
            }
            // Ensuring count is a 31-bit integer allows us to heavily optimize the
            // main part. But anyway, most current (August 2014) browsers can't handle
            // strings 1 << 28 chars or longer, so:
            if (str.length * count >= 1 << 28) {
                throw new RangeError('repeat count must not overflow maximum string size');
            }
            var rpt = '';
            for (;;) {
                if ((count & 1) == 1) {
                    rpt += str;
                }
                count >>>= 1;
                if (count == 0) {
                    break;
                }
                str += str;
            }
            return rpt;
        };
    }
})();


// https://github.com/tc39/proposal-object-values-entries
;(function() {
var reduce = Function.bind.call(Function.call, Array.prototype.reduce);
var isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable);
var concat = Function.bind.call(Function.call, Array.prototype.concat);
var keys = Reflect.ownKeys;

if (!Object.values) {
	Object.values = function values(O) {
		return reduce(keys(O), function(v, k) {return concat(v, typeof k === 'string' && isEnumerable(O, k) ? [O[k]] : [])}, []);
	};
}
})();


// https://github.com/jerrybendy/url-search-params-polyfill
(function(self) {
    'use strict';

    if (self.URLSearchParams) {
        return;
    }


    var __URLSearchParams__ = "__URLSearchParams__";


    function URLSearchParams (search) {
        search = search || "";

        this [__URLSearchParams__] = {};

        if (typeof search === "object") {
            for (var i in search) {
                if (search.hasOwnProperty(i)) {
                    this.append(i, JSON.stringify(search [i]));
                }
            }

        } else {

            // remove first '?'
            if (search.indexOf("?") === 0) {
                search = search.slice(1);
            }

            var pairs = search.split("&");
            for (var j = 0; j < pairs.length; j ++) {
                var value = pairs [j],
                    index = value.indexOf('=');

                if (-1 < index) {
                    this.append(
                        decode(value.slice(0, index)),
                        decode(value.slice(index + 1))
                    );
                }
            }
        }

    }


    URLSearchParams.prototype.append = function(name, value) {
        var dict = this [__URLSearchParams__];
        if (name in dict) {
            dict[name].push('' + value);
        } else {
            dict[name] = ['' + value];
        }
    };

    URLSearchParams.prototype.delete = function (name) {
        delete this [__URLSearchParams__] [name];
    };

    URLSearchParams.prototype.get = function (name) {
        var dict = this [__URLSearchParams__];
        return name in dict ? dict[name][0] : null;
    };

    URLSearchParams.prototype.getAll = function (name) {
        var dict = this [__URLSearchParams__];
        return name in dict ? dict [name].slice(0) : [];
    };

    URLSearchParams.prototype.has = function (name) {
        return name in this [__URLSearchParams__];
    };

    URLSearchParams.prototype.set = function set(name, value) {
        this [__URLSearchParams__][name] = ['' + value];
    };

    URLSearchParams.prototype.forEach = function (callback, thisArg) {
        var dict = this [__URLSearchParams__];
        Object.getOwnPropertyNames(dict).forEach(function(name) {
            dict[name].forEach(function(value) {
                callback.call(thisArg, value, name, this);
            }, this);
        }, this);
    };

    URLSearchParams.prototype.toString = function () {
        var dict = this[__URLSearchParams__], query = [], i, key, name, value;
        for (key in dict) {
            name = encode(key);
            for (i = 0, value = dict[key]; i < value.length; i++) {
                query.push(name + '=' + encode(value[i]));
            }
        }
        return query.join('&');
    };


    function encode(str) {
        var replace = {
            '!': '%21',
            "'": '%27',
            '(': '%28',
            ')': '%29',
            '~': '%7E',
            '%20': '+',
            '%00': '\x00'
        };
        return encodeURIComponent(str).replace(/[!'\(\)~]|%20|%00/g, function (match) {
            return replace[match];
        });
    }

    function decode(str) {
        return decodeURIComponent(str.replace(/\+/g, ' '));
    }



    self.URLSearchParams = URLSearchParams;

    self.URLSearchParams.polyfill = true;


})(typeof self !== 'undefined' ? self : this);
