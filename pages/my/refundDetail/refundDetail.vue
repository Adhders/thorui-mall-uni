<template>
	<view class="container">
		<view class="tui-order-header">
			<view class="tui-header-content">
				<view>
					<view class="tui-status-text">退款成功</view>
					<view class="tui-reason"><text class="tui-reason-text">退款原路退回 2020-09-02 08:20:19</text></view>
				</view>
				<!-- img_refundfailure.png -->
				<image src="https://thorui.cn/images/mall/group/img_success3x.png" class="tui-status-img" mode="widthFix"></image>
			</view>
		</view>
		<tui-list-cell :hover="false" unlined>
			<view class="tui-title">
				<text>退款金额</text>
				<text>￥596.00</text>
			</view>
		</tui-list-cell>
		<view class="tui-order-item">
			<tui-list-cell :hover="false" :lineLeft="false"><view class="tui-order-title">订单信息</view></tui-list-cell>
			<block v-for="(item, index) in 2" :key="index">
				<tui-list-cell padding="0">
					<view class="tui-goods-item">
						<image :src="`https://system.chuangbiying.com/static/images/mall/product/${index + 3}.jpg`" class="tui-goods-img"></image>
						<view class="tui-goods-center">
							<view class="tui-goods-name">欧莱雅（LOREAL）奇焕光彩粉嫩透亮修颜霜 30ml（欧莱雅彩妆 BB霜 粉BB 遮瑕疵 隔离）</view>
							<view class="tui-goods-attr">黑色，50ml</view>
						</view>
						<view class="tui-price-right">
							<view>￥298.00</view>
							<view>x2</view>
						</view>
					</view>
				</tui-list-cell>
			</block>
		</view>
		<view class="tui-order-info">
			<view class="tui-order-content">
				<view class="tui-order-flex">
					<view class="tui-item-title">售后类型：</view>
					<view class="tui-item-content">退货退款</view>
				</view>
				<view class="tui-order-flex">
					<view class="tui-item-title">付款方式：</view>
					<view class="tui-item-content">余额</view>
				</view>
				<view class="tui-order-flex">
					<view class="tui-item-title">商品数量：</view>
					<view class="tui-item-content">4</view>
				</view>
				<view class="tui-order-flex">
					<view class="tui-item-title">退款编号：</view>
					<view class="tui-item-content">322090091111922</view>
				</view>
				<view class="tui-order-flex">
					<view class="tui-item-title">退款原因：</view>
					<view class="tui-item-content">买错了</view>
				</view>
				<view class="tui-order-flex">
					<view class="tui-item-title">订单编号：</view>
					<view class="tui-item-content">329900923328874</view>
				</view>
				<view class="tui-order-flex">
					<view class="tui-item-title">申请时间：</view>
					<view class="tui-item-content">2020-09-01 20:30:19</view>
				</view>
				<view class="tui-order-flex">
					<view class="tui-item-title">申请说明:</view>
					<view class="tui-item-content">重新购买</view>
				</view>
			</view>
			<tui-list-view unlined="bottom">
				<tui-list-cell unlined>
					<view class="tui-contact">
						<image src="https://thorui.cn/images/mall/group/icon_order_contactmerchant.png"></image>
						<text>联系商家</text>
					</view>
				</tui-list-cell>
			</tui-list-view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			webURL: 'https://www.thorui.cn/wx/static/images/mall/order/',
			//1-退款中 2-退款成功 3-退款失败
			status: 1,
			show: false
		};
	},
	methods: {}
};
</script>

<style>
.container {
	padding-bottom: 80rpx;
}
.tui-order-header {
	width: 100%;
	height: 160rpx;
	position: relative;
	background: linear-gradient(90deg, rgb(255, 89, 38), rgb(240, 14, 44));
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
	color: #fefefe;
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
.tui-order-item {
	margin-top: 20rpx;
	border-radius: 10rpx;
	overflow: hidden;
}

.tui-title {
	width: 100%;
	font-size: 28rpx;
	line-height: 28rpx;
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

.tui-order-title {
	position: relative;
	font-size: 28rpx;
	line-height: 28rpx;
	padding-left: 12rpx;
	box-sizing: border-box;
}

.tui-order-title::before {
	content: '';
	position: absolute;
	left: 0;
	top: 0;
	border-left: 4rpx solid #eb0909;
	height: 100%;
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
	padding-top: 0;
}

.tui-item-title {
	width: 132rpx;
	flex-shrink: 0;
	white-space: nowrap;
}

.tui-item-content {
	color: #666;
	line-height: 32rpx;
}
.tui-contact {
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
}
.tui-contact image {
	width: 36rpx;
	height: 36rpx;
	margin-right: 16rpx;
}
</style>
