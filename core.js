// 1、整体自调
(function (window) {

    var document = window.document;

    var arr = [];
    var push = arr.push;
    var slice = arr.slice;
    var concat = arr.concat;

    var obj = {};
    var toString = obj.toString;
    var hasOwn = obj.hasOwnProperty;
// 实现一个兼容去除首尾空格的方法
    function trim( str ) {
        if( !$.isString( str ) ) {
            return str;
        }
        if( str.trim ) {
            return str.trim();
        }

        return str.replace(/^\s+|\s+$/g, '');//用那个来代替前后的空格
    }
    // 判断数据是不是html字符串
    function isHTML(html) {
        if (html && html[0] === '<' && html[html.length - 1] === '>'
            && html.length >= 3) {
            return true;
        }

        return false;
    }
    // 根据传入的html字符串，创建出对应的元素
    function parseHTML(html) {
        /*
         * 实现思路：
         * 1、创建一个临时的DOM元素
         * 2、给这个DOM元素设置innnerHTML为传入进来的html字符串
         * 3、返回DOM元素的子元素
         * */
        var div = document.createElement('div');
        div.innerHTML = html;
        return div.children;
    }

    // 判断参数是不是函数
    function isFunction(fn) {
        return typeof fn === 'function';
    }

    //判断是不是DOM
    function isDom(ele) {
        return !!ele && !!ele.nodeType;   //nodetype的返回值是数字，如果不是就会是false
    }

    // 判断参数是不是数值
    function isNumber(number) {
        return typeof number === 'number';
    }

    // 判断参数是不是字符串
    function isString(string) {
        return typeof string === 'string';
    }

    // 判断参数是不是window
    function isWindow(w) {
        return !!w && w.window === w;
    }

    // 判断参数是不是对象( 函数，数组等等都是对象 )
    function isObj(obj) {
        return typeof obj === 'object' && obj !== null;
    }

    // 获取一个对象的具体类型
    function getObjType(obj) {
        return toString.call(obj).slice(8, -1);
    }

    // 判断数据是不是数组或者类数组
    function isArrayLike(arrayLike) {
        /*
         * 实现思路：
         * 1、如果是函数或者window，直接返回false
         * 2、判断arrayLike是不是对象，是的话进一步判断
         * 3、判断arrayLike是不是真数组，如果是直接返回true
         * 4、判断arrayLike是不是类数组，如果是直接返回true
         * 4.1、如果arrayLike的length为0那么是伪数组
         * 4.2、或者arrayLike的length为数值，并且大于0，并且存在最大下标的值，那么就认为是伪数组
         * 5、默认返回false
         * */
        if (isFunction(arrayLike) || isWindow(arrayLike)) {
            return false;
        }

        // 判断是不是对象，如果是，进一步判断是不是真数组或伪数组
        if (isObj(arrayLike)) {

            if (getObjType(arrayLike) === 'Array') {
                return true;
            }

            else if (arrayLike.length === 0 ||
                ( isNumber(arrayLike.length) && arrayLike.length > 0 && (arrayLike.length - 1) in arrayLike )
            ) {
                return true;
            }
        }

        return false;
    }

    // 判断数据是不是数组或者类数组
    function _isArrayLike(arrayLike) {
        if (isFunction(arrayLike) || isWindow(arrayLike) || !isObj(arrayLike)) {
            return false;
        }

        return arrayLike.length === 0 ||
            ( isNumber(arrayLike.length) && arrayLike.length > 0 && (arrayLike.length - 1) in arrayLike );
    }

    // 传入函数，该函数在DOM树构建完毕的时候被执行
    function ready(fn) {
        /*
         * 实现思路：
         * 1、判断DOM树是否已经构建完毕，如果是，执行执行fn即可
         * 2、如果不是，监听DOM树构建完毕的事件，事件触发时执行fn。
         * */

        // 无论IE8还是现代浏览器，readyState值为'complete'，DOM树一定构建完毕了；
        // 如果是现代浏览器，readyState值为'interactive'，DOM树也构建完毕。
        if (document.readyState === 'complete' ||
            ( document.addEventListener && document.readyState === 'interactive' )) {
            fn();
        }

        else {

            // 现代浏览器绑定事件
            if (document.addEventListener) {
                document.addEventListener('DOMContentLoaded', fn);
            }

            // 监听IE8
            else {
                document.attachEvent('onreadystatechange', function () {
                    if (document.readyState === 'complete') {
                        fn();
                    }
                });
            }
        }
    }

    // @function 实现each
    // @param { obj: Object } 要遍历的对象
    // @param { fn: Function } 遍历过程中，所需的回调，该回调会接收遍历到的下标和值
    function each(obj, fn) {
        // 如果要遍历的对象，是数组或伪数组，通常我们要得到他们下标存储的数据，
        // 这种情况下，就不能使用for in了。
        /*
         * 实现思路：
         * 1、判断obj是不是数组或者伪数组，如果是则var i的形式遍历它
         * 2、如果是其他对象，则通过for in的形式遍历它
         * 3、把遍历到的下标和值依次传给回调
         * */
        // 如果是数组，var i 方式遍历，
        // 然后把遍历到的下标和值传给回调，
        // 同时改变回调执行时内部this为值
        if (isArrayLike(obj)) {
            for (var i = 0; i < obj.length; i++) {
                // 约定，如果回调的执行结果为false，那么就中断遍历
                if (fn.call(obj[i], i, obj[i]) === false) {
                    break;
                }
            }
        }
        // 否则，for in 方式遍历，
        // 然后把遍历到的下标和值传给回调，
        // 同时改变回调执行时内部this为值
        else {
            for (var key in obj) {
                // 约定，如果回调的执行结果为false，那么就中断遍历
                if (fn.call(obj[key], key, obj[key]) === false) {
                    break;
                }
            }
        }

        // 遍历谁就返回谁
        return obj;
    }

    function map(obj, fn) {
        /*
         * 实现思路：
         * 1、判断是不是真伪数组，如果是var i遍历，不是for in遍历
         * 2、遍历到的下标和值传给回调
         * 3、改变回调执行时的this指向为val
         * 4、然后判断回调执行的结果，如果不为undefind或null，那么存储起来
         * 5、返回所有存储的数据
         * */
        var i, len;
        var result = [], temp;

        if (isArrayLike(obj)) {

            for (i = 0, len = obj.length; i < len; i++) {

                // 接收回调的返回结果
                temp = fn.call(obj[i], i, obj[i])

                // 如果结果不为undefined或null，那么存储起来
                if (temp != null) {
                    result.push(temp);
                }
            }
        }
        else {

            for (i in obj) {

                // 接收回调的返回结果
                temp = fn.call(obj[i], i, obj[i]);

                // 如果结果不为undefined或null，那么存储起来
                if (temp != null) {
                    result.push(temp);
                }
            }
        }

        // 返回所以存储的数据
        return result;
    }

    // 3、jQuery工厂
    var jQuery = function (selector) {
        return new jQuery.fn.init(selector);
    };

    // 4、给原型提供一个简称
    jQuery.fn = jQuery.prototype = {
        constructor: jQuery,

        // 获取jQ库的版本
        jquery: '1.0.0',

        // jQ对象的length默认值
        length: 0,

        // 获取指定位置的原生DOM元素，不传参转换为数组返回。
        get: function (i) {
            /*
             * 实现思路：
             * 1、没有传参，借用slice方法把实例对象转换为数组返回
             * 2、传参，正数或0按照指定下标返回，非正数倒着返回。
             * */
            if (arguments.length === 0) {
                return slice.call(this);
            } else if (isNumber(i)) {

                if (i >= 0) {
                    return this[i]
                }
                else {
                    return this[this.length + i];
                }
            }
        },

        // 获取指定位置的原生DOM元素，不传参转换为数组返回。
        _get: function (i) {
            if (arguments.length === 0) {
                return slice.call(this);
            } else if (isNumber(i)) {
                return i >= 0 ? this[i] : this[this.length + i];
            }
        },

        // 获取指定位置的原生DOM元素，不传参转换为数组返回。
        __get: function (i) {
            if (arguments.length === 0) {
                return slice.call(this);
            } else {
                return i >= 0 ? this[i] : this[this.length + i];
            }
        },

        // 获取指定位置的元素，并包装返回
        eq: function (i) {
            /*
             * 实现思路：
             * 1、正数或0按照指定下标获取对应的元素，非正数倒着获取对应的元素
             * 2、然后把获取到的元素包装成jQ对象返回
             * */
            var node = i >= 0 ? this[i] : this[this.length + i];
            //return jQuery( node );

            // 调用pushStack方法，把node传过去，pushStack会自动包装成新实例，
            // 并且这个新实例还记录了上一级链。
            return this.pushStack(node);
        },

        // 获取指定位置的元素，并包装返回
        _eq: function (i) {
            return jQuery(this.get(i));
        },

        // 获取第一个元素，并包装返回
        first: function () {
            return this.eq(0);
        },

        // 获取最后一个元素，并包装返回
        last: function () {
            return this.eq(-1);
        },

        // 把jQ对象转换为数组返回
        toArray: function () {
            return slice.call(this);
        },

        // 截取部分元素，包装成jQ对象返回
        slice: function (start, end) {
            /*
             * 实现思路：
             * 1、复用数组的slice方法截取jQ实例
             * 2、把截取到的jQ实例包装返回
             * */
            var arr = slice.call(this, start, end);
            // return jQuery( arr );

            // slice返回的是截取后的新实例，链断了，
            // 所以要记录上级链，只要记录上级链，就交由pushStack来处理。
            return this.pushStack(arr);
        },

        // 添加新元素，返回新的length长度
        push: function () {
            return push.apply(this, arguments);
        },

        // 添加新元素，返回新的length长度
        _push: push,

        // 对已有元素排序，返回排序后的jQ对象
        sort: arr.sort,

        // 删除或者插入元素，返回被删除的元素
        splice: arr.splice,

        // 把创建新实例的工作交给pushStack完成，
        // 同时pushStack还可以帮助新实例记录上一级链
        pushStack: function (arr) {
            /*
             * pushStack方法内部会新创建一个JQ实例，
             * 然后给这个新实例添加一个preObj属性记录该方法的调用者,
             * 最后返回这个新实例
             * */
            var $new = jQuery(arr);
            $new.preObj = this; // 这里的this，谁调用pushStack就指向谁。
            return $new;
        },

        // 返回上级链
        end: function () {
            return this.preObj;
        },

        /*
         * 遍历jQ对象，把遍历到的下标和元素依次返回给回调函数；
         * 回调执行时，内部的this指向每一个遍历到的元素；
         * 回调执行时，如果返回false，那么each就会中断剩余元素的遍历。
         * */
        each: function (fn) {
            return each(this, fn);
        },

        /*
         * 遍历jQ实例，通过回调的返回值，得到一个新的实例
         * */
        map: function (fn) {
            // map返回一个新的实例，链断了，所以要调用pushStack记录
            return this.pushStack(map(this, fn));
        }
    };

    // 5、init构造函数
    var init = jQuery.fn.init = function (selector) {

        // 如果参数转换为布尔不为false，则进一步判断
        if (selector) {

            // 如果参数为函数
            if (isFunction(selector)) {
                ready(selector);
            }

            // 如果参数为字符串，则进一步判断
            else if (isString(selector)) {

                // 如果是html字符串，创建对应的元素，然后把这些元素依次添加到实例中
                if (isHTML(selector)) {
                    push.apply(this, parseHTML(selector));
                }

                // 否则认为是选择器，去页面中获取元素，把获取到的元素依次添加到实例中
                else {
                    push.apply(this, document.querySelectorAll(selector));
                }
            }

            // 如果是数组或伪数组，把这些元素依次添加到实例中
            else if (isArrayLike(selector)) {

                try {
                    push.apply(this, selector);
                } catch (e) {
                    // 在IE8中，如果报错了，那么selector就一定是用户自定义的伪数组对象
                    push.apply(this, slice.call(selector));
                }
            }

            // DOM元素或其他
            else {
                push.call(this, selector);
            }
        }
    };

    // 6、替换构造函数的原型为工厂函数的原型
    init.prototype = jQuery.fn;

    // 2、暴露
    window.jQuery = window.$ = jQuery;

    // 给jQ自己和原型分别添加extend方法
    jQuery.extend = jQuery.fn.extend = function () {
        var arg = arguments, len = arg.length;

        // 默认认为会传入多个参数，所以从1开始遍历得到后面的每一个对象
        var i = 1, key;

        var target = arg[0];  // 默认认为会传入多个参数，所以目的为第一个对象

        // 如果只有1个参数，那么目标改为this，遍历的i就从第一个对象开始了，所以改为0。
        if (len === 1) {
            target = this;
            i = 0;
        }

        // 得到后面的每一个对象
        for (; i < len; i++) {

            // 得到每一个对象自己的成员
            for (key in arg[i]) {
                if (arg[i].hasOwnProperty(key)) {
                    target[key] = arg[i][key]
                }
            }
        }

        // 给谁混入返回谁
        return target;
    };

    // 添加静态方法
    jQuery.extend({
        trim:trim,
        isHTML: isHTML,
        parseHTML: parseHTML,
        isFunction: isFunction,
        isNumber: isNumber,
        isString: isString,
        isWindow: isWindow,
        isObj: isObj,
        getObjType: getObjType,
        isArrayLike: isArrayLike,
        ready: ready,
        each: each,
        map: map,
        isDom: isDom
    });

})(window);