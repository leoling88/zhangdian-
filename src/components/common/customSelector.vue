<template>
  <div class="selector_box">

    <cell class="custom_cell" :title="describe" :tldata="placedata" :value="itemName" :is-link="isLink" @click.native="showPopup" :disabled="disabled">
      <span class="vux-cell-option" v-if="!itemName">{{placedata}}</span>
      <span class="" v-if="isTexts">{{texts + itemName}}</span>
      <!--<icon v-if="!isFirst && itemName == ''" type="warn"></icon>-->
    </cell>

    <div :class="['popup_cont',show && !disabled ? 'active' : '']" class="popup_cont" ref="popup" v-if="isNoneTo">
      <div class="title">选择{{describe}}<span @click="show = !show">取消</span></div>
      <div class="poput_wraper">
        <ul class="list_cont" ref="searchListCont">
          <template v-for="(item,index) in options">
            <li @click="checkItem(item.key, item.value, index)" :key="index" :class="[item.key == value ? 'active' : '']">
              {{item.value}}
              <icon type="success-no-circle"></icon>
            </li>
          </template>
          <li :class="['no_data',options.length == 0 ? 'show_no_data' : '']">
            <load-more class="load_more" :show-loading="options.length == 0" :tip="options.length == 0 ? '正在加载' : '暂无数据'"></load-more>
            <!--<load-more class="load_more" :show-loading="showLoading" :tip="showLoading ? '正在加载' : '暂无数据'"></load-more>-->
          </li>
        </ul>
      </div>
    </div>

    <!--遮罩层-->
    <div :class="['mask_box', show ? 'show' : '']" @click="show = !show" v-if="isNoneTo"></div>

  </div>
</template>
<script>
  import {Popup, Group, Cell, Icon, LoadMore} from 'vux'
  export default {
    props: {
      describe: { // 描述
        type: String,
        default: ''
      },
      placedata:{//请选择的制
        type: String,
        default: ''
      },
      value: [String, Number],  // 通过v-model指令传递给子组件的属性
      options: Array, // 数据
      texts: String,
      isTexts: {
        type: Boolean,
        default: false
      },
      isFirst: { // 是否第一次选择
        type: Boolean,
        default: true
      },
      disabled: { // 是否可用
        type:Boolean,
        default: false
      },
      showLoading: { // 是否在加载中
        type:Boolean,
        default: false
      },
      isLink: { // 是否显示箭头
        type:Boolean,
        default: true
      },
      isNoneTo: { //
        type:Boolean,
        default: true
      }
    },
    components: {Popup, Group, Cell,Icon, LoadMore},
    data() {
      return {
        title: '自定义',
        itemName: '',  // key对应的文本
        show:false,
        scrollTop: ''
      }
    },
    watch: {
      value: function(val, old) {
        if (val != old) this.assignments();
        this.$emit('change',val, this.itemName);
      },
      show: function (val, old) {
        if (val) {
          document.documentElement.style.position = 'fixed'
        } else {
          document.documentElement.style.position = 'static'
        }
        window.scrollTo(0, this.scrollTop)
      }
    },
    updated(){
      this.assignments();
    },
    methods: {
      checkItem(key, val, index){
        const lis = this.$refs.searchListCont.children
        if (this.itemName != val) {  // 如果值不一致，触发
          this.itemName = val;
          this.$emit('input',key, val);
        }
        this.show = !this.show;
        for(let i=0; i < lis.length; i++) {
          if (i == index) {
            lis[i].className = 'active'
          } else if (i != lis.length - 1) {
            lis[i].className = ''
          }
        }
      },
      assignments(){  // 回显
        const options = this.$props['options'];
        options.forEach((item)=>{
          if (item.key == this.$props['value']) this.itemName = item.value;
        });
      },
      showPopup () { // 打开组件
        if (!this.disabled) {
          this.show = !this.show
          this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop
          document.documentElement.style.top = -this.scrollTop + 'px'
          window.scrollTo(0, this.scrollTop)
        }
        this.$emit('to');
      }
    },
    mounted () {
      this.assignments();
    }
  }
</script>
<style lang="less" scoped>
  .popup_cont{
    width:100%;height:7.56rem;overflow:hidden;position: fixed;bottom:-7.56rem;left:0;z-index:9999;background: #fff;transition: all .5s ease;
    .title{line-height: 1rem;background: #eee;font-size: .32rem;text-indent: .2rem;
      span{display: inline-block;float: right;width:1.5rem;color:#1F67D0;text-align: center;text-indent: 0;}
    }
    .poput_wraper{height:6.56rem;overflow-y: scroll;}
    .poput_wraper::-webkit-scrollbar{display: none;}
  }
  .popup_cont.active{bottom:0;}
  .mask_box{width:100%;height:100%;display: none;overflow: hidden;position: fixed;left:0;top:0;z-index: 9998;background: rgba(0,0,0,.6);}
  .mask_box.show{display: block;}
  .selector_box .custom_cell{position: relative;box-sizing: border-box;
    &:before{content: "";display: block;height:1px;width:100%;top:0;left:0px;}
  }

  .list_cont{
    width:100%;overflow: hidden;background: #fff;
    li{text-indent:.3rem;border-bottom:1px solid #eee;display: block;height: .8rem;line-height: .8rem;position:relative;
      .load_more{width:80%;margin-top:1rem;}
    }
    li:last-of-type{border:none;}
    .no_data{display:none;line-height: 4.6rem;text-align: center;font-size: .34rem;background:none;color:#999;}
    .show_no_data{display: block;}
    .weui-icon-success-no-circle{color: #1F67D0;float: right;margin-right: .3rem;display: none;position:absolute;right:.1rem;top:.1rem;}
    li.active .weui-icon-success-no-circle{display: inline-block;}
  }
  .weui_icon_warn{/*float: right;*/display: inline-block;}
  .weui-icon-info{margin-right:.15rem;}
</style>

