<template>
	<view class="container">
		<view class="tui-order-item">
			<tui-list-cell padding="20rpx 30rpx" :hover="false" :lineLeft="false">
				<view class="tui-goods-title"><view>商品信息</view></view>
			</tui-list-cell>
			<tOrderItem :order="order"></tOrderItem>
		</view>
		<form @submit="formSubmit">
			<view class="tui-refund__form">
				<tui-list-cell padding="0" arrow  @click="onPopup('refundType')">
					<view class="tui-line-cell" >
						<view class="tui-title">
							<text>申请类型</text>
						</view>
						<input placeholder-class="tui-phcolor" class="tui-input" name="refundType"  v-model="ruleForm.refundType"/>
					</view>
				</tui-list-cell>
				<tui-list-cell padding="0" arrow @click="onPopup">
					<view class="tui-line-cell">
						<view class="tui-title">
							<text>申请原因</text>
						</view>
						<input placeholder-class="tui-phcolor" class="tui-input" name="reason"  v-model="ruleForm.reason"  placeholder="请选择退款原因" />
					</view>
				</tui-list-cell>
				<tui-list-cell :hover="false" padding="0" v-if="ruleForm.refundType==='退货退款'">
					<view class="tui-line-cell tui-order-item">
						<view class="tui-title">
							<text>退款金额</text>
						</view>
						<view class="refund_amount">￥</view>
						<input placeholder-class="tui-phcolor" class="tui-input refund_amount" name="refund_fee" v-model="ruleForm.refund_fee" />
					</view>
				</tui-list-cell>
				<view class="tui-line-cell tui-max-amount" v-if="!range">
					<text>最大退款金额：</text>
					<text>￥{{order.netCost}} </text>
				</view>
				<tui-list-cell :hover="false" padding="0">
					<view class="tui-line-cell tui-order-item descption-box">
						<view class="tui-title">
							<text>申请说明</text>
						</view>
						<view style="color: #cccccc">您还可以输入{{count}}字</view>
					</view>
					<tui-textarea v-model="ruleForm.detail" placeholder-class="tui-phcolor" :size="28" maxlength=150
						:borderBottom="false" :textareaBorder="false" :borderTop="false" name="detail" placeholder="请填写申请说明"/>
					<view class="upload-image">
						<tui-upload :serverUrl="action"
							:formData="formData"
							:width = width
							:height = width
							@complete="onSuccess">
						</tui-upload>
					</view>
				</tui-list-cell>
			</view>
			<view class="tui-btn__box">
				<tui-button height="88rpx" type="danger" shadow shape="circle" formType="submit" :disabled="!first">提交申请</tui-button>
			</view>
		</form>
		<tui-bottom-popup :show="popupShow" @close="hidePopup" style="z-index: 1000;">
			<view class="tui-popup-box">
				<view class="tui-right">
					<tui-icon name="close-fill" color="#999" :size="20"  @click="hidePopup"></tui-icon>
				</view>
				<view class="reason-header">{{choice==='refundType'? '请选择售后类型' : '请选择申请原因'}}</view>
				<scroll-view scroll-y class="tui-popup-scroll">
					<view class="tui-scrollview-box">
						<tui-radio-group @change="radioChange">
							<tui-label v-for="(item,index) in displayList" :key="index" class="reason-item">
								<view class="thorui-flex__between">
									<text class="tui-text">{{item.name}}</text>
									<tui-radio isCheckMark checkMarkColor="#07c160" :scaleRatio="1.3" :checked="item.checked"
										:value="index.toString()">
									</tui-radio>
								</view>
							</tui-label>
						</tui-radio-group>
					</view>
				</scroll-view>
			</view>
		</tui-bottom-popup>
	</view>
</template>

