<!---->
<template>
    <div v-transfer-dom>
      <popup v-model="showPopup">
        <div class="popupBox">
          <div class="rel fs32 textCenter popup_title">请输入支付密码 <x-icon class="abs hideDialog" type="ios-close-empty" size="30" @click="ColsePopupg"></x-icon></div>
          <div class="rel set_pwd_box textCenter">
            <ul id="set_pwd_box_ul_1" class="set_pwd_box_ul">
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
            </ul>
            <a class="abs fs26 link_reset_pwd" @click="findPayPwd">找回支付密码</a>
          </div>

          <p class="num_name_box fs22 textCenter"><span>易医安全键盘</span> </p>
          <div class="form_edit">
            <div class="num" @click="checkNum(1)">1</div>
            <div class="num" @click="checkNum(2)">2</div>
            <div class="num" @click="checkNum(3)">3</div>
            <div class="num" @click="checkNum(4)">4</div>
            <div class="num" @click="checkNum(5)">5</div>
            <div class="num" @click="checkNum(6)">6</div>
            <div class="num" @click="checkNum(7)">7</div>
            <div class="num" @click="checkNum(8)">8</div>
            <div class="num" @click="checkNum(9)">9</div>
            <div class="nonum"></div>
            <div class="num" @click="checkNum(0)">0</div>
            <div class="nonum" @click="removeNum()"></div>
          </div>
        </div>
      </popup>
    </div>
</template>
<script>
  import { mapState } from 'vuex'
  import { TransferDom,Popup} from 'vux'
  export default {
    directives: {TransferDom},
    components: {Popup},
    props:['DialogCallBack'],
    data () {
      return {
        showPopup:true,
        CallBackFun:'',
        PassWordValue:'',
      }
    },
    created() {
      this.showPopup=true;
    },
    methods: {
      findPayPwd(){//找回密码链接

      },
      ColsePopupg(){//关闭弹窗
          this.showPopup=false;
      },
      CallBack(){//输入密码正确后返回函数
        this.showPopup=false;
        this.$bus.$emit(this.DialogCallBack);
      },
      checkNum(num){//点击数字
        var _this = this;
        var _len = _this.PassWordValue.length || 0;
        if(_len==6){
          return;
        }
        _this.PassWordValue = String(_this.PassWordValue)+String(num);
        _this.fillPwd();
        if(_this.PassWordValue.length==6){
          _this.$store.commit('UPDATE_LOADING', true);
          setTimeout(function(){
            _this.$store.commit('UPDATE_LOADING', false);
            _this.CallBack();
//            _this.$bus.$emit('CallPayPassword',_this.PassWordValue);
          },1000)
        }
      },
      fillPwd(){//填充密码
        var _this = this;
        var _len = _this.PassWordValue.length || 0;
        var obj_li = document.getElementById("set_pwd_box_ul_1").getElementsByTagName("li");
        for (var i=0;i<obj_li.length;i++){
          obj_li[i].innerHTML = '';
        }
        for (var j=0;j<_len;j++){
          obj_li[j].innerHTML = '●';
        }
      },
      removeNum(){//移除密码
        var _this = this;
        var _len = _this.PassWordValue.length || 0;
        if(_len==0){
          _this.DialogHide();
          return;
        }
        _this.PassWordValue = _this.PassWordValue.substr(0, _len - 1);
        _this.fillPwd();
      },
      clearNum(){//清空密码
        var _this = this;
//        var _len = _this.PassWordValue.length ;
        _this.PassWordValue = '';
        _this.fillPwd();
      }
    }
  }
</script>
<style lang="less" scoped>
  .popupBox{ background: #fafafa;}
  .popup_title{ padding: 0.28rem 0; border-bottom:1px solid #e7e7e7;}
  .hideDialog{ width: 0.8rem; height: 0.8rem; right:5px; top:6px; fill: #cccccc;}
  .num_name_box{ color: #8a8a8a;  background: #fff; padding: 2px 0; }
  .num_name_box span{ line-height: 10px;  background-size: 0.30rem 0.33rem;padding: 5px 0 5px 0.35rem; }

  .set_pwd_box{padding-top: 0.26rem; padding-bottom: 0.8rem;}
  .set_pwd_box_ul{ background: #fff;  border: 1px solid #e7e7e7;  font-size: 0;  display: inline-block;  position: relative;  font-size: 0;  }
  .set_pwd_box_ul li{  display: block; float: left;  width: 1.05rem;  height: 0.86rem;  font-size: 20px;  font-weight: 700;  text-align: center;  line-height: 0.86rem;  border-left: 1px solid #e7e7e7;  overflow: hidden;  }
  .set_pwd_box_ul li:first-child {  border-left: none; }
  .hidden_input_box{ position: absolute; left: -100000px; top:-100000px;}
  .link_reset_pwd{ height: 22px; line-height: 22px; right:0; top:1.7rem; color: #52a7ff; width: 100%; text-align: right; padding-right: 0.52rem;}
  /* 键盘 */
  .form_edit {  width: 100%;  background: #D1D4DD; border-top:1px solid #D1D4DD }
  .form_edit> div {  border-bottom: 1px solid #D1D4DD; border-right: 1px solid #D1D4DD;  float: left;  width: 33%;  height: 45px;  text-align: center;  color: #333;  line-height: 45px;  font-size:0.5rem;    background-color: #fff;   }
  .form_edit> div:active{ background: #e7e7e7;}
  .form_edit> div:nth-child(3n) {  margin-right: 0;  }
  .form_edit> div.nonum{  background-color: #d2d5db;  }
  .form_edit> div:last-child { background-repeat: no-repeat;  background-position: center center;  background-size: 0.56rem 0.38rem;  }
</style>


