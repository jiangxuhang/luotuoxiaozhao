<template>
  <section class="content">
    <nav class="navHeader" @click="selectChange">
      <div :class="{active:num == 1}" data-id="1">全部</div>
      <div :class="{active:num == 2}" data-id="2">推荐</div>
      <div :class="{active:num == 3}" data-id="3">更多</div>
      <div :class="{active:num == 4}" data-id="4">分享</div>
    </nav>
    <article class="infoItem" v-for='(article,index) in saveArr' :key="index">
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
        <dt class="imageContent" @click.stop="unStar" :data-id="index">
          <img src="../../images/flag0.png" v-if="article.save==false">
          <img src="../../images/flag1.png" v-else-if="article.save==true">
        </dt>
      </dl>
    </article>
    <article class="infoItem" v-for='article in info' :key="article._id" @click="toDetail" :data-detail="article.ID">
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
        <dt class="imageContent" @click.stop="star" :data-id="article._id">
          <img src="../../images/flag0.png" v-if="article.save==false">
          <img src="../../images/flag1.png" v-else-if="article.save==true">
        </dt>
      </dl>
    </article>
  </section>
</template>

<script>
import { get,post } from '@/utils/index'
export default {
  data:{
    // info:[{
    //   name:'深圳市腾讯科技有限公司',
    //   local:'黑龙江大学',
    //   comment:20,
    //   time:'4小时以前'
    // },
    // {
    //   name:'深圳市腾讯科技有限公司',
    //   local:'黑龙江大学',
    //   comment:20,
    //   time:'4小时以前'
    // },
    // {
    //   name:'深圳市腾讯科技有限公司',
    //   local:'黑龙江大学',
    //   comment:20,
    //   time:'4小时以前'
    // }],
    num:1,
    info:[],
    offset:0,
    index:10,
    id:0,
    saveArr:[]
  },
  methods: {
    //导航栏选择
    selectChange (e) {
      let targetValue = e.target.dataset.id
      this.num = targetValue
    },
    //进入详情页
    toDetail (e) {
      let id = e.currentTarget.dataset.detail
      wx.navigateTo({ url:"../detail/main?id=" + id });
    },
    //收藏
    async star (e) {
      let id = e.currentTarget.dataset.id
      if (this.info[id].save) {
        //取消收藏
        let saveArr = await wx.getStorageSync("saveArr")
        for (let i = 0; i < saveArr.length; i++) {
          if (saveArr[i]._id == id) {
            saveArr.splice(i, 1)
            break
          }
        }
        console.log('delete',saveArr)
        await wx.setStorageSync("saveArr",saveArr)
        this.saveArr = saveArr
        this.info[id].save = false
      } else {
        //收藏
        let saveArr = await wx.getStorageSync("saveArr")
        if (!saveArr) {
         saveArr = []
        }
        this.info[id].save = true
        saveArr.push(this.info[id])
        await wx.setStorageSync("saveArr",saveArr)
        this.saveArr = saveArr
        console.log('saveArr',saveArr)
      }

    },
    async unStar (e) {
      let id = e.currentTarget.dataset.id
      let saveArr = await wx.getStorageSync("saveArr")
      saveArr.splice(id, 1)
      await wx.setStorageSync("saveArr",saveArr)
      this.saveArr = saveArr
    }
  },
  async onLoad () {
    this.saveArr = await wx.getStorageSync("saveArr")
    let url = 'http://132.232.202.22/XZ/info'
    let info = await get(url, {
      school:'hlju',
      offset:this.offset,
      index:this.index
    })
    this.info = info.data.map((value) => {
      value.save = false
      value._id = this.id
      this.id++
      return value
    })
    console.log('info', this.info)
  },
  async onReachBottom () {
    this.offset += 10
    let url = 'http://132.232.202.22/XZ/info'
    let info = await get(url, {
      school:'hlju',
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
  }
}
</script>

<style scoped>
  .navHeader {
    background-color:#6A13FE;
    display:flex;
    padding:15rpx;
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
