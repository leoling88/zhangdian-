<template>
  <div class="template_container">

    <div class="step3_cont">
      <div class="sucess_cont">
        <div class="circle-box">
          <div v-show="isReg" class="is-reg"><img class="icon_success" src="../../../static/images/icon_success.png"/><br/>已登记</div>
          <div  v-show="isSrawData">
            <div class="countdown">
              <div class="style-1"><b>{{days}}</b><span class="text">天</span><br/>后办可居住证</div>
            </div>
            <canvas id="canvas" ></canvas>
          </div>

        </div>
        <div class="succtime">登记时间：{{checktime}}</div>
      </div>

      <a @click="seeStepdetail" class="check_detail_btn" style="margin-top:.2rem;">查看详情</a>
      <!--<router-link :to="`/registration/${comGuid}/${openid}?registerFlag=1&nativeFlag=${nativeFlag}&type=edit`"  class="check_detail_btn change_address">居住信息变更</router-link>-->
      <a v-show="isSrawData"  @click="alertWin" class="check_detail_btn2" style="margin-top:.2rem;">取消居住登记</a>

    </div>
    <div class="step3_cont marT10">

      <b class="title">温馨提示：</b>
      <p><span>一、</span>自登记日期之日起，在居住地居住满半年后，并符合有合法稳定就业、合法稳定住所、连续就读条件之一的，提交相关证明材料，可到公安机关申领《山东省居住证》。相关证明材料如下：</p>
      <p><span>1、</span>申请人（委托代理人）居民身份证原件及复印件； </p>
      <p><span>2、</span>居住地住址证明：已购买房屋（房产证、土地证或者商品房买卖合同和发票）或者已租赁房屋（含村、居委会开具的居住证明和租赁合同）或者居住在工作单位（由工作单位开具居住在单位内部的证明）；</p>
      <p><span>3、</span>就业证明：劳动合同或者工商营业执照、务工经商证明相关材料；</p>
      <p><span>4、</span>对于在居住地连续就读的，由所在学校或培训机构开具连续就读的证明材料。</p>
      <p><span>二、</span>在上述居住地址终止居住的，请及时告知注销居住登记信息；</p>
      <p><span>三、</span>根据《居住证暂行条例》第九条第四款规定，申请人及相关证明材料出具人应该对本条规定的证明材料的真实性、合法性负责。</p>
      <p><span>四、</span>经核实发现虚假居住登记信息的，在信息系统予以注销居住信息，并依据《居住证暂行条例》第十八、十九条的有关规定，追究相关法律责任。</p>
    </div>
    <div v-transfer-dom>
      <confirm v-model="alertShow" title="操作提示" @on-confirm="cancellation">
        <p style="text-align:center;">请确认是否取消？</p>
      </confirm>
    </div>

  </div>
