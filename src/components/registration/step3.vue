<template>
  <div class="xfv-container">
    <step step="3"></step>
    <div class="xfv-from step-swich">
      <!--<custom-selector v-model="formData.member" describe="随行家庭成员" :options="memberList" :isFirst="isFirst" @input="getMember"></custom-selector>-->
      <div class="member-switch">
        <group>
          <x-switch title="随行未成年家庭成员" v-model="switchValue" @on-change="getMember" :disabled="seledisab"></x-switch>
        </group>
      </div>

      <div class="member-wraper" v-if="isMember">
        <div class="mv-children borderNone" v-if="formData.children.length > 0">
          <div class="mvc-item" v-for="(item,index) in formData.children" data-type="0">
            <div class="mcv-box" @touchstart.capture="touchStart" @touchend.capture="touchEnd" @click="skip">
                <group label-width="15em" label-align="left" class="hideLine">
                  <!--<cell :title="'随行人员' + (index + 1)" value-align="right">-->
                    <!--<span class="mvc-value" slot="value">{{formData.children[index].childName}}</span>-->
                    <!--<img class="mvc-edit" src="static/images/edit.png" @click="editMember(index, item)">-->
                  <!--</cell>-->
                  <cell :title="formData.children[index].childName" value-align="right">
                    <span class="mvc-value" slot="value" v-if="formData.children[index].sex==1">男</span>
                    <span class="mvc-value" slot="value" v-if="formData.children[index].sex==2">女</span>
                    <img class="mvc-edit" src="static/images/edit.png" @click="editMember(index, item)">
                  </cell>
                </group>
              <!--<div class="delete" @click="deleChild(index, formData.children[index].uuid)" :data-index="index">删除</div>-->
              <div class="delete" :class="{ falseclass: !istrueclick }" @click="istrueclick&&deleChild(index, formData.children[index].uuid)" :data-index="index">删除</div>
            </div>
          </div>
        </div>
        <div class="mw-plus" @click="addMember" v-if="addmorezn">
          <x-icon type="ios-plus-outline" size="38"></x-icon>
          <p>添加随行未成年家庭成员</p>
        </div>

      </div>
    </div>

    <div v-transfer-dom>
      <confirm v-model="Confirm.isShowConfirm" title="操作提示" @on-confirm="onConfirm">
        <p style="text-align:center;">{{Confirm.confirmText}}</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <alert v-model="Alert.isShowAlert" title="" @on-show="onAlert">
        <p style="text-align:center;">请添加随行未成年家庭成员信息</p>
      </alert>
    </div>
    <div @click="goNext" v-if="nodeEnv === 'development'">下一步</div>
    <!--<div @click="goNext">下一步</div>-->
    <!--<children-zj></children-zj>-->
  </div>
