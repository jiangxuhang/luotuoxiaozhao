export function get (url, data, header) {
  return request(url, 'GET', data)
}

export function post (url, data, header) {
  return request(url, 'POST', data)
}

function request (url,method,data,header={"Content-Type":"application/x-www-form-urlencoded"}) {
  return new Promise((resolve, reject) => {
    wx.request({
      data,
      method,
      header,
      url,
      success:function (res) {
        resolve(res)
      },
      error:function (err) {
        reject(err)
      }
    })
  })
}