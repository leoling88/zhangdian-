<template>
    <div class="template_container">
        <div class="error">
          <img src="../../../static/images/reminder.png" alt="">
          <p><span class="notice">访问失败</span>您的芝麻信用未开通，服务暂不能访问，请先开通后再使用！</p>

          <button @click="tiaoRouter" class="check_detail_btn" style="margin-top:.6rem;">返回首页</button>
        </div>
    </div>
</template>
<script>
  import {XButton} from 'vux'
  import api from '../../api/api'
  export default {
    components: {XButton},
    data() {
      return {

      }
    },
    methods: {
      tiaoRouter(){
        location.href = '/cnZhangDian/mobile/laisuiHomeIndex?homeType=lsns_'
      },
      setTitle () {
        if (window.AlipayJSBridge) AlipayJSBridge.call('setTitle', {title: '温馨提示'})
      },
      setOptionMenu () {
        if (window.AlipayJSBridge) {
          AlipayJSBridge.call('setOptionMenu', {
            title : ' ',  // 与icon、icontype三选一
            redDot : '-1', // -1表示不显示，0表示显示红点，1-99表示在红点上显示的数字
            color : '#008cec', // 必须以＃开始ARGB颜色值
          });
          AlipayJSBridge.call('showOptionMenu');
          //document.addEventListener('optionMenu', this.goNext, false) // 绑定支付宝右上角点击事件
        }
      },
      goNext () {
        location.href = '/cnZhangDian/mobile/laisuiHomeIndex?homeType=lsns_'
      },
    },
    mounted(){
      this.setTitle();
      this.setOptionMenu();
    }
  }
</script>
<style scoped lang="less">
  .error{margin:1.2rem auto 0;text-align:center;padding:0 0.3rem;
    img{width:1.32rem;}
    p{font-size:.3rem;color:#999;}
  }
  .notice{font-size:.4rem;display:block;margin-bottom:.2rem;margin-top:.2rem;color:#333;}
</style>
