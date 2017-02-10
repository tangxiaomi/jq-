/**
 * Created by lenovo on 2016/12/18.
 */
    //添加静态方法
$.extend({
    //判断现代浏览器的
    addEvent:function(ele,type,fn){
        if(ele.addEventListener){
            ele.addEventListener(type,fn);
        }else{
            ele.attachEvent('on'+type,fn);
        }
    }
})
$.fn.extend({
    on:function(type,fn){
        //先遍历所有的元素
        //判断该元素有没有event_cache对象 没有就添加
        //判断对象中有没有type数组，没有就添加
        //只有第一次的时候才会使用dom中的添加事件的发法，其他的都是直接进行push
        //每次给对象就可能要添加好多方法，所以要对数组中的内容进行边遍历
        return this.each(function(){
            var self=this;
            self.event_cache=self.event_cache||{};//有就直接使用，没有就直接新建
            if(!self.event_cache[type]){//没有数组就新建一个数组
                self.event_cache[type]=[]; //遍历数组中的内容 没有数组就表示是第一次
                $.addEvent(self,type,function(e){//第一个，采用dom的注册
                    for(var i= 0,len=self.event_cache[type].length;i<len;i++){
                        self.event_cache[type][i].call(self,e);//调用里边的fn  就应该调用
                    }
                });
            }
            self.event_cache[type].push(fn);
        })

    },
    off:function(type,fn){
        //首先遍历所有元素
        //如果没有对象，就不用管
        //如果不传入参数，就是全部清空，将所有的数组都清空
        //如果传入一个参数，就是将制定的那个事件数组清空
        //如果传入两个参数，就是将指定的那是事件里的所有的函数给清空
        var arg=arguments;
        var len=arg.length;
        //这里的argument必须是外层函数的实参
        return this.each(function(){
            if(this.event_cache){
                if(len===0){
                    for(k in this.event_cache){
                        this.event_cache[k]=[];
                    }
                }else if(len===1){
                    this.event_cache[type]=[];
                }else if(len>1){
                    //这里要倒叙，因为如果出现重复的，会导致长度发生变化，就会删除不完全
                    for(var i=this.event_cache[type].length-1;i>=0;i--){
                        if(this.event_cache[type][i]==fn){
                            this.event_cache[type].splice(i,1);
                        }
                    }
                }
            }
        })
    }
});