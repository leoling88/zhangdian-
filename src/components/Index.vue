<template>
  <div class="xfv-container" style="background-color: #fff;height: 100%;position: absolute;bottom:0;left:0;">
      <div class="xfv-index-top">


        <div ref="szzdIndexTop">

          <a class="link-jzdqy" href="#/regulations1"><i ><img src="static/images/icon_001.png" alt=""></i><span>居住证权益</span><img src="static/images/bg_001.png" alt=""></a>
          <img src="static/images/szzd_bg.png">
        </div>
        <div class="szzd-index-link" ref="linkBar">
          <flexbox>
            <flexbox-item class="check-in">
              <a @click="OpenPopupg"><img src="static/images/szzd_1.png"><span>居住登记</span></a>
            </flexbox-item>
            <flexbox-item class="check-in">
              <a @click="recieveCard"><img src="static/images/szzd_2.png"><span>电子居住登记证</span></a>
            </flexbox-item>
          </flexbox>
        </div>
        <div class="szzd-index-bottom">
          <p>中国共产党张店区委员会政法委员会</p>
<!--           <p>服务电话：<a href="tel:0533-2869862">0533-2869862</a></p>
 -->
        </div>
<!--底部van-->
      <div class="footerbar">
        <a @click = "getQ"><span><img src="static/images/icon_03.png">常见问题</span></a>
        <a @click="getfeedback"><span><img src="static/images/icon_01.png">我要反馈</span></a>
      </div>        
<!--底部van end-->
      </div>
      <div v-transfer-dom>
      <x-dialog v-model="showDialogStyle" class="szzd-dialog">
        <div class="popupBox">
          <div class="popup_title">
            <img src="static/images/layer_bg.png">
            <span class="title_type">请选择居民类别</span>
            <span class="title_close" @click="ColsePopupg"><img src="static/images/close.png"></span>
          </div>
          <div class="popup_button">
            <flexbox>
              <flexbox-item><a href="javascript:;" class="szzdbtn disabled">户籍居民</a></flexbox-item>
              <!--<flexbox-item><a href="javascript:;" class="szzdbtn szzdbtn1" @click="certFace(1)">户籍居民</a></flexbox-item>-->
              <flexbox-item><a href="javascript:;" class="szzdbtn szzdbtn2" @click="certFace(0)">非户籍居民</a></flexbox-item>
            </flexbox>
          </div>
        </div>
      </x-dialog>
    </div>

    <div v-transfer-dom>
      <confirm v-model="isShowConfirm" title="" @on-confirm="certFacelyp">
        <p style="text-align:center;">您需完成居住登记，方可领取，<br/>现在进行居住登记？</p>
      </confirm>
    </div>


  </div>
