<template>
  <div class="template_container">
    <!--<div @click="goNext">首页</div>-->
    <div class="card-wraper" v-if="true">
      <div class="card_cont">
        <img class="icon_card" src="../../../static/images/card_bg.png"/>
        <!--<h2>数字张店电子登记卡</h2>-->
      </div>
      <div class="card_lists">
        <group label-width="6.5em" label-align="left">
          <cell title="姓名" :value="formData.name" value-align="left"></cell>
          <cell title="手机号" :value="formData.phoneNo" value-align="left"></cell>
          <cell title="身份证" :value="formData.idNo" value-align="left"></cell>
          <cell title="登记日期" :value="formData.checktime" value-align="left"></cell>
          <cell class="livePlace" title="现居住地" :value="formData.wholeName" value-align="left"></cell>
        </group>
      </div>

    </div>
  </div>
</template>
<script>
  import {XInput, XButton, Group, Cell, Value2nameFilter as value2name} from 'vux'
  import api from '../../api/api'
  import { mapState } from 'vuex'
  export default {
    name: 'step3',
    components: {XInput, XButton, Group, Cell},
    data() {
      return {
      	addressList:this.$Utils.getLocalStorage('addressList'),
        step:'0',
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
          phoneNo: '',
          checktime: '',// 预约时间
          roomNumberName: '',
          doorNumberName: '',
          townAddress:'',
          wholeName:''    //完整地址
        },
        streetTownName: '', // 预约街道
        value1: '街道代码', //
        timeOptions: []
      }
    },
    computed: {
    },
    mounted () {
      this.setTitle();
      this.setOptionMenu();
      this.getPeopleInfo();
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
      getPeopleInfo () {
        this.$store.commit('UPDATE_LOADING', true);

        api.rebackPeopleInfo({idCard:this.formData.idNo,isEdit:this.isEdit,step:this.step}).then((res) => {
          const data = res.data.jsonRes[0]
          if(res.data.success){
            this.$store.commit('UPDATE_LOADING', false);
            this.formData.phoneNo = data.phoneNo ? this.starPhoneNo(data.phoneNo) : ''; //
            this.formData.name = data.name ? data.name : '';
            this.formData.checktime = data.checktime ? data.checktime : '';
            this.formData.roomNumberName = data.roomNumberName ? data.roomNumberName : '';
            this.formData.doorNumberName = data.doorNumberName ? data.doorNumberName : '';
            this.formData.culture = data.culture ? data.culture : '';
            this.formData.comeDate = data.comeDate ? data.comeDate : '';
            this.formData.comeReason = data.comeReason ? data.comeReason : '';
            this.formData.idNo = this.starRoomNumberName(this.formData.idNo);
            this.formData.wholeName = data.wholeName
            // this.formData.townAddress = value2name([JSON.parse(data.address)[0]], this.addressList);//镇办--replace去除字符串中的空格
          }
        }).catch(() => {
          this.$store.commit('UPDATE_LOADING', false);
        })
      },
      starPhoneNo (str) {
        return str.substr(0, 3) + '****' + str.substr(7);
      },
      starRoomNumberName (str) {
        return str.substr(0, 4) + '********' + str.substr(14);
      },
      starString (str, startStr, endStr, starNum) {

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
    .card_lists{border-radius: .16rem;min-height:7.76rem;margin:0;padding-top:.23rem;}
  }
</style>
<style>
  .card_lists .weui-cell{font-size:.32rem;padding:0 .2rem !important;height:.96rem;line-height:.96rem;/*border-bottom:1px solid #d9d9d9;*/}
  .card_lists .livePlace{height:auto;line-height:normal;padding:.32rem .2rem !important;}
  .card_lists .livePlace.weui-cell{align-items:normal !important;}
</style>
