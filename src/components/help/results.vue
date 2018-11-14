<template>
  <div class="msg">
  	<div class="img" v-if="resultsData.state == 1"><img class="icon_success" src="../../../static/images/icon_success.png"/></div>
  	<div class="img" v-if="resultsData.state == 2"><img class="icon_success" src="../../../static/images/reminder.png"/></div>
  	<div class="conter" v-html="resultsData.text"></div>
  	<div class="conter2" @click="toHelp">返回帮助与反馈</div>
        


  </div>
</template>

<script>

import api from '../../api/api';

import { mapState } from 'vuex';
export default {

    name: 'success',
    data () {
    	return {
            openid: this.$route.params.openid,
    		resultsData:{
    			msg: this.$route.query.msg,
    			text: '',
    			state: ''
    		}


    	}
    },
    methods: {
    	requireData() {
    		if (this.resultsData.msg == 'success') {
    			this.resultsData.state = 1
    			this.resultsData.text = '您的反馈已提交成功<br/>我们将尽快处理'
    		}else if (this.resultsData.msg == 'error') {
    			this.resultsData.state = 2
    			this.resultsData.text = '网络出错<br/>请稍后再试'

    		}

    	},


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
		toHelp () {
			this.$router.push({path:`/help/${this.openid}`});
		}

 

    },
    mounted () {
    	this.requireData()

    },    
}
</script> 
<style scoped >
.msg .img{width:2rem;height:2rem;margin:1.5rem auto .8rem;}
.conter{font-size:.36rem;color:#333;text-align: center; }
.conter2{margin:.2rem 0;font-size:.3rem;color:#4486ff;text-align: center; }
</style>