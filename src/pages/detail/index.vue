<template>
  <div>
    <wxParse :content="article" @preview="preview" @navigate="navigate" />

  <!-- <div v-if="flag">
    <div class="commentall">
      <button  class="btn-praise btn">开发中</button>
      <button  open-type='share' class='btn-share btn' >转发</button>
      <div class="input_send">
        <input :maxlength="100" placeholder="写评论..." class="input" placeholder-class="placeholderStyle" v-model="comment"></input>
        <button  open-type="getUserInfo" mode="aspectFit" class="send" @click="addComment"></button>
      </div>
    </div>


    <div class="commentNull" v-if="!commentsFlag">
      <img class="commentNull_img" mode="aspectFit" src="../../images/commentNull.png">
    </div>


      <div class="commentflex" v-if="commentsFlag">
        <div class="comment" v-for='comment in comments' >
          <div class="float comment_img">
            <img :src="comment.userimage" mode="aspectFit" class="avatar" >
          </div>
          <div class="float comment_info column">
            <div class="comment_info_username ">
              {{comment.username}}
            </div>
            <div class="comment_info_">
              {{comment.commentinfo}}
            </div>
            <div class="comment_info_time">
              {{comment.time}}
            </div>
          </div>
          <div class="float comment_praise">
          <img src="../../images/praise.png" alt="" mode="aspectFit" class='pariseimg'>
          {{comment.parise}}
          </div>
        </div>
      </div>
    </div>
  </div> -->
  </div>
</template>

<script>
import wxParse from "mpvue-wxparse";
import {get,post,login} from '@/util'
export default {
  components: {
    wxParse
  },
  data() {
    return {
      code:"",
      openid:"",
      article: "<div>请稍等</div>",
      mid: "",
      id: 1,
      flag: 0,
      comments: [
        // {
        //   userimage: "../../images/userimg1.png",
        //   username: "极奏",
        //   commentinfo: "nice",
        //   parise: "50",
        //   time: "9小时前"
        // },
        // {
        //   userimage: "../../images/userimg2.png",
        //   username: "jizou",
        //   commentinfo: "nice兄弟nice",
        //   parise: "2",
        //   time: "1小时前"
        // }
      ],
      comment:"",
      nickName:'',
      avatarUrl:'',
      commentsFlag:0
    };
  },
  methods: {
    preview(src, e) {
      // do something
    },
    navigate(href, e) {
      // do something
    },
    async loading() {
      this.id = this.$root.$mp.query.id;
      console.log("id", this.id);
      let self = this;
      if (this.article == "<div>请稍等</div>") {
        this.flag = 1;
      }
      await wx.request({
        url: "https://www.sayetuan.com/XZ/jobhtml?id=" + this.id,
        success: function(res) {
          self.article = res.data.html;
        }
      });
    },
    async sendComment(){
      if(!this.comment)
      {
        wx.showModal({
          title:'评论失败',
          content:'评论不能为空噢',
          showCancel: false
        })
      }
      else{
        const data={
          nickName:this.nickName,
          avatarUrl:this.avatarUrl,
          comtext:this.comment,
          openid:'123456',
          job_id:this.id
        }
        console.log(data);
        try{
            await post('http://192.168.43.73:8080/TEST/comment',data);
            this.comment='';
            wx.showToast({
              title: 'text',
              icon: 'success'
            })
            this.getComments();
          }
          catch(e){
            wx.showModal({
            title:'发送失败',
            content:'网络请求失败，请稍后再试',
            showCancel: false
          })
          console.log(e);
        }
      }
    },
    async addComment(){
      let user =wx.getStorageSync('userInfo');
      const self = this;
      if(!user){
        let res=await login();
        console.log(res);
        wx.setStorageSync('userInfo',res) 
      }
      else{
        this.sendComment();
      }
    },
    async getComments(){
      const comments=await get('',{infoid:this.id});
      this.comments=comments;
      if(this.comments==='')
      {
        commentsFlag=0;
      }
      console.log(comments);
    },
    async getList(init){
            if(init)
            {
                this.page=0;
                this.more= true;
            }
            wx.showNavigationBarLoading();
            const books= await get('/weapp/booklist',{page:this.page});
            if(books.list.length<10&&this.page>0)
            {
                this.more =false;
            }
            if(init)
            {
                this.books=books.list;
                wx.stopPullDownRefresh()
            }
            else{
                this.books=this.books.concat(books.list);
            }
            wx.hideNavigationBarLoading();
        },  
    },  
  onLoad() {
    this.article = "<div>正在渲染,请稍等</div>";
    this.flag=0;
  },
  mounted() {
    this.loading();
    this.getComments();
    setTimeout(() => {
      this.flag=1;
    },3000);
    console.log(this.flag)
  }
};
</script>

