<template>
  <div class="xfv-container">
    <step step="1"></step>
    <div class="xfv-from">
      <x-input v-model="formData.name" title="姓名" :disabled="formCtrl.name" placeholder="请输入您的姓名" placeholder-align="right" text-align="right" :readonly="true"></x-input>
      <x-input v-if="!filePhone" v-model="formData.idNo" title="身份证号码" :disabled="formCtrl.idNo" placeholder="请输入您的身份证号码" :show-clear="false" placeholder-align="right" text-align="right" :max="18" :readonly="true"></x-input>
      <cell v-if="filePhone" class="shfenColor" title="身份证号码" >{{formData.idNo | filtersIdcard}}</cell>
      <cell v-if="filePhone" class="shfenColor" title="联系手机" >{{formData.phoneNo | filtersPhone}}</cell>
      <x-input v-if="!filePhone" v-model="formData.phoneNo" title="联系手机" :disabled="formCtrl.phoneNo" placeholder="请输入11位手机号码" :show-clear="false" placeholder-align="right" type="tel" :max="11" text-align="right" ref="phoneNo" :readonly="inputRead"></x-input>
      <!--<x-input v-model="formData.phoneNo" title="联系手机" :disabled="formCtrl.phoneNo" placeholder="请输入11位手机号码" :show-clear="false" placeholder-align="right" type="text" :max="11" text-align="right" ref="phoneNo" :readonly="inputRead"></x-input>-->
<!--       <custom-selector placeholder="请选择性别" placedata="请选择性别" v-model="formData.sex" :disabled="seledisab" :isLink="showLink" describe="性别" :options="sexList" :isFirst="isFirst"></custom-selector> -->

     <cell v-model="formData.sex" class="shfenColor" title="性别" >{{formData.sexC}}</cell>

      <custom-selector v-model="formData.marry" :disabled="seledisab" :isLink="showLink" describe="婚姻状况" placedata="请选择婚姻状况" :options="marryList" :isFirst="isFirst"></custom-selector>
      <custom-selector v-model="formData.polity" :disabled="seledisab" :isLink="showLink" describe="政治面貌" placedata="请选择政治面貌" :options="polityList" :isFirst="isFirst"></custom-selector>
      <custom-selector v-model="formData.culture" :disabled="seledisab" :isLink="showLink" describe="文化程度" placedata="请选择文化程度" :options="cultureList" :isFirst="isFirst"></custom-selector>
      <custom-selector v-model="formData.armyserve" :disabled="seledisab" :isLink="showLink" describe="服兵役情况" placedata="请选择服兵役情况" :options="armyserveList" :isFirst="isFirst"></custom-selector>
    </div>

    <div class="xfv-from" v-if="isNativeFlag">
      <datetime :readonly="inputRead" class="address_cont" v-model="formData.comeDate" title="到达本地日期" :max-year="maxYear" :min-year="1900" ref="dateTime"></datetime>
      <custom-selector v-model="formData.comeReason" describe="来本市原因" placedata="请选择来本市原因" :options="comeReasonList" :isFirst="isFirst" :disabled="seledisab" :isLink="showLink"></custom-selector>
    </div>

    <!--<div v-transfer-dom>
      <confirm v-model="isShowConfirm" title="操作提示" @on-confirm="onConfirm">
        <p style="text-align:center;">请您核实所填信息是否正确，确认无误后再提交！</p>
      </confirm>
    </div>-->

    <div v-transfer-dom>
      <alert v-model="Alert.isShowAlert" title="" :hide-on-blur="true">
        <p style="text-align:center;">{{Alert.AlertText}}</p>
      </alert>
    </div>

    <div @click="goNext" v-if="nodeEnv === 'development'">下一步</div>
    <!--<div @click="goNext">下一步</div>-->
  </div>
