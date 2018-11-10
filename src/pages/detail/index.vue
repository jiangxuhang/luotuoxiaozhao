<template>
  <div>
    <wxParse v-if='flag' :content="article" @preview="preview" @navigate="navigate" />
  </div>
</template>

<script>
import wxParse from 'mpvue-wxparse'
export default {
  components: {
    wxParse
  },
  data () {
    return {
      article: '<div>请稍等</div>',
      flag:1,
      id:1
    }
  },
  methods: {
    preview(src, e) {
      // do something
    },
    navigate(href, e) {
      // do something
    },
    async loading(){
      this.id = this.$root.$mp.query.id
      console.log('id',this.id)
      let self=this;
      // if(this.article=='<div>请稍等</div>')
      // {
      //   this.flag=0;
      // }
      await wx.request({
        url:'http://132.232.202.22/XZ/jobhtml?id='+this.id,
        success:function(res){
          console.log(res.data);
          self.article=res.data;
          self.flag=1;
      }
    })
    }
  },
  mounted() {
    this.loading();
  },
}
</script>

<style>
@import url("~mpvue-wxparse/src/wxParse.css");
/* @import url("../../../static/css/spinners.css"); */
</style>