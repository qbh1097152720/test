// 不需要依赖key值  通过 key值生成对应的 dep（依赖收集器）及wather 订阅者；  get  时候收集依赖---》触发get操作；  set 发布；
class KVue{
    constructor(options){
        this.$options = options;
        this.$data = options.data;
        this.observer(this.$data);
        this.compile();
        // 只收集了message 的watcher；
        // new Watcher();
        // 触发了get  方法；
        // this.$data.message
        
    }
    // 观察数据、劫持数据
    observer(data){
        Object.keys(data).forEach(key=>{
            let value = data[key];
            let _this = this;
            let dep = new Dep();
            Object.defineProperty(data,key,{
                configurable:true,
                enumerable:true,
                get(){
                    // 收集依赖
                    // Dep.target 是Wather  对象；
                    if(Dep.target){
                        dep.addSub(Dep.target);
                    }
                    console.log("get",Dep.target);
                    return value; 
                },
                set(newValue){
                    console.log("??",dep);
                    // 发布；----》每一个watcher 的update方法；
                    dep.notify();
                    value = newValue;
                }

            })
        })
    }

    // 编译；
    compile(){
        let ele = document.querySelector(this.$options.el);
        this.compileChildnodes(ele);
    }
    compileChildnodes(ele){
            // 获取子节点；
        let childNodes = ele.childNodes;
        // console.log(childNodes);
        childNodes.forEach(node=>{
            if(node.nodeType===3){
                // console.log("文本");
                let textContent = node.textContent;
                // console.log(textContent);
                // 匹配大胡子语法；；
                let reg = /\{\{\s*([^\{\}\s]+)\s*\}\}/g;
                if(reg.test(textContent)){
                    // console.log("有大括号")
                    // 获取message
                    let $1 = RegExp.$1;
                    // console.log("("+$1+")");
                    console.log("data里的数据",this.$data[$1]);
                    // 文本节点替换成data里的”数据“
                    // node.textContent = this.$data[$1];
                    new Watcher();
                    node.textContent = node.textContent.replace(reg,this.$data[$1]);

                    // 编译；
                    // 绑定自定义事件；（自定义事件名称：data的键名 $1）
                    // this.addEventListener($1,e=>{
                    //     // console.log("自定义事件绑定",e);
                    //     // console.log(e.detail)
                    //     let newValue = e.detail;
                    //     let oldValue = this.$data[$1];
                    //     // console.log(oldValue);
                    //     let reg = new RegExp(oldValue);
                    //     node.textContent = node.textContent.replace(reg,newValue);
                    // })
                    // 实例化Watcher 及  触发  依赖收集
                   
                    // this.$data[$1];



                }
            }else if(node.nodeType===1){
                // console.log("标签");


                if(node.childNodes.length>0){
                    this.compileChildnodes(node);
                }
            }
        })
    }
}

// 依赖收集器；
class Dep{
    constructor(){
        this.subs = [];
    }
    addSub(sub){
        this.subs.push(sub);
    }

    // 发布；
    notify(){
       this.subs.forEach(sub=>{
            sub.update();
       }) 
    }
}
//dep---> [wather1,watcher2]  -->notify  -->(wather1,wather1):update方法；

//订阅者；
class Watcher{
    constructor(){
        Dep.target = this;  //this 指向 new Watcher
    }
    update(){
        console.log("更新了");
    }
}