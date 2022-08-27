<template>
	<view class="container">
		<view class="tui-order-header">
			<!-- <image :src="webURL+'img_detail_bg.png'" mode="widthFix" class="tui-img-bg"></image> -->
			<view class="tui-header-content">
				<view>
					<view class="tui-status-text">{{getStatusText(status)}}</view>
					<view class="tui-reason"><text class="tui-reason-text">{{getReason(status)}}</text>
						<tui-countdown :time="getTime(order.create_time)" color="rgba(254,254,254,0.75)"
						 colonColor="rgba(254,254,254,0.75)" borderColor="transparent" @end="onEnd(order)"
						 backgroundColor="transparent" v-if="status===0"></tui-countdown>
					</view>
				</view>
				<image :src="getImg(status)" class="tui-status-img" mode="widthFix"></image>
			</view>
		</view>
<!--		<tui-list-cell arrow backgroundColor="#fefefe" @click="logistics">-->
<!--			<view class="tui-flex-box">-->
<!--				<image :src="webURL+'img_order_logistics3x.png'" class="tui-icon-img"></image>-->
<!--				<view class="tui-logistics">-->
<!--					<view class="tui-logistics-text">快递已到收货点，请注意查收哦! 投递员: echo. 联系电话: 17788849992</view>-->
<!--					<view class="tui-logistics-time">2019-06-03 12:02</view>-->
<!--				</view>-->
<!--			</view>-->
<!--		</tui-list-cell>-->
		<tui-list-cell unlined :hover="false">
			<view class="tui-flex-box">
				<image :src="webURL+'img_order_address3x.png'" class="tui-icon-img"></image>
				<view class="tui-addr">
					<view class="tui-addr-userinfo">{{order.address.userName}}<text class="tui-addr-tel">{{order.address.telNumber | formatNumber}}</text></view>
					<view class="tui-addr-text">{{ order.address.location + order.address.detailInfo  }}</view>
				</view>
			</view>
		</tui-list-cell>

		<view class="tui-order-item">
			<tui-list-cell :hover="false" :lineLeft="false">
				<view class="tui-goods-title">
					商品信息
				</view>
			</tui-list-cell>
		    <t-order-item :order="order" type="detail"></t-order-item>
			<view class="tui-goods-info">
				<view class="tui-price-flex tui-size24">
					<view>商品总额</view>
					<view>￥{{order.totalCost}}</view>
				</view>
				<view class="tui-price-flex  tui-size24">
					<view>优惠券</view>
					<view style="display: inline-flex">
						<view class="tui-symbol">-</view>
						<view>￥{{order.discount}}</view>
					</view>
				</view>
				<view class="tui-price-flex  tui-size24">
					<view>配送费</view>
					<view style="display: inline-flex">
						<view class="tui-symbol">+</view>
						<view>￥{{order.shipping_fee}}</view>
					</view>
				</view>
				<view class="tui-size32">
					<view class="tui-goods-price tui-primary-color">
						<view class="tui-black">实付款<text class="tui-colon">:</text></view>
						<view class="tui-size-24">￥</view>
						<view class="tui-price-large">{{order.netCost.split('.')[0]}}</view>
						<view class="tui-size-24">.{{order.netCost.split('.')[1]}}</view>
					</view>
				</view>
			</view>
		</view>

		<view class="tui-order-info">
			<tui-list-cell :hover="false" :lineLeft="false">
				<view class="tui-order-title">
					订单信息
				</view>
			</tui-list-cell>
			<view class="tui-order-content">
				<view class="tui-order-flex">
					<view class="tui-item-title">订单号:</view>
					<view class="tui-item-content">{{order.orderNum}}</view>
				</view>