</template>
<script type="text/javascript">
  import {XInput, XButton, Group, Alert, Cell, Icon, Datetime, Confirm, XSwitch, TransferDomDirective as TransferDom, Value2nameFilter as value2name} from 'vux';
  import Step from '../common/Step.vue';
  import customSelector from '../common/customSelector.vue'
  import childrenZj from '../common/childrenZj.vue'
  import api from '../../api/api'
  import { mapGetters } from "vuex";
  import { mapState } from 'vuex'
  export default {
    name: 'index',
    directives: {
      TransferDom
    },
    components: {XInput, XButton, Group,Alert, Cell, Icon, Datetime, Confirm, XSwitch, Step, customSelector,childrenZj},
    data () {
      return {
        isEdit: this.$route.query.isEdit || '0',  //  add: 新增, edit: 修改
        step:this.$route.query.isEdit,
        checktime:'',//登记时间
        istrueclick:true,//判断删除点击
        licuoFlag:'',
        nodeEnv: 'development',
        scrollTop:'',
        isCover:false,
        showloading: false,
        isLockY: false,
        isFirst: true, // 是否是第一次选择或输入
        isShowConfirm: false,
        isReback: true,  // 数据是否回填，主要为了解决数据回填时阻止五级联动触发事件
        showLoading: true,
        readonly: true,
        seledisab:false,//数据回填后custom-selector设置不可选
        addmorezn:true,//判断是否显示添加子女的按钮
        isMember: false,
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
        deleIndex: '',
        delType: 2, // 删除子女信息参数，1，为全部删，2，为单个删，默认
        uuid: '',
        childUuid: '',
        comGuid: this.$route.query.comGuid,
        openid: this.$route.query.openid,
        formData: {
          idNo: this.$route.params.idNo,
          member: '',
          children: [] // 子女
        },
        Confirm: {
          isShowConfirm: false,
          confirmText: '确定要删除当前的信息吗?',
          state: false // true 为提交表单
        },
        Alert: {
          isShowAlert: false,
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
        memberList: [{
          key: '1',
          value: '有'
        },{
          key: '0',
          value: '无'
        }],
        residenceFlagList: [{
          key: '1',
          value: '是'
        },{
          key: '0',
          value: '否'
        }],
        sexList:[],
        relationList:[],
        switchValue: false,
        maxYear: new Date().getFullYear(),
        startX : 0,
        endX : 0
      }
    },
    computed: {
//      ...mapState([
//        'openid','wxsqn','comGuid'
//      ])
    },
    watch: {
      registerFlag: function (val, old) {
        console.log('registerFlag',val)
        this.setOptionMenu()
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
//      this.backFanhui();
      console.log('555',this.licuoFlag)
    },
    methods: {
      backFanhui (){//返回
        const query = {
          comGuid: this.$route.params.comGuid,
          openid:this.$route.params.alipayAcount,
          registerFlag: this.registerFlag,
          nativeFlag: this.nativeFlag
        }
//      document.addEventListener('back', () => {
//        this.$router.push({path:`/step2/${this.formData.idNo}`, query});
////        this.$router.push({path:`/step2/${this.formData.idNo}`});
////        alert('返回');
//        return
//      }, false)
//        document.addEventListener('back', function() {//////
//          AlipayJSBridge.call('popTo', {
//            urlPattern: '/',
//          }, function(e) {
//            alert(JSON.stringify(e));
//          });
//        });
      },
      removebackFanhui () {//销毁支付宝返回事件
        document.removeEventListener('back', this.backFanhui, false);
      },
      onAlert () {
        console.log('yes')
      },
      setTitle () {
//        if (window.AlipayJSBridge) AlipayJSBridge.call('setTitle', {title: '居住登记'});
        if(this.nativeFlag == 1){
          if (window.AlipayJSBridge) AlipayJSBridge.call('setTitle', {title: '户籍居住登记'})
        }else if(this.nativeFlag == 0){
          if (window.AlipayJSBridge) AlipayJSBridge.call('setTitle', {title: '非户籍居住登记'})
        }
      },
      setOptionMenu () {
        if (window.AlipayJSBridge) {
          if(this.registerFlag == 3){
            AlipayJSBridge.call('setOptionMenu', {
              title : '首页',
              redDot : '-1',
              color : '#008cec',
            });
          }else{
            AlipayJSBridge.call('setOptionMenu', {
              title : '完成',
              redDot : '-1',
              color : '#008cec',
            });
          }

          AlipayJSBridge.call('showOptionMenu');
          document.addEventListener('optionMenu', this.goNext, false) // 绑定支付宝右上角点击事件
        }
      },
      removeOptionMenu () {
        if (window.AlipayJSBridge) {
          document.removeEventListener('optionMenu', this.goNext, false);
        }
      },
      getNodeEnv () {
        return this.nodeEnv = process.env.NODE_ENV;
      },
      addMember () {
        const query = {
          comGuid: this.$route.params.comGuid,
          openid:this.openid,
          registerFlag: this.registerFlag,
          nativeFlag: this.nativeFlag,
          isEdit: this.isEdit
        }
        this.$router.push({path:`/step3Plus/${this.formData.idNo}`,query});
      },
      editMember (index, item) {
        const query = {
          index: index,
          isEditchild: true,
          uuid: item.uuid,
          comGuid: this.$route.params.comGuid,
          registerFlag: this.registerFlag,
          openid:this.openid,
          isEdit: this.isEdit
        }
        this.$router.push({path:`/step3Plus/${this.formData.idNo}`, query});
      },
//      goXqing (){//查看详情
//        if(this.registerFlag ==3){
//          this.Confirm.isShowConfirm = false;
//        }
//      },
      goNext () {
        if(this.registerFlag == 3){
          location.href = '/cnZhangDian/mobile/laisuiHomeIndex?homeType=lsns_'
        }else{
          const validate = this.validate()
          if (!validate.valid || (this.isMember&&this.formData.children.length<1)) {
            this.$store.commit('SHOWTOAST', validate.errorMsg);
            this.Alert.isShowAlert = !this.Alert.isShowAlert
          } else {
            this.Confirm.state = true
            this.Confirm.isShowConfirm = !this.Confirm.isShowConfirm
            this.Confirm.confirmText = '请核实所有的信息的正确性，确定后将无法再更改！'
          }
        }

      },
      onConfirm () {  // 确认
        if (!this.Confirm.state) {
          if (this.childUuid) {
            api.deleteChildren({
              delType: this.delType,
              parentUuid: this.uuid,
              childrenArr: this.childUuid
            }).then((res) => {
              const data = res.data
              if (data.success) {
                let listItems = document.querySelectorAll('.mvc-item');
                for( let i = 0 ; i < listItems.length ; i++){
                  listItems[i].dataset.type = 0
                }
                this.$store.commit('SHOWTOAST', '操作成功！');
              }
            })
          }
          this.formData.children.splice(this.deleIndex, 1)
        } else { // 提交表单
          this.$store.commit('UPDATE_LOADING', true);
          api.saveResideInfo({
              formData: this.formData,
              homeType: 'lsns_',  // 南沙区域标记
              isRegister: 3,
            isEdit: this.isEdit
          }).then(res => {
            this.$store.commit('UPDATE_LOADING', false);
            if(res.data.success) {
              const query = {
                isEdit: this.isEdit,
                comGuid:this.comGuid,
                openid:this.openid,
                registerFlag: this.registerFlag,
                nativeFlag: this.nativeFlag
              }
              this.$router.push({path:`/step4/${this.formData.idNo}`, query});
//              if(this.registerFlag == 3){
//                this.$router.push({path:`/successStep/${this.formData.idNo}?checktime=${this.checktime}`, query});
//              }else{
//                this.$router.push({path:`/step4/${this.formData.idNo}`, query});
//              }
            } else {
              this.$store.commit('SHOWTOAST',res.data.msg);
            }
          }).catch(() => {
            this.$store.commit('UPDATE_LOADING', false);
          })
        }
      },
      validate () { // 校验表单
        let valid = true;
        let errorMsg = '';
        if (!this.formData.member) { //
          errorMsg = '请选择随行家庭成员！'
        } else {
          valid = true
          errorMsg = ''
        }
        return {valid, errorMsg}
      },
      getDictionary(){ // 获取所有的字典
        api.queryDictionaryList(this.nativeFlag).then(res => {
          if(res.data.success) {
            const data = res.data.obj;
            this.filerData(data.XB, this.sexList);//性别
          }
        });
        api.getRelation().then(res => { // 与填表人关系
          if(res.data.success) {
            const data = res.data.obj;
            this.filerRelationData(data, this.relationList);
          }
        });
      },
      filerData(srcData, toData){ // 来穗接口筛选数据字典
        if(srcData instanceof Array && toData instanceof Array){
          srcData.forEach(item => {
            toData.push({
              value: item.itemName ? item.itemName : item.mph,
              key: item.itemCode ? item.itemCode : item.zhid
            })
          });
        }
      },
      filerRelationData(srcData, toData){ // 筛选数据字典
        if(srcData instanceof Array && toData instanceof Array){
          srcData.forEach(irem => {
            toData.push({
              value: irem.description,
              key: irem.subtype
            })
          });
        }
      },
      getPeopleInfo () {
        this.$store.commit('UPDATE_LOADING', true);
        api.rebackPeopleInfo({idCard:this.formData.idNo,isEdit:this.isEdit,step:this.step}).then((res) => {
          const data = res.data.jsonRes[0]
          if(res.data.success){
//            this.licuoFlag = data.registerFlag;
            this.registerFlag = data.registerFlag;
            console.log('8888',this.licuoFlag)
            if(data.registerFlag == 3){
              this.seledisab = true;
              this.addmorezn = false;
              this.checktime = data.checktime;
              this.istrueclick = false;
              console.log('1114',this.checktime);
            }
            this.$store.commit('UPDATE_LOADING', false);
            this.uuid = data.uuid // 用户标识
            this.formData.children = data.children// 子女
            this.switchValue = !!(data.children.length > 0)


          }
        }).catch(() => {
          this.$store.commit('UPDATE_LOADING', false);
        })
      },
      validateChild () {  // 子女信息校验
        let valid = false;
        let errorMsg = '';

        this.formData.children.forEach((item) => {
          if (!item.childName) {  // 姓名
            valid = false;
            errorMsg = '请输入孩子的姓名！'
          } else if (!this.$regExp.name.test(item.childName)) {
            valid = false;
            errorMsg = '孩子的姓名不合法！'
          } else if (!item.sex) {
            valid = false;
            errorMsg = '请选择孩子的性别！'
          } else if (!item.relation) {
            valid = false;
            errorMsg = '请选择关系！'
          } else if (!item.birthdayDate && !item.childIdNo) { // 出生日期和身份证号都没有值
            valid = false;
            errorMsg = '请选择孩子的出生日期或身份证号！'
          } else if (item.birthdayDate && item.childIdNo.length > 0 && !this.$regExp.cardID.test(item.childIdNo)) { // 出生日期和身份证号都有值，只需判断身份证号是否合法
            valid = false;
            errorMsg = '孩子的身份证号不合法！'
          } else if (item.childIdNo.length > 0 && !this.$regExp.cardID.test(item.childIdNo)) { // 只填身份证号
            valid = false;
            errorMsg = '孩子的身份证号不合法！'
          } else {
            valid = true
            errorMsg = ''
          }
        });
        if (this.formData.children.length == 0) {
          valid = false
          errorMsg = '请添加子女信息'
        }
        return {valid, errorMsg}
      },
      addChild () {  // 增加子女
        const validate = this.validateChild()
        if (validate.valid || this.formData.children.length == 0) {  // 在子女验证通过后才能新增
          this.formData.children.push({
            childName:'',  // 子女姓名
            sex: '',  // 子女性别
            relation: '',  // 与填表人关系
            birthdayDate: '',  // 出生日期
            childIdNo:'',  // 子女身份证号
            residenceFlag:''  //
          });
        } else {
          this.$store.commit('SHOWTOAST', validate.errorMsg);
        }
      },
      deleChild (index, childUuid) {
        this.deleIndex = index
        this.childUuid = childUuid
        this.Confirm.state = false
        this.Confirm.isShowConfirm = !this.Confirm.isShowConfirm
        this.Confirm.confirmText = '确定要删除当前信息吗?'
      },
      getMember (val) {
        if (val) {
          console.log('112233',val);
          this.isMember = true;
          this.formData.member = '1';
        } else {
          this.isMember = false;
          this.formData.member = '0';
        }
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
      },
      //跳转
      skip(){
        if(this.checkSlide()){
          this.restSlide();
        } else {
          //alert('You click the slide!')
        }
      },
      //滑动开始
      touchStart(e){
        this.startX = e.touches[0].clientX;
      },
      //滑动结束
      touchEnd (e) {
        let parentElement = e.currentTarget.parentElement;
        this.endX = e.changedTouches[0].clientX;

        if( parentElement.dataset.type == 0 && this.startX - this.endX > 30){
          this.restSlide();
          parentElement.dataset.type = 1;
        }

        if( parentElement.dataset.type == 1 && this.startX - this.endX < -30){
          this.restSlide();
          parentElement.dataset.type = 0;
        }

        this.startX = 0;
        this.endX = 0;
      },
      //判断当前是否有滑块处于滑动状态
      checkSlide(){
        let listItems = document.querySelectorAll('.list-item');

        for( let i = 0 ; i < listItems.length ; i++){
          if( listItems[i].dataset.type == 1 ) {
            return true;
          }
        }
        return false;
      },
      //一次只能滑动一个
      restSlide(){
        let listItems = document.querySelectorAll('.list-item');

        for( let i = 0 ; i < listItems.length ; i++){
          listItems[i].dataset.type = 0;
        }
      }
    },
    destroyed () {
      this.removeOptionMenu();
//      this.removebackFanhui();
    }
  }
</script>
<style lang="less">
  .form_cont{width:100%;overflow: hidden;}
  .go_next_btn{width:1rem;height:1rem;line-height:1rem;position: absolute;top:0;right:.3rem;color:#fff;}
  .group_cont{width:100%;overflow: hidden;
    .weui-cells__title{background: #eee;height:1rem;line-height:1.2rem;margin:0;}
  }
  .no_before .weui-cell:before{display: none;}
  .has_before{
    position: relative;
    &:before{content: " "; width:100%;position: absolute;height: 1px;border-top: 1px solid #D9D9D9;border-top: 1px solid #D9D9D9;  color: #D9D9D9;left: 15px;display: block;transform: scaleY(0.5);position: absolute;bottom:0;}
  }
  .is_married{overflow: hidden;width:100%;/*height:1.97rem;*/position: relative;transition: all 1s ease;
    &:before{content: " "; width:100%;position: absolute;height: 1px;border-top: 1px solid #D9D9D9;border-top: 1px solid #D9D9D9;  color: #D9D9D9;left: 15px;display: block;transform: scaleY(0.5);}
  }
  .add_childen_btn{width:5.8rem;height:.88rem;background:#0091FF;margin:.5rem auto;height:.88rem;line-height: .88rem;text-align: center;color:#fff;border-radius: 0.08rem;}
  .child_title{height:1.1rem;line-height: 1.2rem;text-indent:15px;padding-right:.4rem;border-top:1px dashed #D9D9D9;color:#1f67d0;}
  .child_title:first-of-type{border:none;}
  .child_del_btn{float: right;margin-top:.3rem;}

  .icons{display: block;width:1rem;height:1rem;margin:0 auto .3rem auto;position: relative;}
  .icons:before{font-size: 1rem;position: absolute;left: 0;top:0;}

  /*.step-swich .weui-cell{line-height:0;padding-top:0 !important;padding-bottom:0 !important;}*/

  .weui-cells.vux-no-group-title:after{border:none;}
  .member-wraper .borderNone{border-top:none !important;}
  /*.member-switch .weui-cell{display:flex !important;}*/
  /*.mv-children .weui-cell{display:flex !important;}*/
  .weui-switch{top:.2rem !important;}
</style>
