/* 
    1. Promise.allsettled也是一个静态方法
    2. Promise.allsettled接收一个可迭代对象作为参数，在所有对象都执行完毕之后转换状态，只会转换到Fulfilled态
    3. 返回的也是一个promise可以实现链式调用，获取的结果是一个对象数组=>每一个对象包含了参数中promise实例的状态和 结果/错误

    实现方式：
        1.直接实现
        2.Promise.all实现
        3.Promise.finally实现
*/

Promise.allSettled = function (iterator) {

    // 因为它只会转换到fulfilled，所以可以不用传reject参数。。
    return new Promise((resolve) => {
        let count = 0
        let result = []
        if (!iterator.length) resolve(result)
        
        for (const [i, p] of iterator.entries()) {
            Promise.resolve(p).then((val) => {
                result[i] = { status: 'fulfilled', val }
                count++
                if(count===iterator.length) resolve(result)
            }, (err) => {
                result[i] = { status: 'rejected', err }
                count++
                if(count===iterator.length) resolve(result)
            })
        }
    })
}


Promise.allSettledByAll = function (iterator) {
    // 通过map进行映射获取到找一个数组是结果数组，再传入all中
    return Promise.all(iterator.map(p => {
        Promise.resolve(p).then(
            val => { status: 'fulfilled', val },
            reason=>{status:'rejected',reason})
    }))
}