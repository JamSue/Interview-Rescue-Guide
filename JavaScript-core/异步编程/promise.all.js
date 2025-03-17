
/* 
    1. Promise.all()是一个静态方法，接受的参数必须是一个可迭代对象，比如数组
    2. 如果数组中的元素不是Promise实例，会调用Promise.resolve()方法,将其转换成Promise实例
    3. Promise.all()返回一个新的Promise对象这个新的promise对象会在传入的迭代对象中的所有promise实例都成功的时候才会触发成功，只要有一个失败就会触发失败
    4. 返回到promise实例是按照传入的迭代对象的顺序返回的
    5. 如果传入的迭代对象是空的那么就直接返回一个成功的promise对象
    6. 如果传入的迭代对象中有一个promise是失败的那么则返回这个失败的结果
    7. Promise.all的返回是一个promise实例可链式调用

    Promise.all()的实现要点：
      (1) 保证返回的实例对象是按照顺序的=>通过数组的索引
      (2) 判断对象是不是一个Promise的方式: =>通过resolve转化成Promise，可以不判断
            a. 大部分情况可以通过 obj instanceof Promise, 但是存在对象原型链被修改的情况或者说实现作用域访问不到的情况（比如第三方库（如Bluebird）提供的Promise，这些实例的构造函数可能不是原生的`Promise`，导致`instanceof Promise`返回`false`）
            b. 通过判断实例的then函数是否存在，是否是function类型
*/
Promise.myAll = function (iterator) {
    return new Promise((resolve, reject) => {
        if (!iterator.length) resolve([])
        let result = new Array(iterator.length).fill(null)
        let count = 0 // 用来计数已执行完成的Promise

        for (const [i, p] of iterator.entries()) {
            // 不确定p是不是Promise实例通过resolve将他封装成一个promise
            Promise.resolve(p).then((val) => {
                result[i] = val
                count++
                if(count===iterator.length) resolve(result)
            }, (err) => {
                reject(err)
            })
        }
    })
}

// 测试1：混合成功与失败
const p1 = Promise.resolve(1);
const p2 = Promise.reject('error');
Promise.myAll([p1, p2]).catch(console.log); // 应捕获到 'error'

// 测试2：非Promise值处理
Promise.myAll([1, Promise.resolve(2)]).then(console.log); // 应输出 [1, 2]


/* 应用场景 */

/* 
 1. 同时发起请求多个独立接口，并在所有请求完成后统一处理数据
 2. 批量上传多个文件到服务器，直到所有的文件都上传成功了才返回成功
*/

/* // 示例：上传用户选择的多个文件
const files = [file1, file2, file3];
const uploadPromises = files.map(file => {
  const formData = new FormData();
  formData.append('file', file);
  return fetch('/api/upload', { method: 'POST', body: formData });
});

Promise.all(uploadPromises)
  .then(() => showToast('所有文件上传成功'))
  .catch(() => showToast('部分文件上传失败')); */