<script>
import form from "@/components/common/tui-validation/tui-validation.js"
import tOrderItem from '@/components/views/t-order-item/t-order-item'
export default {
	components: {
		tOrderItem
	},
	data() {
		return {
			edit: false,
			focus: false,
			first: true,
			range: true,
			order: {},
			width: '',
			choice: 'refundType',
			formData: {},
			bucket_image: 'chuangbiying-review',
			action: 'http://up-cn-east-2.qiniup.com',
			ruleForm: {
				imgs: '',
        		refund_fee: '',
				detail: '',
				refundType: '退货退款',
				reason: '',	
			},
			popupShow: false,
			displayList: [],
			typeList: [
				{name: '换货', checked: false},
				{name: '退货退款', checked: false},
			],
			reasonList: [
				{name: '多拍、错拍、不喜欢', checked: false},
				{name: '不喜欢、效果不好', checked: false},
				{name: '材质与商品描述不符', checked: false},
				{name: '大小尺寸与商品不符', checked: false},
				{name: '颜色、款式、型号与描述不符', checked: false},
				{name: '质量问题', checked: false},
				{name: '做工粗糙、有瑕疵', checked: false},
				{name: '收到商品少件、破损或污渍', checked: false},
				{name: '商家发错货', checked: false},
				{name: '假冒品牌', checked: false},
				{name: '其它', checked: false},
			],
			goodsList: []
		};
	},
	onLoad(options){
		this.edit = options.edit
		this.order = JSON.parse(decodeURIComponent(options.order))
		if(this.edit){
			this.ruleForm.imgs = this.order.imgs
			this.ruleForm.detail = this.order.detail
			this.ruleForm.refundType = this.order.refundType
			this.ruleForm.refund_fee = this.order.refund_fee
			this.ruleForm.reason = this.order.reason
		}else{
			this.ruleForm.refund_fee = this.order.netCost
			this.ruleForm.refundType = options.refundType
		}
		//将系统宽度px转换为rpx
		let systemWidth = getApp().globalData.windowWidth/(uni.upx2px(100)/100)
		// 100为页面两边的距离加上图片间隔
		this.width = (systemWidth-100)/3
		var url =  '/upload/token/' + this.bucket_image
		this.tui.request(url)
			.then(response => {
				this.uptoken=response.token
				this.formData={'token': this.uptoken}
			})
			.catch(error => {
				console.log(error.response)
			}
		)
	},
	computed: {
		count(){
			return 150-this.getCount(this.ruleForm.detail.length)
		},
		refundList(){
			return this.$store.state.refundList
		}
	},
	watch: {
		'ruleForm.refund_fee': function(v){
			if(v > this.order.netCost){
				this.range=false
				this.tui.toast("退款金额不能大于最大退款金额")
			}else{
				this.range=true
			}
		}
	},
	filters: {
		getProperty(attr) {
			let str = ''
			attr.forEach(o=>{
				str = str + o.value + '，'
			})
			return str.slice(0,-1)
		},
	},
	methods: {
		hidePopup(){
			this.popupShow = false
		},
		detail(order) {
     	 	this.$store.commit('setTargetOrder', order)
      		uni.navigateTo({
        		url: '/pages/my/orderDetail/orderDetail'
			})
		},
		getCount(count) {
			const max = Number(this.maxlength)
			if (count > max) {
				return max
			}
			return count;
		},
		onPopup(o){
			this.popupShow=true
			this.choice = o
			this.displayList = (o==='refundType')?  this.typeList : this.reasonList
		},
		radioChange(e){
			if(this.choice === 'refundType'){
				this.ruleForm.refundType = this.typeList[e.detail.value].name
			}else {
				this.ruleForm.reason = this.reasonList[e.detail.value].name
			}
			this.hidePopup()
		},
		onSuccess(v){
			if(v.status===1){
				this.ruleForm.imgs = v.keyList
			}
		},
		formSubmit(e){
		//表单规则
			let rules = [{
				name: "refundType",
				rule: ["required"], //可使用区间，此处主要测试功能
				msg: ["请选择售后类型"]
			}, {
				name: "reason",
				rule: ["required"],
				msg: ["请选择退款原因"]
			},{
				name: "detail",
				rule: ["required"],
				msg: ["请输入申请说明"]
			}];
			let extra = {
				name: "refund_fee",
				rule: ["required"],
				msg: ["请输入退款金额"]
			}
			if(this.ruleForm.refundType==='退货退款'){
				rules.splice(2, 0, extra)
			}
			//进行表单检查
			let formData = e.detail.value;
			let checkRes = this.range?form.validation(formData, rules):"退款金额不能大于最大退款金额";
			if(!checkRes){
				this.first=false
				let pid = uni.getStorageSync("pid")
				let appid = this.$store.state.appid
				let orderNum = this.order.orderNum
				if(this.edit){
					let url = '/updateRefundOrders/' + this.order.refundNum + '/edit'
					this.tui.request(url, 'PUT', this.ruleForm).then(
						(res) =>{
							let obj = Object.assign({},this.order, this.ruleForm)
							let index = this.refundList.findIndex((o)=>{return o.refundNum === obj.refundNum})
							this.$set(this.refundList, index, obj)
							this.tui.toast("更新成功")
							setTimeout(()=>{
								uni.navigateBack({delta: 1})
							}, 500);
						}
					)
				}else{
					let url = '/addRefundOrder/' + pid + '/' + appid + '/' + orderNum
					this.tui.request(url, 'POST', this.ruleForm).then(
						(res) =>{
							if(res.code==='0'){
								this.tui.toast("申请售后成功")
								this.ruleForm.refundNum = res.refundNum
								this.ruleForm.status = '处理中'	
								this.$store.state.orderState[5]+=1						
								this.refundList.unshift(Object.assign({}, this.order, this.ruleForm))
								setTimeout(()=>{
									uni.navigateBack({delta: 1})
								}, 500);
							}
						}
					)
				}
			}else {
				uni.showToast({
					title: checkRes,
					icon: "none"
				});
			}
		}
	}
};
</script>

