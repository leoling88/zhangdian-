<template>
  <div class="template_container">

    <div class="step3_cont">
      <div class="sucess_cont">
        <img class="icon_success" src="../../../static/images/icon_success.png"/>
        <h3>登记成功</h3>
      </div>

      <button v-if="!disButton" @click="recieveCard" type="button" :disabled="disButton" class="check_detail_btn" style="margin-top:.2rem;">领取电子居住登记证</button>
      <button type="button" v-if="disButton" class="check_detail_btn check_huise" style="margin-top:.2rem;">您已领取电子居住登记证</button>

    </div>

    <!--<div @click="goNext">下一步</div>-->
  </div>
</template>
<script>
  import {Icon,Group,Cell, Timeline, TimelineItem, Alert,TransferDomDirective as TransferDom, XSwitch, Tab, TabItem} from 'vux'
  import api from '../../api/api'
  import { mapState } from 'vuex'
  export default {
    name: 'step3',
    components: {Icon,Group,Cell, Timeline, TimelineItem, Alert},
    directives: {
      TransferDom
    },
    data() {
      return {
        isEdit: this.$route.query.isEdit || '0',  //  add: 新增, edit: 修改
        step:'0',
        disButton:false,
        isFirst: true, // 是否是第一次选择或输入
        isShowAlert: false,
        showLoading: false,  // 是否在加载中
        maxYear: new Date().getFullYear(),
        transactWay: 1, // 续签居住证办理方式
        openid: this.$route.query.openid,
        registerFlag: this.$route.query.registerFlag,
        nativeFlag: this.$route.query.nativeFlag,
        formData: {
          zhimascore: this.$route.query.zhimascore,
          // 业务进程: 1，登记成功未预约，2，登记预约成功未审核，3，登记审核成功, 4,居住证申请成功未预约, 5,预约成功未审核
          recordstate: '',
          comGuid: this.$route.query.comGuid,
          idNo: this.$route.params.idNo, // 身份号
          name: '',
          phoneNo: '',
          loginDate: '',// 预约时间
          loginTime: '',// 预约时间段
          checktimels: '', // 预约日期时间
          checktimeidls: '',// 预约日期时间ID(预约号)
          addressDetail: '',  // 街道详细地址
          streetNumber: ''  // 街道电话
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
//      this.recieveCard();
      this.getPeopleInfo();
//      this.backFanhui();
    },
    methods: {
      backFanhui (){//返回
      document.addEventListener('back', () => {
        location.href = '/cnZhangDian/mobile/laisuiHomeIndex?homeType=lsns_'
        return
      }, false)
      },
      removebackFanhui () {//销毁支付宝返回事件
        document.removeEventListener('back', this.backFanhui, false);
      },
      getPeopleInfo () {
        this.$store.commit('UPDATE_LOADING', true);
        api.rebackPeopleInfo({idCard:this.formData.idNo,isEdit:this.isEdit,step:this.step}).then((res) => {
          const data = res.data.jsonRes[0]
          if(res.data.success){
            this.$store.commit('UPDATE_LOADING', false);
            console.log('55664',data.cardStatus);
            if(data.cardStatus == 2){
              this.disButton = true;
            }

          }
        }).catch(() => {
          this.$store.commit('UPDATE_LOADING', false);
        })
      },
       recieveCard () {
        api.recieveCard(this.openid, 1).then(res => {
          const data = res.data.attributes || [];
          if(res.data.success) {
            const query = {
              comGuid: this.$route.query.comGuid,
              openid:this.$route.query.openid,
              registerFlag: this.registerFlag,
              nativeFlag: this.nativeFlag
            }

            if (data.state == '1') { // 登记成功，准备领卡
              this.$router.push({path:`/card/${this.formData.idNo}`, query});
            } else if (data.cardStatus == '2') {  // 登记成功，已领卡
              this.$router.push({path:`/cardList/${this.formData.idNo}`, query});
            }
          }
        });
      },
      setTitle () {
        if(this.nativeFlag == 1){
          if (window.AlipayJSBridge) AlipayJSBridge.call('setTitle', {title: '户籍居住登记'})
        }else if(this.nativeFlag == 0){
          if (window.AlipayJSBridge) AlipayJSBridge.call('setTitle', {title: '非户籍居住登记'})
        }
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
        if (window.AlipayJSBridge) {
          document.removeEventListener('optionMenu', this.goNext, false);
        }
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
          isRegister: 4,
          isEdit: this.isEdit
        }).then(res => {
          this.$store.commit('UPDATE_LOADING', false);
          if(res.data.success) {
            const query = {
              isEdit: this.isEdit,
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
//      this.removebackFanhui();
    }
  }
</script>
<style lang="less" scoped>
  .step3_cont{
    width:100%;overflow:hidden;line-height: .5rem;overflow:hidden;position: relative;
    .sucess_cont{
      width:100%;height:5.2rem;padding-top:1.2rem;
      .icon_success{display: block;width:1.8rem;height:1.8rem;margin:0 auto;}
      h3{height: 1rem;line-height: 1.4rem;font-size: .35rem;text-align: center;color:#000;margin-top: 0;}
      h3:last-of-type{height: 1rem;line-height: 1rem;font-size: .4rem;text-align: center;}
      h3 span{display: block;color:#0091ff;font-size: .35rem;line-height: .5rem;}
      h3 em{display: block;color:#0091ff;font-size: .35rem;line-height: .5rem;}
    }

    p{
      width:94%;margin:0 auto;line-height: .5rem;font-size: .28rem;
      span:first-of-type{display:inline-block;height:.7rem;float: left}
      span:last-of-type{color:red;}
    }
    .modif_btn{display: inline-block;line-height: .6rem;padding:0 .15rem;border:1px solid #eee;color:#666;font-size: .3rem;border-radius: .05rem;position: absolute;right:.2rem;top:.5rem;}
    .info_cont{
      width:7.1rem;margin:.3rem auto;overflow: hidden;background: #fff;
      li{font-size: .3rem;line-height: 1rem;color:#212c35;border-bottom:1px solid #eee;padding:0 .3rem;}
      span{color:#5a6570;float: right;}
    }
  }
  .hava_date_title{height:1rem;line-height: 1.1rem;color: #0091ff;font-size: .35rem;text-indent: .3rem;}
  .hava_date_title.bg{background: #F5F5F5;}
  .select_box{
    width:100%;overflow: hidden;display: none;background: #fff;
    .btn_cont{
      width:100%;overflow: hidden;height:2rem;display: flex;justify-content: space-around;
      .submit_btn{margin:.5rem .3rem;}
    }
  }

  .select_box.show{display: block;}
  .goHome{width:1.2rem;height:1.4rem;position: absolute;left:0;top:0;}
  .get_away{ background: #F5F5F5;color:#0091ff;}
  .icons{display: block;width:2rem;height:2rem;margin:0 auto 0 auto;}
  .icons:before{font-size: 1.8rem;}
  .check_huise{background:#ccc !important;}
</style>
