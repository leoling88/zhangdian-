<template>
  <div class="QA">
	<h1 class="h1">{{article.title}}</h1>
	<div class="con" >
        <div v-html="article.personalOpinion"></div>
        <div>
            <img :src="'/cnZhangDian/mobile/fbPicRead?fid=' + item.uuid" v-for="item in articleImg">
        </div>
        <span class="time">提问时间：{{article.date}}</span>
    </div>
<!--     <div class="con2"><span class="icon"></span><span class="icon2">回答</span><div  v-html="article.answer"></div><span class="time">回答时间：{{article.aswertime}}</span></div>
    <div @click="goNext" v-if="nodeEnv === 'development'">下一步</div>
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
    		article:[],
            articleImg:[],
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
            api.myQArticle(this.comGUID).then((res) => {
              if(res.data.success){
                this.article = res.data.obj
                this.articleImg = res.data.fileIds
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
.QA{width:100%;overflow:hidden;border-top:.02rem solid #ccc;}
.QA .h1{padding:.2rem .3rem;font-size:.28rem;color:#333;background:#fff;font-weight: bold;}
.QA .con{border-top:.01rem solid #ccc;border-bottom:.01rem solid #ccc;margin-bottom:1rem;padding:.2rem .3rem ;font-size:.28rem;color:#666;background:#fff; position: relative;}
.QA .con .time{position: absolute;left:.1rem;bottom:-.4rem;color:#ccc;font-size:.24rem;}

.QA .con2{margin:0 1rem .5rem .2rem;border-radius:.1rem;padding:.2rem;color:#fff;background:#108ee9;position: relative;}
.QA .con2 .icon{display:block;
    width:0; 
    height:0; 
    border-top:.2rem solid transparent;
    border-bottom: .2rem solid transparent;
    border-left: .2rem solid #108ee9;
    position: absolute;right:-.15rem;top:.22rem;
}
.QA .con2 .icon2{position: absolute;right:-.9rem;top:.22rem;color:#108ee9;}
.QA .con2 .time{position: absolute;right:.1rem;bottom:-.4rem;color:#ccc;font-size:.24rem;}

.QA .con p{padding:.1rem 0;}
.QA .con img,.QA .con2 img{width:auto;max-width:90%;margin:.3rem auto;}
</style>