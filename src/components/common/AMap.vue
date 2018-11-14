<template>
  <div class="selector_search_box">

    <img class="pos_icon" src="../../../static/images/timg.png" @click="showPopup"/>

    <!--关键字搜索-->
    <div :class="['scroller_wraper', 'page_silder', show ? 'show' : '']" @touchmove="inputBlur">
      <div id="pickerBox">
        <icon type="search"></icon>
        <!--<icon v-show="keyWord" type="clear" @click.native="keyWord = ''"></icon>-->
        <input v-model.trim="keyWord" placeholder="请输入要搜索的关键字" class="key_word" id="pickerInput" @focus="inputFocus">
        <div id="poiInfo"></div>
        <div class="btn suer_btn" @click="closePopup(true)">确定</div>
      </div>
      <div id="map_container"><!--地图--></div>
      <div :class="['recover_icon', isReload ? 'isReload' : '']" @click="reloadMap"><!--重新定位--></div>

      <scroller lock-x :use-pullup="true" :pullup-config="pullupConfig" @on-scroll="scrollHander" ref="scroller">
        <div class="scroller_container" style="padding-top:6.4rem;">
          <ul class="list_cont" ref="searchListCont">
            <template v-for="(item,index) in dataList">
              <!--checkItem方法内后三个参数不是必传，主要是针对企业信息准备的，他们分别是：单位地址，企业编号，企业电话-->
              <li @click="checkItem(item, index)" :key="index" :class="[index == 0 ? 'active' : '']">
                <span>{{item.name}}</span>
                <span v-if="index != 0" class="address">{{item.address}}</span>
                <icon type="success-no-circle"></icon>
              </li>
            </template>

            <!--无数据显示-->
            <li v-if="showLoading || dataList.length == 0" class="no_data">
              <div id="tip"></div>
              <load-more class="load_more" :show-loading="showLoading" :tip="showLoading ? '正在加载…' : '暂无数据'"></load-more>
              <!--<span v-show="!showLoading">暂无数据，可点击空白处返回</span>-->
            </li>
          </ul>

        </div>
      </scroller>
    </div>
  </div>
