// 添加一个兼容获取样式的静态方法
$.extend({
    getStyle: function( ele, styleName ) {

        // 如果ele不是DOM，styleName不是字符串，那么直接返回，不做任何处理。
        if( !$.isDOM( ele ) || !$.isString( styleName ) ) {
            return;
        }

        if( window.getComputedStyle ) {
            return window.getComputedStyle( ele )[ styleName ];
        }else {
            return ele.currentStyle[ styleName ];
        }
    }
});

$.fn.extend({
    css: function( styleName, styleVal ) {
        /*
         * 实现思路：
         * 1、如果参数个数为1，需要进一步判断处理
         * 1.1、如果是字符串，直接返回第一个元素指定的样样式
         * 1.2、如果是对象，那么遍历得到每一个元素，再遍历这个对象得到所有要设置的样式，分别设置。
         * 2、如果参数个为2，那么遍历得到每一个元素，分别按照指定的样式名设置指定样式。
         * 3、默认返回this，实现链式编程。
         * */
        var arg = arguments, len = arg.length;
        var i, nodeLen, key;

        // 参数1个
        if( len === 1 ) {

            // 参数为字符串的处理
            if( $.isString( styleName ) ) {

                // 返回第一个元素指定的样式
                return $.getStyle( this[0], styleName );
            }

            // 参数为对象的处理,给所有元素批量设置样式
            else if( $.isObj( styleName ) ) {

                // 遍历得到每一个元素
                for( i = 0, nodeLen = this.length; i < nodeLen; i++ ) {

                    // 遍历得到每一个要添加的样式
                    for( key in styleName ) {

                        // 给每一个元素分别设置每一个样式
                        this[ i ].style[ key ] = styleName[ key ];
                    }
                }
            }
        }

        // 参数2个，给所有元素添加指定样式
        else if( len > 1 ) {

            // 遍历得到每一个元素
            for( i = 0, nodeLen = this.length; i < nodeLen; i++ ) {

                // 给每一个元素设置指定样式
                this[ i ].style[ styleName ] = styleVal;
            }
        }

        // 链式编程
        return this;
    },

    _css: function( styleName, styleVal ) {

        var arg = arguments, len = arg.length;

        // 参数1个
        if( len === 1 ) {

            // 参数为字符串的处理
            if( $.isString( styleName ) ) {

                // 返回第一个元素指定的样式
                return $.getStyle( this[0], styleName );
            }

            // 参数为对象的处理,给所有元素批量设置样式
            if( $.isObj( styleName ) ) {

                this.each(function(){
                    // 这里的this指向每一个元素
                    var self = this;

                    $.each( styleName, function( key, val ) {
                        // 这里的this指向每一个val值
                        self.style[ key ] = val;
                    });
                });
            }
        }

        // 参数2个，给所有元素添加指定样式
        else if( len > 1 ) {

            this.each(function(){
                // 这里的this指向每一个元素
                this.style[ styleName ] = styleVal;
            });
        }

        // 链式编程
        return this;
    },

    // 设置或者获取属性节点
    attr: function( attrName, attrVal ) {

        var arg = arguments, len = arg.length;

        if( len === 1 ) {

            // 字符串
            if( $.isString( attrName ) ) {

                // 返回第一个元素的属性节点值
                return this.get(0).getAttribute( attrName );
            }

            // 对象
            else if( $.isObj( attrName ) ) {

                // 遍历每一个元素
                this.each(function() {

                    var self = this;

                    // 遍历每一个属性节点名和值
                    $.each( attrName, function( attrName, attrVal ) {

                        self.setAttribute( attrName, attrVal );
                    });
                });
            }
        }

        else if( len > 1 ) {

            this.each(function() {
                this.setAttribute( attrName, attrVal );
            });
        }

        // 链式编程
        return this;
    },

    // 设置或者获取属性
    prop: function( propName, propVal ) {

        var arg = arguments, len = arg.length;

        if( len === 1 ) {

            if( $.isString( propName ) ) {
                return this[0][ propName ];
            }

            else if( $.isObj( propName ) ) {
                this.each(function() {

                    var self = this;

                    $.each(propName, function( propName, propVal ) {
                        self[ propName ] = propVal;
                    });
                });
            }
        }

        else if( len > 1 ) {
            this.each(function() {
                this[ propName ] = propVal;
            });
        }

        // 链式编程
        return this;
    },

    // 不传参获取第一个元素的value属性值，
    // 传参给所以元素设置指定的value属性值
    val: function( val ) {
        var arg = arguments, len = arg.length;

        // 不传参获取第一个元素的value属性值，
        if( len === 0 ) {
            return this[0].value;
        }

        // 参给所以元素设置指定的value属性值
        else {
            this.each(function() {
                this.value = val;
            });
        }

        // 链式编程
        return this;
    },

    // 借用prop方法实现
    _val: function( val ) {
        if( arguments.length === 0 ) {
            return this.prop( 'value' );
        }else {
            return this.prop( 'value', val );
        }
    },

    // 借用prop方法实现，参数根据arguments来定
    __val: function() {
        [].unshift.call( arguments, 'value' );
        return this.prop.apply( this, arguments );

        //this.prop.apply( this, { 0:'value' } ); 如果调用val没有传参，相当于这个样子
        //this.prop.apply( this, { 0:'value', 1:val } ); 如果调用val传参，相当于这个样子
    },

    // 只要有一个元素存在就返回true
    hasClass: function( className ) {
        /*
         * 实现思路：
         * 1、遍历所有元素
         * 2、获取元素的className，判断是否存在被判断的，如果存在返回true
         * 3、默认返回false
         * */
        var i, len;

        // 遍历得到所有元素
        for( i = 0, len = this.length; i < len; i++ ) {

            // 只要有一个存在，就可以返回true了
            if( new RegExp('\\b' + className + '\\b').test( this[i].className ) ){
                return true;
            }
        }

        // 默认返回false
        return false;
    },

    _hasClass: function( className ) {

        // 声明一个标记，默认代表不存在
        var has = false;

        this.each(function() {
            if ( (' ' + this.className + ' ').indexOf(' ' + className + ' ') > -1 ) {

                // 只要有一个元素存在，那么就修改标记为true
                has = true;

                // 告诉each不用继续遍历了，够了。
                return false;
            }
        });

        // 返回标记
        return has;
    },

    // 批量添加class
    addClass: function( classNames ) {
        /*
         * 实现思路：
         * 1、把classNames转换为数组
         * 2、遍历得到所有元素
         * 3、遍历得到所有要添加的class
         * 4、依次判断每一个元素是否存在每一个class，不存在则在原有的className上进行添加
         * 5、链式编程返回this
         * */
        classNames = classNames.split(' ');

        // 遍历所有元素
        this.each(function() {
            var $self = jQuery(this);

            // 遍历所有要添加的class
            $.each( classNames, function( i, addClass ) {

                // 没有的情况下再添加
                if( !$self.hasClass( addClass ) ) {
                    $self.get(0).className += ' ' + addClass;
                }
            });
        });

        // 链式编程
        return this;
    },

    // 批量删除class
    removeClass: function( classNames ) {
        /*
         * 实现思路：
         * 1、把classNames转换为数组
         * 2、遍历得到所有元素
         * 3、遍历得到所有要删除的class
         * 4、删除class
         * 5、链式编程返回this
         * */
        classNames = classNames.split(' ');

        // 遍历所有元素
        this.each( function() {
            var self = this;

            // 遍历所有要删除的class
            $.each( classNames, function() {
                // 这里的this是每一个要删除的class字符串包装后的对象，
                // 字符串对象，在字符串拼接时，会自动转换为普通字符串。
                self.className = $.trim( self.className.replace(new RegExp('\\b' + this + '\\b', 'g'), '') );
            });
        });

        // 链式编程
        return this;
    },

    // 有则删除，没则添加
    toggleClass: function( classNames ) {

        classNames = classNames.split(' ');

        // 遍历所有元素
        this.each(function() {
            var $self = jQuery( this );

            // 遍历所有的toggleClass
            $.each(classNames, function( i, toggleClass ) {

                // 有则删除，没则添加
                if( $self.hasClass( toggleClass ) ){
                    $self.removeClass( toggleClass );
                }else {
                    $self.addClass( toggleClass );
                }
            });
        });

        // 链式编程
        return this;
    }
});