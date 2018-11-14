import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
export default new Router({

  routes: [
    //首页
    {
      path: '/',
      component: function (resolve) {
        require(['../components/Index.vue'], resolve);
      },
      meta: {
        title: '数字广东',
        showBottom: false
      }
    },
    //step1
    {
      path: '/registration/:comGuid/:alipayAcount',
      component: function (resolve) {
        require(['../components/registration/step1.vue'], resolve);
      },
      meta: {
        title: '数字广东',
        showBottom: false
      }
    },
    //step2
    {
      path: '/step2/:idNo',
      component: function (resolve) {
        require(['../components/registration/step2.vue'], resolve);
      },
      meta: {
        title: '数字广东',
        showBottom: false
      }
    },
    //step3
    {
      path: '/step3/:idNo',
      component: function (resolve) {
        require(['../components/registration/step3.vue'], resolve);
      },
      meta: {
        title: '数字广东',
        showBottom: false
      }
    },
    {
      path: '/step4/:idNo',
      component: function (resolve) {
        require(['../components/registration/step4.vue'], resolve);
      },
      meta: {
        title: '数字广东',
        showBottom: false
      }
    },
    {
      path: '/successStep/:idNo',
      component: function (resolve) {
        require(['../components/registration/successStep.vue'], resolve);
      },
      meta: {
        title: '数字广东',
        showBottom: false
      }
    },
    {
      path: '/card/:idNo',
      component: function (resolve) {
        require(['../components/registration/card.vue'], resolve);
      },
      meta: {
        title: '数字广东',
        showBottom: false
      }
    },
    {
      path: '/cardList/:idNo',
      component: function (resolve) {
        require(['../components/registration/cardList.vue'], resolve);
      },
      meta: {
        title: '数字广东',
        showBottom: false
      }
    },
    //领取卡包详情
    {
      path: '/cardDetail/:idNo',
      component: function (resolve) {
        require(['../components/registration/cardDetail.vue'], resolve);
      },
      meta: {
        title: '数字广东',
        showBottom: false
      }
    },
    {
      path: '/step3Plus/:idNo',
      component: function (resolve) {
        require(['../components/registration/step3Plus.vue'], resolve);
      },
      meta: {
        title: '数字广东',
        showBottom: false
      }
    },
    {
      path: '/reminder',
      component: function (resolve) {
        require(['../components/registration/reminder.vue'], resolve);
      },
      meta: {
        title: '数字广东',
        showBottom: false
      }
    },
    {
      path: '/qrcode',
      component: function (resolve) {
        require(['../components/qrcode.vue'], resolve);
      },
      meta: {
        title: '分享二维码',
        showBottom: false
      }
    },
    //意见反馈
    {
      path: '/feedback/:openid',
      component: function (resolve) {
        require(['../components/help/feedback.vue'], resolve);
      },
      meta: {
        title: '意见反馈',
        showBottom: true
      }
    },
    //我的反馈
    {
      path: '/myQ/:openid',
      component: function (resolve) {
        require(['../components/help/myQ.vue'], resolve);
      },
      meta: {
        title: '我的反馈',
        showBottom: true
      }
    },
    //反馈与帮助
    {
      path: '/help/:openid',
      component: function (resolve) {
        require(['../components/help/index.vue'], resolve);
      },
      meta: {
        title: '帮助与反馈',
        showBottom: true
      }
    },
    //问题解答
    {
      path: '/article/:openid/:comGUID',
      component: function (resolve) {
        require(['../components/help/article.vue'], resolve);
      },
      meta: {
        title: '帮助与反馈',
        showBottom: true
      }
    },
    //我的问题解答
    {
      path: '/article2/:openid/:comGUID',
      component: function (resolve) {
        require(['../components/help/article2.vue'], resolve);
      },
      meta: {
        title: '帮助与反馈',
        showBottom: true
      }
    },  
    //处理成功页面
    {
      path: '/results/:openid',
      component: function (resolve) {
        require(['../components/help/results.vue'], resolve);
      },
      meta: {
        title: '提交结果',
        showBottom: true
      }
    }, 
  ]
});
