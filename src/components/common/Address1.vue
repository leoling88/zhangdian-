<template>
  <div class="selcet-style">
    <div class="select-1-tab " @click="selectShow">
      <slot name="label">请选择</slot>
      <span v-text="selectDatas.value" class="fr text" ></span>
      <span v-if="selectDatas.submitData[0].value == ''" class="fr text color-2">请选择<slot name="label"></slot></span>      
      <i class="icon-arrow-right"></i>
    </div>
    <div class="select-bg" v-show="selectDatas.show"></div>
    <div class="select-show over-hid"  v-if="selectDatas.show">
      <div class="title">选择<slot name="label"></slot><span class="bntBlack" @click="selectClose">确定</span></div>
      <div class="selcet over-hid">
        <div class="load-show" v-show="selectDatas.pass"><img src="../../../static/images/loading.gif" alt=""></div>
        <ul class="ul0 w33 fl" v-for="(item, index) in selectDatas.liststData">
          <li v-for="(item0, index0) in item"  @click="optionClick(index, item0.key, item0.value)" :class="{hover:selectDatas.submitData[index].hover == item0.key}"><span v-text="item0.value"></span></li>
        </ul>

      </div>
    </div>
 
  </div>
</template>
<script>
  import {XInput,Cell, Icon,LoadMore, Scroller, PopupRadio} from 'vux'
  import { mapState } from 'vuex'
  import api from '../../api/api'
  export default {
    name:'v-select',
    data () {
      return {
      }

    },
    props: {
      selectDatas:Object,
    },
    computed: {
    },
    methods: {
      optionClick (index, key, value) {
        this.selectDatas.submitData[index].hover = key
        this.selectDatas.submitData[index].key = key
        this.selectDatas.submitData[index].value = value          
        if(index < 3){
          this.selectDatas.submitData[index + 1].hover = ''
          this.selectDatas.submitData[index + 1].key = ''
          this.selectDatas.submitData[index + 1].value = ''          
        }
        this.$emit('optionclick');
      },
      selectShow () {
        this.$emit('selectshow');
      },
      selectClose () {
        this.$emit('selectshide');
        // this.selectDatas.show = false

      }

    },

    mounted () {
    },
    destroyed () {
    }
  }
</script>
<style lang="less">
.selcet-style0{padding:.2rem;}

</style>
