<template>
  <div style="height:auto;">
    <iframe style="width:100%;height:100%;" :src="bdTokenUrl" frameborder="0" scrolling="no" id="bdIframe">
    </iframe>
  </div>
</template>

<script type="text/javascript">


export default {
  name: 'turnoverfamily',
  data(){
    return{
      bdTokenUrl : 'http://192.168.43.1:8081/video'
    }
  },
  created() {
    this.getUrl();
    this.$nextTick(()=>{
      this.getCode();
    });
  },
  mounted(){
    /**
     * iframe-宽高自适应显示
     */
    const oIframe = document.getElementById('bdIframe');
    const deviceWidth = document.documentElement.clientWidth;
    const deviceHeight = document.documentElement.clientHeight;
    oIframe.style.width = (Number(deviceWidth)-220) + 'px'; //数字是页面布局宽度差值
    oIframe.style.height = (Number(deviceHeight)-120) + 'px'; //数字是页面布局高度差
  },
  methods: {
    /**
     * 获取-外部接口信息
     */
    getUrl() {
      let that = this
      let bdUrl = {queryurl: this.$paths.bdpath+'/locate'};
      this.$api.getBdToken(bdUrl,function(res) {
        that.bdTokenUrl = res.data.data;
      })
    },
  }
}
</script>

<style>

</style>