<!--				<view class="tui-order-flex">-->
<!--					<view class="tui-item-title">物流单号:</view>-->
<!--					<view class="tui-item-content">33655511251265578556</view>-->
<!--				</view>-->
				<view class="tui-order-flex">
					<view class="tui-item-title">创建时间:</view>
					<view class="tui-item-content">{{order.create_time | formatDate}}</view>
				</view>
				<view class="tui-order-flex" v-if="order.payment_time">
					<view class="tui-item-title">付款时间:</view>
					<view class="tui-item-content">{{order.payment_time | formatDate}}</view>
				</view>
				<view class="tui-order-flex" v-if="order.note">
					<view class="tui-item-title">订单备注:</view>
					<view class="tui-item-content">{{order.note}}</view>
				</view>
			</view>
			<tui-list-view unlined="bottom">
				<tui-list-cell unlined>
					<view class="tui-contact" @tap="onCall">
						<image src="https://system.chuangbiying.com/static/images/mall/icon_contactmerchant.png"></image>
						<text>联系商家</text>
					</view>
				</tui-list-cell>
			</tui-list-view>
		</view>
		<view class="tui-safe-area"></view>
		<view class="tui-tabbar tui-order-btn">
			<block v-if="order.status==='交易关闭'">
				<view class="tui-btn-ml">
					<tui-button type="danger" plain width="152rpx" height="56rpx" :size="26" shape="circle" @tap="onDelete(order)">删除订单</tui-button>
				</view>
			</block>
			<block v-if="order.status==='待支付'">
				<view class="tui-btn-ml">
					<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @tap="cancelOrder(order)">取消订单</tui-button>
				</view>
				<view class="tui-btn-ml">
					<tui-button type="danger" plain width="152rpx" height="56rpx" :size="26" shape="circle" @click="pay(order)">去支付</tui-button>
				</view>
			</block>
			<block v-if="order.status==='待发货'">
				<view class="tui-btn-ml">
					<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @tap="refund(order)">申请退款</tui-button>
				</view>
				<view class="tui-btn-ml">
					<tui-button type="danger" plain width="152rpx" height="56rpx" :size="26" shape="circle" @click="remind">催发货</tui-button>
				</view>
			</block>
			<block v-if="order.status==='待收货'">
				<view class="tui-btn-ml">
					<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @click="refund(order)">申请退款</tui-button>
				</view>
				<view class="tui-btn-ml">
					<tui-button type="black"  plain width="152rpx" height="56rpx" :size="26" shape="circle" @click="buy(order)">再次购买</tui-button>
				</view>
				<view class="tui-btn-ml">
					<tui-button type="danger" plain width="152rpx" height="56rpx" :size="26" shape="circle" @click="onReceipt(order)">确认收货</tui-button>
				</view>
			</block>
			<block v-if="order.status==='交易成功'">
			    <view class="tui-btn-ml">
					<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @tap="onDelete(order)">删除订单</tui-button>
				</view>
				<view class="tui-btn-ml">
					<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @click="refund(order)">退换/售后</tui-button>
				</view>
				<view class="tui-btn-ml" v-if="isVisible(order.reviewState)">
					<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @click="addEvaluate(order, 'additional')">追加评价</tui-button>
				</view>
				<view class="tui-btn-ml">
					<tui-button type="danger"  plain width="152rpx" height="56rpx" :size="26" shape="circle" @click="buy(order)">再次购买</tui-button>
				</view>
			</block>
			<block v-if="order.status==='待评价'">
				<view class="tui-btn-ml">
					<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @click="refund(order)">退换/售后</tui-button>
				</view>
				<view class="tui-btn-ml">
					<tui-button type="black"  plain width="152rpx" height="56rpx" :size="26" shape="circle" @click="buy(order)">再次购买</tui-button>
				</view>
				<view class="tui-btn-ml">
					<tui-button type="danger" plain width="152rpx" height="56rpx" :size="26" shape="circle" @click="addEvaluate(order, 'first')">评价</tui-button>
				</view>
			</block>
			<block v-if="order.status==='处理中'">
				<view class="tui-btn-ml">
					<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @tap="detail(order)">
						售后信息
					</tui-button>
				</view>
			</block>
			<block v-if="order.status==='申请已撤销' || order.status==='退款成功'">
				<view class="tui-btn-ml">
					<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @tap="onDelete(order)">
						删除订单
					</tui-button>
				</view>
				<view class="tui-btn-ml">
					<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @tap="detail(order)">
						售后信息
					</tui-button>
				</view>
			</block>
		</view>
		<tui-modal :show="isShow" @cancel="onCancel" :custom="true">
			<view class="tui-modal-custom">
				<image :src=selectedImg class="tui-tips-img"></image>
				<view class="tips-title">
					<view class="tui-modal-custom-text">确认收到货了吗？</view>
					<view class="tui-modal-custom-text subTitle">为保障售后权益，请检查后再确认收货</view>
				</view>
				<view class="btn-block">
					<tui-button class="btn cancel" height="72rpx" :size="28" shape="circle" @click="onCancel">取消</tui-button>
					<tui-button class="btn" height="72rpx" :size="28" type="danger" shape="circle" @click="onConfirm">确认收货</tui-button>
				</view>
			</view>
		</tui-modal>
		<tui-modal :show="isDelete" @click="onRemove"  title="确定删除订单？" content="删除之后订单无法恢复，请慎重考虑？"></tui-modal>
	</view>