<style lang="less">

.tui-order-item {
	margin-top: 20rpx;
	border-radius: 10rpx;
	overflow: hidden;
}

.tui-goods-title {
	width: 100%;
	font-size: 28rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.tui-refund__form {
	margin-top: 20rpx;
}
.tui-line-cell {
	width: 100%;
	padding: 24rpx 30rpx;
	box-sizing: border-box;
	display: flex;
	align-items: center;
}
.tui-max-amount {
	color: #e41f19; 
	font-size: 28rpx;
}
.tui-title {
	width: 160rpx;
	font-size: 28rpx;
	color: #666;
}
.tui-input {
	min-width: 440rpx;
	height: 48rpx;
	font-size: 28rpx;
}
.tui-phcolor {
	color: #ccc;
	font-size: 28rpx;
}
.tui-btn__box{
	padding: 60rpx 30rpx;
}
.refund_amount{
	font-size: 40rpx;
	font-weight: bold;
}
.tui-popup-box {
	min-height: 600rpx;
	position: relative;
	padding: 30rpx 0 0 0;
	.reason-header{
		text-align: center;
		font-size: 36rpx;
		line-height: 36rpx;
		padding-bottom: 28rpx;
		border-bottom: 1px solid #eaeef1;
	}
	.reason-item {
		border-bottom: 1px solid #eaeef1;
		&:last-child {
			border: 0
		}
	}
	.thorui-flex__between{
		display: flex;
		font-size: 32rpx;
		padding: 16rpx 20rpx;
		align-items: center;
		justify-content: space-between;
	}
}
.tui-right {
	position: absolute;
	right: 30rpx;
	top: 30rpx;
}
.tui-img__title {
	padding-bottom: 24rpx;
}
.tui-popup-scroll {
	max-height: 600rpx;
	font-size: 26rpx;
}
.tui-scrollview-box {
	padding: 0 0 60rpx 30rpx;
	box-sizing: border-box;
}
.descption-box{
	padding-bottom: 0;
	justify-content: space-between;
}
.upload-image{
	padding: 0 30rpx 30rpx;
}
</style>
