<template>
  <section class="content">
    <div class="topcover" v-if="authorize">
      <div class="text">分享一次微信群聊获取更多校招内容</div>
      <button class="share" open-type='share'>分享</button>
    </div>
    <nav class="navHeader" @click="selectChange" v-if="navShow">
      <div :class="{active:num == 1}" data-id="1">全部</div>
      <div :class="{active:num == 2}" data-id="2">收藏</div>
      <div :class="{active:num == 3}" data-id="3">更多</div>
      <button data-id="1" open-type='share' @click="share" id="1">分享</button>
    </nav>
    <article v-if="num == 1 || num == 2" class="infoItem" v-for='(article,index) in info' :key="index" @click="toDetail" :data-detail="article.ID">
      <dl class="info">
        <dt class="detail">
          <dd class="name">
            {{article.company}}
          </dd>
          <dd class="infoBottom">
            <div>{{article.school}}</div>
            <div><!-- {{article.comment}} 评论--></div>
            <div>{{article.date}}</div>
          </dd>
        </dt>
        <dt class="imageContent" @click.stop="star" :data-id="index">
          <img src="../../images/flag0.png" v-if="article.save==false">
          <img src="../../images/flag1.png" v-else-if="article.save==true">
        </dt>
      </dl>
    </article>
    <More v-if="num == 3"></More>
  </section>
</template>

