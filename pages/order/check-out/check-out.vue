<template>
	<view class="container">
		<view class="tui-price__box">
			<text>￥</text>
			<text class="tui-price">1558</text>
			<text>.00</text>
		</view>

		<radio-group>
			<view class="tui-padding">
				<tui-list-cell backgroundColor="#FEFAFA" :hover="false">
					<view class="tui-pay__header">
						<image src="https://system.chuangbiying.com/static/images/mall/pay/icon_pay_bankcard.png" class="tui-pay-logo"></image>
						<text>银行卡支付</text>
					</view>
				</tui-list-cell>
				<tui-list-cell>
					<label class="tui-pay-item">
						<image src="https://system.chuangbiying.com/static/images/mall/bank/n_y.png" class="tui-pay-logo"></image>
						<text>农业银行储蓄卡(7789)</text>
						<view class="tui-radio">
							<radio color="#EB0909" name="pay"></radio>
						</view>
					</label>
				</tui-list-cell>
				<tui-list-cell>
					<label class="tui-pay-item">
						<image src="https://system.chuangbiying.com/static/images/mall/bank/z_s.png" class="tui-pay-logo"></image>
						<text>招商银行储蓄卡(4026)</text>
						<view class="tui-radio">
							<radio color="#EB0909" name="pay"></radio>
						</view>
					</label>
				</tui-list-cell>
				<tui-list-cell arrow unlined>
					<view class="tui-pay__header">
						<text class="tui-text__all">全部付款方式</text>
						<text class="tui-text__gray">绑定新卡</text>
					</view>
				</tui-list-cell>
			</view>
			<tui-list-cell :hover="true">
				<label class="tui-pay-item">
					<image src="https://system.chuangbiying.com/static/images/mall/pay/icon_pay_balance.png" class="tui-pay-logo"></image>
					<text>余额支付（余额￥864.50）</text>
					<view class="tui-radio" v-if="true">
						<radio color="#EB0909" name="pay"></radio>
					</view>
					<view class="tui-recharge" v-if="false">去充值</view>
				</label>
			</tui-list-cell>
			<tui-list-cell>
				<label class="tui-pay-item">
					<image src="https://system.chuangbiying.com/static/images/mall/pay/icon_pay_weixin.png" class="tui-pay-logo"></image>
					<text>微信支付</text>
					<view class="tui-radio">
						<radio color="#EB0909" name="pay"></radio>
					</view>
				</label>
			</tui-list-cell>
			<tui-list-cell unlined>
				<label class="tui-pay-item">
					<image src="https://system.chuangbiying.com/static/images/mall/pay/icon_pay_zhifubao.png" class="tui-pay-logo"></image>
					<text>支付宝支付</text>
					<view class="tui-radio">
						<radio color="#EB0909" name="pay"></radio>
					</view>
				</label>
			</tui-list-cell>
		</radio-group>

		<view class="tui-btn__box">
			<tui-button height="88rpx" type="danger" shape="circle" shadow>银行卡支付￥1558.00</tui-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style>
	.container{
		padding-bottom: 142rpx;
	}
	.tui-price__box {
		padding: 40rpx 0 50rpx;
		box-sizing: border-box;
		text-align: center;
		color: #EB0909;
		font-size: 40rpx;
		font-weight: bold;
	}

	.tui-price {
		font-size: 48rpx;
	}

	.tui-padding {
		padding-bottom: 30rpx;
		border-top-left-radius: 24rpx;
		border-top-right-radius: 24rpx;
		overflow: hidden;
	}

	.tui-pay__header {
		display: flex;
		align-items: center;
	}
	.tui-text__all{
		font-size: 28rpx;
		padding-left: 63rpx;
	}

	.tui-pay-item {
		width: 100%;
		height: 80rpx;
		display: flex;
		align-items: center;
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

	/* #ifndef MP-WEIXIN */
	>>>.uni-radio-input {
		margin-right: 0 !important;
	}

	/* #endif */

	/* #ifdef MP-WEIXIN */
	.wx-radio-input {
		margin-right: 0 !important;
	}

	/* #endif */

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

	.tui-text__gray {
		color: #999;
		font-size: 24rpx;
		margin-left: auto;
		padding-right: 30rpx;
	}

	.tui-btn__box {
		width: 100%;
		padding: 12rpx 30rpx;
		box-sizing: border-box;
		background-color: #fff;
		position: fixed;
		left: 0;
		bottom: 0;
		border-top-left-radius: 24rpx;
		border-top-right-radius: 24rpx;
		overflow: hidden;
	}
</style>
