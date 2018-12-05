<template>
  <div class="footerbar">
  	<a @click="getfeedback"><span><img src="static/images/icon_01.png">我要反馈</span></a>
  	<a @click="getMyQ"><span><img src="static/images/icon_02.png">反馈历史</span></a>
  </div>
</template>

<script>
let _openidVal = localStorage.getItem('sOpenid')

  export default {
    name: 'footerbar',
    data () {
      return {
        openId: this.$route.params.openid,
      }

    },
    methods:{
    	getMyQ() {
	        // if(_openidVal) {
	        this.$router.push({path:'/myQ/' + this.openId});
	        // }else{
	        //   location.href = '/cnZhangDian/mobile/qtEntrance?qtType=2';   //http://192.168.18.250:8080
	        // }
        },
        getfeedback () {

          localStorage.setItem('_back',null);
          // this.$router.push({path:'/feedback/' + this.openId});
	        // if(_openidVal) {
	        // 	this.$router.push({path:'/feedback/' + _openidVal});
	          
	        // }else{
	          location.href = '/cnZhangDian/mobile/qtEntrance?qtType=1' //http://192.168.18.250:8080
	        // }        	
        }

    }
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