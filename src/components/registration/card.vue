<template>
  <div class="template_container">

    <div class="card-wraper" v-if="true">
      <div class="card_cont">
        <img class="icon_card" src="../../../static/images/card_bg.png"/>
        <!--<h2>数字张店电子登记卡</h2>-->
      </div>
      <div class="card_text">
        <h3>恭喜！领取成功</h3>
        <!--<p>数字张店电子登记卡已放至支付宝卡包中</p>-->
      </div>
      <div class="card_link">
        <a href="javascript:;" @click="openCard" class="check_detail_btn">打开电子居住登记证</a>
      </div>

    </div>

  </div>
</template>
<script>
  import {Icon,Group,Cell, Timeline, TimelineItem, Alert,TransferDomDirective as TransferDom, XSwitch, Tab, TabItem} from 'vux'
  import api from '../../api/api'
  import { mapState } from 'vuex'
  export default {
    name: 'card',
    components: {Icon,Group,Cell, Timeline, TimelineItem, Alert},
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
        formData: {
          idNo: this.$route.params.idNo, // 身份号
          name: ''
        },
        streetTownName: '', // 预约街道
        streetTownCode: '', // 街道代码
        timeOptions: []
      }
    },
    computed: {
    },
    mounted () {
      this.setTitle();
      this.setOptionMenu();
    },
    methods: {
      openCard(){ // 获取所有的字典
        const query = {
          //serviceType: this.serviceType,
          comGuid: this.$route.query.comGuid,
          openid:this.$route.query.openid,
          registerFlag: this.$route.query.registerFlag,
          nativeFlag: this.$route.query.nativeFlag
        }
        //console.log(this.$route)
        this.$router.push({path:`/cardList/${this.formData.idNo}`, query});
      },
      setTitle () {
        if (window.AlipayJSBridge) AlipayJSBridge.call('setTitle', {title: '领取结果'});
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
              serviceType: this.serviceType,
              comGuid: this.$route.params.comGuid,
              openid:this.$route.params.alipayAcount,
              zhimascore:this.formData.zhimascore
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
    .card_text{
      margin:.53rem 0 1.46rem;
      h3{color:#333;}
    }
    .xfv-from{border-radius: .16rem;min-height:7.76rem;margin:0;padding-top:.23rem;}
  }
</style>
