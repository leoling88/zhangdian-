/*
 * 基础正则表达式封装
 * 基础工具类封装
 * Creation time :2017-4-13
 * */

export default{

  install(Vue){
    Vue.prototype.$regExp={//正则表达式
      name: /^([\u4E00-\u9FFF]|[a-zA-Z]){2,11}$/, // 包含中文的姓名正则
      kong: /\S/, //非空
      fixedPhone: /^0\d{2,3}-\d{7,8}(-\d{1,6})?|1[34578]\d{9}$/, // 包括固定电话和手机号
      phone:/^1[34578]\d{9}$/,// 手机号
      number:/^[0-9]*$/,//只能是数字x
      numberd:/^\d+(\.\d+)?$/,//只能是数字和小数点
      amount : /^([+-]?)((\d{1,3}(,\d{3})*)|(\d+))(\.\d{2})?$/, // 金额 开头只可为正号或者负号,也可以没有符号,小数点前可以输入任意位数的数字,小数点后只能输入两位数字.
      amountPlus:/^((\d{1,3}(,\d{3})*)|(\d+))(\.\d{2})?$/,  //只为正数的金额 ,其他跟amountReg一样
      date : /(\s(((0?[0-9])|([1-2][0-3]))\:([0-5]?[0-9])((\s)|(\:([0-5]?[0-9])))))?$/, // 日期
      area : /^[A-Za-z0-9\u4e00-\u9fa5]+$/, //文本域：10-200个汉字或字母
      email:/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/,//邮箱号码
      rate:/^((\d+\.?\d*)|(\d*\.\d+))\%$/,  //百分比
      password:/^[\x21-\x7E]{8,16}$/,  //密码,8-16字母或数字
      phoneEmail:/^[1]{1}[0-9]{10}$|(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/,  //匹配手机邮箱
      banknum:/^(\d{16}|\d{18}|\d{19}|\d{20}|\d{21})$/,  //银行卡
      cardID:/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/, //身份证格式验证
      spechar:/^[^`~!@%#$^&*=|':;',/?~！@#￥……&*——|‘；：”“'。，\\、？]+$/,//不能有特殊字符
    };

    // 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
    Date.prototype.format = function (fmt) { //author: meizz
      var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp('(' + k + ')').test(fmt))
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
      return fmt;
    };

    //工具类
    Vue.prototype.$Utils={
      setLocalStorage (key, value) {
        localStorage.setItem(key, JSON.stringify(value))
      },
      getLocalStorage (key) {
        return JSON.parse(localStorage.getItem(key))
      },
      /*
       * 说明：通过身份证号码获取出生年月日
       * idCard：{string} 身份证号码
       * */
      getBirthdayFromIdCard (idCard) {
        var idCard = idCard + ''
        var birthday = "";
        if(idCard != null && idCard != ""){
          if(idCard.length == 15){
            birthday = "19"+idCard.substr(6,6);
          } else if(idCard.length == 18){
            birthday = idCard.substr(6,8);
          }
          birthday = birthday.replace(/(.{4})(.{2})/,"$1-$2-");
        }

        return birthday;
      },
      /*
       *说明：设置cookie方法
       *key：对象  val：对象的值   time：过去时间（天）
       * */
      setCookie(key,val,time){
        if(time){
          var date=new Date(); //获取当前时间
          var expiresDays=time;  //将date设置为n天以后的时间
          date.setTime(date.getTime()+expiresDays*24*3600*1000); //格式化为cookie识别的时间
          document.cookie=key + "=" + val +";expires="+date.toGMTString();  //设置cookie
        }else{
          document.cookie=key+"="+val;
        }
      },
      /*
       *说明：获取cookie方法
       *key：对象
       * */
      getCookie(key){
        var getCookie = document.cookie.replace(/[ ]/g,"");  //获取cookie，并且将获得的cookie格式化，去掉空格字符
        var arrCookie = getCookie.split(";");  //将获得的cookie以"分号"为标识 将cookie保存到arrCookie的数组中
        var tips;  //声明变量tips
        for(var i=0;i<arrCookie.length;i++){   //使用for循环查找cookie中的tips变量
          var arr=arrCookie[i].split("=");   //将单条cookie用"等号"为标识，将单条cookie保存为arr数组
          if(key==arr[0]){  //匹配变量名称，其中arr[0]是指的cookie名称，如果该条变量为tips则执行判断语句中的赋值操作
            tips=arr[1];   //将cookie的值赋给变量tips
            break;   //终止for循环遍历
          }
        }
        return tips;
      },
      /*
       *说明：删除cookie方法
       *key：对象
       * */
      deleteCookie(key){ //删除cookie方法
        var date = new Date(); //获取当前时间
        date.setTime(date.getTime()-10000); //将date设置为过去的时间
        document.cookie = key + "=v; expires =" +date.toGMTString();//设置cookie
      },
      /*
       *说明：对象复制
       *key：参数传递
       * */
      dataClone(data){ //删除cookie方法
        var _data = new Object();
        if(typeof data =='object'){
          for( var k in data){
            _data[k] = data[k];
          }
        }
        return _data;
      },
      /*
       * 说明：判断是否是数字
       * key:string
       * */
      isNumber(val){
        var patrn = /^[0-9]*$/;
        if (patrn.exec(val) == null || val == "") {
          return false
        } else {
          return true
        }
      },
      /*
      * 说明：判断是否是手机号码
      * key:string
      * */
      isPhone(val){
        var patrn =  /^(((1[3456789][0-9]{1})|(15[0-9]{1}))+\d{8})$/;
        if (!patrn.test(val) || val == "") {
          return false
        } else {
          return true
        }
      },
      /*
       * 说明：让所有input失去焦点 收缩键盘
       * */
      inputBlur(){
        var input = document.getElementsByTagName("input");
        for (var j = 0; j < input.length; j++) {
          input[j].blur();
        }
      },
      /*
       * 说明：让所有textarea失去焦点 收缩键盘
       * */
      textareaBlur(){
        var textarea = document.getElementsByTagName("textarea");
        for (var j = 0; j < textarea.length; j++) {
          textarea[j].blur();
        }
      },
      /*
       * 参数src --- base65加密
       * */
      base64encode(str){
        var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var out, i, len;
        var c1, c2, c3;
        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
          c1 = str.charCodeAt(i++) & 0xff;
          if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
          }
          c2 = str.charCodeAt(i++);
          if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
          }
          c3 = str.charCodeAt(i++);
          out += base64EncodeChars.charAt(c1 >> 2);
          out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
          out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
          out += base64EncodeChars.charAt(c3 & 0x3F);
        }
        return out;
      },
      /*
       * 参数src --- base65解密
       * */
      base64decode(str){
        var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
        var c1, c2, c3, c4;
        var i, len, out;
        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
          /* c1 */
          do {
            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
          }
          while (i < len && c1 == -1);
          if (c1 == -1)
            break;
          /* c2 */
          do {
            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
          }
          while (i < len && c2 == -1);
          if (c2 == -1)
            break;
          out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
          /* c3 */
          do {
            c3 = str.charCodeAt(i++) & 0xff;
            if (c3 == 61)
              return out;
            c3 = base64DecodeChars[c3];
          }
          while (i < len && c3 == -1);
          if (c3 == -1)
            break;
          out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
          /* c4 */
          do {
            c4 = str.charCodeAt(i++) & 0xff;
            if (c4 == 61)
              return out;
            c4 = base64DecodeChars[c4];
          }
          while (i < len && c4 == -1);
          if (c4 == -1)
            break;
          out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
        }
        return out;
      },
      /*
       * 参数name --- URL上面的参数
       * */
      getQueryString(){
        var Url = window.location.hash.indexOf("?req=");
        if(Url>-1){
          var r = window.location.hash.split('?req=')[1].split("&");
          if(r!=null)return  r[0]; return null;
        }else{
          return null;
        }
      },
      /*
       * 获得URL参数对象的值
       * */
      getParams(req){
        var params = req.split("&"),hash={};
        for (var i = 0; i < params.length; i++) {
          var val = params[i].split("=");
          if(navigator.userAgent.indexOf("Safari") > -1){
            hash[val[0]] = unescape(val[1]);
          }else{
            hash[val[0]] = unescape(val[1]);
            //hash[unescape(val[0])] = decodeURIComponent(val[1]);
          }
        }
        return hash;
      },
      /** 金额千分位格式化
       * @param num {Number} 金额
       * @param digits {Number} 保留小数点后几位数
       **/
      addThousandSign(num, digits) {
        var num = parseFloat(num);
        num = '' + num.toFixed(digits);
        return num.replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,');
      },
      /** 金额1000转成1k
       * @param num {Number} 金额
       * @param digits {Number} 保留小数点后几位数
       **/
      addThousandK(num) {
        return (num/1000)+'k';
      },

      /** 获取字符串指定前几位
       * @param str {String} 原字符串
       * @param num {Number} 需求的位数
       **/
      getStrFirstPart(str, num){
        str = '' + str;
        num = Number(num);
        if(num > str.length){
          num = str.length;
        }
        return str.slice(0, num);
      },

      /** 获取字符串指定最后几位
       * @param str {String} 原字符串
       * @param num {Number} 需求的位数
       **/
      getStrLastPart(str, num) {
        str = '' + str;
        num = Number(num);
        return str.slice(str.length - num, str.length);
      },

      /** 数字字符串不足6位，在后面用零补足
       * @param num {Number} 需求的位数
       **/
      prefixInteger (num) { //
        let str = num.toString()
        if (str.length < 6) {
          str = num + '000000'
        }
        return str.slice(0,6)
      }


    }
  }
}





