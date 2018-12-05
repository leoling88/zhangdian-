<template>
  <div class="selcet-style">
    <div class="select-1-tab " @click="selectShow" >
      <slot name="label">请选择</slot>
      <span class="icon-arrow-right" v-if='selectDatas.seledisab'><i class="icon-arrow-icon"></i></span>
      <span v-text="selectDatas.submitData.name" class="fr text"></span>
      <span v-if="selectDatas.submitData.name == ''" class="fr text color-2">请选择<slot name="label"></slot></span>

    </div>
    <div class="select-bg" v-show="selectDatas.show"></div>
    <div class="select-show "  v-if="selectDatas.show">
      <div class="title">选择<slot name="label"></slot><span class="bntBlack" @click="selectClose">取消</span></div>
      <div class="selcet ">
        <div class="load-show" v-show="selectDatas.pass"><img src="../../../static/images/loading.gif" alt=""></div>
        <div  v-if="!selectDatas.listShow">    <!--手动增加 -->
          <div class="text2"><input type="text" v-model="selectDatas.addAddressVal"></div>
          
          <span @click="setNewAddress" class="add-but2">确定</span>
        </div>
        <div v-else>
          <div class="text" ><input type="text"  v-model="selectDatas.searchVal"><span @click="searchList" class="search">搜索</span></div>   
          <ul class="option-bor"  >
            <li v-for="(item, index) in selectDatas.liststData"  @click="optionClick(item.value, item.name, index)" v-if="item"><span v-text="item.name"></span></li>
          </ul>
          <div  class="add-but" @click="addInputShow" v-if="selectDatas.addInpuBut">若搜索不到，请点击手动输入</div>
        </div>
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
      optionClick (value, name, key) {    //点击列表获取当前值
       
        this.selectDatas.submitData.hover = key
        this.selectDatas.submitData.key = key
        this.selectDatas.submitData.value = value
        this.selectDatas.submitData.name = name
        this.selectDatas.show = false
        this.$emit('optionclick');
        
      },
      selectShow () {
        this.$emit('selectshow');
      },
      selectClose () {
        this.selectDatas.show = false
        this.selectDatas.listShow = true
        this.$emit('selectshide');
      },
      searchList () {   //搜索筛选
        let _val = this.selectDatas.searchVal
        let _data = this.selectDatas.liststData
        if(_val != ''){
          for (var i = 0; i < _data.length; i ++){
            if(_data[i].name.indexOf(_val)>-1 ){

            }else{
              this.$set(this.selectDatas.liststData, i, false)

            }            
          }
          console.log()



        }
        this.$emit('searchlist');
      },
      addInputShow () {
        this.selectDatas.listShow = false
      },
      setNewAddress() {      //手动增加新地址
        this.selectDatas.submitData.name = this.selectDatas.addAddressVal
        this.selectDatas.listShow = true
        this.selectDatas.show = false
        this.$emit('setnewaddress');

      },





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
