<template>
  <div class="QA">
	<h1 class="h1">{{article.title}}</h1>
	<div class="con" v-html="article.content"></div>
<!--     <div @click="goNext" v-if="nodeEnv === 'development'">下一步</div>
 -->

  </div>
</template>

<script>

import api from '../../api/api';
import footerBar from '@/components/common/footerBar'

import { mapState } from 'vuex';
export default {

    components: {footerBar},
    name: 'QA',
    data () {
    	return {
            openId: this.$route.params.openid,
            comGUID: this.$route.params.comGUID,
    		article:{},
    		nodeEnv: 'development',

    	}
    },
    methods: {


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
		removeOptionMenu () {
		document.removeEventListener('optionMenu', this.goNext, false);
		},
        requireData () {
            this.$store.commit('UPDATE_LOADING', true)
            api.hotArticle(this.comGUID).then((res) => {
              if(res.data.success){
                this.article = res.data.obj[0]
                // this.articleImg = res.data.fileIds
                this.$store.commit('UPDATE_LOADING', false);
              }
            }).catch(() => {
              this.$store.commit('UPDATE_LOADING', false);
            })
        },
        setTitle (data) {
          if (window.AlipayJSBridge) AlipayJSBridge.call('setTitle', {title: '问题详情'})
        },        
    },
    mounted () {
        this.requireData()
        this.setTitle()
        this.setOptionMenu()
    },
    destroyed () {
      this.removeOptionMenu();
    }    
}
</script> 
<style scoped >
.QA{width:100%;min-height:736px;overflow:hidden;border-top:.02rem solid #ccc;background:#fff;}
.QA .h1{padding:.2rem .3rem;font-size:.28rem;color:#333;background:#fff;font-weight: bold;}
.QA .con{border-top:.01rem solid #ccc;margin-bottom:1rem;padding:.2rem .3rem ;font-size:.28rem;color:#666;}
.QA .con p{padding:.1rem 0;}
.QA .con img{width:auto;max-width:90%;margin:.1rem auto;}
</style>