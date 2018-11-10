import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
const app = new Vue(App)
app.$mount()

export default{
    config: {
      pages: ['^pages/index/main'],
      'window': {
        'backgroundTextStyle': 'dark',
        'navigationBarBackgroundColor': 'white',
        'navigationBarTitleText': '骆驼',
        'navigationBarTextStyle': 'black',
        'enablePullDownRefresh':true
      },
    }
  }
  