</template>
<script>
  import {Icon,Group,Cell, Timeline, TimelineItem, Alert, Confirm,TransferDomDirective as TransferDom, XSwitch, Tab, TabItem} from 'vux'
  import api from '../../api/api'
  import { mapState } from 'vuex'
  export default {
    name: 'step3',
    components: {Icon,Group,Cell, Timeline, TimelineItem, Alert, Confirm},
    directives: {
      TransferDom
    },
    data() {
      return {
        checktime:'',
        step:'0',
        days:'',
        isFirst: true, // 是否是第一次选择或输入
        isShowAlert: false,
        showLoading: false,  // 是否在加载中
        comGuid: this.$route.query.comGuid,
        openid: this.$route.query.openid,
        registerFlag: this.$route.query.registerFlag,
        nativeFlag: this.$route.query.nativeFlag,
        idNo: this.$route.params.idNo,
        isSrawData:false,
        isReg: false,
        alertShow: false,
        idUu:'',

      }
    },
    computed: {
    },
    mounted () {
      this.setTitle();
      this.setOptionMenu();
      this.getPeopleInfo();
      this.getCountDown();
    },
    methods: {
//20180806 by leoling
      drawData() {
        let days = this.days;
        //days = 0;
        let startDeg = -225  //45;
        let endDeg = 45;
        let value = 270/183;
        let targetValue = days * value;
        let canvas =  document.getElementById("canvas");
        let rad = Math.PI / 180;

        let size =600;
        let lineWidth = 50;
        let lineWidth2 = lineWidth;
        let r = size / 2;
        
        canvas.width = size;
        canvas.height = size;
        
        let context = canvas.getContext("2d");
        let linearGradient = context.createLinearGradient(0, 0, size, 0);
        linearGradient.addColorStop(0, "#ffd200");
        linearGradient.addColorStop(1, "#ff9c00");
        
        function arc(){
          context.save();
          context.beginPath();
          context.lineCap = "round";
          context.lineWidth = lineWidth;
          context.strokeStyle = linearGradient;
          context.fillStyle = linearGradient;
          // context.arc(r, r, r - lineWidth / 2, endDeg * rad, (endDeg - targetValue) * rad, true);

          context.arc(r, r, r - lineWidth / 2, startDeg  * rad, ( endDeg - targetValue) * rad, false);

          context.stroke();
          //context.fill();
          context.closePath();
          context.restore();
        }
        
        //灰色圆弧
        function arcBorder(){
          context.clearRect(0, 0, size, size);
          context.save();
          context.beginPath();
          context.lineCap = "round";
          context.lineWidth = lineWidth2;
          context.strokeStyle = "#008cec";
          context.arc(r, r, r - lineWidth / 2, startDeg * rad, endDeg * rad , false);
          context.stroke();
          context.closePath();
          context.restore();
          console.log( .5 * rad)
        }

       arcBorder()
       arc()
      },
      getCountDown () {
        this.$store.commit('UPDATE_LOADING', true);
        api.daysRemailing({idCard:this.idNo}).then((res) => {
          const data = res.data
          if(res.data.success) {
            if(!data.flag){
              this.isSrawData = true
              this.days = data.days
              this.comGuid = data.comguid
              this.drawData()
          
            }else{
              this.isReg = true  //isRegBut
            }
          }
        })
      },

      getPeopleInfo () {
        this.$store.commit('UPDATE_LOADING', true);
        api.rebackPeopleInfo({idCard:this.idNo,isEdit:this.isEdit,step:this.step}).then((res) => {
          const data = res.data.jsonRes[0]
          if(res.data.success){
            this.checktime = data.checktime
            this.idUu = data.uuid     // 20180807 + by leoLing
            this.openid = data.openid  // 20180807 + by leoLing
            this.$store.commit('UPDATE_LOADING', false);
          }
        }).catch(() => {
          this.$store.commit('UPDATE_LOADING', false);
        })
      },
      seeStepdetail (){
        location.href = `/cnZhangDian/mobile/zhimaStart?bizCode=CERT_FACE&businesType=1&innerType=1&homeType=lsns_&type=1&isEdit=2&nativeFlag=${this.nativeFlag}`;
      },
      /*    20180807  修改体验方式   by leoLing
      seeStepdetail2 (){
        location.href = `/cnZhangDian/mobile/zhimaStart?bizCode=CERT_FACE&businesType=1&innerType=1&homeType=lsns_&type=1&isEdit=1&nativeFlag=${this.nativeFlag}`;
      },
      */
      alertWin (){
        this.alertShow = true
      }, 
      closeWin () {
        this.alertShow = false
      }, 
      cancellation (){
        api.cancellationReg({idComgu:this.idUu}).then((res) => {
          const data = res.data
          if(res.data.success) {
            // this.$router.push({path:`/registration/000a4c7d16894b0681354e2ab9479cab/2088912982050224`});
             this.$router.push({path:`/`});

          }
        })


      },   
      setTitle () {
        if (window.AlipayJSBridge) AlipayJSBridge.call('setTitle', {title: '居住登记结果'})
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
  .step3_cont{
    width:100%;margin:0 auto;padding:.5rem 0;overflow:hidden;line-height: .5rem;overflow:hidden;position: relative;box-shadow:0 0 1px 1px #ccc;background:#fff;

    .sucess_cont{
      width:100%;min-height:4rem;padding-top:.3rem;
      .icon_success{display: block;width:1.8rem;height:1.8rem;margin:0 auto;}
      h3{height: 1rem;line-height: 1.4rem;font-size: .35rem;text-align: center;color:#000;margin-top: 0;}
      h3:last-of-type{height: 1rem;line-height: 1rem;font-size: .4rem;text-align: center;}
      h3 span{display: block;color:#0091ff;font-size: .35rem;line-height: .5rem;}
      h3 em{display: block;color:#0091ff;font-size: .35rem;line-height: .5rem;}
    }

    p{
      line-height: .5rem;font-size: .28rem;padding:.1rem .25rem .1rem .7rem;
      span{position: absolute;left:.3rem;}
      
/*      span:first-of-type{display:inline-block;height:.7rem;float: left}
/*      span:last-of-type{color:red;}
*/    }
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
  .succtime{font-size:.28rem;color:#999;text-align:center;}
  .title{display:block;padding:0 .25rem;color:#008cec;}
  .change_address{margin-top: .5rem;}
  .marT10{margin-top:.25rem;}
  .check_detail_btn2{display:block;width: 6.80rem;height:.96rem;line-height:.96rem;margin:.2rem auto 0 auto; border-radius: .1rem;text-align: center;color:#008cec;font-size: .34rem;border:1px solid #008cec;}
  .countdown{ width:100%;text-align:center; position:absolute;top:30%; }
  .countdown .style-1 b{margin-right:.1rem; font-size:.6rem; }
  .countdown .style-1 .text{font-size:.35rem;}
  .is-reg{height:1.4rem;font-size:.6rem; text-align:center;}

  .circle-box{width:3rem; height:3rem;position:relative; margin:0 auto;}

  .circle-box canvas{  width:100%; height:100%;margin:0 auto; }

</style>
