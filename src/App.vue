<template>
  <div id="app">
    <router-view></router-view>
    <Loading :show="loadingShow"></Loading>
  </div>
</template>
<script>
import Loading  from './components/common/Loading.vue'
import { mapState } from 'vuex';
import api from './api/api';
export default {
  name: 'xuefront',
  componentName: 'xuefront',
  components: {Loading},
  computed: {
    ...mapState([
      'loadingShow'
    ])
  },
  methods: {
    setRem (designWidth = 750) {  // 自适应所有主流设备
      var winWidth = document.body.clientWidth || document.documentElement.clientWidth;
      if (winWidth > designWidth) winWidth = designWidth;
      document.querySelector("html").style.fontSize = winWidth * 100 / designWidth + "px";
    },
    getDictionary () { // 获取所有的字典
      api.queryNewDictionaryList().then(res => {
        if(res.data.success) {
          const data = res.data.obj;
          this.$Utils.setLocalStorage('addressList', this.filerData(data, 2));
        }
      });

      api.queryDictionaryList(this.$route.query.nativeFlag).then(res => {
        if(res.data.success) {
          const data = res.data.obj;
          this.$Utils.setLocalStorage('XB', this.filerData(data.XB)); // 性别
          this.$Utils.setLocalStorage('HYZK', this.filerData(data.HYZK)); // 婚姻状况
          this.$Utils.setLocalStorage('WHCD', this.filerData(data.WHCD)); // 文化程度
          this.$Utils.setLocalStorage('FBY', this.filerData(data.FBY)); // 服兵役
          this.$Utils.setLocalStorage('ZZMM', this.filerData(data.ZZMM)); // 政治面貌
          this.$Utils.setLocalStorage('LBSYY', this.filerData(data.LBSYY)); // 来本市原因
          this.$Utils.setLocalStorage('ZZSY', this.filerData(data.ZZSY)); //
          this.$Utils.setLocalStorage('ZZDXZ', this.filerData(data.ZZDXZ)); // 房屋类型
          this.$Utils.setLocalStorage('370303', this.filerData(data['370303'])); // 派出所
//          this.$Utils.setLocalStorage('Police', this.filerData(data.Police)); // 派出所
        }
      });

      api.queryForPolice().then(res => {
        if(res.data.success) {
          const data = res.data.obj.rows;
          this.$Utils.setLocalStorage('pcsList', this.filerData(data,1));
        }
      });


    },
    filerData(srcData, type=1) { // 来穗接口筛选数据字典
      let toData = []
      if (type ==1) {
        srcData.forEach(item => {
          toData.push({
            value: item.itemName ? item.itemName : item.mph,
            key: item.itemCode ? item.itemCode : item.zhid
          })
        });
      } else {

        srcData.forEach((item,i) => {
          toData.push({
            name: item.itemName,
            value: item.itemCode
          })


          item.dataList.forEach((item2) => {
            toData.push({
              name: item2.itemName,
              value: item2.itemCode,
              parent: item2.typeCode
            })

            item2.dataList.forEach((item3) => {
              toData.push({
                name: item3.itemName,
                value: item3.itemCode,
                parent: item3.typeCode
              })
            })
          })
        });
      }
      return toData;
    },
  },
  created (){
    this.setRem()
  },
  mounted () {
    this.getDictionary()
    const _this = this;
    window.addEventListener("resize", function () {
      _this.setRem()
    });
  },

}
</script>

<style lang="less">
  @import '~vux/src/styles/reset.less';
  @import './styles/app.less';

  /*.xfv-from .weui-cell:before{content:normal !important;}*/
  .xfv-from .weui-cell{/*border-bottom:1px solid #d9d9d9;border-top:1px solid #d9d9d9;*/padding:0 .2rem;font-size:.32rem;height:.96rem;line-height:.96rem;}

  .step-top .weui-cell{border-top:none;}
  .step-bottom .weui-cell{border-bottom:none;}

  .dp-header .dp-item.dp-right{color:#1F67D0 !important;}
  .weui-cell:before{left:0px !important;}
  .vux-popup-header-right{color:#1F67D0 !important;}
  .vux-cell-value{color:#333 !important;}
  .vux-cell-disabled .vux-label{color:#333 !important;}
  .weui-switch:checked{border-color: #008cec !important;background-color: #008cec !important;}
  .shfenColor .weui-cell__ft{color:#333 !important;}
  .vux-cell-placeholder{color:#CFCCD6 !important;}
  iframe{display:none !important;opacity:0;}
ul,li{list-style:none;}


</style>
