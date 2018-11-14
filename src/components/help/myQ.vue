<template>
  <div class="QA">
	<ul class="ul-1">
		<li v-for="(item, index) in lists"  >
				<div><span class="time">{{item.time}}</span></div>
				<div>{{item.name}}</div>
		
		</li>
	</ul>


  </div>
</template>

<script>

import api from '../../api/api';

import { mapState } from 'vuex';
export default {


    name: 'QA',
    data () {
    	return {
    		openid: this.$route.params.openid,
    		lists:[
	    		{
	    			name:'如何修改手机号码？',
		    		url:'/QZ',
		    		time:'2018-7-8'
		    	},
	    		{
	    			name:'手机登录，身份证登录，刷脸登录有什么区别吗？',
		    		url:'/QZ',
		    		time:'2018-7-8'
		    	},
	    		{
	    			name:'收到不短信验证码',
		    		url:'/QZ',
		    		time:'2018-7-8'
		    	},
	    		{
	    			name:'忘记密码，怎么办？',
		    		url:'/QZ',
		    		time:'2018-7-8'
		    	},
	    		{
	    			name:'忘记密码，怎么办？忘记密码，怎么办？忘记密码，怎么办？忘记密码，怎么办？忘记密码，怎么办？',
		    		url:'/QZ',
		    		time:'2018-7-8'
		    	}

    		],
    		nodeEnv: 'development',

    	}
    },
    methods: {


	    goNext () {
	    },
		setOptionMenu () {
			if (window.AlipayJSBridge) {
			  AlipayJSBridge.call('setOptionMenu', {
			    title : '下一步',  // 与icon、icontype三选一
			    redDot : '-1', // -1表示不显示，0表示显示红点，1-99表示在红点上显示的数字
			    color : '#008cec', // 必须以＃开始ARGB颜色值
			  });
			  AlipayJSBridge.call('showOptionMenu');
			  document.addEventListener('optionMenu', this.goNext, false) // 绑定支付宝右上角点击事件
			}
		},
		removeOptionMenu () {
		document.removeEventListener('optionMenu', this.goNext, false);
		},

 

    },
    mounted () {
    },    
}
</script> 
<style scoped >
.QA{}
.ul-1{border-top:.01rem solid #ccc;border-bottom:.01rem solid #ccc;padding:0 .3rem;font-size:.3rem;background:#fff;}
.ul-1 li{padding:.2rem 0;border-bottom:.01rem solid #ccc; position: relative;list-style:none;}
.ul-1 li:last-child{border:none;}
.ul-1 li div{overflow:hidden;}
.ul-1 .time{float:right;font-size:.2rem;color:#ccc;}
</style>