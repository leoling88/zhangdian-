<template>
  <div class="box-1">
    <h1>流动人口权益保障和公共服务</h1>
    <p>根据《山东省流动人口服务管理暂行办法》，流动人口的合法权益受法律保护，任何单位和个人不得侵犯。县级以上人民政府应当逐步将流动人口居住管理、权益保障和公共服务等纳入居住登记制度，完善和扩大居住证的使用功能，推进流动人口基本公共服务均等化。
    <p>流动人口持居住证或者居住登记凭证，在居住地依法享有下列权益和公共服务：</p>
    <p>(一)<font>公共就业服务</font>机构提供的职业指导、职业介绍、
就业失业登记、就业信息查询等服务；</p>
    <p>(二)参加<font>社会保险</font>，缴存、提取和使用住房<font>公积金</font>；</p>
    <p>(三)国家规定的传染病防治、儿童计划免疫等基本公共卫生服务；</p>
    <p>(四)国家规定的对育龄流动人口的<font>计划生育基本项目技术服务</font>；</p>
    <p>(五)<font>法律服务和法律援助</font>；</p>
    <p>(六)按照规定<font>参加居住地专业技术职务资格评定</font>或者考试、职业(执业)资格考试、职业(执业)资格登记；</p>
    <p>(七)居住地人民政府规定的<font>住房保障政策</font>；</p>
    <p>(八)居住地人民政府或者有关部门按照规定给予的表彰和奖励；</p>
    <p>(九)居住地人民政府规定的其他公共服务。</p>
    <p>流动人口持居住证或者居住登记凭证，在居住地享有下列便利：</p>
    <p>(一)申领机动车驾驶证等手续；</p>
    <p>(二)按照有关规定办理出入境证件；</p>
    <p>(三)按照有关规定换领、补领居民身份证；</p>
    <p>(四)居住地人民政府规定的其他便利。</p>
    <p>流动人口符合居住地人民政府规定条件的，其适龄子女接受学前教育、义务教育应当与常住户口学生同等
对待。</p>
    <p>居住证对于来穗人员而言不仅是居住证明，其持有人在居住地可依法享受劳动就业、参加社会保险和缴
存、提取和使用住房公积金的权利，并享受当地义务教育、基本公共就业服务、公共文化体育服务等基本公共服务以及出入境证件办理、居民身份证换领补领、机动车登记、申领机动车驾驶证等便利。</p>
  </div>
</template>

<script>

import api from '../../api/api';

import { mapState } from 'vuex';
export default {

    name: 'success',
    data () {
    	return {

    	}
    },
    methods: {
		removeOptionMenu () {
			document.removeEventListener('optionMenu', this.goNext, false);
		},
        setTitle (data) {
          if (window.AlipayJSBridge) AlipayJSBridge.call('setTitle', {title: '居住权益'})
        },
    },
    mounted () {
        this.setTitle()
    },    
}
</script> 
<style scoped >
.box-1{padding:.4rem;font-size:.26rem;color:#2a2a2a;text-align:justify;
text-justify:inter-ideograph;background:#fff;}
.box-1 h1{margin-bottom:.3rem;font-size:.34rem; text-align: center;color:#a31616;}
.box-1 p{margin-top:.1rem; text-indent: 2em;}
.box-1 p font{_border-bottom:.01rem solid #000;}
</style>