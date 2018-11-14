
import axios from 'axios';
import qs from 'qs';
// axios.defaults.baseURL ='http://lst.createt.cn:3389/cnZhangDian';
axios.defaults.baseURL ='/cnZhangDian';    //http://192.168.16.43:8080
export default {

  /*
   * 获取来穗数据字典
   * nativeFlag: 户籍状态 0: 非户籍,1:户籍
   */
  queryDictionaryList (nativeFlag) {  // 本地数据字段（多个）
    return axios.get(`/mobile/queryDictionaryList?typeCodes=XZQ,XB,MZ,WHCD,ZZMM,HKXZ,HYZK,SF,JZFS,ZZDXZ,ZZSY,JZY,LBSYY,370303,QYLD,FBY&nativeFlag=${nativeFlag || 0}`);
  },

  queryNewDictionaryList(nativeFlag) {
    return axios.get(`/mobile/queryNewDictionaryList?typeCode=370303&nativeFlag=1`);
  },

  queryForPolice() {
    return axios.get(`/mobile/queryForPolice?flag=1`);
  },


  // 学历字典
  StudyGrade () {
    return axios.get('/mobile/dataDescList?type=StudyGrade');
  },

  // 户口类型字典
  getRegType () {
    return axios.get('/mobile/dataDescList?type=RegType');
  },

  // 婚姻状况字典
  getMarriyState () {
    return axios.get('/mobile/dataDescList?type=MarriyState');
  },

  // 政治面貌字典
  getPoliticalStatus () {
    return axios.get('/mobile/dataDescList?type=PoliticalStatus');
  },

  // 居住处所类型字典
  getHouseType () {
    return axios.get('/mobile/dataDescList?type=HouseType');
  },

  // 是否承租人字典
  getLessee () {
    return axios.get('/mobile/dataDescList?type=Lessee');
  },

  // 居住方式字典
  getLiveType () {
    return axios.get('/mobile/dataDescList?type=LiveType');
  },

  // 居住事由字典
  getReson () {
    return axios.get('/mobile/dataDescList?type=Reson');
  },

  // 与填表人关系字典
  getRelation () {
    return axios.get('/mobile/dataDescList?type=Relation');
  },

  // 就业情况字典
  getEmploymentStatus () {
    return axios.get('/mobile/dataDescList?type=employmentStatus');
  },

  /*
   * 首页新闻列表
   * param: page 新聞页数
   */
  getNewsList (page,type) {
    return axios.get(`/mobile/newsWebIntf/newslist?opentype=1&rows=5&newsType=${type}&index=${page}`);
  },

  /*
   * 新闻詳情
   * param: newsId 新聞id
   */
  newsDetail (newsId) {
    return axios.get(`/mobile/newsWebIntf/newsDetail?comGUID=${newsId}`);
  },

  /*
   * 新闻点赞
   * param: newsId 新聞id
   */
  newsThumbsUp (newsId) {
    return axios.post(`/mobile/newsWebIntf/upLikecnt?comGUID=${newsId}`);
  },

  /*
   * 新闻浏览次数
   * param: newsId 新聞id
   */
  newsViewcnt (newsId) {
    return axios.post(`/mobile/newsWebIntf/upViewcnt?comGUID=${newsId}`);
  },
  /*
   * 常见问题---列表
   */
  helpList () {
    return axios.post(`/mobile/helplist`);
  },
   /*
   * 常见问题---问题答案
   */
  helpDetai (comguid) {  
    return axios.post(`/mobile/helpdetail?comguid=${comguid}`);
  },

  /*
   * 首页banner
   * params: 表单数据对象
   */
  homePage () {
    return axios.post('/mobile/newsWebIntf/homePage');
  },

  /*
   * 获取从支付宝返回的信息
   */
  getUserDetails (comGuid) {
    return axios.get(`/mobile/peopleDetails?comGuid=${comGuid}`);
  },

  /*
   * 提交居住证办理基础信息
   * formData: 表单数据对象
   * formData: 表单数据对象
   */
  saveResideInfo (params) {
    return axios.post(`/mobile/peopleSave?jsonStr=${JSON.stringify(params.formData)}&homeType=${params.homeType}&isRegister=${params.isRegister}&isEdit=${params.isEdit}`);
  },

  /*
   * 详情信息回显
   * params: {string} 身份证号码
   */
  rebackPeopleInfo (params) {
    return axios.post(`/mobile/rebackPeopleInfo?idCard=${params.idCard}&isEdit=${params.isEdit}&step=${params.step}`);
  },

  /*
   * 子女保存接口
   * params: 表单数据对象
   */
  childrenSave (params) {
    return axios.post(`/mobile/childrenSave?jsonStr=${JSON.stringify(params)}`);
  },

  /*
   * 删除子女接口
   * params: {object} 表单数据对象
   * delType: 删除类型，1，全部删除，2、单个删除
   * parentUuid: 用户主键ID
   * childrenArr: 用户主子女主键ID
   */
  deleteChildren (params) {
    return axios.get('/mobile/deleteChildren', {
      params: {
        delType: params.delType,
        parentUuid: params.parentUuid,
        childrenArr: params.childrenArr
      }
    });
  },

  /*
  *  居住证接口
  * */
  applyResidence (idCard) {
    return axios.get('/mobile/applyResidence?idCard='+idCard);
  },
  /*
  *  是否已领取电子卡接口
  * */
  recieveCard (openid, state) {
    return axios.get('/mobile/recieveCard?openid='+openid + '&state=' + state);
  },
  /*
  *  查询办理居住证办理剩余天数接口
  * */
  daysRemailing (params) {
      //return axios.get('/mobile/daysRemailing?idCard='+idCard);
      return axios.get(`/mobile/daysRemailing?idCard=${params.idCard}`);

  },
  //取消登记   20180807  + leoLing
  cancellationReg(params) {
      return axios.get(`/mobile/changeStatus?comguId=${params.idComgu}`);
  },
  /*
   *  查询是否有传图片
   * */
  isHavePic (idCard) {
    return axios.get('/mobile/isHavePic?idCard='+idCard);
  },

  /*
  *  图片上传接口
  *  params {object}
  *  fileType 图片类型
  *  idCard 身份证号
  *  picList 图片数组
  * */
  uploadPic(params) {
    return axios.post('/mobile/uploadPic', qs.stringify({
      picList: JSON.stringify(params.picList),
      idCard: params.idCard,
      fileType: params.fileType
    }));
  },
  /*
   *  图片上传接口
   *  params {String}  uuid
   * */
  deletePic (params) {
    return axios.post('/mobile/delPic?uuid='+ params);
  },
  /*
   *  获取短信验证码接口
   *  params {Object}
   *  openid: 支付宝id
   *  wxsqn: 支付宝id
   *  mobile: 手机号
   * */
  sendMessage (params) {
    return axios.post('/mobile/laisuiSendMessage',qs.stringify({
      openid: params.openid,
      wxsqn: params.wxsqn,
      account: params.account,
      opentype: 1,
      mobile: params.mobile
    }));
  },
  /*
   *  注册接口
   *  params {Object}
   *  openid: 支付宝id
   *  xm: 姓名
   *  zjhm: 证件号码
   *  password：登录密码 8-16 字母或数字
   *  mobile： 手机号码
   *  checkCode：短信验证码
   * */
  saveUser (params) {
    return axios.post('/mobile/laisuiSaveUser',qs.stringify({
      openid: params.openid,
      opentype: 1,
      xm: params.name,
      zjhm: params.idCard,
      // password: params.passWord,
      mobile: params.mobile,
      checkCode: params.identifyingCode
    }));
  },

  /*
  *  反馈接口
  *  defaultOpinion   问题点
  *  personalOpinion  问题内容
  *  openid  支付宝ID
  *  file 

  * */
  saveFeedback(params) {
    return axios.post('/mobile/feedBackSave', qs.stringify({
      defaultOpinion: params.defaultOpinion,
      personalOpinion: params.personalOpinion,
      openid: params.openid,
      files: params.files,
    }));
  },
  /*
   *  登录接口
   *  params {Object}
   *  openid: 支付宝id
   *  wxsqn: 微信授权码
   *  account: 证件号码或手机号码
   *  password：登录密码
   * */
  login (params) {
    return axios.post('/mobile/laisuiLogin',qs.stringify({
      openid: params.openid,
      wxsqn: params.wxsqn,
      account: params.account,
      password: params.password
    }));
  },
  /*
   *  找回密码接口
   *  params {Object}
   *  openid: 支付宝id
   *  wxsqn: 微信授权码
   *  checkCode: 短信验证码
   *  newPassword：新密码
   *  mobile: 手机号码
   * */
  findPassword (params) {
    return axios.post('/mobile/laisuiFindPassword',qs.stringify({
      openid: params.openid,
      wxsqn: params.wxsqn,
      opentype: 1,
      checkCode: params.checkCode,
      newPassword: params.newPassword,
      mobile: params.mobile
    }));
  },
  /*
   *  行政区查询
   *  params {Object}
   *  openid: 支付宝id
   *  wxsqn: 微信授权码
   *  wxsqm：授权码(第三方)
   *  itemName：字典名称，支持模糊查询
   * */
  queryXzqList (params) {
    return axios.post('/mobile/laisuiQueryXzqList',qs.stringify({
      openid: params.openid,
      wxsqn: params.wxsqn,
      account: params.account,
      opentype: 1,
      wxsqm: params.wxsqm,
      itemName: params.itemName
    }));
  },
  /*
   *  街镇查询
   *  params {Object}
   *  openid: 支付宝id
   *  wxsqn: 微信授权码
   *  xzq: 行政区代码
   *  itemName: 代码名称，支持模糊查询
   *  currentPage 当前页 如果为空或不是正整数，默认为1
   * */
  queryJzdmPage (params) {
    return axios.post('/mobile/laisuiQueryJzdmPage',qs.stringify({
      openid: params.openid,
      wxsqn: params.wxsqn,
      account: params.account,
      opentype: 1,
      xzq: params.xzq,
      currentPage: params.currentPage,
      itemName: params.itemName,
    }));
  },
  /*
   *  街路巷查询 (图南)
   *  params {Object}
   *  openid: 支付宝id
   *  wxsqn: 微信授权码
   *  jz: 街镇代码
   *  itemName: 街路巷名称，支持模糊查询
   *  currentPage 当前页 如果为空或不是正整数，默认为1
   * */
  queryJddmPage (params) {
    return axios.post('/mobile/laisuiQueryJddmPage',qs.stringify({
      openid: params.openid,
      wxsqn: params.wxsqn,
      account: params.account,
      opentype: 1,
      jz: params.jz,
      itemName: params.itemName,
      currentPage: params.currentPage
    }));
  },

  /*
   *  街路巷查询（本地）
   *  params {Object}
   *  typeCode: 街镇代码
   *  itemName: 街路巷名称，支持模糊查询
   *  currentPage 分页页码
   *  pageSize 单页数据条数,目前写死50条
   * */
  queryDictionaryListPage (params) {
    return axios.get('/mobile/queryDictionaryListPage',{
      params: {
        typeCode: params.typeCode,
        itemName: params.itemName,
        currentPage: params.currentPage,
        pageSize: 50
      }
    });
  },

  /*
   *  门牌号查询/出租屋（栋）信息
   *  params {Object}
   *  openid: 支付宝id
   *  wxsqn: 微信授权码
   *  jddm: 街道代码
   *  mpmc: 门牌名称
   *  currentPage 当前页 如果为空或不是正整数，默认为1
   * */
  queryFwxxzPage (params) {
    return axios.post('/mobile/laisuiQueryFwxxzPage',qs.stringify({
      openid: params.openid,
      wxsqn: params.wxsqn,
      account: params.account,
      opentype: 1,
      jddm: params.jddm,
      mpmc: params.mpmc,
      currentPage: params.currentPage
    }));
  },
  /*
   *  房号查询/出租屋（套）信息
   *  params {Object}
   *  openid: 支付宝id
   *  wxsqn: 微信授权码
   *  zhid: 房屋栋ID
   *  dy: 详址 支持模糊查询
   *  currentPage: 当前页 如果为空或不是正整数，默认为1
   * */
  queryFwxxfhPage (params) {
    return axios.post('/mobile/laisuiQueryFwxxfhPage',qs.stringify({
      openid: params.openid,
      wxsqn: params.wxsqn,
      account: params.account,
      opentype: 1,
      zhid: params.zhid,
      currentPage: params.currentPage,
      dy: params.dy
    }));
  },
  /*
   *  查询企业单位信息
   *  params {Object}
   *  openid: 支付宝id
   *  wxsqn: 微信授权码
   *  dwmc: 单位名称 支持模糊查询
   *  currentPage: 当前页 如果为空或不是正整数，默认为1
   * */
  queryDwxxPage (params) {
    return axios.post('/mobile/laisuiQueryDwxxPage',qs.stringify({
      openid: params.openid,
      wxsqn: params.wxsqn,
      account: params.account,
      opentype: 1,
      dwmc: params.dwmc,
      currentPage: params.currentPage
    }));
  },
  /*
   *  查询最近七天预约登记
   *  params {Object}
   *  openid: 支付宝id
   *  wxsqn: 微信授权码
   *  jz: 街镇代码
   *  yyrq: 预约日期（YYYY-MM-DD）必须大于当天，只能预约七天范围内的
   * */
  laisuiQuerySmhsszList (params) {
    return axios.post('/mobile/laisuiQuerySmhsszList',qs.stringify({
      openid: params.openid,
      wxsqn: params.wxsqn,
      account: params.account,
      opentype: 1,
      jz: params.jz,
      yyrq: params.yyrq
    }));
  },
  /*
   *  查询居住证信息
   *  params {Object}
   *  openid: 支付宝id
   *  wxsqn: 微信授权码
   *  zjhm: 证件号码
   *  xm: 姓名
   *  opentype: 1: 支付宝应用,2: 来穗小程序
   * */
  laisuiJzzCardInfo (params) {
    return axios.post('/mobile/laisuiJzzCardInfo',qs.stringify({
      openid: params.openid,
      wxsqn: params.wxsqn,
      opentype: 1,
      zjhm: params.zjhm,
      xm: params.xm
    }));
  },

  /*
   *  查询用户预约结果的街道地址
   *  params {Object}
   *  idCard: 证件号码
   * */
  getStreeDate (params) {
    return axios.post('/mobile/getStreeDate',qs.stringify({
      idCard: params.idCard,
    }));
  },

  /*
   *  积分首页列表
   *  params {Object}
   *  index: 页数
   *  rows: 每页条数
   * */
  goodsList (page) {
    return axios.post(`/mobile/goodsList?rows=6&index=${page}`);
  },
  /*
   *  我的积分
   *  params {Object}
   *  userId: 用户id
   * */
  selectJiFen (params) {
    return axios.post('/mobile/selectJiFen',qs.stringify({
      userId: params.userId
    }));
  },
  /*
   *  商品详情查询
   *  params {Object}
   *  goodsId: 用户id
   * */
  goodsDetail (params) {
    return axios.post('/mobile/goodsDetail',qs.stringify({
      goodsId: params.goodsId
    }));
  },
  /*
   *  兑换记录列表
   *  params {Object}
   *  index: 页数
   *  rows: 每页条数
   * */
  orderList (page) {
    return axios.post(`/mobile/orderList?rows=6&index=${page}`);
  },
  /*
   *  兑换记录列表详情
   *  params {Object}
   *  orderId: 兑换记录id
   * */
  orderDetail (params) {
    return axios.post('/mobile/orderDetail',qs.stringify({
      orderId: params.orderId
    }));
  },
  /*
   *  兑换
   *  params {Object}
   *  idCard: 身份证
   *  goodsId: goodsId
   * */
  changIntegration (params) {
    return axios.post('/mobile/changIntegration',qs.stringify({
      idCard: params.idCard,
      goodsId: params.goodsId
    }));
  },

  /*
   *  高德地理编码
   *  params {Object}
   *  key: {String} 高德Key
   *  address: {String} 结构化地址信息，如：北京市朝阳区阜通东大街6号
   *  city: {String} 指定查询的城市
   *  batch: {Boolean}批量查询控制
   * */
  geo (params) {
    return axios.get('http://restapi.amap.com/v3/geocode/geo',{
      params: {
        key: params.key || 'a06d528a58c5f5eef056245de71141be',
        address: params.address,
        city: params.city,
        batch: params.batch,
      }
    });
  },

  /*
   *  高德逆地理编码
   *  params {Object}
   *  key: {String}高德Key
   *  location: {Array} 经纬度坐标
   *  poitype: 返回附近POI类型
   *  radius: {Number}搜索半径
   *  extensions: 返回结果控制
   *  batch: 批量查询控制
   *  roadlevel: 道路等级
   * */
  regeo (params) {
    return axios.get('http://restapi.amap.com/v3/geocode/regeo',{
      params: {
        key: params.key || 'a06d528a58c5f5eef056245de71141be',
        location: params.location,
        radius: params.radius,
        poitype: params.poitype,
        extensions: 'all',
        batch: params.batch,
        roadlevel: params.roadlevel || 0,
      }
    });
  }



}