<style>
@import url("~mpvue-wxparse/src/wxParse.css");
/* @import url("../../../static/css/spinners.css"); */
.commentNull{
  margin-top:20rpx;
}
.commentNull_img{
  width:366rpx;
  height: 440rpx;
  margin-left: 150rpx;
}
.red-btn{
    color:white;
    background: #EA5A49;
    margin-bottom: 10rpx;
    padding-left: 15rpx;
    padding-right: 15rpx;
    border-radius: 2rpx;
    font-size: 32rpx;
    line-height:80rpx;
    height:80rpx;
    width:100%;
    margin-top: 10rpx;
}
.btn {
  display: inline-block;
  border-style: solid;
  width: 240rpx;
  height: 74rpx;
  background: #ffffff;
  border-radius: 40rpx;
  border-width: 3rpx;
  color: #5c5d5f;
  border-color: #f0f0f0;
  margin-left: 20rpx;
  font-size: 15px;
}
.btn-praise:before {
  position: absolute;
  left: 36rpx;
  top: 16rpx;
  content: "";
  background-image: url(../../images/praise.png);
  background-size: 38rpx 38rpx;
  width: 36rpx;
  height: 36rpx;
}
.btn-praise {
  padding: 0rpx 0rpx 0rpx 20rpx;
  font-size: 28rpx;
}
.btn-share:before {
  position: absolute;
  left: 36rpx;
  top: 16rpx;
  content: "";
  background-image: url(../../images/share.png);
  background-size: 38rpx 38rpx;
  width: 36rpx;
  height: 36rpx;
}
.btn-share {
  padding: 0rpx 0rpx 0rpx 20rpx;
  font-size: 28rpx;
}
.input {
  display: inline-block;
  width: 500rpx;
  height: 64rpx;
  border-style: none;
  font-size: 16px;
  background-color: #f4f5f7;
  border-radius: 40rpx;
  margin-left: 20rpx;
  padding-left: 60rpx;
  margin-top: 36rpx;
}
.input:before {
  position: absolute;
  left: 35rpx;
  margin-top:12rpx;
  content: "";
  background-image: url(../../images/comment.png);
  background-size: 38rpx 38rpx;
  width: 36rpx;
  height: 36rpx;
}
.send{
  display: inline-block;
  width: 94rpx;
  height: 94rpx;
  margin-left: 10rpx;
  background-image: url("../../images/send.png");
  background-size: 94rpx 94rpx;
}
.icon-user {
  width: 44rpx;
  height: 44rpx;
  padding: 5px;
}
.float {
  display: inline-flex;
}
.commentflex {
  margin-top: 20px;
  padding-left: 20rpx;
}
.comment {
  width: 100%;
  height: 280rpx;
  display: flex;
}
.comment_img {
  width: 15%;
  height: 100%;
}
.avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
}
.comment_info {
  width: 65%;
  height: 100%;
}
.comment_praise {
  width: 20%;
  height: 100%;
}
.column {
  flex-direction: column;
}
.comment_info_username {
  color: #70859e;
  font-size: 28rpx;
}
.comment_info_ {
  margin-top: 20rpx;
  color: #505050;
  font-size: 34rpx;
  height: 100rpx;
}
.comment_info_time {
  color: #585858;
  font-size: 24rpx;
}
.comment_praise {
  font-size: 32rpx;
  color: #afafb1;
}
.pariseimg {
  width: 36rpx;
  height: 36rpx;
}
</style>