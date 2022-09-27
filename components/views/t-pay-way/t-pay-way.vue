<template>
	<view>
		<tui-dialog :buttons="buttons" :show="visible" title="订单已生成，确定放弃付款吗？" @close="visible=false" @click="buttonTap">
			<!-- <template v-slot:title></template> -->
			<template v-slot:content>
				喜欢的商品可能会被抢空哦
			</template>
		</tui-dialog>
		<tui-bottom-popup :show="show" @close="close">
			<tui-list-cell :hover="false">
				<view class="tui-pay-item__title">
					<view>请选择支付方式</view>
					<view>支付金额：<text class="tui-pay-amuont">￥{{orderForm.netCost.toFixed(2)}}</text></view>
				</view>
			</tui-list-cell>
			<radio-group>
				<tui-list-cell unlined :hover="false">
					<label class="tui-pay-item">
						<image src="https://system.chuangbiying.com/static/images/mall/pay/icon_pay_balance.png" class="tui-pay-logo"></image>
						<text>余额支付（余额0，余额不足）</text>
						<view class="tui-radio" v-if="false">
							<radio color="#EB0909" name="pay"></radio>
						</view>
						<view class="tui-recharge">去充值</view>
					</label>
				</tui-list-cell>
				<tui-list-cell unlined>
					<label class="tui-pay-item">
						<image src="https://system.chuangbiying.com/static/images/mall/pay/icon_pay_weixin.png" class="tui-pay-logo"></image>
						<text>微信支付</text>
						<view class="tui-radio">
							<radio color="#EB0909" checked name="pay"></radio>
						</view>
					</label>
				</tui-list-cell>
<!--				<tui-list-cell unlined>-->
<!--					<label class="tui-pay-item">-->
<!--						<image src="https://system.chuangbiying.com/static/images/mall/pay/icon_pay_zhifubao.png" class="tui-pay-logo"></image>-->
<!--						<text>支付宝支付</text>-->
<!--						<view class="tui-radio">-->
<!--							<radio color="#EB0909" name="pay"></radio>-->
<!--						</view>-->
<!--					</label>-->
<!--				</tui-list-cell>-->
			</radio-group>
			<view class="tui-btn-pay">
				<tui-button height="88rpx" type="danger" :disabled =fail shape="circle" shadow @click="btnPay">{{initial? '去付款': '继续付款'}}</tui-button>
			</view>
		</tui-bottom-popup>
	</view>
</template>

<script>
	export default {
		name: 'tPayWay',
		emits: ['close'],
		props: {
			// //控制显示
			// show: {
			// 	type: Boolean,
			// 	default: false
			// },
			page:{
				type:Number,
				default:1
			},
			orderForm: {
				type: Object,
				default: {},
			},
			mode: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				show: false,
				visible: false,
				result: null,
				initial: true,
				success: true,
				fail: false, //是否支付异常
				buttons: [
					{
						text: '暂时放弃',
						color: '#999'

					},
					{
						text: '再想想',
						color: '#eb0909'
				    }
				]
			};
		},
		computed:{
			cart(){
				return this.$store.state.cart
			}
		},
		methods: {
			close() {
				console.log('close', this.success)
				if(!this.success){
					if(this.result){
						this.visible = true
					}else{
						let url = '/updateOrder/' + this.orderForm.orderNum + '/status'
						this.tui.request(url, 'PUT', {status : "交易关闭"}, true).then(()=>{})
					}
				}
			    this.show=false
				this.fail = false
			},
			buttonTap(e){
				this.visible=false
				if(e.index===0){
					this.initial=true
					this.$emit("close",{})
				}else{
					this.show = true
				}
			},
			requestPayment(result, order){
				let _this = this
				let reviewState = []
				order.goodsList.forEach(()=>{reviewState.push({count: 0})})
				order.reviewState = reviewState
				wx.requestPayment({
					appid: result.appid,
					nonceStr: result.nonceStr,
					package: result.package,
					timeStamp: result.timeStamp,
					signType: result.signType,
					paySign: result.paySign,
					success: function () {
						_this.success = true
						_this.close()
						if(order.mode==='groupBuy'){
							// console.log('order', order)
							let url = '/addActivityOrder/' + uni.getStorageSync("pid") + '/' + order.orderNum
							_this.tui.request(url, 'POST', order.activity).then()
							//更新活动商品库存
							_this.tui.request('/updateGoodsStock/activity', 'PUT', order.goodsList)
						}else{
							let url = '/updateOrder/' + order.orderNum + '/payment'
							order.status = '待发货'
							_this.tui.request(url, 'PUT', {status: "待发货"}).then()
							//更新商品库存
							_this.tui.request('/updateGoodsStock/', 'PUT', order.goodsList)
						}
						setTimeout(()=>{
							wx.redirectTo({url: "/pages/order/success/success"})
						}, 300)

					},
					fail: function (err) {
						_this.initial = false
						let url = '/updateOrder/' + order.orderNum + '/paymentInfo'
						_this.tui.request(url, 'PUT', {paymentInfo : result}).then(()=>{})
						
					},
				})
			},
			btnPay(){
				this.success = false
				const pid = uni.getStorageSync("pid")
				const appid  =  this.$store.state.appid
				if(this.mode==='cart'){
					this.orderForm.goodsList.forEach((sku)=>{ 
						let index = this.cart.findIndex((o) => {return sku.id === o.id})
						this.cart.splice(index, 1)
					})
					let url = '/updateCustomer/' + pid +'/updateCart'
					this.tui.request(url, 'PUT', {'cart': this.cart}).then((res)=>{console.log('res', res)})
				}
				let url = '/pay_miniprog/' + appid + '/' + pid
				if(this.initial){
					this.orderForm.status = '待支付'
					this.tui.request(url,'POST', this.orderForm).then((res)=>{
						// console.log('res', res)
						this.orderForm.orderNum = res.orderNum
						if(res.code==='0'){
							this.result = res.result
							this.requestPayment(this.result, this.orderForm)
						}else{
							this.tui.toast(res.errorMessage)
							this.fail = true
							setTimeout(()=>{this.close()}, 2000)
						}
					})
				}
				else{
					this.requestPayment(this.result, this.orderForm)
				}
			}
		}
	}
</script>

<style scoped>
	.tui-pay-item__title {
		width: 100%;
		height: 90rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20rpx;
		box-sizing: border-box;
		font-size: 28rpx;
	}

	.tui-pay-amuont {
		color: #eb0909;
		font-weight: 500;
		font-size: 34rpx;
	}

	.tui-pay-item {
		width: 100%;
		height: 80rpx;
		display: flex;
		align-items: center;
		padding: 0 20rpx;
		box-sizing: border-box;
		font-size: 28rpx;
	}

	.tui-pay-logo {
		width: 48rpx;
		height: 48rpx;
		margin-right: 15rpx;
	}

	.tui-radio {
		margin-left: auto;
		transform: scale(0.8);
		transform-origin: 100% center;
	}

	.tui-btn-pay {
		width: 100%;
		padding: 68rpx 60rpx 50rpx;
		box-sizing: border-box;
	}

	.tui-recharge {
		color: #fc872d;
		margin-left: auto;
		padding: 12rpx 0;
	}
</style>
