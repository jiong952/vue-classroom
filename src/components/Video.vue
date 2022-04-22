<template>
  <div style="height:auto;">
    <iframe src="http://192.168.43.1:8081/video" scrolling="no" frameborder="0" height="100%" id="mainFrame" width="100%" onload='IFrameReSize("mainFrame");IFrameReSizeWidth("mainFrame");'></iframe>
  </div>
</template>

<script type="text/javascript">


export default {
  name: 'video',
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
    IFrameReSize(iframename) {
      var pTar = document.getElementById(iframename);
      if (pTar) {  //ff
        if (pTar.contentDocument && pTar.contentDocument.body.offsetHeight) {
          pTar.height = pTar.contentDocument.body.offsetHeight;
        } //ie
        else if (pTar.Document && pTar.Document.body.scrollHeight) {
          pTar.height = pTar.Document.body.scrollHeight;
        }
      }
    },
    IFrameReSizeWidth(iframename) {
      var pTar = document.getElementById(iframename);
      if (pTar) {  //ff
        if (pTar.contentDocument && pTar.contentDocument.body.offsetWidth) {
          pTar.width = pTar.contentDocument.body.offsetWidth;
        }  //ie
        else if (pTar.Document && pTar.Document.body.scrollWidth) {
          pTar.width = pTar.Document.body.scrollWidth;
        }
      }
    }

  }
}
</script>

<style>

</style>