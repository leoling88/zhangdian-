<template>
  <div class="xfv-container">
    <step step="2"></step>
    <div class="xfv-from">
      <div class="address_cont rightSan">
         <x-address class="address_list" title="派出所/社区" v-model="formData.address" :list="addressList"  placeholder = "请输入派出所/社区" @on-shadow-change="areaChange" :disabled="seledisab"></x-address>
          <span v-if="formData.address.length > 0" class="subAddress">{{formData.subAddress}}</span>
      </div>

      <template>
        <cell v-if="inputRead" class="address_detail" title="街路巷" :value="formData.roomNumberName"></cell>
        <div v-show="!inputRead" class="address_detail_cont">
          <x-textarea v-model="formData.roomNumberName" title="街路巷" placeholder="请输入街路巷" :rows="1" :autosize="true" :readonly="inputRead" @on-change="tareaChange" ref="userTarea"></x-textarea>
          <AMap v-model="formData.mapAddress" :areaName="formData.areaName" @change="amapChange" ref="AMap"></AMap>
        </div>

        <x-input v-model="formData.doorNumberName" title="门楼牌号" placeholder="请输入门楼牌号" :show-clear="false" placeholder-align="right" text-align="right" :readonly="inputRead"></x-input>
      </template>

      <custom-selector v-model="formData.houseType" placedata="请选择住所类别" describe="住所类别" :options="houseTypeList" :isFirst="isFirst" :disabled="seledisab" :isLink="showLink" @input="getFd"></custom-selector>
      <!--444-->
      <div v-if="fdShow" class="fdclass">
        <x-input v-model="formData.landlordName" title="房东姓名" placeholder="请输入房东姓名" :show-clear="false" placeholder-align="right" text-align="right" :readonly="inputRead"></x-input>
        <x-input v-model="formData.landlordPhone" title="房东联系电话" placeholder="请输入房东联系电话" :show-clear="false" placeholder-align="right" text-align="right" :readonly="inputRead" type="tel" :max="11"></x-input>
        <x-input v-model="formData.landlordIdCard" title="房东身份证号" placeholder="请输入房东身份证号" :show-clear="false" placeholder-align="right" text-align="right" :readonly="inputRead" :min="15" :max="18"></x-input>
      </div>
      <span v-if="isNativeFlag">
        <custom-selector v-model="formData.reson" describe="居住事由" placedata="请选择居住事由" :options="resonList" :isFirst="isFirst" :disabled="seledisab" :isLink="showLink"></custom-selector>
        <custom-selector v-model="formData.term" describe="居住期限" placedata="请选择居住期限" :options="termList" :isFirst="isFirst" :disabled="seledisab" :isLink="showLink"></custom-selector>
      </span>
    </div>

    <div class="xfv-from">
      <custom-selector v-model="formData.hasJob" placedata="请选择工作单位" describe="有无工作单位" :options="jobList" :isFirst="isFirst" @input="getJob" :disabled="seledisab" :isLink="showLink"></custom-selector>
      <x-input v-model="formData.workCompany" title="工作单位" placeholder="请输入工作单位" :show-clear="false" placeholder-align="right" text-align="right" v-if="isJob" :readonly="inputRead"></x-input>
      <custom-selector  v-model="formData.companyPolice" describe="单位所属派出所" placedata="请选择单位所属派出所" :options="pcsList" :isFirst="isFirst" v-if="isJob" :disabled="seledisab" :isLink="showLink"></custom-selector>  <!-- 改 v-if="isJob"  by leoLing --> 

    </div>

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
  import {XInput, XTextarea, XButton, Group, Cell, Icon, Datetime, Alert, Confirm, TransferDomDirective as TransferDom, XAddress,Value2nameFilter as value2name} from 'vux';
  import Step from '../common/Step.vue';
  import AMap from '../common/AMap.vue'
  import customSelector from '../common/customSelector.vue'
  import api from '../../api/api'
  import { mapGetters } from "vuex";
  export default {
    name: 'index',
    directives: {
      TransferDom
    },
    components: {XInput, XTextarea, XButton, Group,XAddress, Cell, Icon, Datetime, Alert, Confirm, Step, customSelector, AMap},
    data () {
      return {
        isEdit: this.$route.query.isEdit || '0',  //  add: 新增, edit: 修改
        step:this.$route.query.isEdit,
        nodeEnv: 'development',
        fdShow:false,
        scrollTop:'',
        isCover:false,
        showloading: false,
        isLockY: false,
        isFirst: true, // 是否是第一次选择或输入
        isShowConfirm: false,
        isReback: true,  // 数据是否回填，主要为了解决数据回填时阻止五级联动触发事件
        showLoading: true,
        readonly: true,
        inputRead:false,//数据回填后input设置不可填
        seledisab:false,//数据回填后custom-selector设置不可选
        showLink:true,//是否有右箭头，默认有
        isJob: false,
        isNativeFlag: false,
        registerFlag: this.$route.query.registerFlag,
        nativeFlag:  this.$route.query.nativeFlag || '0', // 默认非户籍
        pullupConfig:{
          content: '',
          pullUpHeight: 30,
          height: 40,
          autoRefresh: false,
          downContent: '',
          upContent: '',
          loadingContent: '',
          clsPrefix: 'xs-plugin-pullup-'
        },
        formData: {
          idNo: this.$route.params.idNo,
          subAddress: '',
          address: [],
          areaName: '',
          roomNumberName: '',
          mapAddress: '',
          houseType: '', //住所类别
          reson: '', //居住事由
          term: '',   //居住期限,
          hasJob: '',
          workCompany: '',  //工作单位
          doorNumberName:'',
          landlordName:'',
          landlordPhone:'',
          landlordIdCard:'',
          companyPolice: ''
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
          }
        },
        sexList: [
          { key: '01', value: '城镇' },
          { key: '02', value: '农村' }
        ],
        resonList: [],
        houseTypeList: [],
        addressList: [],
        pcsList: [],
        termList: [{
          key: 1,
          value: '1月以内'
        },{
          key: 2,
          value: '1月至1年'
        },{
          key: 3,
          value: '1年以上'
        }],
        jobList: [{
          key: '1',
          value: '有'
        },{
          key: '0',
          value: '无'
        }],
        companyPoliceList: [],
        maxYear: new Date().getFullYear(),
      }
    },
    created () {
      this.getDictionary();
      this.getPeopleInfo();
    },
    mounted () {
      this.setTitle();
      this.setOptionMenu();
      this.getNodeEnv();
//      this.queryForPolice();

    },
    methods: {
      tareaChange(val){
        let that = this;
        this.$nextTick(function () {
          that.$refs.userTarea.updateAutosize()
        });
      },
      areaChange (ids, names) {
        this.formData.areaName = names.toString().replace(/\,/g,'')
        let  _address = ['37030301','3703030102','370303010201']
        if(this.formData.address.length < 3 ){this.formData.address = _address}
        this.formData.subAddress = value2name(['', '', ids[2]], this.addressList)
      },
      amapChange (item, index) {
        if (index == 0) {
          this.formData.roomNumberName = item.address
        } else {
          this.formData.roomNumberName = item.address + item.name
        }

      },
      getNodeEnv () {
        return this.nodeEnv = process.env.NODE_ENV;
      },
      getNativeFlag () {
        if (this.nativeFlag == 0) {
          this.isNativeFlag = true;
          this.formData.nativeFlag = '0';
        } else {
          this.isNativeFlag = false;
          this.formData.nativeFlag = '1';
        }
      },
      setTitle () {
        if(this.nativeFlag == 1) {
          if (window.AlipayJSBridge) AlipayJSBridge.call('setTitle', {title: '户籍居住登记'})
        }else if(this.nativeFlag == 0){
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
        if (window.AlipayJSBridge) {
          document.removeEventListener('optionMenu', this.goNext, false);
        }
      },
      goNext () {
        this.$Utils.inputBlur();
        this.$Utils.textareaBlur();
        this.isFirst = false
        const validate = this.validate()
        if (!validate.valid) {
          this.Alert.state = true
          this.Alert.isShowAlert = !this.Alert.isShowAlert
        } else {
          this.onConfirm();
        }
        if (this.$refs.AMap.show) this.$refs.AMap.closePopup()
      },
      queryForPolice(){
        api.queryForPolice({
        }).then(res => {
          console.log(res);
        })
      },
      onConfirm () {  // 确认

        this.formData.roomNumberName = this.formData.roomNumberName.replace(/#/g,encodeURIComponent('#'));
        this.formData.workCompany = this.formData.workCompany.replace(/#/g,encodeURIComponent('#'));
        this.formData.doorNumberName = this.formData.doorNumberName.replace(/#/g,encodeURIComponent('#'));
        api.saveResideInfo({
          formData: this.formData,
          homeType: 'lsns_',  // 南沙区域标记
          isRegister: 2,
          isEdit: this.isEdit
        }).then(res => {
          this.$store.commit('UPDATE_LOADING', false);
          if(res.data.success) {
            const query = {
              isEdit: this.isEdit,
              comGuid: this.$route.query.comGuid,
              openid:this.$route.query.openid,
              registerFlag: this.registerFlag,
              nativeFlag: this.nativeFlag
            }
            this.$router.push({path:`/step3/${this.formData.idNo}`, query});
          }
        }).catch(() => {
          this.$store.commit('UPDATE_LOADING', false);
        })
      },
      validate () { // 校验表单
        let valid = false;
        let errorMsg = '';
        if (this.formData.address.length < 0 || this.formData.address == '') { // 派出所社区
          errorMsg = '请选择派出所/社区！'
        } else if (!this.formData.roomNumberName) { // 街路巷
          errorMsg = '街路巷不能为空！'
        }else if ( !this.formData.doorNumberName) { // 门楼牌号
          errorMsg = '门楼牌号不能为空！'
        } else if (!this.formData.houseType) { // 住所类别
          errorMsg = '请选择住所类别！'
        } else if (this.formData.landlordPhone && (!this.$Utils.isPhone(this.formData.landlordPhone))) {
          errorMsg = '房东联系电话格式不正确，请检查重新填写！'
        } else if (this.formData.landlordIdCard && (!this.$regExp.cardID.test(this.formData.landlordIdCard))) {
          errorMsg = '房东身份证号格式不正确，请检查重新填写！'
        } else if (this.isNativeFlag && !this.formData.reson) { // 居住事由
          errorMsg = '请选择居住事由！'
        } else if (this.isNativeFlag && !this.formData.term) {
          errorMsg = '请选择居住期限！'
        } else if (!this.formData.hasJob) {
          errorMsg = '请选择居住地有无工作单位！'
        } else if (this.isJob && !this.formData.workCompany) { // 工作单位
          errorMsg = '工作单位不能为空！'
        } else if (this.isJob && !this.formData.companyPolice && this.isNativeFlag) {
          errorMsg = '请选择单位所属派出所！'
        } else {
          valid = true
          errorMsg = ''
        }
        this.Alert.AlertText = errorMsg;
        return {valid, errorMsg}
      },
      getDictionary(){ // 获取所有的字典
        this.resonList = this.$Utils.getLocalStorage('ZZSY');
        this.houseTypeList = this.$Utils.getLocalStorage('ZZDXZ');
        this.pcsList = this.$Utils.getLocalStorage('pcsList');
        this.addressList = this.$Utils.getLocalStorage('addressList');
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
            }
            
            this.$store.commit('UPDATE_LOADING', false);
            this.formData.address = data.address.replace(/\\\\/g, '').split(',') ;
            this.formData.roomNumberName = data.roomNumberName || '';
            this.formData.houseType = data.houseType ? data.houseType : '';
            this.formData.reson = data.reson ? data.reson : '';
            this.formData.term = data.term ? data.term : '';
            this.formData.hasJob = data.hasJob ? data.hasJob : '';
            this.formData.workCompany = data.workCompany ? data.workCompany : '';
            this.formData.landlordName = data.landlordName ? data.landlordName : '';
            this.formData.landlordPhone = data.landlordPhone ? data.landlordPhone : '';
            this.formData.landlordIdCard = data.landlordIdCard ? data.landlordIdCard : '';
            this.formData.doorNumberName = data.doorNumberName ? data.doorNumberName : '';
            this.formData.companyPolice = data.companyPolice ? data.companyPolice : '';
            this.formData.nativeFlag = data.nativeFlag || '0';
            this.getNativeFlag();//此项应写在mounted里面，写在这里对本机单页面调试有影响(居住事由,居住期限不显示)
            this.getJob(this.formData.hasJob);
            this.getFd(this.formData.houseType);
          }
        }).catch(() => {
          this.$store.commit('UPDATE_LOADING', false);
        })
      },
      getJob (key, value) {
        console.log(key,value)
        if (key == '1') {
          this.isJob = true;
        } else {
          this.isJob = false;
          this.formData.workCompany = '';
          this.formData.companyPolice = '';
        }
      },
      getFd (key, value) {
        if (key == '5') {
          this.fdShow = true;
        } else {
          this.fdShow = false;
          this.formData.landlordName = '';
          this.formData.landlordPhone = '';
          this.formData.landlordIdCard = '';
        }
      },
      infinite() { // 上拉加载
        this.pageIndex ++;
        this.getNewSList(this.pageIndex, this.newsType);
      },
      getStringByteLength (str) {   // 获取字符串字节长度
        var Zhlength=0;   // 全角
        var Enlength=0;   // 半角

        for(var i=0;i<str.length;i++){
          if(str.substring(i, i + 1).match(/[^\x00-\xff]/ig) != null)
            Zhlength+=1;
          else
            Enlength+=1;
        }
        return Zhlength*2 + Enlength
      }
    },
    destroyed () {
      this.removeOptionMenu();
    }
  }
</script>
<style scoped>
  .xfv-from .weui-cell{height:auto;}
  .fdclass{position:relative;}
  .fdclass:before{content: " ";position: absolute;left: 0;top: 0;right: 0;height: 1px;border-top: 1px solid #D9D9D9;color: #D9D9D9;transform-origin: 0 0;transform: scaleY(0.5);left: 0px;}

</style>
<!--<style>-->
  <!--.rightSan .vux-cell-primary:after{content: " ";-->
    <!--display: inline-block;-->
    <!--height: 6px;-->
    <!--width: 6px;-->
    <!--border-width: 2px 2px 0 0;-->
    <!--border-color: #C8C8CD;-->
    <!--border-style: solid;-->
    <!--transform: rotate(45deg);-->
    <!-- -webkit-transform: rotate(45deg);-->
    <!--position: absolute;-->
    <!--top: 50%;-->
    <!--margin-top: -4px;-->
    <!--right: .23rem;}-->
  <!--.rightSan .weui-cell_access .weui-cell__ft:after{content:normal !important;}-->
<!--</style>-->
