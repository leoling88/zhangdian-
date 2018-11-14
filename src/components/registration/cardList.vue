<template>
  <div class="template_container">
    <!--<div @click="goNext">首页</div>-->
    <div class="card-wraper" v-if="true">
      <div class="card_cont">
        <img class="icon_card" src="../../../static/images/card_bg.png"/>
        <!--<h2>数字张店电子登记卡</h2>-->
      </div>
      <div class="xfv-from lyp-card">
        <custom-selector v-model="formData.cardList" describe="详情说明" :options="cardList" :isFirst="isFirst" :isNoneTo="false" @to="toHref" placedata="查看"></custom-selector>
      </div>

    </div>

  </div>
</template>
<script>
  import {Icon,Group,Cell, Timeline, TimelineItem, Alert,TransferDomDirective as TransferDom, XSwitch, Tab, TabItem} from 'vux'
  import customSelector from '../common/customSelector.vue'
  import { mapState } from 'vuex'
  export default {
    name: 'step3',
    components: {Icon,Group,Cell, Timeline, TimelineItem, Alert, customSelector},
    directives: {
      TransferDom
    },
    data() {
      return {
        isFirst: true, // 是否是第一次选择或输入
        isShowAlert: false,
        showLoading: false,  // 是否在加载中
        serviceType: this.$route.query.serviceType ? this.$route.query.serviceType : 1, // 业务类型，1,为登记，2，为居住证办理
        maxYear: new Date().getFullYear(),
        transactWay: 1, // 续签居住证办理方式
        openid: this.$route.query.openid,
        formData: {
          zhimascore: this.$route.query.zhimascore,
          // 业务进程: 1，登记成功未预约，2，登记预约成功未审核，3，登记审核成功, 4,居住证申请成功未预约, 5,预约成功未审核
          recordstate: '',
          comGuid: this.$route.query.comGuid,
          idNo: this.$route.params.idNo, // 身份号
          name: '',
          cardList: ''  // 街道电话
        },
        cardList: []
      }
    },
    computed: {
    },
    mounted () {
      this.setTitle();
      this.setOptionMenu();
    },
    methods: {
      setTitle () {
        if (window.AlipayJSBridge) AlipayJSBridge.call('setTitle', {title: '电子居住登记证'});
      },
      setOptionMenu () {
        if (window.AlipayJSBridge) {
          AlipayJSBridge.call('setOptionMenu', {
            title : '首页',  // 与icon、icontype三选一
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
     goNext () {
        const query = {
          //serviceType: this.serviceType,
          comGuid: this.$route.query.comGuid,
          openid:this.$route.query.openid,
          registerFlag: this.$route.query.registerFlag,
          nativeFlag: this.$route.query.nativeFlag
        }
//        this.$router.push({path:'/', query});
       location.href = '/cnZhangDian/mobile/laisuiHomeIndex?homeType=lsns_'
      },
      onConfirm () {  // 确认
        this.$store.commit('UPDATE_LOADING', true);
        api.saveResideInfo({
          formData: this.formData,
          homeType: 'lsns_',  // 南沙区域标记
          isEdit: this.isEdit
        }).then(res => {
          this.$store.commit('UPDATE_LOADING', false);
          if(res.data.success) {
            const query = {
              //serviceType: this.serviceType,
              comGuid: this.$route.query.comGuid,
              openid:this.$route.query.openid,
              registerFlag: this.$route.query.registerFlag,
              nativeFlag: this.$route.query.nativeFlag
            }
            this.$router.push({path:'/step4/' + this.formData.idNo, query});
          }
        }).catch(() => {
          this.$store.commit('UPDATE_LOADING', false);
        })
      },
      validate () { // 校验表单
        let valid = true;
        let errorMsg = '';
        if (!this.formData.name) { // 姓名
          errorMsg = '姓名不能为空！'
        } else if (!this.formData.sex) { // 性别
          errorMsg = '请选择性别！'
        } else if (!this.formData.isMarital) { // 婚姻状况
          errorMsg = '请选择婚姻状况！'
        } else if (!this.formData.phoneNo) { // 手机号码
          errorMsg = '手机号不能为空！'
        } else if (!this.$Utils.isPhone(this.formData.phoneNo)) {
          errorMsg = '手机号不合法！'
        } else {
          valid = true
          errorMsg = ''
        }
        return {valid, errorMsg}
      },
      getDictionary(){ // 获取所有的字典
        api.queryDictionaryList().then(res => {
          if(res.data.success) {
            const data = res.data.obj;
            this.laisuiFilerData(data.XB, this.sexList);
            this.laisuiFilerData(data.MZ, this.nationList);
          }
        });
      },
      toHref () {
        const query = {
          //serviceType: this.serviceType,
          comGuid: this.$route.query.comGuid,
          openid:this.$route.query.openid,
          registerFlag: this.$route.query.registerFlag,
          nativeFlag: this.$route.query.nativeFlag
        }
        this.$router.push({path:`/cardDetail/${this.formData.idNo}`, query});
      },
      onScroll (pos) {  // 滚动事件回调
        this.scrollTop = pos.top
        if(this.scrollTop >= this.$refs.szzdIndexTop.clientHeight + this.$refs.linkBar.clientHeight){
          this.isCover = true;
        } else {
          this.isCover = false;
        }
      },
      infinite() { // 上拉加载
        this.pageIndex ++;
        this.getNewSList(this.pageIndex, this.newsType);
      }
    },
    destroyed () {
      this.removeOptionMenu();
    }
  }
</script>
<style lang="less" scoped>
  .card-wraper{
    padding:.18rem .35rem .2rem;
    .icon_card{
      display:block;
    }
    .xfv-from{border-radius: .16rem;min-height:7.76rem;margin:0;padding-top:.23rem;}
  }

</style>
<style>
  /*.xfv-from .weui-cell:before{content:normal !important;}*/
  /*.xfv-from .weui-cell{border-bottom:1px solid #d9d9d9;border-top:1px solid #d9d9d9;padding:0 .2rem;font-size:.32rem;height:.96rem;line-height:.96rem;}*/
  .lyp-card .selector_box{position:relative;}
  .lyp-card .selector_box:before{  content: " ";
    position: absolute;
    bottom: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #D9D9D9;
    color: #D9D9D9;
    transform-origin: 0 0;
    transform: scaleY(0.5);
    left: 0px;}
</style>