</template>
<script type="text/javascript">
  import {XInput,Group, Cell, Flexbox, FlexboxItem, Scroller,Swiper,SwiperItem, LoadMore, Loading, Confirm, XDialog, TransferDomDirective as TransferDom} from 'vux'
  import { mapGetters } from "vuex";
  import api from '../api/api'
  let _openidVal = localStorage.getItem('sOpenid')
  export default {
    name: 'index',
    directives: {
      TransferDom
    },
    components: {XInput,Group, Cell, Flexbox, FlexboxItem,Scroller,Swiper,SwiperItem,LoadMore, Loading, Confirm, XDialog},
    data () {
      return {
        openId: this.$route.query.openid,
        showDialogStyle: false,
        isShowConfirm: false,
        registerFlag: this.$route.query.registerFlag || '0', //0:未登记,1:已登记
        nativeFlag: this.$route.query.nativeFlag || '0', //0: 非户籍,1:户籍
        openid: this.$route.query.openid,
        idNo: this.$route.query.idCard, // 身份号
//        idNo: this.$route.query.idNo // 身份号
      }
    },
    methods: {
      certFacelyp (){
        this.showDialogStyle = true;
      },
      setTitle () {
        if (window.AlipayJSBridge) AlipayJSBridge.call('setTitle', {title: '数字张店'});
      },
      setOptionMenu () {
        if (window.AlipayJSBridge) {
          AlipayJSBridge.call('setOptionMenu', {
            title : ' ',  // 与icon、icontype三选一
            redDot : '-1', // -1表示不显示，0表示显示红点，1-99表示在红点上显示的数字
            color : '#008cec', // 必须以＃开始ARGB颜色值
          });
        }
      },
      removeOptionMenu () {
        if (window.AlipayJSBridge) {
          document.removeEventListener('optionMenu', this.goNext, false);
        }
      },
      recieveCard () {
        api.recieveCard(this.openId).then(res => {
          const data = res.data.attributes || [];
          if(res.data.success) {
            const query = {
              comGuid: this.$route.query.comGuid,
              openid: this.$route.query.openid,
              registerFlag: this.registerFlag,
              nativeFlag: this.nativeFlag
            }
            if (data.cardStatus == '0') { // 未登记
              this.isShowConfirm = !this.isShowConfirm;
            } else if (data.cardStatus == '1') { // 登记成功，准备领卡
              this.$router.push({path:`/step4/${data.idCard}`, query});
            } else if (data.cardStatus == '2') { // 登记成功，已领卡
              this.$router.push({path:`/cardList/${data.idCard}`, query});
            }
          }
        });
      },
      onConfirm () {  // 确认
        this.$router.push({path:`/card/${this.idNo}`, query});
      },
      removeOptionMenu () {
        if (window.AlipayJSBridge) {
          document.removeEventListener('optionMenu', this.goNext, false);
        }
      },
      ColsePopupg () {
        this.showDialogStyle = false;
      },
      OpenPopupg() {

        api.userType(this.openid).then((res) => {
          const data = res.data
          console.log(data)
          if(res.data.success){

            if (data.obj.registerFlag == 3) {  // 如果已经登记过了，就直接刷脸进入基本信息页
              this.idNo = data.obj.idCard
              const query = {
    //            comGuid: this.$route.query.comGuid,
    //            openid: this.$route.query.openid,
    //            registerFlag: this.registerFlag,
                nativeFlag: this.nativeFlag
              }
    //          this.certFace(this.$route.query.nativeFlag);
              this.$router.push({path:`/successStep/${this.idNo}`,query});
              this.showDialogStyle = false;
            } else {
              this.showDialogStyle = true;
            }

          }
        }).catch(() => {
          this.$store.commit('UPDATE_LOADING', false);
        })






      },
      certFace (nativeFlag) {
        this.$store.commit('UPDATE_LOADING', true);
        location.href = `/cnZhangDian/mobile/zhimaStart?bizCode=CERT_FACE&businesType=1&innerType=1&homeType=lsns_&type=1&isEdit=0&nativeFlag=${nativeFlag}`;
      },
      getPeopleInfo () {
        this.$store.commit('UPDATE_LOADING', true);
        api.rebackPeopleInfo({idCard:this.idNo,isEdit:'6',step:'6'}).then((res) => {
          const data = res.data.jsonRes[0]
          if(res.data.success){
            this.$store.commit('UPDATE_LOADING', false);
          }
        }).catch(() => {
          this.$store.commit('UPDATE_LOADING', false);
        })
      },
      getfeedback () {
        localStorage.setItem('_back',null);
        // this.$router.push({path:'/feedback/' + this.openId});
        // if(_openidVal) {
        //  this.$router.push({path:'/feedback/' + _openidVal});
          
        // }else{
        location.href = '/cnZhangDian/mobile/qtEntrance?qtType=1';  
        // //http://192.168.18.250:8080
        // }          
      },
      getQ() {
         this.$router.push({path:'/help/' + this.openId});
      }
    },
    mounted () {
      this.setTitle();
      this.setOptionMenu();

      
      //this.getPeopleInfo();
    },
    destroyed () {
      this.removeOptionMenu();
      this.$store.commit('UPDATE_LOADING', false);
    }
  }
</script>
<style>
.link-jzdqy{display:block;position: absolute;top:0;right:0;width:2.2rem;height:.7rem;color:#fff;font-size:.26rem;top:.2rem;}
.link-jzdqy img{width:100%;}
.link-jzdqy i{display: block;width:.3rem;height:.3rem;margin:.07rem .2rem 0;position: absolute;}
.link-jzdqy span{padding:.03rem 0  0 .6rem;position: absolute;display:block;}
.szzd-index-bottom{margin-bottom:.8rem;padding:.5rem 0;background:#fff;}
.col-blue{color:#329af0;}
.footerbar{
  width:100%;height:1rem;position: fixed;bottom:0;left:0;background:#f1f1f1;color:#fff;
}
.footerbar a{float:left;display:inline-block;width:50%;padding:.2rem 0; height:.6rem; text-align: center;color:#888;}
.footerbar a span{display: block;border-right:.01rem solid #ccc;line-height: .6rem;}
.footerbar a:last-child span{border:none;}
.footerbar a img{display: inline-block;width:.35rem;height:.35rem;margin-right:.1rem;background:#ccc;vertical-align: middle;}
</style>