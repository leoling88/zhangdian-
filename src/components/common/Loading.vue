<template>
  <div :class="['loading',show ? 'show' : '']">
    <div class="loader-inner ball-pulse">
      <spinner type="android" slot="value" class="android"></spinner>
    </div>
  </div>
</template>
<script>
  import { mapState } from 'vuex'
  import { Spinner} from 'vux'
  export default {
    name: 'v-loading',
    components: {
      Spinner
    },
    props: {
      show: {
        type: Boolean
      }
    },
    computed: {
      ...mapState([
        'styleColor'
      ])
    }
  };
</script>
<style scoped>
  .loading{position: fixed;  top: -100%;  left: 0;  right: 0;  z-index: 9999999;  width: 100%;  height: 100%;transition: all .5s ease;opacity: 0;}
  .loading.show{/*top:0;*/transform: translateY(80%);opacity: 1;}

  .loading .ball-pulse{width: 1.2rem; height: 1.2rem;margin:0 auto;background: #333; border-radius: 5px; opacity: 0.9;text-align: center;line-height: 1.05rem;transform: translateY(5rem);}
  .vux-spinner-android{ stroke: #fff!important;}
</style>

