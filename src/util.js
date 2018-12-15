export function get(url, data) {
    return request(url, 'GET', data)
}
export function post(url, data) {
    return request(url, 'POST', data)
}

function request(url, method, data) {
    return new Promise((resolve, reject) => {
        wx.request({
            data,
            method,
            url:url,
            header:{
                'content-type':'application/x-www-form-urlencoded'
            },
            success: function(res) {
                if (res.data.ok == 1) {
                    resolve(res.data.data)
                } else {
                    // showModal('添加失败', res.data.msg)
                    console.log(res);
                    reject(res.data)
                }
            }
        })
    })
}

export function login()
{
    return new Promise((resolve,reject)=>{
        wx.login({
            success(data){
                resolve(data.code);
            },
            fail(err){
                reject(err);
            }
        })
    })
}