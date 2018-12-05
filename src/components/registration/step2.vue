<template>
  <div class="xfv-container">
    <step step="2"></step>
    <div class="xfv-from">
      <div class="address_cont rightSan"> <!-- -->
         <x-address class="address_list" title="派出所/社区" v-model="formData.address" :list="addressList"  placeholder = "请输入派出所/社区" @on-shadow-change="areaChange"  :disabled="seledisab"></x-address>
          <span v-if="formData.address.length > 0" class="subAddress">{{formData.subAddress}}</span>
      </div>

      <selectingle :selectDatas = "selectJDX"  @optionclick="JDXClick" @selectshow="selectShow2" @searchlist = "searchListValue"  :isFirst="isFirst" >
        <span slot='label'>街道巷</span>
        <span slot='value'>{{formData.streetAlleysName}}</span>
      </selectingle>
      <selectingle :selectDatas = "selectDoor"  @optionclick="DoorClick" @selectshow="selectShow3" @searchlist = "searchListValue" :isFirst="isFirst" :disabled="seledisab" @setnewaddress="setnewaddress" >
        <span slot='label'>门牌号</span>
        <span slot='value'>{{selectDoor.doorNumberName}}</span>
      </selectingle>
      <selectingle :selectDatas = "selectRoom"  @optionclick="RoomClick" @selectshow="selectShow4" @searchlist = "searchListValue" disabled="seledisab"  @setnewaddress="setnewaddress">
        <span slot='label'>房号</span>
        <span slot='value'>{{selectRoom.roomNumberName}}</span>
      </selectingle>

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
  import selectmultiterm from '../common/Address1.vue'
  import selectingle  from '../common/Address2.vue'
  import customSelector from '../common/customSelector.vue'
  import api from '../../api/api'
  import { mapGetters } from "vuex";
  import people from '../../api/123.json';
  export default {
    name: 'index',
    directives: {
      TransferDom
    },
    components: {XInput, XTextarea, XButton, Group,XAddress, Cell, Icon, Datetime, Alert, Confirm, Step, customSelector, selectmultiterm, selectingle},
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
        areaType:'4,5,6',    //获取城市地址类型
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
          areaName: '',
          mapAddress: '',
          houseType: '', //住所类别
          reson: '', //居住事由
          term: '',   //居住期限,
          hasJob: '',
          workCompany: '',  //工作单位
          landlordName:'',
          landlordPhone:'',
          landlordIdCard:'',
          companyPolice: '',
          address:[],//[街镇，派出所，社区]编码
          adName:[],//[街镇，派出所，社区]名称
          streetAlleysCode:'',// 街道巷编码
          streetAlleysName:'',// 街道巷名称
          doorNumberCode:'',//  门牌号
          doorNumberName:'',// 门牌号名称
          roomNumberCode:'',// 房号
          roomNumberName:'',//房号名称
        },
        selectStype:{
          sqCod:'',
          isFirst: 0//

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
        addressList:[],
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
        select1:{     //下拉选择1
          submitData:[
            {
              key:'370303003',
              value:'',
              hover:''
            },
            {
              key:'37030300302',
              value:'',
              hover:''
            },
            {
              key:'',
              value:'',
              hover:''
            },

          ],
          seledisab: true,
          pass:true,           
          liststData:[],
          show: false,
          value:'',
        },
        selectJDX:{     //下拉选择街道其  
          submitData:{
            key:'',
            value:'',
            hover:''
          },
          addAddressVal:'', //手动增加地址
          searchVal:'',
          show: false,
          value:'',
          pass:true,
          liststData:[],
          seledisab: true, 
          listShow: true,  // 显示列表 用于点击添加时
          addInpuBut: false,  // 用于显示添加新地址按钮
        },
        selectDoor:{     //下拉选择街道其
          submitData:{
              key:'',
              value:'',
              hover:''
          },
          addInpuBut: true,  // 用于显示添加新地址按钮
          addAddressVal:'', //手动增加地址
          liststData:[],
          searchVal:'',
          show: false,
          value:'',
          pass:true,
          seledisab: true,  
          listShow: true  // 显示列表 用于点击添加时 
        },
        selectRoom:{     //下拉选择街道其
          submitData:{
            key:'',
            value:'',
            hover:''
          },
          addInpuBut: true,  // 用于显示添加新地址按钮
          addAddressVal:'', //手动增加地址
          liststData:[],
          searchVal:'',
          show: false,
          value:'',
          pass:true ,
          seledisab: true,  
          listShow: true  // 显示列表 用于点击添加时
        },
      }
    },
    created () {
      this.getDictionary();
      this.getPeopleInfo();
      // console.log(this.addressList)
      this.getAddressDatas()
    },
    mounted () {
      this.setTitle();
      this.setOptionMenu();
      this.getNodeEnv();
      this.queryForPolice();
      this.getJDXDatas()

    },
    methods: {


      areaChange (ids, names) {
        // this.formData.areaName = names.toString().replace(/\,/g,'')
        let  _address = ['37030301','3703030102','370303010201']
        if(this.formData.address.length < 3 ){this.formData.address = _address}
        this.formData.address = ids
        this.formData.adName = names
        this.formData.subAddress = value2name([ids[0], ids[1], ids[2]], this.addressList)
        this.selectStype.sqCod =  ids[2]



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
        // if (this.$refs.AMap.show) this.$refs.AMap.closePopup()
      },
      queryForPolice(){
        api.queryForPolice({
        }).then(res => {
          console.log(res);
        })
      },
      selectsHide () {
        let  errorMsg
        if (this.formData.address.length < 3 ){
          this.select1.show = false

        }else {
          if(!this.select1.submitData[0].key){
            errorMsg = '请选择街道'
          }else if(!this.select1.submitData[1].key){
            errorMsg = '请选择派出所'
          }else if(!this.select1.submitData[2].key){
            errorMsg = '请选择社区'
          }
          this.Alert.isShowAlert = true
          this.Alert.AlertText = errorMsg;    
        }

      },
      onConfirm () {  // 确认

        // this.formData.roomNumberName = this.formData.roomNumberName.replace(/#/g,encodeURIComponent('#'));
        // this.formData.workCompany = this.formData.workCompany.replace(/#/g,encodeURIComponent('#'));
        // this.formData.doorNumberName = this.formData.doorNumberName.replace(/#/g,encodeURIComponent('#'));
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
        }
        //  else if (!this.formData.roomNumberName) { // 街路巷
        //   errorMsg = '房号不能为空！'
        // }
        else if ( !this.formData.doorNumberName) { // 门楼牌号
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
        // this.addressList = this.$Utils.getLocalStorage('addressList');
      },
      getPeopleInfo () {
        //this.$store.commit('UPDATE_LOADING', true);
        api.rebackPeopleInfo({idCard:this.formData.idNo,isEdit:this.isEdit,step:this.step}).then((res) => {
          const data = res.data.jsonRes[0]
          if(res.data.success){
            if(data.registerFlag == 3){    //
              this.inputRead = true;
              this.seledisab = true;
              this.showLink = false;
              this.selectRoom.seledisab = false
              this.selectJDX.seledisab = false
              this.selectDoor.seledisab = false
            }
            this.$store.commit('UPDATE_LOADING', false);
            this.formData.address = data.address.replace(/\\\\/g, '').split(',') ;
            this.formData.roomNumberName = data.roomNumberName || '';
            this.formData.houseType = data.houseType ? data.houseType : '';
            this.formData.reson = data.reson ? data.reson : '';
            this.formData.term = data.term ? data.term : '';
            this.selectJDX.submitData.name = data.streetAlleysName;
            this.selectDoor.submitData.name = data.doorNumberName;
            this.selectRoom.submitData.name = data.roomNumberName;
            this.formData.hasJob = data.hasJob ? data.hasJob : '';
            this.formData.workCompany = data.workCompany ? data.workCompany : '';
            this.formData.landlordName = data.landlordName ? data.landlordName : '';
            this.formData.landlordPhone = data.landlordPhone ? data.landlordPhone : '';
            this.formData.landlordIdCard = data.landlordIdCard ? data.landlordIdCard : '';
            this.formData.doorNumberName = data.doorNumberName ? data.doorNumberName : '';
            this.formData.companyPolice = data.companyPolice ? data.companyPolice : '';
            this.formData.nativeFlag = data.nativeFlag || '0';
            this.formData.streetAlleysCode = data.streetAlleysCode;
            this.formData.doorNumberCode = data.doorNumberCode;
            this.formData.roomNumberCode = data.roomNumberCode;
            this.formData.streetAlleysName = data.streetAlleysName
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
      },
      // selectShow() {
      //   this.select1.show = true
      // },
      selectShow2() {

        if(this.selectJDX.seledisab){
          if(this.formData.address.length < 3 ){
            this.Alert.isShowAlert = true
            this.Alert.AlertText = '请先选择上一级';           
          }else{
            this.selectJDX.show = true
            this.getJDXDatas()              
          }             
        }      
       


      },
      selectShow3() {
        if(this.selectDoor.seledisab){
          if(!this.formData.streetAlleysName){
            this.Alert.isShowAlert = true
            this.Alert.AlertText = '请先选择上一级';           
          }else{
            this.selectDoor.show = true
            this.getDoorDatas()            
          }          
        }

      },
      selectShow4() {
        if(this.selectDoor.seledisab){
          if(!this.formData.doorNumberName){
            this.Alert.isShowAlert = true
            this.Alert.AlertText = '请先选择上一级';           
          }else{
            this.selectRoom.show = true
            this.getRoomDatas()            
          }          
        }

      },      

      JDXClick() {
        this.formData.streetAlleysName = this.selectJDX.submitData.name
        this.formData.streetAlleysCode = this.selectJDX.submitData.value
        this.selectDoor.submitData = {key:'',value:'',hover:''}
        this.selectRoom.submitData = {key:'',value:'',hover:''}
        this.formData.doorNumberCode =''
        this.formData.doorNumberName =''
        this.formData.roomNumberCode =''
        this.formData.roomNumberName =''
      },
      DoorClick(){
        this.formData.doorNumberName = this.selectDoor.submitData.name
        this.formData.doorNumberCode = this.selectDoor.submitData.value
        this.selectRoom.submitData = {key:'',value:'',hover:''}
        this.formData.roomNumberCode =''
        this.formData.roomNumberName =''
      },
      RoomClick(){
        this.formData.roomNumberName = this.selectRoom.submitData.name
        this.formData.roomNumberCode = this.selectRoom.submitData.value

      },      
      getAddressDatas() {       //社区派出所字典
        this.areaType = '4,5,6'
        api.querySSQPDatas(this.areaType,'').then((res) => {
          const _data = res.data.obj
          if(res.data.success){
            this.addressList =  res.data.obj
          }
          console.log(this.addressList)
        });

      },
      getJDXDatas () {     //街道巷
        this.selectJDX.pass = true
        this.areaType = 7
        api.querySSQPDatas(this.areaType,this.formData.address[2]).then((res) => {
          const _data = res.data.obj
          if(res.data.success){
            if(_data.length > 0){
              this.selectJDX.liststData =  res.data.obj

            }else {

            }
            console.log(this.selectJDX.liststData)
            this.selectJDX.pass = false
          }

        });                
      },
      searchListValue() {
        let _str 
        let _data 
        if(this.areaType == 7) {
          _str =  this.selectJDX.searchVal
          _data = this.selectJDX.liststData 
        }else if(this.areaType == 8){
          _str =  this.selectDoor.searchVal
          _data = this.selectDoor.liststData

        }else if(this.areaType == 9){
          _str =  this.selectRoom.searchVal
          _data = this.selectRoom.liststData

        }
        if(_str != ''){
          for (var i = 0; i < _data.length; i ++){
            let _value = _data[i].name
            if(_value.indexOf(_str)>-1 ){

            }else{


            }

          }
          console.log(this.selectJDX.liststData)
        }
      },
      getDoorDatas () {     //门牌号
        
        this.areaType = 8
        if(this.selectDoor.listShow ){ //如果是不是手动输入时请求接口
          api.querySSQPDatas(this.areaType, this.formData.streetAlleysCode).then((res) => {
            const _data = res.data.obj
            this.selectDoor.pass = true
            if(res.data.success){
              console.log( res.data.obj)
              this.selectDoor.liststData = res.data.obj
              this.selectDoor.pass = false
            }
          });           
        }
       
      },
      getRoomDatas () {    //房号
        this.areaType = 9
        if(this.selectRoom.listShow ){ //如果是不是手动输入时请求接口
          api.querySSQPDatas(this.areaType,this.formData.doorNumberCode).then((res) => {
            const _data = res.data.obj
            this.selectRoom.pass = true
            if(res.data.success){
              this.selectRoom.liststData = res.data.obj
              this.selectRoom.pass = false
            }
          });
        }else{
          this.selectRoom.pass = false
        }        
      },
      selectHide () {   //确定并闭选择窗口
        this.select1.show = false
      },
      setnewaddress() {
        if(this.areaType == 8){
          this.formData.doorNumberName = this.selectDoor.addAddressVal    //将手动添加值添加到提交数据
          console.log(this.formData.doorNumberName) 
          this.formData.doorNumberCode = '10000'
          this.selectRoom.listShow = false   //去掉下一级列表
        }else if(this.areaType == 9){
          this.formData.roomNumberName  =  this.selectRoom.addAddressVal   //将手动添加值添加到提交数据 
          this.formData.roomNumberCode = '10000'

        }
      }

    },
    destroyed () {
      this.removeOptionMenu();
    },
    watch: {
     'selectStype.sqCod': {
        handler(newName, oldName) {
          console.log(newName + '---'+oldName +'--' +this.selectStype.isFirst)
          if(newName != oldName){
            if(this.selectStype.isFirst < 2){
              this.selectStype.isFirst ++
            }else{
              this.formData.streetAlleysCode =''
              this.formData.streetAlleysName =''
              this.formData.doorNumberCode =''
              this.formData.doorNumberName =''
              this.formData.roomNumberCode =''
              this.formData.roomNumberName ='' 
              this.selectJDX.submitData.name = ''  
              this.selectDoor.submitData.name = ''
              this.selectRoom.submitData.name = ''                
            }
          }
        // ...
      },
      deep: true,
      immediate: true
      }
    },
    computed: {

    }

  }
</script>
<style >
  .xfv-from .weui-cell{height:auto;}
  .fdclass{position:relative;}
  .fdclass:before{content: " ";position: absolute;left: 0;top: 0;right: 0;height: 1px;border-top: 1px solid #D9D9D9;color: #D9D9D9;transform-origin: 0 0;transform: scaleY(0.5);left: 0px;}
.select-1-tab{min-height:.5rem;padding:.25rem;position:relative;border-top:.005rem solid #d9d9d9;overflow:hidden;}
.select-1-tab .text{display:inline-table;max-width:4.5rem;}
.select-bg{width:100%;height:100%;position: fixed;top:0;left:0;opacity:.6; background:#000;z-index:10;}
.color-1{color:#000;}
.color-2{color:#ccc;}
.select-show{width:100%;height:11rem; position: fixed;bottom:0;left:0;z-index:11;background:#fff;overflow:hidden;}
.select-show .title{padding:.2rem;font-size:.3rem;background:#eee; position: relative;}
.select-show .selcet{background:#fff;max-height:15rem;overflow-y:auto;padding:0 .1rem;}
.select-show .selcet ul{max-height:7rem;overflow-y:auto;}
.select-show .selcet li{padding:.1rem;font-size:.26rem;}
.select-show .option-bor li{padding:.2rem;font-size:.3rem;border-bottom:.01rem solid #ccc;}
.select-show .selcet li .icon{float:left;display: block;width:1rem;height:1rem;margin-top:.1rem;margin-right:.5rem;border:.02rem solid #ccc;border-radius:50%;}
.select-show .selcet li .icon i{display:block;width:.5rem;height:.5rem;margin:.25rem auto;border-radius:50%;background:#ccc;}
.select-show .selcet li.hover{color:#008DEE;}
.select-show .selcet li.hide{display:none;}
.select-show .selcet .ul0{height:6rem;margin:0 .2%;overflow-y: auto;}
.bntBlack{padding:.2rem .3rem;color:#008DEE;top:0;right:0; position:absolute;}
.w33{width:32.3333%;}
.fl{float:left;}
.fr{float:right;}
.cor-black{color:#000;}
.load-show{width:.3rem;height:.3rem;margin:1rem auto;}
.load-show img{width:100%;}
.select-show .text{margin-top:.2rem;border:.01rem solid #ccc;padding:.1rem .2rem;}
.select-show .text input{width:80%;border:none;font-size:.3rem;}
.select-show .text2{margin:.5rem auto;border:.01rem solid #ccc;padding:.1rem ;}
.select-show .text2 input{width:100%;border:none;padding:.1rem 0;}
.select-show .search{float:right;color:#ccc;font-size:.3rem;}
.icon-arrow-right{display:block;float:right;width:.15rem;border:.02rem solid #fff;}
.icon-arrow-icon{color:#ccc;position:absolute;width:.12rem;height:.12rem;border-bottom:solid .04rem currentColor;border-left:solid .04rem currentColor;-webkit-transform:rotate(-135deg);transform:rotate(-135deg);right:.24rem;top:50%;margin-top:-.06rem;}
.address_cont .subAddress{height:.96rem;align-items: center;line-height: .5rem;display: flex;}
.add-but{width:6rem;margin:.5rem auto;padding:.2rem;border:.01rem solid #ccc;border-radius:.1rem;text-align: center;color:#ccc;}
.add-but2{display:block;width:6rem;margin:0 auto;border-radius:.1rem;padding:.2rem;color:#fff; text-align: center;background:#008DEE;}
</style>