</template>

<script>
	import utils from "@/utils/util.js"
	import tOrderItem from '@/components/views/t-order-item/t-order-item'
	export default {
		components: {
			tOrderItem
		},
		data() {
			return {
				appid: '',
				phone: '',
				webURL: "https://system.chuangbiying.com/static/images/mall/order/",
				//1-待付款 2-付款成功 3-待收货 4-订单已完成 5-交易关闭
				status: 2,
				selectedOrder : '',
				isShow: false,
				isDelete: false,
				order: {
					note: '',
					discount: '0.00',
					totalCost: '0.00',
					netCost:  '0.00',
					shipping_fee: '0.00',
					goodsList: [],
					address: {'telNumber': ''}
				},
			}
		},
		onLoad(options){
			this.order =  JSON.parse(decodeURIComponent(options.order))
			this.status = this.getStatus(this.order.status)
			this.phone = this.$store.state.phone
			this.appid = this.$store.state.appid
		},
		filters: {
			formatNumber(v){
				return utils.formatNumber(v)
			},
			formatDate(v){
				return utils.formatDate("y-m-d h:i:s", v)
			}
		},
		computed: {
			orderList(){
				return this.$store.state.orderList
			}
		},
		methods: {
			getStatus: function(status){
				const statusList = [
					{status: '待支付'}, {status: '待发货'}, {status: '待收货'},
					{status: '待评价'}, {status: '交易成功'}, {status: '交易关闭'},
					{status: '处理中'}, {status: '退款成功'}
				]
				return statusList.findIndex((o)=>{return o.status===status})
			},
			getTime(time){
				time = time.replace(/-/g, "/") //如果不转化，在ios设备上会计算错误
				const expireTime = 24*60*60*1000 //一天后过期
				let t1 = Date.parse(new Date(time)) + expireTime
				let t2 = Date.parse(new Date())
				return (t1-t2)/1000
			},
			onCall: function() {
				// #ifdef MP-WEIXIN
				wx.makePhoneCall({
					phoneNumber: this.phone
				})
				// #endif
			},
			getImg: function(status) {
				return this.webURL + ["img_order_payment3x.png", "img_order_send3x.png", "img_order_received3x.png",
					"img_order_signed3x.png", "img_order_signed3x.png",  "img_order_closed3x.png", "img_waiting.png", "img_success3x.png"
				][status]
			},
			getStatusText: function(status) {
				return ["等待您付款", "付款成功", "待收货", "待评价", "交易成功", "交易关闭", '处理中', "退款成功"][status]
			},
			getReason: function(status) {
				return ["", "等待卖家发货", "还剩X天XX小时自动确认", "", "感谢购买我们的商品，欢迎下次再来!", "超时未付款，订单自动取消", "等待商家处理", ""][status]
			},
			logistics() {
				this.tui.href("/pages/my/logistics/logistics")
			},
			onEnd(order){
				this.tui.toast('订单已失效')
				this.cancelOrder(order)
			},
			isVisible(state){
				return state.findIndex(o=>{return o.count===1}) !==-1
			},
			remind() {
                this.tui.toast('待开发')
			},
			pay(order) {
				let _this = this
				let result = order.paymentInfo
				wx.requestPayment({
					appid: result.appid,
					nonceStr: result.nonceStr,
					package: result.package,
					timeStamp: result.timeStamp,
					signType: result.signType,
					paySign: result.paySign,
					success: function () {
						let goodsList = []
						order.goodsList.forEach((o)=>{
							goodsList.push({id: o.id, 'buyNum': o.buyNum})
								
						})
						if(order.mode==='groupBuy'){
							let url = '/addActivityOrder/' + uni.getStorageSync("pid") + '/' + order.orderNum
							_this.tui.request(url, 'POST', order.activity).then()
							//更新活动商品库存
							_this.tui.request('/updateGoodsStock/activity', 'PUT', goodsList)
						}else{
							let url = '/updateOrder/' + order.orderNum + '/' + 'payment'
							order.status = '待评价'
							_this.tui.request(url, 'PUT', {status: "待评价"}).then()
							//更新商品库存
							_this.tui.request('/updateGoodsStock/', 'PUT', goodsList)
						}
						_this.tui.href("/pages/order/success/success")},
					fail: function (err) {
						console.log('err', err)
					},
				})
			},
			buy(order){
				let goods = order.goodsList[0]
				this.tui.href('/pages/index/productDetail/productDetail?spu_id=' + goods.spu_id + '&sku_id=' + goods.id + '&buy=true')
			},
			cancelOrder(order) {
				let url = '/closeOrder_miniProg/' + this.appid + '/' + order.orderNum
				this.tui.request(url).then(
					(res)=>{
						if(res.code===204){
							let index =  this.orderList.findIndex((o)=>{ return o.orderNum === order.orderNum})
							this.orderList[index].status = "交易关闭"
							this.tui.toast('取消成功，交易关闭')
							order.status = "交易关闭"
							this.status = this.getStatus("交易关闭")
						}else if(res.code===400){
							let index =  this.orderList.findIndex((o)=>{ return o.orderNum === order.orderNum})
							this.orderList[index].status = "待评价"
							this.tui.toast('无法取消订单，该订单已支付成功')
							if(order.mode==='groupBuy'){
								let url = '/addActivityOrder/' + uni.getStorageSync("pid") + '/' + order.orderNum
								_this.tui.request(url, 'POST', order.activity).then()
								//更新活动商品库存
								_this.tui.request('/updateGoodsStock/activity', 'PUT', goodsList)
								order.status = "拼团中"
							}else{
								order.status = "待评价"
								this.status = this.getStatus("待评价")
							}
						}
						else{
							this.tui.toast(res.message)
						}
				})
			},
			onDelete(order){
				this.selectedOrder = order
				this.isDelete=true
			},
			onRemove(e){
				if(e.index===1){
					let selectedIndex = this.orderList.findIndex((o)=>{ return o.orderNum === this.selectedOrder.orderNum})
					this.orderList.splice(selectedIndex,1)
					let url = '/deleteOrder/' + this.selectedOrder.orderNum
					this.tui.request(url, 'DELETE').then(()=>{this.tui.toast('删除订单成功')})
				}
				this.isDelete = false
				uni.navigateBack({delta: 1})
			},
			invoiceDetail(){
				this.tui.href('/pages/my/invoiceDetail/invoiceDetail')
			},
			refund(order){
				this.tui.href('/pages/my/refundList/refundList?order=' + encodeURIComponent(JSON.stringify(order)))
			},
			onReceipt(order){  
				this.selectedOrder = order
				this.selectedImg = order.goodsList[0].defaultImageUrl
				this.isShow=true
			},
			addEvaluate(order, mode){
				let url = (order.goodsList.length>1)? '/pages/my/evaluateList/evaluateList?':
					('/pages/my/addEvaluate/addEvaluate?mode=' + mode + '&')
				url = url + 'order=' + encodeURIComponent(JSON.stringify(order))
				uni.navigateTo({
					url: url
				})
			},
			detail(order) {
				this.tui.href('/pages/my/refundList/refundList?history=' + encodeURIComponent(JSON.stringify(order)))
			}
		}
	}
