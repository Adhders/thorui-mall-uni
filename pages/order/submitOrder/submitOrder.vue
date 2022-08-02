<template>
	<view class="container">
		<block v-if="address">
			<view class="tui-box">
				<tui-list-cell :arrow="true" unlined :radius="true" @click="chooseAddr">
				<view class="tui-address">
					<view v-if="true">
						<view class="tui-userinfo">
							<text class="tui-name">{{orderForm.address.userName}}</text>
							{{orderForm.address.telNumber | formatNumber}}
						</view>
						<view class="tui-addr">
							<view class="tui-addr-tag" v-if="orderForm.address.label">{{orderForm.address.label}}</view>
							<text>{{orderForm.address.location + orderForm.address.detailInfo}}</text>
						</view>
					</view>
					<view class="tui-none-addr" v-else>
						<image src="https://system.chuangbiying.com/static/images/index/map.png" class="tui-addr-img" mode="widthFix"></image>
						<text>选择收货地址</text>
					</view>
				</view>
				<view class="tui-bg-img"></view>
			</tui-list-cell>
				<view class="tui-top tui-goods-info">
					<tui-list-cell :hover="false" :lineLeft="false">
						<view class="tui-goods-title">
							商品信息
						</view>
					</tui-list-cell>
					<block v-for="(item,index) in orderForm.goodsList" :key="index">
						<tui-list-cell :hover="false" padding="0">
							<view class="tui-goods-item">
								<image :src="item.defaultImageUrl" class="tui-goods-img" mode="aspectFill"></image>
								<view class="tui-goods-center">
									<view class="tui-goods-name">{{item.title}}</view>
									<view class="tui-goods-attr">
										<view class="tui-sub-info">{{item.slogan}}</view>
										<view class="tui-sub-info">
											{{item.propertyList | getProperty}}
										</view>
									</view>
									<view class="tui-price-box">
										<view>
											<text class="tui-size-24">￥</text>
											<text class="tui-goods-price">{{item.integerPrice}}</text>
											<text class="tui-size-24" v-if="item.decimalPrice">.{{ item.decimalPrice}}</text>
										</view>
										<tui-numberbox class="tui-numberbox" :value="item.buyNum" :height="36" :width="64" :min="1" :index="index" @change="changeNum"></tui-numberbox>
									</view>
								</view>
							</view>
						</tui-list-cell>
					</block>
					<tui-list-cell :hover="false">
						<view class="tui-padding tui-flex">
							<view>商品总额</view>
							<view>￥{{orderForm.totalCost.toFixed(2)}}</view>
						</view>
					</tui-list-cell>
					<tui-list-cell :arrow="hasCoupon" :hover="hasCoupon" @click="couponShow=true">
						<view class="tui-padding tui-flex">
							<view>优惠券</view>
							<view :class="{'tui-color-red':hasCoupon}">{{hasCoupon?"满5减1":'没有可用优惠券'}}</view>
						</view>
					</tui-list-cell>
					<tui-list-cell :hover="true" :arrow="true" @click="invoice">
						<view class="tui-padding tui-flex">
							<view>发票</view>
							<view class="tui-invoice-text">不开发票</view>
						</view>
					</tui-list-cell>
					<tui-list-cell :hover="false">
						<view class="tui-padding tui-flex">
							<view>配送费</view>
							<view>￥{{orderForm.shipping_fee.toFixed(2)}}</view>
						</view>
					</tui-list-cell>
					<tui-list-cell :hover="false" :lineLeft="false" padding="0">
						<view class="tui-remark-box tui-padding tui-flex">
							<view>订单备注</view>
							<input type="text" class="tui-remark" v-model="orderForm.note" placeholder="选填: 请先和商家协商一致" placeholder-class="tui-phcolor">
						</view>
					</tui-list-cell>
					<tui-list-cell :hover="false" unlined>
						<view class="tui-padding tui-flex tui-total-flex">
							<view class="tui-flex-end tui-color-red">
								<view class="tui-black">合计： </view>
								<view class="tui-size-26">￥</view>
								<view class="tui-price-large">{{orderForm.netCost.toFixed(2).split('.')[0]}}</view>
								<view class="tui-size-26">.{{orderForm.netCost.toFixed(2).split('.')[1]}}</view>
							</view>
						</view>
					</tui-list-cell>
				</view>
				<view class="tui-top">
					<tui-list-cell unlined :hover="insufficient" :radius="true" :arrow="insufficient">
						<view class="tui-flex">
							<view class="tui-balance">余额支付<text class="tui-gray">(￥0.00)</text></view>
							<switch color="#19be6b" class="tui-scale-small" v-show="!insufficient" />
							<view class="tui-pr-30 tui-light-dark" v-show="insufficient">余额不足, 去充值</view>
						</view>
					</tui-list-cell>
				</view>
			</view>
			<view class="tui-safe-area"></view>
			<view class="tui-tabbar">
				<view class="tui-flex-end tui-color-red tui-pr-20">
					<view class="tui-black">实付金额: </view>
					<view class="tui-size-26">￥</view>
					<view class="tui-price-large">{{orderForm.netCost.toFixed(2).split('.')[0]}}</view>
					<view class="tui-size-26">.{{orderForm.netCost.toFixed(2).split('.')[1]}}</view>
				</view>
				<view class="tui-pr25">
					<tui-button width="200rpx" height="70rpx" :size="28" type="danger" shape="circle" @click="btnPay">确认支付</tui-button>
				</view>
			</view>
			<t-pay-way :show="show" ref="pay" :orderForm="orderForm" :mode="mode"></t-pay-way>
			<t-select-coupons :show="couponShow" @close="couponClose"></t-select-coupons>
		</block>
		<block v-else>
			<tui-no-data  imgUrl="https://system.chuangbiying.com/static/images/toast/img_nodata.png"
						  @click="addAddress"  btnText="新建地址" :fixed="false" style="margin-top: 30%">
				<text class="tui-color__black">您还没有地址哦！</text>
				<!--如果需要自定义按钮，可在插槽中自定义，不使用默认按钮-->
			</tui-no-data>
			<tui-dialog :buttons="buttons" :show="visible" title="你还没有收货地址哦，赶紧设置一个吧" @close="visible=false" @click="buttonTap"></tui-dialog>
		</block>
	</view>
