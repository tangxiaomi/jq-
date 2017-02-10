/**
 * Created by lenovo on 2016/12/19.
 */
$.extend({
    //首先分析配置信息
    //首先给他一个默认的参数
    ajaxSetting:{
        type:'get',
        url:location.href,
        async: true,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        timeout: null
    },
    //讲传进来的对象转换成字符串
    dataStringify:function(data){
        var str='';
        if(typeof data==='object'){
            for(var k in data){
                //防止汉字出现乱码
                str+=encodeURIComponent(k)+'='+encodeURIComponent(data[k])+'&';
            }
            str=str.slice(0,-1);//将最后一个&切掉
            return str;
        }
    },
    //对传入的数据进行处理
    processData:function(options){
        //首先合并默认的参数和你手动输入的参数
        var config={};
       $.extend(config,$.ajaxSetting,options);//合并用的是$的方法,别人有的你没有可以扩展过来使用
        //对输入的内容，进行处理
        //首先将输入的都变成大写
        config.type=config.type.toUpperCase();
        //如果是get就将数据放到url后边，并且将数据清空
        if(config.type==='GET'){
            config.url+='?'+ $.dataStringify(config.data);
            config.data=null;
        }else if(config.type==='POST'){
            //如果是post就进行头部设置
            config.data= $.dataStringify(config.data);
        };
        return config;
    },
    jsonp:function(options){
        //首先创建出一个script
        var script=document.createElement('script');
        //将地址传过去，添加到页面，进行删除
        script.src=options.url+'?'+'callback=test'//PHP中的函数,本来就是出于调用状态
        document.head.appendChild(script).parentNode.removeChild(script);
        //定义一个全局的函数，进行数据的接受
        window['test']=function(data){
            console.log(data);
            options.success(data);
        }
    },
    ajax:function(options){
        //首先进行基本信息的配置
        var config= $.processData(options);
        //如果传进来的datatype是jsonp那么就要特殊处理
        if(config.dataType==='JSONP'){
            return $.jsonp(options);
        }
        //进行实例化一个xhr
        var xhr=new XMLHttpRequest();
        xhr.open(config.type,config.url,config.async);
        //有需求就设置头部
        if(config.type==='POST'){
            xhr.setRequestHeader('Content-Type',config.contentType);//这里写错了是xhr
        }
        xhr.onreadystatechange=function(){
            if(xhr.readyState===4){
                if(xhr.status>=200&&xhr.status<300||xhr.status==304){
                    //这些都是成功的时候
                    //根据输入数据的类型，来处理相关的数据
                    var successDate;
                    switch(config.dataType){
                        //结果应该是返回一个对象
                        case 'json':
                            successDate=JSON.parse(xhr.responseText);
                            break;
                        //结果直接执行，然后在将结果，直接返回
                        case 'script':
                            Function(xhr.responseText)();
                            successDate=xhr.responseText;
                            break;
                        //结果放到页面上执行
                        case 'style':
                            var style=document.createElement('style');
                            $(style).html(xhr.responseText).appendTo('head');
                            successDate=xhr.responseText;
                            break;
                        //默认 不传的情况下，就直接返回
                        default :
                            successDate=xhr.responseText;
                    };
                    config.success&&config.success(successDate);
                }else{
                    config.error&&config.error(xhr.status);//只有这个函数存在的时候才会执行
                }
            }
        }
        xhr.send(config.data);
    }
})