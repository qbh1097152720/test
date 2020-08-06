class KPromise {
    constructor(handle) {
        // [[promiseStatus]]  
        this.status = "pending";
        this.value = undefined;
        // this.resolveFn = null;
        // this.rejectFn = null;

        // 数组队列保存；
        this.resolveQueue = [];
        this.rejectQueue = [];
        // handle(function(val){
        //     // console.log(this);
        //     // resolve
        //     this.status = "fulfilled"
        //     this.value = val;
        // }.bind(this),function(val){
        //     // reject   
        //     this.status = "rejected"
        //     this.value = val;
        // }.bind(this));
        // console.log(this);
        handle(this._resolve.bind(this), this._reject.bind(this))
    }
    _resolve(val) {
        this.status = "fulfilled"
        this.value = val;
        // 执行 onResolved；
        const run = () => {
            // this.resolveFn(val);
            // console.log(this.resolveQueue);
            let cb;
            while (cb = this.resolveQueue.shift()) {
                cb && cb(val);
            }
            // this.resolveQueue.forEach(cb=>{
            //     cb(val);
            // })
        }
        // setTimeout(run);
        let ob = new MutationObserver(run)
        ob.observe(document.body, {
            attributes: true
        })
        document.body.setAttribute("kkb", Math.random());
    }
    _reject(val) {
        this.status = "rejected"
        this.value = val;
        const run = () => {
            let cb;
            while (cb = this.rejectQueue.shift()) {
                cb && cb(val);
            }
        }
        // setTimeout(run);
        let ob = new MutationObserver(run)
        ob.observe(document.body, {
            attributes: true
        })
        document.body.setAttribute("kkb", Math.random());
    }
    then(onResolved, onRejected) {
        // onResolved 及 onRejected 不是在then里执行的；他是和  resolve 及 reject 相关；

        // 错误的写法；
        // if (this.status === "fulfilled") {
        //     onResolved && onResolved(this.value);
        // } else if (this.status === 'rejected') {
        //     onRejected && onRejected(this.value);
        // }
        // console.log(this.status );
        // 保存函数；不执行；
        // this.resolveFn = onResolved;
        // this.rejectFn = onRejected;

        // 多个then；
        // this.resolveQueue.push(onResolved);
        // this.rejectQueue.push(onRejected);
        let myp =  new KPromise((resolve,reject)=>{
            // 直接执行；错误的；
            // let res =  onResolved && onResolved();
            // // 对象；
            // if(res instanceof KPromise){
            //     return res;
            // }
            // // 普通值；
            // resolve(res);
            // 不去执行；
            this.resolveQueue.push(val=>{
                let res = onResolved && onResolved(val);
                if(res instanceof KPromise){
                    // 返还 KPromise对象
                    // return res.then(res=>{
                    //     resolve(res)
                    // });
                    // console.log(resolve)
                    return res.then(resolve);
                }
                resolve(res)
            })
            this.rejectQueue.push(val=>{
                onRejected && onRejected(val);
                reject(val);
            })
            // reject("err")
        })
        return myp;
    }
    catch(onRejected){
        this.then(undefined,onRejected);
    }
    static resolve(val){
        return new KPromise(resolve=>{
            resolve(val);
        })
    }
    static reject(val){
        return new KPromise((resolve,reject)=>{
            reject(val);
        })
    }
    static all(lists){
        let arr = [];
        return new KPromise((resolve)=>{
            lists.forEach(item=>{
                item.then(res=>{
                    arr.push(res);
                    if(arr.length===lists.length){
                        resolve(arr);
                    }
                })
            })
        })
    }
    static race(lists){
        return new KPromise((resolve,reject)=>{
            lists.forEach(item=>{
                item.then(res=>{
                    resolve(res);
                },err=>{
                    reject(err);
                })
            })
        })
    }
    finally(cb){
        // cb();
        return this.then(cb,cb);
    }
}