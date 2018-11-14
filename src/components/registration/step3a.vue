<template>
  <div class="xfv-container">
    <step step="3"></step>
    <div class="xfv-from">
      <custom-selector v-model="formData.member" describe="随行家庭成员" :options="memberList" :isFirst="isFirst" @input="getMember"></custom-selector>
      <!--子女-->
        <group title="子女信息" class="group_cont" v-show="isMember">
          <template v-for="(item,index) in formData.children">
            <div class="child_title">第{{index + 1}}个孩子<icon class="child_del_btn" type="cancel" @click.native="deleChild(index, item.uuid)"></icon></div>
            <x-input v-model="formData.children[index].childName" title="姓名" placeholder="请填写子女姓名" :show-clear="true" placeholder-align="right" text-align="right" :max="15" :required="true" :ref="`childName${index}`" :is-type="inputValid.spouseName"></x-input>
            <custom-selector v-model="formData.children[index].sex" describe="性别" :options="sexList" :isFirst="true"></custom-selector>
            <custom-selector v-model="formData.children[index].relation" describe="关系" :options="relationList" :isFirst="true"></custom-selector>
            <datetime class="address_cont" v-model="formData.children[index].birthdayDate" title="出生日期" :min-year=1900 :max-year="maxYear"></datetime>
            <x-input v-model="formData.children[index].childIdNo" title="身份证号" placeholder="请输入身份证" :show-clear="true" placeholder-align="right" type="number" :min="15" :max="18" text-align="right"></x-input>
            <custom-selector v-model="formData.children[index].residenceFlag" describe="现居住地上学" :options="residenceFlagList" :isFirst="true"></custom-selector>
          </template>
          <div class="add_childen_btn" @click="addChild">+ 添加子女</div>
        </group>
    </div>

    <div v-transfer-dom>
      <confirm v-model="Confirm.isShowConfirm" title="操作提示" @on-confirm="onConfirm">
        <p style="text-align:center;">{{Confirm.confirmText}}</p>
      </confirm>
    </div>
    <!--<div @click="goNext">下一步</div>-->
  </div>
</template>
<script type="text/javascript">
  import {XInput, XButton, Group, Cell, Icon, Datetime, Confirm, TransferDomDirective as TransferDom, Value2nameFilter as value2name} from 'vux';
  import Step from '../common/Step.vue';
  import customSelector from '../common/customSelector.vue'
  import api from '../../api/api'
  import { mapGetters } from "vuex";
  export default {
    name: 'index',
    directives: {
      TransferDom
    },
    components: {XInput, XButton, Group, Cell, Icon, Datetime, Confirm, Step, customSelector},
    data () {
      return {
        isEdit: this.$route.query.isEdit || '0',  //  add: 新增, edit: 修改
        step:'0',
        scrollTop:'',
        isCover:false,
        showloading: false,
        isLockY: false,
        isFirst: true, // 是否是第一次选择或输入
        isShowConfirm: false,
        isReback: true,  // 数据是否回填，主要为了解决数据回填时阻止五级联动触发事件
        showLoading: true,
        readonly: true,
        isMember: false,
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
          confirmText: '确定要删除当前子女的信息吗?',
          state: false // true 为提交表单
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
        maxYear: new Date().getFullYear()
      }
    },
    computed: {
    },
    created () {
      this.getDictionary();
      this.getPeopleInfo();
    },
    mounted () {
      this.setTitle();
      this.setOptionMenu();
    },
    methods: {
      setTitle () {
        if (window.AlipayJSBridge) AlipayJSBridge.call('setTitle', {title: '居住登记'});
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
        const validate = this.validate()
        const validateChild = this.validateChild()
        if (!validate.valid) {
          this.$store.commit('SHOWTOAST', validate.errorMsg);
        } else if(this.formData.children.length > 0 && !validateChild.valid) {  // 校检子女信息
          this.$store.commit('SHOWTOAST', validateChild.errorMsg);
        } else {
          this.Confirm.state = true
          this.Confirm.isShowConfirm = !this.Confirm.isShowConfirm
          this.Confirm.confirmText = '请核实所有的信息的正确性，确定后将无法再更改！'
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
            isEdit: this.isEdit
          }).then(res => {
            this.$store.commit('UPDATE_LOADING', false);
            if(res.data.success) {
              const query = {
                isEdit: this.isEdit,
                serviceType: this.serviceType,
                comGuid:this.comGuid,
                openid:this.openid,
                zhimascore: this.formData.zhimascore
              }
              this.$router.push({path:`/step4/${this.formData.idNo}`, query});
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
        api.queryDictionaryList().then(res => {
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
            this.$store.commit('UPDATE_LOADING', false);
            this.uuid = data.uuid // 用户标识
            this.formData.children = data.children// 子女
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
        console.log(index != this.formData.children.length - 1)
        if (index != this.formData.children.length - 1) {
          this.$store.commit('SHOWTOAST', '请先删除最后那个孩子的信息！');
        } else {
          this.deleIndex = index
          this.childUuid = childUuid
          this.Confirm.state = false
          this.Confirm.isShowConfirm = !this.Confirm.isShowConfirm
          this.Confirm.confirmText = '确定要删除当前子女的信息吗?'
        }
      },
      getMember (key, value) {
        if (key == '1') {
          this.isMember = true;
        } else {
          this.isMember = false;
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
      }
    },
    destroyed () {
      this.removeOptionMenu();
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

</style>
