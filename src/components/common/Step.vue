<template>
  <div>
    <dl class="step_cont">
      <dt><img :src="`./static/images/step${step}.png`"></dt>
      <dd><span>基础信息</span><span>居住信息</span><span>家庭成员</span></dd>
    </dl>
  </div>
</template>
<script>
  export default {
    props: {
      step: {
        type: [Number,String],
        default: 1
      }
    },
    data() {
        return {}
    }
  }
</script>
<style scoped lang="less">

  .step_cont{width:100%;height:1.4rem;padding-top:.4rem;overflow:hidden;background: #f2f2f8;border-bottom:.2rem #eee solid;}
    dl{
      width:100%;height:1.5rem;padding-top:.4rem;overflow:hidden;background: #f2f2f8;border-bottom:.2rem #eee solid;
      dt{
        width:5.3rem;overflow: hidden;margin:0 auto;text-align: center;
        img{width:5.3rem;height:.48rem;}
      }
      dd{
        width:6.5rem;overflow: hidden;margin:0.1rem auto 0;
        span{width:33%;display: inline-block;color:#666;}
        span:first-of-type{text-indent: .25rem;}
        span:nth-of-type(2){text-align: center;}
        span:last-of-type{text-align: right;}
      }
    }


</style>
