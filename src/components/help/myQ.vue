<template>
  <div class="QA">
	<ul class="ul-1">
		<li v-for="(item, index) in lists"  >
			<a @click="goArrt(item.comGUID)">
				<div><span class="time">{{item.createTime | formatDate}}</span></div>
				<div class="text">{{item.title}}</div>				
			</a>
		
		
		</li>

<!-- 		<li   >
			<a >
				<div><span class="time">2018-12-23</span></div>
				<div class="text">2018-12-23</div>				
			</a>

		
		</li> -->

	</ul>
	<div class="mess" v-if="lists.length < 1"><span>暂无记录</span></div>


  </div>
</template>

<script>

import api from '../../api/api';

import { mapState } from 'vuex';
export default {


    name: 'QA',
    data () {
    	return {
    		openId: this.$route.params.openid,
    		lists:[],
    		nodeEnv: 'development',

    	}
    },
    methods: {
    	goArrt(comGUID){
			this.$router.push({path:'/article2/' + comGUID});
    	},
	    goNext () {
	    },
		setOptionMenu () {
			if (window.AlipayJSBridge) {
			  AlipayJSBridge.call('setOptionMenu', {
			    title : ' ',  // 与icon、icontype三选一
			    redDot : '-1', // -1表示不显示，0表示显示红点，1-99表示在红点上显示的数字
			    color : '#008cec', // 必须以＃开始ARGB颜色值
			  });
			  AlipayJSBridge.call('showOptionMenu');
			  document.addEventListener('optionMenu', this.goNext, false) // 绑定支付宝右上角点击事件
			}
		},
		requireDatas() {
	        this.$store.commit('UPDATE_LOADING', true);
	        api.requireMyQ({
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
		removeOptionMenu () {
		document.removeEventListener('optionMenu', this.goNext, false);
		},
        setTitle (data) {
          if (window.AlipayJSBridge) AlipayJSBridge.call('setTitle', {title: '反馈历史'})
        },    
 

    },
    mounted () {
    	this.requireDatas()
    	this.setTitle()
    	this.setOptionMenu()
    },
    destroyed () {
      this.removeOptionMenu();
    },  
    filters: {
      formatDate: function (value) {
        let date = new Date(value);
        let y = date.getFullYear();
        let MM = date.getMonth() + 1;
        MM = MM < 10 ? ('0' + MM) : MM;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let m = date.getMinutes();
        m = m < 10 ? ('0' + m) : m;
        let s = date.getSeconds();
        s = s < 10 ? ('0' + s) : s;
        return y + '-' + MM + '-' + d  //+ ' ' + h + ':' + m + ':' + s;
      }
  }
       
}
</script> 
<style scoped>
.QA{background:#fff;min-height:720px;border-top:.02rem solid #ccc;}
.mess{margin:2rem 0;text-align:center;}
.ul-1{border-top:.01rem solid #ccc;border-bottom:.01rem solid #ccc;padding:0 .3rem;font-size:.3rem;background:#fff;}
.ul-1 li{padding:.2rem 0;border-bottom:.01rem solid #ccc; position: relative;list-style:none;}
.ul-1 li:last-child{border:none;}
.ul-1 li a{color:#333;}
.ul-1 li div{overflow:hidden;}
.ul-1 .time{font-size:.26rem;color:#ccc;position: absolute;right:0;top:50%;margin-top:-.15rem;}
.ul-1 li .text{width:75%;}
</style>