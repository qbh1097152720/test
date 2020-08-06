class KVue{
    constructor(options){
        this.$options = options;
        this.$data = options.data;
        this.observer(this.$data);
        this.compile();
    }
    // 观察数据、劫持数据
    observer(data){
        Object.keys(data).forEach(key=>{
            let value = data[key];
            Object.defineProperty(data,key,{
                configurable:true,
                enumerable:true,
                get(){
                    console.log("get");
                    return value; 
                },
                set(newValue){
                    console.log("set设置了");
                    // 更新视图；--》编译；
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
                    node.textContent = node.textContent.replace(reg,this.$data[$1]);
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