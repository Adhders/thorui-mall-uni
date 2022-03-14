<template>
	<view class="container">
		<view class="tui-order-item">
			<tui-list-cell padding="20rpx 30rpx" :hover="false" :lineLeft="false">
				<view class="tui-goods-title"><view>商品信息</view></view>
			</tui-list-cell>
			<block v-for="(item, index) in order.goodsList" :key="index">
				<tui-list-cell padding="0" @click="detail(order)">
					<view class="tui-goods-item">
						<image :src="item.defaultImageUrl" class="tui-goods-img"></image>
						<view class="tui-goods-center">
							<view class="tui-goods-name">{{item.title}}</view>
							<view class="tui-goods-attr">{{item.propertyList | getProperty}}</view>
						</view>
						<view class="tui-price-right">
								<view>￥{{item.price}}</view>
								<view>x{{item.buyNum}}</view>
							</view>
					</view>
				</tui-list-cell>
			</block>
		</view>
		<view class="tui-refund__form">
			<tui-list-cell padding="0" arrow  @click="onPopup('refundType')">
				<view class="tui-line-cell" >
					<view class="tui-title">
						<text>申请类型</text>
					</view>
					<input placeholder-class="tui-phcolor" class="tui-input" v-model="ruleForm.refundType"/>
				</view>
			</tui-list-cell>
			<tui-list-cell padding="0" arrow @click="onPopup">
				<view class="tui-line-cell">
					<view class="tui-title">
						<text>申请原因</text>
					</view>
					<input placeholder-class="tui-phcolor" class="tui-input"  v-model="ruleForm.reason"  placeholder="请选择退款原因" />
				</view>
			</tui-list-cell>
			<tui-list-cell :hover="false" padding="0">
				<view class="tui-line-cell tui-order-item">
					<view class="tui-title">
						<text>退款金额</text>
					</view>
          <view class="refund_amount">￥</view>
					<input placeholder-class="tui-phcolor" class="tui-input refund_amount" v-model="ruleForm.refund_fee" />
<!--						<text class="edit-label" @tap="focus=true">修改金额</text>-->
				</view>
			</tui-list-cell>
			<tui-list-cell :hover="false" padding="0">
				<view class="tui-line-cell tui-order-item descption-box">
					<view class="tui-title">
						<text>申请说明</text>
					</view>
					<view style="color: #cccccc">您还可以输入{{count}}字</view>
				</view>
				<tui-textarea v-model="ruleForm.description" placeholderStyle="{fontSize: 28rpx}" :size="28" maxlength=150
					:borderBottom="false" :textareaBorder="false" :borderTop="false" placeholder="请填写申请说明"/>
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
			<tui-button height="88rpx" type="danger" shadow shape="circle" @tap="onSubmit">提交申请</tui-button>
		</view>
		<tui-bottom-popup :show="popupShow" @close="hidePopup" style="z-index: 1000;">
			<view class="tui-popup-box">
				<view class="tui-right">
					<tui-icon name="close-fill" color="#999" :size="20"  @click="hidePopup"></tui-icon>
				</view>
				<view class="reason-header">请选择申请原因</view>
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
// import TuiTextarea from "../../../components/thorui/tui-textarea/tui-textarea";
export default {
	// components: {TuiTextarea},
	data() {
		return {
			amount: '¥100',
			focus: false,
			order: {},
			width: '',
			choice: '',
			formData: {},
			bucket_image: 'chuangbiying-review',
			action: 'http://up-cn-east-2.qiniup.com',
			ruleForm: {
				imgs: '',
        refund_fee: '',
				description: '',
				refundType: '我要退货退款',
				reason: '',
			},
			popupShow: false,
			displayList: [],
			typeList: [
				{name: '我要退货退款', checked: false},
				{name: '我要退款（无需退货）'	, checked: false},
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
			goodsList: [{
				defaultImageUrl: 'https://system.chuangbiying.com/static/images/mall/product/3.jpg',
				title: '欧莱雅（LOREAL）奇焕光彩粉嫩透亮修颜霜 30ml（欧莱雅彩妆 BB霜 粉BB 遮瑕疵 隔离）',
				spec: '黑色，50ml',
				price: 29,
				num: 2,
			},{
				defaultImageUrl: 'https://system.chuangbiying.com/static/images/mall/product/4.jpg',
				title: '欧莱雅（LOREAL）奇焕光彩粉嫩透亮修颜霜 30ml（欧莱雅彩妆 BB霜 粉BB 遮瑕疵 隔离）',
				spec: '黑色，50ml',
				price: 189,
				num: 2,
			}]
		};
	},
	onLoad(option){
		this.order = this.$store.state.targetOrder
    this.ruleForm.refund_fee = this.order.netCost
		//将系统宽度px转换为rpx
		let systemWidth = this.$store.state.width/(uni.upx2px(100)/100)
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
			return 150-this.getCount(this.ruleForm.description.length)
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
		onSubmit(){
      let pid = uni.getStorageSync("pid")
      let appid = this.$store.state.appid
      let orderNum = this.order.orderNum
      let url = '/addRefundOrder/' + pid + '/' + appid + '/' + orderNum
      this.tui.request(url, 'POST', this.ruleForm).then(
          (res) =>{
            console.log('res', res)
            this.ruleForm.netCost = this.order.netCost
            this.ruleForm.goodsList = this.order.goodsList
            this.$store.state.refundList.unshift(this.ruleForm)
            uni.navigateBack({delta: 1})
          }
      )
		}
	}
};
</script>

<style lang="less" scoped>
.tui-order-list {
	margin-top: 80rpx;
}

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

.tui-goods-item {
	width: 100%;
	padding: 20rpx 30rpx;
	box-sizing: border-box;
	display: flex;
	justify-content: space-between;
}

.tui-goods-img {
	width: 180rpx;
	height: 180rpx;
	display: block;
	flex-shrink: 0;
}

.tui-goods-center {
	flex: 1;
	padding: 20rpx 8rpx;
	box-sizing: border-box;
}

.tui-goods-name {
	max-width: 310rpx;
	word-break: break-all;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	font-size: 26rpx;
	line-height: 32rpx;
}

.tui-goods-attr {
	font-size: 22rpx;
	color: #888888;
	line-height: 32rpx;
	padding-top: 20rpx;
	word-break: break-all;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
}

.tui-price-right {
	text-align: right;
	font-size: 24rpx;
	color: #888888;
	line-height: 30rpx;
	padding-top: 20rpx;
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