</script>

<style>
	.container {
		padding-bottom: 118rpx;
	}

	.tui-order-header {
		width: 100%;
		height: 160rpx;
		position: relative;
		background-color: #EB0909;
	}

	.tui-img-bg {
		width: 100%;
		height: 160rpx;
	}

	.tui-header-content {
		width: 100%;
		height: 160rpx;
		position: absolute;
		z-index: 10;
		left: 0;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 70rpx;
		box-sizing: border-box;
	}

	.tui-status-text {
		font-size: 34rpx;
		line-height: 34rpx;
		color: #FEFEFE;
	}

	.tui-reason {
		font-size: 24rpx;
		line-height: 24rpx;
		color: rgba(254, 254, 254, 0.75);
		padding-top: 15rpx;
		display: flex;
		align-items: center;
	}

	.tui-reason-text {
		padding-right: 12rpx;
	}

	.tui-status-img {
		width: 80rpx;
		height: 80rpx;
		display: block;
	}

	.tui-flex-box {
		width: 100%;
		display: flex;
		align-items: center;
	}

	.tui-icon-img {
		width: 44rpx;
		height: 44rpx;
		flex-shrink: 0;
	}

	/* .tui-logistics {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0 24rpx 0 20rpx;
		box-sizing: border-box;
	}

	.tui-logistics-text {
		font-size: 26rpx;
		line-height: 32rpx;
	}

	.tui-logistics-time {
		font-size: 24rpx;
		line-height: 24rpx;
		padding-top: 16rpx;
		color: #666
	} */

	.tui-addr {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding-left: 20rpx;
		box-sizing: border-box;
	}

	.tui-addr-userinfo {
		font-size: 30rpx;
		line-height: 30rpx;
		font-weight: bold;
	}

	.tui-addr-text {
		font-size: 24rpx;
		line-height: 32rpx;
		padding-top: 16rpx;
	}

	.tui-addr-tel {
		padding-left: 40rpx;
	}

	.tui-order-item {
		margin-top: 20rpx;
		border-radius: 10rpx;
		overflow: hidden;
	}

	.tui-goods-title {
		width: 100%;
		font-size: 28rpx;
		line-height: 28rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tui-color-red {
		color: #E41F19;
		padding-right: 30rpx;
	}
	.tui-black {
		color: #222;
	}
	.tui-colon{
		font-weight: 700;
		margin-right: 3px;
	}
	.tui-goods-price {
		width: 100%;
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
		font-size: 24rpx;
	}

	.tui-size-24 {
		font-size: 24rpx;
		line-height: 24rpx;
	}

	.tui-price-large {
		font-size: 32rpx;
		line-height: 30rpx;
	}

	.tui-goods-info {
		width: 100%;
		padding: 30rpx;
		box-sizing: border-box;
		background: #fff;
	}

	.tui-price-flex {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tui-size24 {
		padding-bottom: 20rpx;
		font-size: 24rpx;
		line-height: 32rpx;
		color: #888;
	}
	.tui-symbol{
		margin-right: 3px;
		font-size: 30rpx
	}
	.tui-size32 {
		font-size: 32rpx;
		line-height: 32rpx;
		font-weight: 500;
	}

	.tui-primary-color {
		color: #EB0909;
	}

	.tui-order-info {
		margin-top: 20rpx;
	}

	.tui-order-title {
		position: relative;
		font-size: 28rpx;
		line-height: 28rpx;
		box-sizing: border-box;
	}
	.tui-order-content {
		width: 100%;
		padding: 24rpx 30rpx;
		box-sizing: border-box;
		background: #fff;
		font-size: 24rpx;
		line-height: 30rpx;
	}

	.tui-order-flex {
		display: flex;
		padding-top: 18rpx;
	}

	.tui-order-flex:first-child {
		padding-top: 0
	}

	.tui-item-title {
		width: 132rpx;
		color: #888888;
		flex-shrink: 0;
	}
	.tui-item-content {
		color: #222;
		line-height: 32rpx;
	}
	.tui-safe-area {
		height: 1rpx;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-tabbar {
		width: 100%;
		height: 100rpx;
		background: #fff;
		position: fixed;
		left: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		font-size: 26rpx;
		box-shadow: 0 0 1px rgba(0, 0, 0, .3);
		padding-bottom: env(safe-area-inset-bottom);
		z-index: 996;
	}

	.tui-order-btn {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		background: #fff;
		padding: 0 30rpx 20rpx;
		box-sizing: border-box;
	}
	.tui-btn-ml {
		margin-left: 20rpx;
	}
	.tui-contact{
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
	}
	.btn_hover{
		background: #f1f1f1;
	}
	.tui-contact image{
		width: 36rpx;
		height: 36rpx;
		margin-right: 16rpx;
	}
</style>