</template>
<script>
  import {XInput,Cell, Icon,LoadMore, Scroller, PopupRadio} from 'vux'
  import { mapState } from 'vuex'
  import api from '../../api/api'
  var map,marker,poiPicker;
  export default {
    components: {XInput,Cell,Icon,LoadMore, Scroller,PopupRadio },
    props: {
      describe: { // 描述
        type: String,
        default: ''
      },
      areaName: { // 区域代码对应的文本
        type: String,
        default: '山东省淄博市张店区'
      },
      disabled: { // 是否可用
        type:Boolean,
        default: false
      }
    },
    data() {
      return {
        title: '自定义',
        value: '',
        keyWord: '',
        show: false,
        currentPage: 1,
        index: 0,
        dataList: [],
        showLoading: '',  // 是否在加载中
        scrollTop: 0, // 组件滚动的高度
        pullupConfig:{
          content: '',
          pullUpHeight: 40,
          height: 40,
          autoRefresh: false,
          downContent: '',
          upContent: '',
          loadingContent: '',
          clsPrefix: 'xs-plugin-pullup-'
        },
        marker: '',
        location: [118.042569, 36.811054],
        sourceLocation: [118.042569, 36.811054],
        area: '', // 省市区
        address: '',  // 通过经纬度逆地理编码转换的地址
        isSelectPoi: false,
        isReload: false  // 重新加载地图
      }
    },
    watch: {
      show: function (val) {
        if (val) {
          var state = {
            title: "",
            url: location.href // 这个url可以随便填，只是为了不让浏览器显示的url地址发生变化，对页面其实无影响
          };
          window.history.pushState(state, state.title, state.url);
        }
      },
      areaName: function (val) {
        this.isSelectPoi = true
        this.geocoder (val)
      },
      isReload: function (val) {
        if (val) {
          this.$refs.scroller.reset({top: 0});
          const lis = this.$refs.searchListCont.children
          for(let i=0; i < lis.length; i++) {lis[i].className = ''}
          this.$refs.searchListCont.children[0].className = 'active'
        }
      }
    },
    methods: {
      checkItem (item, index) {
        this.isSelectPoi = true
        this.resetMap(item.location);
        this.index = index;
        this.value = item;
        const lis = this.$refs.searchListCont.children
        for(let i=0; i < lis.length; i++) {lis[i].className = ''}
        lis[index].className = 'active'
      },
      emit () {
        this.$emit('input', this.value, this.index);
        this.$emit('change', this.value, this.index);
      },
      infinite () {  // 上拉加载
        this.regeo()
      },
      showPopup () {
        if (!this.disabled) {
          this.show = !this.show
        }
      },
      closePopup (data) { // 在没有数据的情况下有效
        if (this.show) {
          this.show = false;
          if (typeof data == 'boolean') this.emit()
          this.$el.querySelector('.key_word').blur()
        }
      },
      scrollHander (pos) {
        this.scrollTop = pos.top
      },
      inputBlur () {   // 在拉动列表时，输入框失去焦点，防止手机键盘弹出来
        this.$el.querySelector('.key_word').blur()
      },
      inputFocus (event) {
        event.target.scrollIntoView(true)
      },
      filerData(srcData, toData){
        if(srcData instanceof Array && toData instanceof Array){
          const firstData = {
            area: this.area,
            name: this.address,
            address: this.address,
            location: this.location
          }
          this.value = firstData
          toData.push(firstData)
          srcData.forEach((item,index) => {
            toData.push({
              area: this.area,
              name: item.name,
              address: item.address,
              location: item.location instanceof Array ? item.location : item.location.split(',')
            })
          });
        }
      },
      poiPicker () {
        const _this = this
        AMapUI.loadUI(['misc/PoiPicker'], function(PoiPicker) {
          poiPicker = new PoiPicker({
            city:'淄博',
            input: 'pickerInput'
          });
          //选取了某个POI
          poiPicker.on('poiPicked', function(poiResult) {
            var poi = poiResult.item
            _this.isSelectPoi = false
            _this.resetMap(poi.location)
          });
        });
      },
      reloadMap () {
        if (this.sourceLocation[0] != this.location[0] ||　this.sourceLocation[1] != this.location[1]) {
          this.isReload = true
          this.resetMap(this.sourceLocation)
        }
      },
      resetMap (location) {   // 重设地图marker
        marker.setMap(map);
        marker.setPosition(location); //更新点标记位置
        map.setCenter(location);   //将标记位置设置为地图中心点
      },
      createAMap () {
        const _this = this
        map = new AMap.Map('map_container', {
          resizeEnable: true,
          center: this.location,
          zoom: 15
        });

        marker = new AMap.Marker({
          icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
          position: map.getCenter()
        });
        marker.setMap(map);

        map.on('touchstart', function (e) {
          _this.isSelectPoi = false
        })

        map.on('moveend', function(e) {
          const pos = map.getCenter()
          marker.setPosition(pos); //更新点标记位置
          _this.location = [pos.lng, pos.lat]
          if (!_this.isSelectPoi) {
            _this.regeo(_this.location)
          } else {
            _this.isReload = false
          }
        });
      },
      geocoder (address) {  // 高德地理编码
        const _this = this
        var geocoder = new AMap.Geocoder({
          city: "370301", //城市，默认：“全国”
          radius: 1000 //范围，默认：500
        });

        geocoder.getLocation(address, function(status, result) {//地理编码,返回地理编码结果
          if (status === 'complete' && result.info === 'OK') {
            const data = result.geocodes[0].location
            _this.location = [data.lng, data.lat]
            _this.sourceLocation = [data.lng, data.lat]
            _this.regeo(_this.location)
            _this.resetMap(_this.location)
          }
        })
      },
      regeo (pos) {  // 高德逆地理编码
        this.showLoading = true
        this.dataList = []
        api.regeo({
          location: pos.toString()
        }).then((res) => {
          const data = res.data.regeocode
          const addressComponent = data.addressComponent
          this.area = addressComponent.province + addressComponent.city + addressComponent.district
//          this.address = data.formatted_address
          this.address = data.addressComponent.township + data.addressComponent.streetNumber.street + data.addressComponent.streetNumber.number
          this.filerData(data.pois, this.dataList);
          this.$refs.scroller.donePullup();
          this.$refs.scroller.reset({top: 0});
          this.isReload = false
          this.showLoading = false
          /*const data = JSON.parse(res.data.jsonRes[0]);
           const totalPage = Math.ceil(data.page.count/data.page.pageSize);  // 目前接口没有统计分页总页数的参数
           if (res.data.success && data.ackCode == 1) {
           this.filerData(data.dataList, this.dataList);
           if (this.currentPage >= totalPage) {
           this.$refs.scroller.disablePullup();
           if (this.dataList.length == 0) this.$refs.scroller.reset({top: 0});
           } else {
           this.$refs.scroller.enablePullup();
           this.$refs.scroller.donePullup();
           this.$refs.scroller.reset();
           }
           }*/
        }).catch((res) => {
          this.$refs.scroller.disablePullup();
          this.isReload = false
          this.showLoading = false
        });
      },
      addBackEvent () {
        if (window.AlipayJSBridge) {
          document.addEventListener("back", this.closePopup, false);
        } else {
          window.addEventListener("popstate", this.closePopup, false);
        }
      },
      removeBackEvent () {
        if (window.AlipayJSBridge) {
          document.removeEventListener("back", this.closePopup, false);
        } else {
          window.removeEventListener("popstate", this.closePopup, false);
        }
      }
    },
    mounted () {
      this.createAMap()
      this.poiPicker()
      this.addBackEvent()
    },
    destroyed () {
      this.removeBackEvent()
    }
  }
