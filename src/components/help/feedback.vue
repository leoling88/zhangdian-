<template>
  <div class="QA">
	<h2 class="h2">请选择您想反馈的问题点(必选)</h2>
	<ul class="ul-1">
		<li v-for="(item, index) in matter" @click="clickMatter(index)" v-bind:class="{on:ishover == index}"><span><i></i></span>{{item.con}}</li>
	</ul>
	<h2 class="h2">请补充详细问题和意见</h2>
	<div class="box-1">
		<textarea maxlength="240" v-model="feedback.text" @input="descArea" placeholder="请输入10个字以上的描述"></textarea>
		<p><font v-bind:class="{fontRed:feedback.len <= 0}">{{feedback.len}}</font>/240</p>
	</div>
	<h2 class="h2">请提供相关问题的截图或照片<span class="right">选中{{feedback.img.length}}/4</span></h2>
	<div class="box-2">
		<form enctype="multipart/form-data">
			<div v-show="feedback.img!=0" ref="file_up"> 
		        <div class="upload_img" v-for="(item,index) of feedback.img"> 
		          <img :src="item.src"> 
		          <span class="del" @click="fileDel(index)"><b></b></span>
		        </div> 
			</div>
		</form>
        <!--bytesToSize(this.feedback.size--> 
		<input @change="fileChange($event)" type="file" id="upload_file" v-if="feedback.img.length < 4"  class="del-but" multiple /> 

		<span  v-if="this.feedback.img.length < 4" class="but plus icon" ></span>		
    </div> 
    <div v-transfer-dom>
      <alert v-model="Alert.isShowAlert" title="" :hide-on-blur="true">
        <p style="text-align:center;">{{Alert.confirmText}}</p>
      </alert>
    </div>

    <form method="post" enctype="multipart/form-data"></form>

    <div @click="submitForm($event)" v-if="nodeEnv === 'development'">下一步</div>

  </div>
</template>

<script>
import { Alert, Confirm as TransferDom} from 'vux';
import api from '../../api/api';
import { mapState } from 'vuex';
export default {
  directives: {
    TransferDom
  },
    components: { Alert},
    name: 'QA',
    data () {
    	return {
    		openid: this.$route.params.openid,
    		ishover: 1,
    		matter:[
	    			{
	    				value: 1,
	    				con:'功能异常:请选择您想反馈的问题点',
	    			},
	    			{
	    				value: 2,
	    				con:'产品建议：用的不爽，我有建议',
	    			},
	    			{
	    				value: 3,
	    				con:'安全问题：密码隐私、欺诈等',
	    			},
	    			{
	    				value: 4,
	    				con:'其他问题',
	    			},     			
    		],
    		feedback:{
    			trouble:2,
	    		text:'',
	    		img:[
	    		],
	    		len:240,
	    		size:0
    		},
    		upfile: {},
	        Alert: {
	          isShowAlert: false,
	          confirmText: '',
	          state: false //
	        },
	        nodeEnv: 'development',

    	}
    },
    methods: {
    	//选择问题项
    	clickMatter (index) {
    		 this.ishover = index
    		 this.feedback.trouble = this.matter[index].value
    		 alert( this.feedback.trouble)

    	},
    	//计算已输入字符
	    descArea(){
	      let textVal = this.feedback.text.length;
	      this.feedback.len = 240 - textVal;
	    },

	    fileChange(el){ 
	      this.$store.commit('UPDATE_LOADING', true);
	      if (!el.target.files[0].size) return; 
	      this.fileList(el.target.files); 
	      el.target.value = '' 
	    }, 
	    fileList(files){ 
	      for (let i = 0; i < files.length; i++) { 
	        this.fileAdd(files[i]); 
	      } 
	    }, 
	    fileAdd(file){ 
	      //this.feedback.size = this.feedback.size + file.size;//总大小 
	      let reader = new FileReader();
	      let _this = this
	      let cc;
	      reader.vue = this; 
	      reader.readAsDataURL(file);
	      reader.onload = function () { 
	        file = this.result; 
	        this.vue.feedback.img.push({ 
	          'src':file
	        });
	      } 
	      
	      
	      this.$store.commit('UPDATE_LOADING', false);
	    }, 
	    fileDel(index){ 
	      //this.feedback.size = this.feedback.size - this.feedback.img[index].file.size;//总大小 
	      this.feedback.img.splice(index, 1); 
	      console.log(this.feedback.img)
	    }, 
	    bytesToSize(bytes){ 
	      if (bytes === 0) return '0 B'; 
	      let k = 1000, // or 1024 
	        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'], 
	        i = Math.floor(Math.log(bytes) / Math.log(k)); 
	      return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]; 
	    },
	    validation () {
	    	const _val = this.feedback.text.length
	    	if(_val < 10) {
	          this.Alert.isShowAlert = true,
	          this.Alert.confirmText = '输入描述不能少10字符',
	          this.Alert.state = true //	    		
	    	}

	    },
	    goNext () {
	    	this.validation()
	    },
		setOptionMenu () {
			if (window.AlipayJSBridge) {
			  AlipayJSBridge.call('setOptionMenu', {
			    title : '提交',  // 与icon、icontype三选一
			    redDot : '-1', // -1表示不显示，0表示显示红点，1-99表示在红点上显示的数字
			    color : '#008cec', // 必须以＃开始ARGB颜色值
			  });
			  AlipayJSBridge.call('showOptionMenu');
			  document.addEventListener('optionMenu', this.goNext, false) // 绑定支付宝右上角点击事件
			}
		},
		removeOptionMenu () {
			document.removeEventListener('optionMenu', this.goNext, false);
		},

		submitForm(event) {

			this.$store.commit('UPDATE_LOADING', true);

			//event.preventDefault();
			let _this = this;
			let formData = new FormData()
			// formData.append('openid', '2088102071822234');
			// formData.append('defaultOpinion', this.feedback.trouble);
			// formData.append('personalOpinion', this.feedback.text);
			//formData.append('file', this.feedback.img);

			let config = {
			  headers: {
			    'Content-Type': 'application/x-www-form-urlencoded'
			  }
			}
			let upfile = []
			for(let i in this.feedback.img ){
				upfile.push(this.feedback.img[i].src) 
			}

  //合并数组为字符串
  upfile = upfile.join(";;;");
  console.log(upfile);
  // upfile = upfile.replace(/,/g,";;;");
  //    console.log(upfile);
  //转换","->"|"
  // temp_string = temp_string.replace(/,/g,"；；；");
  // alert(temp_string);
   
  //转换回数组
  // array = temp_string.split("");
  // alert(array);
			//upfile = upfile.toString()
			//upfile = upfile.replace(/,/g, "=========")
			// console.log(typeof (upfile))
			api.saveFeedback({defaultOpinion: this.feedback.trouble, personalOpinion:this.feedback.text, openid: this.openid, files:upfile}).then(function (res) { //'/mobile/uploadPic', formData, config
				
			  if (res.data.success) {
			  	alert('====>'+res.data.msg)
			  	this.$store.commit('UPDATE_LOADING', false);

			    /*这里做处理*/

			  }else{
			  	alert(res.data.msg)
			  	this.$store.commit('UPDATE_LOADING', false);
			  }
			}).catch(() => {
				this.$store.commit('UPDATE_LOADING', false);
	        })
		} 

    },
    mounted () {
    },    
}
</script> 
<style scoped >
.QA{}
.QA .h2{margin:.2rem .3rem;font-size:.24rem;color:#666;font-weight: 100;background:none;}
.QA .h2 .right{float:right;margin-top:.05rem;font-size:.2rem;line-height:.3rem;}
.ul-1{border-top:.01rem solid #ccc;border-bottom:.01rem solid #ccc;padding:0 .3rem;font-size:.3rem;background:#fff;}
.ul-1 li{padding:.2rem 0;border-bottom:.01rem solid #ccc; position: relative;list-style:none;}
.ul-1 li span{display:block;float:left;width:20px;height:20px;margin-top:.03rem;border:.01rem solid #ccc;border-radius:52%; position:relative;margin-right:.2rem;overflow:hidden;}
.ul-1 li span i{display:none;}
.ul-1 li.on span{border:.01rem solid #108ee9;background: #108ee9;}
.ul-1 li.on span i{display:block;color:#fff;position:absolute;width:10px;height:6px;border-bottom:solid 1px currentColor;border-left:solid 1px currentColor;-webkit-transform:rotate(-45deg);transform:rotate(-45deg);top:50%;left:50%;margin:-6px auto auto -6px;}
.ul-1 li:last-child{border:none;}
.box-1{border-top:.01rem solid #ccc;border-bottom:.01rem solid #ccc;padding:.2rem .3rem 0;background:#fff;}
.box-1 p{font-size:.24rem; text-align: right;color:#ccc;}
.fontRed{color:red;}
textarea{width:100%;height:1rem;margin:0;border:none;}
::-webkit-input-placeholder {
    color: #aab2bd;
}

.box-2{border-top:.01rem solid #ccc;border-bottom:.01rem solid #ccc;padding:.2rem .3rem;background:#fff;overflow:hidden;}
.upload_img{position: relative;}
.upload_img .del{display:block;width:.4rem;height:.4rem;border-radius:50% 0 0 0 ;background:#333;opacity:.8; position: absolute;right:0;bottom:0;color:#fff;line-height:.4rem; text-align: center;font-size:.3rem; line-height:.4rem;}
.upload_img .del b{display:inline-table;height:.06rem;width:70%;background:#fff; position: absolute;right:.05rem;bottom:.15rem;}
.upload_img,.box-2 .but{ float:left;display: block;width:1rem;height:1rem;margin-right:10px;border:.01rem solid #ccc; overflow:hidden;}
.upload_img img{width:100%;height:100%;}
.box-2 .plus{  position: relative;}
.del-but{width:1rem;height:1rem;position:absolute;background:#000;z-index:1000;opacity: 0;}

.plus.icon {
  color: #000;

}

.plus.icon:before {
  content: '';
  position: absolute;
  top:50%;
  left:50%;
  width: .6rem;
  height:.06rem;
  margin:-1.5px auto auto -.3rem;
  background-color: #ccc;

}

.plus.icon:after{content:'';position:absolute;width:.06rem;height:.6rem;margin:-.3rem auto auto -.03rem;background-color:#ccc;top:50%;left:50%;}

</style>