<script>
import { get,post,login } from '@/utils/index'
import More from './more'
export default {
  data:{
    num:1,
    info:[],
    trans:[],
    offset:0,
    index:10,
    id:0,
    saveArr:[],
    scrollTop:0,
    navShow : true,
    authorize : false,
    count : 0
  },
  components: {
    More
  },
  methods: {
    share() {
      console.log('num', this.num)
      this.num = 1
    },
    //导航栏选择
    async selectChange (e) {
      let targetValue = e.target.dataset.id
      this.num = targetValue
      if (this.num == 1) {
        this.info = this.trans
      } else if (this.num == 2) {
        this.info = await wx.getStorageSync('saveArr')
      }
    },
    //进入详情页
    toDetail (e) {
      let id = e.currentTarget.dataset.detail
      wx.navigateTo({ url:"../detail/main?id=" + id });
    },
    //收藏
    async star(e) {
      let id = e.currentTarget.dataset.id
      if (this.num == 1) {
        let item = this.info[id]
        let saveArr = await wx.getStorageSync("saveArr")
        if (!saveArr) {
          saveArr = []
        }
        if (!item.save) {
          for (let i = 0; i < saveArr.length; i++) {
            if(saveArr[i].ID == item.ID) {
              this.info[id].save = true
              return
            }
          }
          item.save = true
          saveArr.push(item)
          await wx.setStorageSync("saveArr", saveArr)
        } else {
          item.save = false
          let ID = item.ID
          console.log('ID',ID)
          for (let i = 0; i < saveArr.length; i++) {
            if (saveArr[i].ID == ID) {
              saveArr.splice(i, 1)
              await wx.setStorageSync("saveArr", saveArr)
            }
          }
        }
      } else if (this.num == 2) {
        let saveArr = await wx.getStorageSync("saveArr")
        if (saveArr[id].save) {
          saveArr.splice(id, 1)
          await wx.setStorageSync("saveArr", saveArr)
          this.info = saveArr
        }
      }

    },

  },
  async onLoad () {
    let authorize = await wx.getStorageSync("authorize")
    console.log("authorize",authorize)
    if (authorize === false) {
      this.authorize = authorize
    }
    this.saveArr = await wx.getStorageSync("saveArr")
    let url = 'https://www.sayetuan.com/XZ/info'
    let info = await get(url, {
      school:'rand',
      offset:this.offset,
      index:this.index
    })
    this.info = info.data.map((value) => {
      value.save = false
      value._id = this.id
      this.id++
      return value
    })
    this.trans = this.info
    console.log('info', this.info)
  },
  // onPageScroll(e) {
  //   if (this.scrollTop == 0) {
  //     this.scrollTop = e.scrollTop
  //   }
  //   if (e.scrollTop < this.scrollTop) {
  //     this.navShow = true
  //   } else if (e.scrollTop > this.scrollTop) {
  //     this.navShow = false
  //   }
  //   console.log(e.scrollTop)
  //   this.scrollTop = e.scrollTop
  // },
  onShareAppMessage(res){
    let shareimg =[
      '../../images/share1.jpg',
      '../../images/share2.jpg'
    ]
    let that = this;
    //在写随机数
    let randomImg = shareimg [Math.floor(Math.random() * shareimg .length)];
    if(res.target.id == '1')
    {
      console.log('button')
      return {
        title: "快来看哈尔滨最新校招信息吧~",
        path: "pages/index/main",
        imageUrl:randomImg,
        success(res) {
          console.log('sharing success')
        },
        fail(res)
        {
          console.log('fail')
        }
      }      
    }
    else{
    return {
      title: "快来看哈尔滨最新校招信息吧~",
      path: "pages/index/main",
      imageUrl:randomImg,
      success(res) {
        if(wx.getSystemInfo) {
          wx.getSystemInfo({
            success(d){
            console.log(d);
            if (d.platform == 'android') {
              wx.getShareInfo({
                shareTicket: res.shareTickets,
                success(){
                  console.log('分享成功');
                  that.authorize = false;
                  wx.setStorageSync("authorize", false);
                },
                fail(){
                  wx.showModal({
                    title: '提示',
                    content: '分享好友无效，请分享群',
                    success(res) {
                      if (res.confirm){
                        console.log('用户点击确定')
                      }
                      else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  })
                }
              })
            }
            if (d.platform == 'ios'){
                if (res.shareTickets != undefined) {
                  console.log("分享的是群");
                  that.authorize = false;
                  wx.setStorageSync("authorize", false);
                  wx.getShareInfo({
                    shareTicket: res.shareTickets,
                    success(){
                      console.log('分享成功');
                    }
                  })
                } else {
                  console.log("分享的是个人");
                  wx.showModal({
                    title: '提示',
                    content: '分享好友无效，请分享群',
                    success(res){
                      if (res.confirm){
                        console.log('用户点击确定')
                      }else if(res.cancel){
                        console.log('用户点击取消')
                      }
                    }
                  })
                }
              }
            },
            fail(res) {
              console.log(res)
            }
          })
        } else {
          that.authorize = false
          console.log('wx.getSystemInfo', wx.getSystemInfo)
        }
      },
      fail(res) {
        console.log(res)
      }
    }
    }
  },
  async onReachBottom () {
    let interval = 0
    if(this.num == 1) {
      wx.showToast({
        title:"正在加载",
        icon:"loading",
        duration: 5000,
      });
      interval = setInterval(()=>{
        wx.showToast({
          title:"正在加载",
          icon:"loading",
          duration: 5000,
        });
      },5000);
    }
    
    this.count++;
    if(this.count == 3)
    {
      this.authorize = true;
    }
    if (this.num != 1) {
      return ''
    }
    this.offset += 5
    let url = 'https://www.sayetuan.com/XZ/info'
    let info = await get(url, {
      school:'rand',
      offset:this.offset,
      index:this.index
    })
    let newinfo = info.data.map((value) => {
      value.save = false
      value._id = this.id
      this.id++
      return value
    })
    this.info = this.info.concat(info.data)
    this.trans = this.info.concat(info.data)
    clearInterval(interval);
    wx.hideToast();
    
  },
  onShow()
  {
    wx.showShareMenu({
      withShareTicket: true,
    })
  },
  async onPullDownRefresh() {
    this.count++;
    if(this.count == 3)
    {
      this.authorize = true;
    }
    console.log(this.count)
    wx.showNavigationBarLoading()
    let url = 'https://www.sayetuan.com/XZ/info'
    let info = await get(url, {
      school:'rand',
      offset:0,
      index:10
    })
    this.info = info.data.map((value) => {
      value.save = false
      value._id = this.id
      this.id++
      return value
    })
    this.trans = this.info
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh()
  }
}
</script>

<style scoped>
  .topcover {
    background: #6A13FE;
    position:fixed;
    z-index: 90;
    opacity: .9;
    top: 138rpx;
    bottom: 140rpx;
    left: 60rpx;
    right: 60rpx;
    border-radius: 40rpx;
    padding: 30rpx;
  }
  .text {
    font-family: PingFangSC-Semibold;
    font-size: 52rpx;
    color: #FFFFFF;
    margin-top: 320rpx;
    text-align: center;
  }
  .share {
    margin-top: 260rpx;
    width: 140rpx;
    height: 60rpx;
    border-radius: 20rpx;
    font-size: 30rpx;
    line-height: 60rpx;
  }
  .content {
    overflow: hidden;
  }
  .navHeader {
    background-color:#6A13FE;
    display:flex;
    padding:15rpx;
    width: 100%;
  }
  .navHeader div {
    background-color:#6A13FE;
    height:36rpx;
    line-height:36rpx;
    padding:10rpx 10rpx;
    border-radius:100rpx;
    margin-left:20rpx;
    color:#fff;
  }
  .navHeader button {
    background-color:#6A13FE;
    line-height:36rpx;
    padding:10rpx 10rpx;
    border-radius:100rpx;
    margin-left:20rpx;
    color:#fff;
    border: 0px solid #6A13FE;
  }
  .navHeader .active {
    background-color:#fff;
    color:#000;
  }
  .imageContent {
    width:60rpx;
    height:72rpx;
    position:absolute;
    right:32rpx;
    top:30rpx;
  }
  .imageContent img {
    height:100%;
    width:100%;
  }
  .infoBottom:after {
    content:'';
    clear:both;
    display:block;
  }
  .infoBottom div {
    float:left;
    margin-left:24rpx;
    margin-top:30rpx;
    font-size:24rpx;
    color:#605959;
  }
  .infoBottom div:nth-child(2) {
    margin-left:50rpx;
  }
  .info {
    display:flex;
    position:relative;
  }
  .infoItem {
    box-shadow:0rpx 1rpx 13rpx -3rpx #605959;
    border-radius:20rpx;
    width:686rpx;
    height:174rpx;
    margin:20rpx auto;
  }
  .detail .name {
    margin:24rpx 0 0 20rpx;
    font-size:36rpx;
    max-width:560rpx;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
</style>