</script>
<style lang="less" scoped>

  .pos_icon{width:.38rem;height:.46rem;display: block;position: absolute;right:5.8rem;top:.4rem;margin-top: -.19rem;}
  .recover_icon{width:35px;height:35px;position: fixed;right:.2rem;top: 5.2rem;z-index: 9999999999;border:1px solid #ccc;background: #fff url(../../../static/images/loc_gray.png) 50% 50% no-repeat;}
  .recover_icon.isReload{background: #fff url(../../../static/images/loading.gif) 50% 50% no-repeat;}



  .page_silder{transform: translateX(100%);-webkit-transform: translateX(100%);will-change: transform;will-change: -webkit-transform;transition: all 250ms ease-in-out;backface-visibility: hidden;perspective: 1000;}

  #pickerBox{
    width: 100%;position: absolute;z-index: 9999;top: 0;right: 0;
    .weui-icon-clear{position: absolute;right:1.65rem;top:50%;margin-top:-7px;}
    .weui-icon-search{width:.7rem;height:100%;line-height: .85rem;text-indent: .12rem;position: absolute;left:0;top:0;}
    .key_word{width:100%;height:.85rem;display:block;border:none;float:left;box-sizing: border-box;background: #fff;font-size: .3rem;text-indent: .7rem;
      &:focus{outline:none;}
    }
    .suer_btn{width:17.65%;height:100%;float:right;line-height:.85rem; text-align: center;background:#1F67D0;color:#fff;position: absolute;right:0;top:0;}
    #poiInfo {background: #fff;}
  }
  .search_box.show{transform: translateX(0);-webkit-transform: translateX(0);}

  #map_container{width:100%;height:5.5rem;overflow: hidden;position: fixed;left:0;top:.85rem;z-index:9;}

  .vux-x-input{
    width: 100%;background:#FAFAFA;padding:0;margin: 0 0px;border-bottom:1px solid #eee;
    .suer_btn{background: #1F67D0;line-height:27px;color:#fff;border-radius: .08rem;width:1rem;position: absolute;right:10px;top:6px;}
    .weui-icon-search{height:41px;line-height: 41px;position: relative;padding-right:10px;
      &:after{content: '';display: block;width: 1px; height:27px;background: #eee;position: absolute;right:0;top:7px;}
    }
  }

  .scroller_wraper{width:100%;height:100%;overflow:hidden;background: #eee;position: fixed;top:0;z-index: 1;}
  .scroller_wraper.show{transform: translateX(0);-webkit-transform: translateX(0);}

  .list_cont{
    width:100%;min-height:100%;overflow: hidden;box-sizing: border-box;
    li{
      padding:.1rem 0 .1rem .3rem;min-height: .9rem;border-bottom:1px solid #eee;display: block;background: #fff;
      span{display: block;width:80%;overflow:hidden;line-height: .45rem;color:#333;font-size: .3rem;}
      .address{display: block;line-height: .35rem;color:#999;font-size: .25rem;margin-top:.05rem;}
      /*span:only-of-type{line-height: 1rem;}*/
    }

    .no_data{text-indent: 0;overflow: hidden;background: none;}
    .go_back_btn{display: inline-block;width: 80%;line-height: 1rem;text-indent: 0;text-align: center;color:#333;background:#eee;}
    .weui-icon-success-no-circle{color: #1F67D0;float: right;margin-right: .3rem;display: none;}
    li.active{
      position: relative;
      span{color:#1F67D0;}
    }
    li.active .weui-icon-success-no-circle{display: inline-block;position: absolute;top: 50%;right:.1rem;margin-top: -12px;}
    li.no_have{color:#FF0000;}
  }
  .weui_icon_warn{float: right;}
  .weui-icon-info{margin-right:.15rem;}
  .loader_more{width:100%;height:0;line-height:.8rem;overflow:hidden;margin:0;position: fixed;left: 0;bottom:0;z-index:9999;background: #fff;transition: all .5s ease;}
  .showHeight{height:1rem;}

</style>
<style>
  .amap-markers{z-index: 9999999999999999999999;}
  .amap-icon{width:.4rem;height:.65rem}
  .amap-ui-poi-picker-search-results-container, .amap-ui-poi-picker-sugg-container{z-index:999977777777999999999991; }
</style>