</template>
<script type="text/javascript">
  import {XInput, XButton, Group, Cell, Icon, Datetime, Alert, Confirm, TransferDomDirective as TransferDom, Value2nameFilter as value2name} from 'vux';
  import Step from '../common/Step.vue';
  import customSelector from '../common/customSelector.vue';
  import api from '../../api/api';
  import { mapState } from 'vuex';
  export default {
    name: 'index',
    directives: {
      TransferDom
    },
    components: {XInput, XButton, Group, Cell, Icon, Datetime, Alert, Confirm, Step, customSelector},
    data () {
      return {
        isEdit: this.$route.query.isEdit || '0',  //  add: 新增, edit: 修改
        step:this.$route.query.isEdit,
        nodeEnv: 'development',
        isCover:false,
        isFirst: true, // 是否是第一次选择或输入
        isShowConfirm: false,
        isReback: true,  // 数据是否回填，主要为了解决数据回填时阻止五级联动触发事件
        readonly: true,
        inputRead:false,//数据回填后input设置不可填
        seledisab:false,//数据回填后custom-selector设置不可选
        showLink:true,//是否有右箭头，默认有
        filePhone:false,//手机号码显示格式
        isNativeFlag: false,
        comGuid: this.$route.params.comGuid,
        registerFlag: this.$route.query.registerFlag,
        formData: {
          alipayAcount: this.$route.params.alipayAcount,
          name: '',
          idNo: '',
          phoneNo: '',
          sex: '',
          sexC:'',
          marry: '', //婚姻状况
          polity: '', //政治面貌
          culture: '',   //文化程度,
          armyserve:'5',//服兵役情况
          comeDate: new Date().format('yyyy-MM-dd'), //到达本地日期
          comeReason: '',
          nativeFlag: this.$route.query.nativeFlag || '0' // 默认非户籍
        },
        formCtrl: {
          name: false,
          idNo: false,
          phoneNo: false,
          sex: false,
          sexC:'',
          marry: false, //婚姻状况
          polity: false, //政治面貌
          culture: false,   //文化程度,
          armyserve: false,   //文化程度,
          comeDate: false, //到达本地日期
          comeReason: false
        },
        Alert: {
          isShowAlert: false,
          confirmText: '',
          state: false //
        },
        inputValid: {
          cellPhone: (val) => {
            if (this.isFirst) return {valid: true}
            return {
              valid: this.$regExp.phone.test(val),
              msg: '手机号不合法！'
            }
          },
          address: () => {
            if (this.isFirst) {
              return false
            } else if (this.formData.address.indexOf('') != -1 || this.formData.address.indexOf('null') != -1) {
              return true
            }
          }
        },
        sexList: [],
        marryList: [],
        polityList: [],
        cultureList: [],
        armyserveList: [],
        comeReasonList: [],
        maxYear: new Date().getFullYear()
      }
    },
    computed: {
    },
    mounted () {
      
      this.getNativeFlag()
      this.setTitle();
      this.setOptionMenu();//右上角
      this.getNodeEnv();
      this.getDictionary();
      this.getAlipayInfo();
      //this.getRegisterFlag();
      console.log('isEdit',this.isEdit)
    },
    filters: {
      filtersIdcard(val) {
        return `${val.substr(0, 6)}********${val.substr(val.length - 4)}`
      },
      filtersPhone(val) {
        return `${val.substr(0, 3)}****${val.substr(val.length - 4)}`
      }
    },
    methods: {
      getNativeFlag () {
        if (this.formData.nativeFlag == '0') {
          this.isNativeFlag = true;
        } else {
          this.isNativeFlag = false;
        }
      },
      getNodeEnv () {
        return this.nodeEnv = process.env.NODE_ENV;
      },
      setTitle (data) {
        if(this.formData.nativeFlag == 1){
          if (window.AlipayJSBridge) AlipayJSBridge.call('setTitle', {title: '户籍居住登记'})
        } else {
          if (window.AlipayJSBridge) AlipayJSBridge.call('setTitle', {title: '非户籍居住登记'})
        }
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
      goNext () {
        this.$Utils.inputBlur();
//        this.$router.push({path:`/step2/440921198511151273`});
        this.isFirst = false
        const validate = this.validate()
        if (!validate.valid) {
          this.Alert.state = true
          this.Alert.isShowAlert = !this.Alert.isShowAlert
        } else {
          this.onConfirm22();
        }
      },
      onConfirm22 () {  // 确认
        this.$store.commit('UPDATE_LOADING', true);
        api.saveResideInfo({
          formData: this.formData,
          homeType: 'lsns_',  // 南沙区域标记
          isRegister: 1,
          isEdit: this.isEdit
        }).then(res => {
          this.$store.commit('UPDATE_LOADING', false);
          if(res.data.success) {
            const query = {
              isEdit: this.isEdit,
              comGuid: this.$route.params.comGuid,
              openid:this.$route.params.alipayAcount,
              registerFlag: this.registerFlag,
              nativeFlag: this.formData.nativeFlag
            }
            this.$router.push({path:`/step2/${this.formData.idNo}`, query});
          }
        }).catch(() => {
          this.$store.commit('UPDATE_LOADING', false);
        })
      },
      validate () { // 校验表单
        let valid = false;
        let errorMsg = '';
        if (!this.formData.name) { // 姓名
          errorMsg = '姓名不能为空！';
        } else if (!this.formData.idNo) { //
          errorMsg = '身份证号码不能为空！'
        } else if (!this.$regExp.cardID.test(this.formData.idNo)) { //
          errorMsg = '身份证号码格式不正确，请检查重新填写！'
        } else if (!this.formData.phoneNo) { // 手机号码
          errorMsg = '手机号码不能为空！'
        } else if (!this.$Utils.isPhone(this.formData.phoneNo)) {
          errorMsg = '手机号码格式不正确，请检查重新填写！'
        } else if (!this.formData.sex) { // 性别
          errorMsg = '请选择性别！'
        } else if (!this.formData.marry) { // 婚姻状况
          errorMsg = '请选择婚姻状况！'
        } else if (!this.formData.polity) { // 政治面貌
          errorMsg = '请选择政治面貌！'
        } else if (!this.formData.culture) { // 文化程度
          errorMsg = '请选择文化程度！'
        } else if (this.isNativeFlag && !this.formData.comeDate) { // 到达本地日期
          errorMsg = '请选择到达本地日期！'
        } else if (this.isNativeFlag && !this.formData.comeReason) { // 来本市原因
          errorMsg = '请选择来本市原因！'
        } else {
          valid = true
          errorMsg = ''
        }
        this.Alert.AlertText = errorMsg;
        return {valid, errorMsg}
      },
      setFormCtrl (item) {
        var ctrl = this.formCtrl;
        for (var i in ctrl) {
          if (i === item) {
            ctrl[i] = false;
          } else {
            ctrl[i] = true;
          }
        }
      },
      getDictionary(){  // 获取所有的字典
        const addressList = JSON.parse(localStorage.getItem('addressList'));
        this.sexList = this.$Utils.getLocalStorage('XB');
        this.marryList = this.$Utils.getLocalStorage('HYZK');
        this.cultureList = this.$Utils.getLocalStorage('WHCD');
        this.armyserveList = this.$Utils.getLocalStorage('FBY');
        this.polityList = this.$Utils.getLocalStorage('ZZMM');
        this.comeReasonList = this.$Utils.getLocalStorage('LBSYY');
      },
      getAlipayInfo () {
        this.$store.commit('UPDATE_LOADING', true);
        api.getUserDetails(this.comGuid).then(res => {
          this.$store.commit('UPDATE_LOADING', false);
          const attributes = res.data.attributes;
          const data = res.data.obj;
          if(res.data.success){
            this.formData.name = data.realname ? data.realname : '';
            this.formData.idNo = data.idcard ? data.idcard : '';
            this.getPeopleInfo();
            this.$emit('UPDATE_ID_NO', this.formData.idNo)
//            this.formData.sex = data.sex
            // if (parseInt(this.formData.idNo.substr(16, 1)) % 2 == 1) {
            //   this.formData.sex = '1'
            // } else {
            //   this.formData.sex = '2'
            // }

            let _idcard = this.formData.idNo
            let _sex
            if(_idcard.length > 15){
              _sex = _idcard.charAt(_idcard.length - 2)
              if(_sex % 2 ==0){
                this.formData.sex  = 2
                this.formData.sexC = '女'
              } 
              else{
                this.formData.sex  = 1
                this.formData.sexC = '男'                
              }
                console.log("===>" +this.formData.sex)
            }else{
              _sex =  _idcard.charAt(_idcard.length-1)
               console.log("===>" +this.formData.sex)
              if(_sex % 2 ==0){
                this.formData.sex  = 2
                this.formData.sexC = '女'
              } 
              else{
                this.formData.sex  = 1
                this.formData.sexC = '男'                
              }
            }


            this.formData.birthday = moment(data.birthday).format("YYYY-MM-DD");
            this.formData.nation = data.nation ? data.nation : ''; // 民族
            this.formData.phoneNo = data.linkphone ? data.linkphone : '';
            this.$store.commit('UPDATE_ID_NO',data.idcard);  // 保存用户的身份证号，在居住证办理时会用到
          }
        }).catch((res) => {
          this.$store.commit('UPDATE_LOADING', false);
          this.isReback = false
        })
      },
      getPeopleInfo () {
        this.$store.commit('UPDATE_LOADING', true);
        api.rebackPeopleInfo({idCard:this.formData.idNo,isEdit:this.isEdit,step:this.step}).then((res) => {
          const data = res.data.jsonRes[0]
          if(res.data.success){
            if(data.registerFlag == 3){
              this.inputRead = true;
              this.seledisab = true;
              this.showLink = false;
              this.filePhone = true;
            }

            this.$store.commit('UPDATE_LOADING', false);
            this.formData.phoneNo = data.phoneNo ? data.phoneNo : '';
            this.formData.marry = data.marry ? data.marry : '';
            this.formData.polity = data.polity ? data.polity : '';
            this.formData.culture = data.culture ? data.culture : '';
            this.formData.armyserve = data.armyserve ? data.armyserve : '';
            this.formData.comeDate = data.comeDate ? data.comeDate : '';
            this.formData.comeReason = data.comeReason ? data.comeReason : '';
//            this.formData.nativeFlag = data.nativeFlag || '0';
            this.getNativeFlag();
          }
        }).catch(() => {
          this.$store.commit('UPDATE_LOADING', false);
        })
      }
    },
    destroyed () {
      this.removeOptionMenu();
    }
  }
</script>
