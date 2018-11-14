<template>
  <div class="footerbar">
  	<a href=""><span><img src="static/images/icon_01.png">我要反馈</span></a>
  	<a href=""><span><img src="static/images/icon_02.png">反馈历史</span></a>
  </div>
</template>

<script>
  export default {
    name: 'footerbar'
  }
</script> 
<style>
.footerbar{
	width:100%;height:1rem;position: fixed;bottom:0;left:0;background:#fff;color:#fff;
}
.footerbar a{float:left;display:inline-block;width:50%;padding:.2rem 0; height:.6rem; text-align: center;color:#888;}
.footerbar a span{display: block;border-right:.01rem solid #ccc;line-height: .6rem;}
.footerbar a:last-child span{border:none;}
.footerbar a img{display: inline-block;width:.35rem;height:.35rem;margin-right:.1rem;background:#ccc;vertical-align: middle;}
</style>