</template>

<script>
	import utils from "@/utils/util"
	import tPayWay from "@/components/views/t-pay-way/t-pay-way"
	import tSelectCoupons from "@/components/views/t-select-coupons/t-select-coupons"
	export default {
		components: {
			tPayWay,
			tSelectCoupons
		},
		data() {
			return {
				mode: '',
				hasCoupon: false,
				insufficient: false,
				show: false,
				visible: false,
				couponShow:false,
				orderForm: {
					note: '',
					discount: 0.00,
					totalCost: 0.00,
					netCost: 0.00,
					shipping_fee: 0.00,
					goodsList: [],
					address: {
						telNumber: '',
						userName: '',
						label: '',
						location: '',
						default: false,
						detailInfo: '',
						postalCode: '',
					}
				},
				buttons: [
					{
						text: '取消',
						// color: '#999'    
					},
					{
						text: '去设置',
						color: '#eb0909'
				    }
				]
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
			formatNumber(v){
				return utils.formatNumber(v)
			}
		},
		onLoad(options){
			this.mode = options.mode //购物车
			this.orderForm.goodsList = JSON.parse(options.goods)
			this.orderForm.address = this.address
			this.calcHandle()
		},
		computed: {
     		address(){
		    	return this.$store.state.userInfo.defaultAddress
			},
		}, 
		methods: {
			calcHandle() {
				let totalPrice = 0;
				this.orderForm.goodsList.map((item) => {
					totalPrice += item.price * item.buyNum;
				})
				this.orderForm.totalCost = totalPrice
				this.orderForm.netCost = this.orderForm.totalCost + this.orderForm.shipping_fee
			},
			changeNum: function(e) {
				this.orderForm.goodsList[e.index].buyNum = e.value
				setTimeout(() => {
					this.calcHandle()
				}, 0)
			},
			buttonTap(e){
				this.visible=false
				if(e.index===0){
					this.$emit("close",{})
					uni.navigateBack({delta: 1})
				}else{
					uni.navigateTo({
						url: '/pages/my/editAddress/editAddress'
					})
				}
			},
			chooseAddr() {
				uni.navigateTo({
					url: "/pages/my/address/address?detailInfo=" + this.orderForm.address.detailInfo
				})
			},
			addAddress(){
				uni.navigateTo({
					url: '/pages/my/editAddress/editAddress'
				})
			},
			btnPay() {
				this.$refs.pay.show = true
			},
			couponClose(){
				this.couponShow=false
			},
			invoice(){
				// this.tui.href('../invoice/invoice')
				this.tui.toast('待开发')
			}
		}
	}
</script>

<style>
	.container {
		padding-bottom: 98rpx;
	}
	.tui-box {
		padding: 20rpx 0 118rpx;
		box-sizing: border-box;
	}
	.tui-address {
		min-height: 80rpx;
		padding: 10rpx 0;
		box-sizing: border-box;
		position: relative;
	}

	.tui-userinfo {
		font-size: 30rpx;
		font-weight: 500;
		line-height: 30rpx;
		padding-bottom: 12rpx;
	}

	.tui-name {
		padding-right: 40rpx;
	}

	.tui-addr {
		font-size: 24rpx;
		word-break: break-all;
		padding-right: 25rpx;
	}

	.tui-addr-tag {
		padding: 5rpx 8rpx;
		flex-shrink: 0;
		background: #EB0909;
		color: #fff;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 25rpx;
		line-height: 25rpx;
		transform: scale(0.8);
		transform-origin: 0 center;
		border-radius: 6rpx;
	}
	.tui-bg-img {
		position: absolute;
		width: 100%;
		height: 8rpx;
		left: 0;
		bottom: 0;
		background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAL0AAAAECAMAAADszM6/AAAAOVBMVEUAAAAVqfH/fp//vWH/vWEVqfH/fp8VqfH/fp//vWEVqfH/fp8VqfH/fp//vWH/vWEVqfH/fp//vWHpE7b6AAAAEHRSTlMA6urqqlVVFRUVq6upqVZUDT4vVAAAAEZJREFUKM/t0CcOACAQRFF6r3v/w6IQJGwyDsPT882IQzQE0E3chToByjG5LwMgLZN3TQATmdypCciBya0cgOT3/h//9PgF49kd+6lTSIIAAAAASUVORK5CYII=") repeat;
	}

	.tui-top {
		margin-top: 20rpx;
		overflow: hidden;
	}

	.tui-goods-title {
		font-size: 28rpx;
		display: flex;
		align-items: center;
	}

	.tui-padding {
		box-sizing: border-box;
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
        border-radius: 8rpx;
		flex-shrink: 0;
	}
    .tui-price-box {
		width: 100%;
		display: flex;
		position: absolute;
		bottom: 0;
		align-items: flex-end;
		justify-content: space-between;
	}
	.tui-sub-info {
		box-sizing: border-box;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.tui-size-24 {
		font-size: 24rpx;
		font-weight: 500;
		color: #e41f19;
	}
	.tui-goods-price {
		font-size: 34rpx;
		font-weight: 500;
		color: #e41f19;
	}
	.tui-goods-center {
		flex: auto;
		max-width: 510rpx;
		position: relative;
		padding: 8rpx 8rpx;
		box-sizing: border-box;
	}
	.tui-goods-name {
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		font-size: 28rpx;
		line-height: 32rpx;
	}
	.tui-goods-attr {
		font-size: 22rpx;
		color: #888888;
		line-height: 32rpx;
		padding-top: 5rpx;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.tui-flex {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 26rpx;
	}

	.tui-total-flex {
		justify-content: flex-end;
	}

	.tui-color-red,
	.tui-invoice-text {
		color: #E41F19;
		padding-right: 30rpx;
	}

	.tui-balance {
		font-size: 28rpx;
		font-weight: 500;
	}

	.tui-black {
		color: #222;
		line-height: 30rpx;
	}

	.tui-gray {
		color: #888888;
		font-weight: 400;
	}

	.tui-light-dark {
		color: #666;
	}

	.tui-size-26 {
		font-size: 26rpx;
		line-height: 26rpx;
	}

	.tui-price-large {
		font-size: 34rpx;
		line-height: 28rpx;
		font-weight: 600;
	}

	.tui-flex-end {
		display: flex;
		align-items: flex-end;
		padding-right: 0;
	}

	.tui-phcolor {
		color: #B3B3B3;
		font-size: 26rpx;
	}

	/* #ifndef H5 */
	.tui-remark-box {
		padding: 22rpx 30rpx;
	}

	/* #endif */
	/* #ifdef H5 */
	.tui-remark-box {
		padding: 26rpx 30rpx;
	}

	/* #endif */

	.tui-remark {
		flex: 1;
		font-size: 26rpx;
		padding-left: 64rpx;
	}

	.tui-scale-small {
		transform: scale(0.8);
		transform-origin: 100% center;
	}

	.tui-scale-small .wx-switch-input {
		margin: 0 !important;
	}

	/* #ifdef H5 */
	>>>uni-switch .uni-switch-input {
		margin-right: 0 !important;
	}

	/* #endif */
	.tui-tabbar {
		width: 100%;
		height: 98rpx;
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

	.tui-pr-30 {
		padding-right: 30rpx;
	}

	.tui-pr-20 {
		padding-right: 20rpx;
	}

	.tui-none-addr {
		height: 80rpx;
		padding-left: 5rpx;
		display: flex;
		align-items: center;
	}

	.tui-addr-img {
		width: 36rpx;
		height: 46rpx;
		display: block;
		margin-right: 15rpx;
	}


	.tui-pr25 {
		padding-right: 25rpx;
	}

	.tui-safe-area {
		height: 1rpx;
		padding-bottom: env(safe-area-inset-bottom);
	}
</style>
