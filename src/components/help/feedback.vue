<template>
  <div class="QA">
  	<h2 class="h2">请填写问题标题 (必填)</h2>
  	<div class="box-1">
	  	<input type="text" class="text" placeholder="请填写标题" v-model="feedback.title">
	</div>

	<h2 class="h2">请选择您想反馈的问题点(必选)</h2>
	<ul class="ul-1">
		<li v-for="(item, index) in matter" @click="clickMatter(index)" v-bind:class="{on:ishover == index}"><span><i></i></span>{{item.con}}</li>
	</ul>
	<h2 class="h2">请补充详细问题和意见</h2>
	<div class="box-1">
		<textarea maxlength="240" v-model="feedback.questionCon" @input="descArea" placeholder="请输入10个字以上的描述"></textarea>
		<p><font v-bind:class="{fontRed:feedback.len >= 240}">{{feedback.len}}</font>/240</p>
	</div>
	<h2 class="h2">请提供相关问题的截图或照片<span class="right">选中{{upImg.length}}/4</span></h2>
	<div class="box-2">
		<form enctype="multipart/form-data">
			<div  ref="file_up">
		        <div class="upload_img" v-for="(item,index) of upImg.img1"> 
		          <img :src="item.src"> 
		          <span class="del" @click="fileDel(1, index, item.id)"><b></b></span>
		        </div> 
			</div>
		</form>
        <!--bytesToSize(this.feedback.size--> 
		<input @change="fileChange($event, 1)" type="file" id="upload_file" v-if="upImg.img1.length < 4"  class="del-but" multiple accept="image/jpeg,image/jpg,image/png"/> 

		<span  v-if="this.upImg.img1.length < 4" class="but plus icon" ></span>		
    </div> 
    <div v-transfer-dom>
      <alert v-model="Alert.isShowAlert" title="" :hide-on-blur="true">
        <p style="text-align:center;">{{Alert.confirmText}}</p>
      </alert>
    </div>

    <form method="post" enctype="multipart/form-data"></form>

<!--     <div @click="goNext" v-if="nodeEnv === 'development'">下一步</div>
 -->
  </div>
</template>

<script>
import { Alert, Confirm as TransferDom} from 'vux';
import api from '../../api/api';
import { mapState } from 'vuex';
let _delImgId

export default {
  directives: {
    TransferDom
  },
    components: { Alert},
    name: 'QA',
    data () {
    	return {
    		queryType: 1,
    		openId: this.$route.params.openid,
    		// fid: this.$route.params.fid,
    		ishover: 0,  //初始化选中位置
    		matter:[
	    			{
	    				value: 1,
	    				con:'功能异常:功能故障或不可用',
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
    			title:'',
    			questionType: 1,     //初始化为1
    			questionCon:'',
    			len:0

    		},
    		upImg: {
    			img1:[],
    			file:'',
    			fbId:''
    		},
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
			this.feedback.questionType = this.matter[index].value
    	},

    	//计算已输入字符
	    descArea(){
	      let textVal = this.feedback.questionCon.length;
	      this.feedback.len = textVal;
	    },
	    submitDatas () {
	        this.$store.commit('UPDATE_LOADING', true);
	        api.feedbackSubmit(
	        {
				title: this.feedback.title,
				defaultOpinion:  this.feedback.questionType,
				personalOpinion:  this.feedback.questionCon,
				openId: this.openId
	        }).then(res => {
	          this.$store.commit('UPDATE_LOADING', false);
	          console.log(res)
	          if(res.data.uFlag) {
	          	localStorage.setItem('_back','back');
			    this.$router.push({path:'/myQ/' + this.openId});
	          }else{
				this.Alert.isShowAlert = true,
				this.Alert.confirmText = res.data.msg,
				this.Alert.state = true //		          	
	          }
	        }).catch(() => {
	          this.$store.commit('UPDATE_LOADING', false);
	        })	    	
	    },
	    validation () {
			let _title
    		if(this.feedback.questionType && this.feedback.title && this.feedback.questionCon.length >= 10){
    			return true
    		}else{
		    	if(!this.feedback.title) _title = '问题标题必填'
		    	else if(!this.feedback.questionType) _title = '问题点必选'
		    	else if(this.feedback.questionCon.length < 10) _title = '详细问题与意见不能少于10个字'
				this.Alert.isShowAlert = true,
				this.Alert.confirmText = _title,
				this.Alert.state = true //	 
				return false   		    			
    		}
	    },
	      fileChange(el, index){ 
	        this.$store.commit('UPDATE_LOADING', true);
	        if (!el.target.files[0].size) return; 
	        this.fileList(el.target.files, index); 
	        el.target.value = '' 
	      }, 
	      fileList(files, index, el){ 
	        for (let i = 0; i < files.length; i++) { 
	          this.fileAdd(files[i], index); 
	        } 
	      }, 
	      fileAdd(file, index, el){ 
	        //this.submitData.size = this.submitData.size + file.size;//总大小 
	        let reader = new FileReader();
	        let _this = this
	        reader.vue = this; 
	        reader.readAsDataURL(file);
	        lrz(file, { width: 700 }).then(function(rst) { 
		        _this.upImg.file = rst.base64 
		        if (rst.file.size < 307200) {
		            //=======图片上传至服务器
		            api.setUpPic({
						openId: _this.openId,
						file: _this.upImg.file,

		            }).then(res => {
		              const _odata = res.data
		              if(res.data.uFlag) {
		                _delImgId = _odata.fId
		                if(index === 1) {
		                  _this.upImg.img1.push({ 
		                    'src':rst.base64,
		                    'id':_delImgId,
		                  });
		                }
						_this.Alert.isShowAlert = true,
						_this.Alert.confirmText = '上传成功',
						_this.Alert.state = true //	
						

		              }else{
						_this.Alert.isShowAlert = true,
						_this.Alert.confirmText = res.data.msg,
						_this.Alert.state = true //	 

		              }
		              _this.$store.commit('UPDATE_LOADING', false);
		            }).catch(() => {
		            })    
		           //=======图片上传至服务器 end    
		           console.log(_this.upImg.img1)        
		         }else{
					_this.$store.commit('UPDATE_LOADING', false);
					_this.Alert.isShowAlert = true,
					_this.Alert.confirmText = '图片质量过大!',
					_this.Alert.state = true //	 

		         }

	          return rst;
	        }).always(function() {
	          // 清空文件上传控件的值
	          el.target.value = null;
	        });
	        

	      }, 
	      fileDel(indexo,index, imgId){ 
	        //this.submitData.size = this.submitData.size - this.submitData.img[index].file.size;//总大小 
	        this.$store.commit('UPDATE_LOADING', true);
	        api.delUpPic(imgId).then(res => {     //删除已上传图片
	          this.$store.commit('UPDATE_LOADING', false);
	          const _odata = res.data.obj
	          if(res.data.uFlag) {
	            if(indexo === 1){
	              this.upImg.img1.splice(index, 1); 
	            }
	            this.$store.commit('SHOWTOAST', '删除成功!')
	          }

	        })       

	      }, 
	    goNext () {
	    	if(this.validation()){
	    		this.submitDatas()
	    	}
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
        setTitle (data) {
          if (window.AlipayJSBridge) AlipayJSBridge.call('setTitle', {title: '我要反馈'})
        },     

    },
    created(){
    	let _back = localStorage.getItem('_back');
    	if(_back == 'back') {
			this.$router.push({path:'/?openid=' + this.openId});
    	}
    	// alert(this.openId)
    	// localStorage.setItem('openid',this.openId);
    	// let _openid = localStorage.getItem('openid')
    	// alert(_openid)

    },
    mounted () {
    	this.setTitle()
    	this.setOptionMenu();//右上角
    }, 
    destroyed () {
      this.removeOptionMenu();
    }

}
</script> 
<style scoped >
.QA{}
.QA .h2{margin:.2rem .3rem;font-size:.3rem;color:#666;font-weight: 100;background:none;}
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
textarea{width:100%;height:2rem;margin:0;border:none;font-size:.3rem;}
::-webkit-input-placeholder {
    color: #ccc;
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
.box-1 .text{width:100%;height:.5rem;margin:0 0 .2rem;border:none;font-size:.3rem;}
.plus.icon:after{content:'';position:absolute;width:.06rem;height:.6rem;margin:-.3rem auto auto -.03rem;background-color:#ccc;top:50%;left:50%;}

</style>