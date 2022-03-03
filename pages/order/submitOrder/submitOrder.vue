<template>
	<tui-loading :fixed="false" v-if="loadding"></tui-loading>
	<view class="container" v-else>
		<block v-if="address">
			<view class="tui-box">
				<tui-list-cell :arrow="true" unlined :radius="true" @click="chooseAddr">
				<view class="tui-address">
					<view v-if="true">
						<view class="tui-userinfo">
							<text class="tui-name">{{address.userName}}</text>
							{{address.telNumber | formatNumber}}
						</view>
						<view class="tui-addr">
							<view class="tui-addr-tag">默认</view>
							<text>{{address.detailInfo}}</text>
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
								<image :src="item.defaultImageUrl" class="tui-goods-img"></image>
								<view class="tui-goods-center">
									<view class="tui-goods-name">{{item.title}}</view>
									<view class="tui-goods-attr">{{item.propertyList | getProperty}}</view>
									<view class="tui-price-box">
										<view class="tui-goods-price">￥{{item.price | getPrice}}</view>
										<tui-numberbox :value="item.buyNum" :height="36" :width="64" :min="1" :index="index" @change="changeNum"></tui-numberbox>
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
							<view class="tui-balance">余额支付<text class="tui-gray">(￥2020.00)</text></view>
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
			<t-pay-way :show="show" @close="popupClose" :orderForm="orderForm"></t-pay-way>
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
				loadding: true,
				hasCoupon: true,
				insufficient: false,
				show: false,
				visible: false,
				couponShow:false,
				address: '',
				orderForm: {
					note: '',
					discount: 0.00,
					totalCost: 0.00,
					netCost: 0.00,
					shipping_fee: 0.00,
					goodsList: [{
                        id: "t2020003120",
                        title: '欧莱雅（LOREAL）奇焕光彩粉嫩透亮修颜霜 30ml（欧莱雅彩妆 BB霜 粉BB 遮瑕疵 隔离）',
                        defaultImageUrl: 'https://system.chuangbiying.com/static/images/mall/product/3.jpg',
                        propertyList: [{"name": "颜色", "value": "红色"}, {"name": "容量", "value": "100ml"}],
                        buyNum: 2,
                        price: 299.5
                    }, {
                            id: 't1020003122',
                            title: '欧莱雅（LOREAL）',
                            defaultImageUrl: 'https://system.chuangbiying.com/static/images/mall/product/4.jpg',
                            propertyList: [{"name": "颜色", "value": "粉色"}, {"name": "容量", "value": "50ml"}],
                            buyNum: 1,
                            price: 499
                        }
                    ],
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
			getPrice(price) {
				price = price || 0;
				return price.toFixed(2)
			},
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
		onLoad(){
			this.calcHandle()
		},
		onShow(){
			const url = '/getAddressList/' + uni.getStorageSync("pid")
			this.tui.request(url,'GET', undefined, true).then((res)=>{
				if(res.code==='0'){
					if(res.addressList.length>0){
						this.address = res.addressList[0]
						this.orderForm.address = this.address
					}else{
						this.visible=true
					}
					this.loadding=false
				}
			})
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
					url: "/pages/my/address/address"
				})
			},
			addAddress(){
				uni.navigateTo({
					url: '/pages/my/editAddress/editAddress'
				})
			},
			btnPay() {
				this.show = true
			},
			popupClose() {
				this.show = false
			},
			couponClose(){
				this.couponShow=false
			},
			invoice(){
				this.tui.href('../invoice/invoice')
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
	.tui-goods-price {
		font-size: 34rpx;
		font-weight: 500;
		color: #e41f19;
	}
	.tui-goods-center {
		flex: 1;
		position: relative;
		padding: 0rpx 8rpx;
		box-sizing: border-box;
	}
	.tui-goods-name {
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
		font-size: 24rpx;
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

	.tui-goods-price {
		display: flex;
		align-items: center;
		padding-top: 20rpx;
	}

	.tui-size-26 {
		font-size: 26rpx;
		line-height: 26rpx;
	}

	.tui-price-large {
		font-size: 34rpx;
		line-height: 32rpx;
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
