$.fn.extend({

    // 设置或者获取元素的innerHTML
    html: function( html ) {
        /*
         * 实现思路：
         * 1、如果不传参，直接返回第一个元素的innerHTML
         * 2、传参重置所有元素的innerHTML
         * 3、链式编程返回this
         * */
        if( arguments.length === 0 ) {
            return this[0].innerHTML;
        }else {
            this.each(function(){
                this.innerHTML = html;
            });
        }

        // 链式编程
        return this;
    },

    // 设置或者获取元素的innerText
    text: function( text ) {
        /*
         * 实现思路：
         * 1、如果不传参，返回所有元素的innerText
         * 2、传参重置所有元素的innerText
         * 3、链式编程返回this
         * */
        var resultText = '';

        if( arguments.length === 0 ) {
            this.each(function() {
                // 累加所有元素的innerText
                resultText += this.innerText;
            });

            // 最终一起返回
            return resultText;
        }else {
            this.each(function() {
                this.innerText = text;
            });
        }

        // 链式编程
        return this;
    },

    // 清空元素的内容
    empty: function() {
        return this.html( null );
    },

    // 删除元素
    remove: function() {
        return this.each(function(){
            this.parentNode.removeChild( this );
        });
    },

    // 把自己作为子元素添加到指定父元素中
    appendTo: function( parent ) {
        /*
         * 实现思路：
         * 1、先把parent统一包装成jQ实例
         * 2、遍历所有的父元素
         * 3、遍历所有的子元素
         * 4、如果是第一个父元素添加子元素，那么添加本体，否则添加子元素的clone版本
         * 5、每次添加子元素，都需要把子元素保存下来
         * 6、最后把所有被添加的子元素包装成jQ对象返回，这个对象要记录上级链。
         * */

        // 把参数包装成jQ对象，方便统一处理
        var $parents = jQuery( parent );
        var $sons = this;
        var temp, result = [];

        // 遍历得到所有父元素
        $parents.each(function( i ) {
            var parent = this;

            // 遍历得到所有子元素
            $sons.each(function() {

                // 只有第一次添加子元素本体，以后添加clone版本
                if( i === 0 ) {
                    parent.appendChild( this );
                    result.push(this);
                }else {
                    temp = this.cloneNode( true );
                    parent.appendChild( temp );
                    result.push( temp );
                }
            });
        });

        // 返回所有被添加元素组成的新实例
        return this.pushStack( result );
    },

    // 把自己作为子元素添加到指定父元素中
    _appendTo: function( parent ) {

        var $parents = jQuery( parent );
        var $sons = this;
        var temp, result = [];

        // 遍历得到所有父元素
        $parents.each(function( i ) {
            var parent = this;

            // 遍历得到所有子元素
            $sons.each(function() {

                // 只有第一个父元素添加子元素本体，以后添加clone版本
                temp = i === 0? this: this.cloneNode( true );
                // 给父元素添加计算好的子元素，然后存储起来
                parent.appendChild( temp );
                result.push( temp );

                // 这句代码，相当于上面三句话的合体
                //result.push( parent.appendChild( i === 0? this: this.cloneNode( true ) ) );
            })
        });

        // 返回所有被添加元素组成的新实例
        return this.pushStack( result );
    },

    // 把自己作为子元素添加到指定父元素的最前面
    prependTo: function( parent ) {

        var $parents = jQuery( parent );
        var $sons = this;
        var result = [];

        // 遍历得到所有的父元素
        $parents.each(function( i ) {
            var parent = this;

            // 遍历得到所有的子元素
            $sons.each(function() {

                // 第一个父添加子元素本地，以后添加clone版本；
                // 被添加的子元素存储到result中。
                result.push( parent.insertBefore( i === 0? this: this.cloneNode( true ), parent.firstChild ) );
            });
        });

        // 返回所有被添加元素组成的新实例
        return this.pushStack( result );
    },

    // 给自己添加指定的子元素
    append: function( son ) {
        /*
         * 实现思路：
         * 1、如果son是字符串，先解析成DOM元素（不能累加到所有元素的innerHTML中）
         * 2、统一包装成jQ实例
         * 3、遍历父元素
         * 4、遍历子元素
         * 5、第一个父添加子元素本体，以后添加clone版本
         * 6、链式编程返回this
         * */

        // 如果是字符串，先解析成DOM元素
        if( $.isString( son ) ) {
            son = $.parseHTML( son )
        }

        var $sons = jQuery( son );
        // 遍历所有的父元素
        this.each(function( i ) {
            var parent = this;

            // 遍历被添加的子元素
            $sons.each( function() {

                // 第一个父添加子元素本体，以后添加clone版本
                parent.appendChild( i === 0? this: this.cloneNode( true ) );
            });
        });

        // 链式编程
        return this;
    },

    // 给自己添加子元素
    append: function( son ) {

        // 如果是字符串，先解析为DOM
        if( $.isString( son ) ) {
            son = $.parseHTML( son );
        }

        // 把son包装成jQ对象，统一处理
        var $sons = jQuery( son );

        // 复用appendTo，把子元素加到父元素中
        $sons.appendTo( this );

        // 链式编程返回this
        return this;
    },

    // 在自己的最前面添加子元素
    prepend: function( son ) {
        /*
         * 实现思路：
         * 1、如果son是字符串，累加到所有元素的innerHTML中。
         * 2、否则把son统一包装成jQ实例
         * 3、遍历父元素
         * 4、遍历子元素
         * 5、第一个父添加子元素本体，以后添加clone版本
         * 6、链式编程返回this
         * */

        // 如果是字符串，先解析为DOM
        if( $.isString( son ) ) {
            son = $.parseHTML( son );
        }

        // 把son包装成jQ对象，统一处理
        var $son = jQuery( son );

        // 复用prependTo，把子元素加到父元素中
        $son.prependTo( this );

        // 链式编程返回this
        return this;
    },

    // 把自己添加到某兄弟元素的前面
    insertBefore: function( sibling ) {
        /*
         * 实现思路：
         * 1、先把sibling包装成jQ对象统一处理
         * 2、遍历所有的sibling，然后得到他们的每一个父元素
         * 3、遍历所有的子元素
         * 4、父添加子，第一个父添加子元素本体，以后clone
         * 5、收集所有被添加的子元素，然后使用pushStack包装返回
         * */
        var $sibling = jQuery( sibling );
        var $sons = this;
        var result = [];

        // 遍历所有的sibling
        $sibling.each(function( i ) {

            var sibling = this;
            var parent = this.parentNode;

            // 遍历所有被添加的子元素
            $sons.each(function() {

                // 把子元素添加到指定兄弟元素的前面，第一个父添加是子元素本体，以后是clone的，
                // 最后把被添加的元素统一存储到一个容器中
                result.push( parent.insertBefore( i === 0? this: this.cloneNode(true), sibling ) );
            });
        });

        return this.pushStack( result );
    },

    // 在自己的前面添加兄弟节点
    before: function( sibling ) {

        // 如果sibling为字符串，先要转换为DOM
        if( $.isString( sibling ) ) {
            sibling = $.parseHTML( sibling );
        }

        var $sibling = jQuery( sibling );

        // 复用insertBefore把$sibling添加到this的前面
        $sibling.insertBefore( this );

        // 链式编程返回this
        return this;
    },

    // 把自己添加到指定兄弟元素的后面
    insertAfter: function( sibling ) {

    },

    // 在自己的后面添加兄弟元素
    after: function( sibling ) {

    },

    // 返回所有元素的子元素
    children: function() {
        var result = [];

        // 遍历得到所有元素
        this.each(function() {

            // 把元素的每一项子元素通过apply取出存储到result中
            result.push.apply( result, this.children );
        });

        return this.pushStack( result );
    },

    // 返回所有元素的下一个兄弟元素
    next: function() {

        var result = [];

        // 遍历得到所有元素
        this.each(function() {

            var tempNode = this;

            // 获取每一个元素的下一个元素，存储到数组中
            while( tempNode = tempNode.nextSibling ) {
                if( tempNode.nodeType === 1 ) {
                    result.push( tempNode );
                    break;
                }
            }
        });

        return this.pushStack( result );
    },

    // 返回所有元素的下一个兄弟元素
    _next: function() {

        // 遍历得到所有元素
        return this.map(function() {
            var tempNode = this;

            // 获取每一个元素的下一个元素，然后return给map方法，
            // map方法会帮我们把所有的兄弟元素收集并包装返回
            while( tempNode = tempNode.nextSibling ) {
                if( tempNode.nodeType === 1 ){
                    return tempNode
                }
            }
        });
    }
});