// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store/store';
import { ConfirmPlugin } from 'vux';

Vue.use(ConfirmPlugin)
import FastClick from 'fastclick';
FastClick.attach(document.body)
import lrz from 'lrz' 
import utils from './scripts/utils/utils'; //配置基础工具类
Vue.use(utils);

Vue.config.productionTip = false


function initVue() {
	/* eslint-disable */
	new Vue({
	  el: '#app',
	  render: h => h(App),
	  router,
	  store,
	  template: '<App/>',
	  components: { App }
	})
}

initVue();





