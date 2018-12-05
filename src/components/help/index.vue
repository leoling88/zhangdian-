<template>
  <div class="QA">
<!-- 	<h2 class="h1">问题列表</h2>
 -->	<div class="ul-1">
		<a  v-for="(item, index) in lists"  @click="goArrt(item.comGUID)" ><span class="title">{{item.title}} </span></a> <!--<span class="icon"></span>-->

	</div>
	<!--
	<h2 class="h1">问题分类</h2>
	<div  class="ul-2">
		<ul>
			<li v-for="(item, index) in lists2"  ><span><img :src="item.img" alt=""></span></li>
		</ul>
	</div>
-->

<!--     <div @click="goNext" v-if="nodeEnv === 'development'">下一步</div>
 -->
    <!--底部帮助-->
    <footerBar></footerBar>
    <!--底部帮助 end-->

  </div>
</template>

<script>

import { Alert, Confirm as TransferDom} from 'vux';
import api from '../../api/api';
import footerBar from '@/components/common/footerBar'

import { mapState } from 'vuex';
export default {
  directives: {
    TransferDom
  },
    components: { Alert,footerBar},
    name: 'QA',
    data () {
    	return {
    		openId: this.$route.params.openid,
    		lists:[],
    		lists2:[],

    		nodeEnv: 'development',

    	}
    },
    methods: {
    	goArrt(comGUID){
			this.$router.push({path:'/article/' + comGUID});
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
		requireList () {
	        api.requireQ({
		      page: 1,
		      size: 200,
		      openId:this.openId,	        	
	        }).then(res => {     
	          this.$store.commit('UPDATE_LOADING', false);
	          const _odata = res.data.obj
	          if(res.data.success) {
	          	if(res.data.status > 0){

	          		this.lists = _odata

	          	}
	            this.$store.commit('UPDATE_LOADING', false);
	          }

	        })  
		},
		setTitle (data) {
          if (window.AlipayJSBridge) AlipayJSBridge.call('setTitle', {title: '常见问题'})
	    },
    },
    mounted () {
    	this.requireList()
    	this.setTitle()
    	if(this.openId.length > 10){
    		localStorage.setItem('sOpenid',this.openId)
    	}
    },    
}
</script> 
<style scoped>
.QA{background:#fff;min-height:720px;border-top:.02rem solid #ccc;}
.QA .h1{padding:.2rem .3rem;font-size:.3rem;color:#666;font-weight: 100;}
.QA .h1 .right{float:right;font-size:.2rem;line-height:.3rem;}
.ul-1{border-top:.01rem solid #ccc;border-bottom:.01rem solid #ccc;padding:0 .3rem;font-size:.3rem;background:#fff;}
.ul-1 a{display:block;padding:.2rem 0;border-bottom:.01rem solid #ccc; position: relative;list-style:none;color:#333;}
.ul-1 a:last-child{border:none;}
.ul-1 a .icon{ position: absolute;top:50%;right:0; }
.icon{color:#ccc;position:absolute;margin-top:-.1rem;width:.2rem;height:.2rem;border-bottom:solid 1px currentColor;border-left:solid 1px currentColor;-webkit-transform:rotate(225deg);transform:rotate(225deg)}
.ul-1 a .title{display:block;padding-right:.1rem;}
.ul-2{width:100%;position: relative;border-top:.01rem solid #ccc;background:#fff;overflow:hidden;}
.ul-2 ul{width:101%;}
.ul-2 li{float:left;width:25%;}
.ul-2 li span{display:block ;height:2rem;border-right:.01rem solid #ccc;border-bottom:.01rem solid #ccc;padding:.01rem;background:#fff;overflow:hidden;}

.ul-2 li span img{display:block;width:100%;height:100%;}
</style>