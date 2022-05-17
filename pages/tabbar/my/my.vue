<template>
	<view>
		<!--header-->
		<view class="tui-mybg-box">
			<image src="https://system.chuangbiying.com/static/images/my/img_bg_3x.png" class="tui-my-bg" mode="widthFix"></image>
			<view class="tui-header-center">
				<image :src="userInfo.avatarUrl" class="tui-avatar" @tap="href(3)"></image>
				<view class="tui-info" v-if="isLogin">
					<view class="tui-nickname">
						{{userInfo.nickName}}
						<image src="https://system.chuangbiying.com/static/images/mall/my/icon_vip_3x.png" class="tui-img-vip"></image>
					</view>
					<view class="tui-phoneNumber">
						<tui-icon name="mobile" :size="12" color="#fff"></tui-icon>
						<view class="tui-explain" v-if="userInfo.phone">{{userInfo.phone | formatNumber}}</view>
						<view class="tui-explain" v-else>
							<tui-form-button open-type="getPhoneNumber"
								@getphonenumber="getPhoneNumber"
								:size="24"
					            height="30rpx"
			                    plain
								link
							    color="#fff">
								绑定手机
							</tui-form-button>
							<tui-icon name="arrowright" color="#fff" :size="30" unit="rpx"></tui-icon>
						</view>
					</view>
				</view>
				<view class="tui-login" v-else @tap="href(5)">
					<text class="tui-login-btn">点击登录</text>
					<tui-icon name="arrowright" color="#fff" :size="36" unit="rpx"></tui-icon>
				</view>
				<!-- #ifndef MP -->
				<view class="tui-btn-edit" v-if="isLogin">
					<tui-button type="white" :plain="true" shape="circle" width="92rpx" height="40rpx" :size="22" @click="href(3)">编辑</tui-button>
				</view>
				<!-- #endif -->
				<!-- #ifdef MP -->
				<view class="tui-set-box">
					<view class="tui-icon-box tui-icon-message" @tap="href(7)">
						<tui-icon name="message" color="#fff" :size="26"></tui-icon>
						<view v-if="isLogin" class="tui-badge tui-badge-white">1</view>
					</view>
					<view class="tui-icon-box tui-icon-setup" @tap="href(2)">
						<tui-icon name="setup" color="#fff" :size="26"></tui-icon>
					</view>
				</view>
				<!-- #endif -->
			</view>
			<view class="tui-header-btm" @tap="href(5)">
				<view class="tui-btm-item">
					<view class="tui-btm-num">25</view>
					<view class="tui-btm-text">收藏夹</view>
				</view>
				<view class="tui-btm-item">
					<view class="tui-btm-num">22</view>
					<view class="tui-btm-text">店铺关注</view>
				</view>
				<view class="tui-btm-item">
					<view class="tui-btm-num">3</view>
					<view class="tui-btm-text">喜欢的内容</view>
				</view>
				<view class="tui-btm-item">
					<view class="tui-btm-num">44</view>
					<view class="tui-btm-text">足迹</view>
				</view>
			</view>
		</view>
		<view class="tui-content-box">
			<view class="tui-box tui-order-box">
				<tui-list-cell :arrow="true" padding="0" :lineLeft="false" @click="href(4,0)">
					<view class="tui-cell-header">
						<view class="tui-cell-title">我的订单</view>
						<view class="tui-cell-sub">查看全部订单</view>
					</view>
				</tui-list-cell>
				<view class="tui-order-list">
					<view class="tui-order-item" @tap="href(4, 1)">
						<view class="tui-icon-box">
							<image src="https://system.chuangbiying.com/static/images/mall/my/icon_daifukuan_3x.png" class="tui-order-icon"></image>
							<view class="tui-badge tui-badge-red" v-if="orderState[1]">{{orderState[1]}}</view>
						</view>
						<view class="tui-order-text">待付款</view>
					</view>
					<view class="tui-order-item" @tap="href(4, 2)">
						<view class="tui-icon-box">
							<image src="https://system.chuangbiying.com/static/images/mall/my/icon_daifahuo_3x.png" class="tui-order-icon"></image>
							<view class="tui-badge tui-badge-red" v-if="orderState[2]">{{orderState[2]}}</view>
						</view>
						<view class="tui-order-text">待发货</view>
					</view>
					<view class="tui-order-item" @tap="href(4, 3)">
						<view class="tui-icon-box">
							<image src="https://system.chuangbiying.com/static/images/mall/my/icon_daishouhuo_3x.png" class="tui-order-icon"></image>
						    <view class="tui-badge tui-badge-red" v-if="orderState[3]">{{orderState[3]}}</view>
						</view>
						<view class="tui-order-text">待收货</view>
					</view>
					<view class="tui-order-item" @tap="href(4, 4)">
						<view class="tui-icon-box">
							<image src="https://system.chuangbiying.com/static/images/mall/my/icon_pingjia_3x.png" class="tui-order-icon"></image>
							<view class="tui-badge tui-badge-red" v-if="orderState[4]"> {{orderState[4]}}</view>
						</view>
						<view class="tui-order-text">待评价</view>
					</view>
					<view class="tui-order-item" @tap="href(10)">
						<view class="tui-icon-box">
							<image src="https://system.chuangbiying.com/static/images/mall/my/icon_tuikuan_3x.png" class="tui-order-icon"></image>
							<view class="tui-badge tui-badge-red" v-if="orderState[5]">{{orderState[5]}}</view>
						</view>
						<view class="tui-order-text">退款/售后</view>
					</view>
				</view>
			</view>

<!--			<view class="tui-box tui-assets-box">-->
<!--				<tui-list-cell padding="0" unlined :hover="false">-->
<!--					<view class="tui-cell-header">-->
<!--						<view class="tui-cell-title">我的资产</view>-->
<!--					</view>-->
<!--				</tui-list-cell>-->
<!--				<view class="tui-order-list tui-assets-list">-->
<!--					<view class="tui-order-item" @tap="href(11)">-->
<!--						<view class="tui-assets-num"><text>20</text></view>-->
<!--						<view class="tui-assets-text">余额</view>-->
<!--					</view>-->
<!--					<view class="tui-order-item" @tap="href(8)">-->
<!--						<view class="tui-assets-num">-->
<!--							<text>3</text>-->
<!--							<view class="tui-badge-dot"></view>-->
<!--						</view>-->
<!--						<view class="tui-assets-text">优惠券</view>-->
<!--					</view>-->
<!--					<view class="tui-order-item">-->
<!--						<view class="tui-assets-num">-->
<!--							<text>7</text>-->
<!--							<view class="tui-badge-dot"></view>-->
<!--						</view>-->
<!--						<view class="tui-assets-text">积分</view>-->
<!--					</view>-->
<!--					<view class="tui-order-item">-->
<!--						<view class="tui-assets-num"><text>0</text></view>-->
<!--						<view class="tui-assets-text">红包</view>-->
<!--					</view>-->
<!--					<view class="tui-order-item">-->
<!--						<view class="tui-assets-num"><text>1</text></view>-->
<!--						<view class="tui-assets-text">礼品卡</view>-->
<!--					</view>-->
<!--				</view>-->
<!--			</view>-->

			<view class="tui-box tui-tool-box">
				<tui-list-cell :arrow="true" padding="0" :lineLeft="false">
					<view class="tui-cell-header">
						<view class="tui-cell-title">常用工具</view>
						<view class="tui-cell-sub">查看更多</view>
					</view>
				</tui-list-cell>
				<view class="tui-order-list tui-flex-wrap">
					<view class="tui-tool-item">
						<view class="tui-icon-box">
							<image src="https://system.chuangbiying.com/static/images/mall/my/icon_gift_3x.png" class="tui-tool-icon"></image>
							<image src="https://system.chuangbiying.com/static/images/mall/my/icon_tab_3x.png" class="tui-badge-icon"></image>
						</view>
						<view class="tui-tool-text">免费领好礼</view>
					</view>
					<view class="tui-tool-item" @tap="href(11)">
						<view class="tui-icon-box">
							<image src="https://system.chuangbiying.com/static/images/mall/my/icon_purse_3x.png" class="tui-tool-icon"></image>
						</view>
						<view class="tui-tool-text">钱包</view>
					</view>
					<view class="tui-tool-item" @tap="href(6)">
						<view class="tui-icon-box">
							<image src="https://system.chuangbiying.com/static/images/mall/my/icon_ticket_3x.png" class="tui-tool-icon"></image>
						</view>
						<view class="tui-tool-text">领券中心</view>
					</view>
					<view class="tui-tool-item">
						<view class="tui-icon-box">
							<image src="https://system.chuangbiying.com/static/images/mall/my/icon_kefu_3x.png" class="tui-tool-icon"></image>
						</view>
						<view class="tui-tool-text">客服服务</view>
					</view>
					<view class="tui-tool-item">
						<view class="tui-icon-box">
							<image src="https://system.chuangbiying.com/static/images/mall/my/icon_fanxian_3x.png" class="tui-tool-icon"></image>
						</view>
						<view class="tui-tool-text">每日返现</view>
					</view>
					<view class="tui-tool-item" @tap="href(9)">
						<view class="tui-icon-box">
							<image src="https://system.chuangbiying.com/static/images/mall/my/icon_tuan_3x.png" class="tui-tool-icon"></image>
						</view>
						<view class="tui-tool-text">我的拼团</view>
					</view>
					<view class="tui-tool-item">
						<view class="tui-icon-box">
							<image src="https://system.chuangbiying.com/static/images/mall/my/icon_zhihuan_3x.png" class="tui-tool-icon"></image>
						</view>
						<view class="tui-tool-text">闲置换钱</view>
					</view>
					<view class="tui-tool-item">
						<view class="tui-icon-box">
							<image src="https://system.chuangbiying.com/static/images/mall/my/icon_kaipiao_3x.png" class="tui-tool-icon"></image>
						</view>
						<view class="tui-tool-text">开发票</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import utils from '@/utils/util.js'
	import jwt from "@/utils/jwt-decode.js";
	export default {
		data() {
			return {
				appid: '',
				pid: '',
				top: 0, //标题图标距离顶部距离
				opacity: 0,
				scrollTop: 0.5,
				pullUpOn: true
			};
		},
		onLoad: function() {
			let obj = {};
			// #ifdef MP-WEIXIN
			obj = wx.getMenuButtonBoundingClientRect();
			// #endif
			// #ifdef MP-BAIDU
			obj = swan.getMenuButtonBoundingClientRect();
			// #endif
			// #ifdef MP-ALIPAY
			my.hideAddToDesktopMenu();
			// #endif
			uni.getSystemInfo({
				success: res => {
					this.width = obj.left || res.windowWidth;
					this.height = obj.top ? obj.top + obj.height + 8 : res.statusBarHeight + 44;
					this.top = obj.top ? obj.top + (obj.height - 32) / 2 : res.statusBarHeight + 6;
					this.scrollH = res.windowWidth * 0.6;
				}
			});
			this.appid = this.$store.state.appid
			this.secret = this.$store.state.secret
			let pid = uni.getStorageSync("pid")
			if(pid){
				let url = '/queryUserInfo/' + pid
				this.tui.request(url).then((res)=>{

					if(res.code==='0'){
						let decoded = jwt.jwt_decode(res.token);
						uni.setStorage({
							key: 'token',
							data: res.token,
						})
						uni.setStorage({
							key: 'pid',
							data: decoded.pid,
						})
						uni.setStorage({
							key: 'userInfo',
							data: decoded.userInfo,
						})
						this.$store.commit('login', true)
						this.$store.commit('setOrderState', res.orderState)
						this.$store.commit('setUserInfo', decoded.userInfo)
						this.$store.commit('setReviewLikes', res.reviewLikes)
					}
				}).catch(err=>{
					console.log('err', err)
				})
			}else{
				this.tui.href('/pages/my/login/login')
			}
		},
		filters: {
			formatNumber(v){
				return utils.formatNumber(v)
			}
		},
		computed: {
     		userInfo(){
		    	return this.$store.state.userInfo
			},
			isLogin(){
		    	return uni.getStorageSync("pid") || this.$store.state.isLogin
			},
			orderState(){
				return this.$store.state.orderState
			}
		},
		methods: {
			getPhoneNumber: function(e) {
				const data = {code: e.code}
				const pid = uni.getStorageSync("pid")
				const url = '/getPhoneNumber/'+ this.appid + '/' + this.secret + '/' + pid
                this.tui.request(url, 'POST', data).then(res=>{
					this.userInfo.phone=res.phone
				}).catch(err => {console.log('err', err)})
            },
			href(page, params) {
				//未登录状态下应跳转至登录页面，此处未作处理
				let url = '';
				switch (page) {
					case 2:
						url = '/pages/my/set/set';
						break;
					case 3:
						url = '/pages/my/userInfo/userInfo';
						break;
					case 4:
						url = '/pages/my/myOrder/myOrder?' + 'currentTab=' + params;
						break;
					case 5:
						url = '/pages/my/login/login';
						break;
					case 6:
						url = '/pages/index/coupon/coupon';
						break;
					case 7:
						url = '/pages/my/message/message';
						break;
					case 8:
						url = '/pages/my/myCoupon/myCoupon';
						break;
					case 9:
						url = '/pages/my/myGroup/myGroup';
						break;
					case 10:
						url = '/pages/my/refundList/refundList';
						break;
					case 11:
						url = '/pages/my/wallet/wallet';
						break;
					default:
						break;
				}
				if (url) {
					this.tui.href(url, true);
				} else {
					this.tui.toast('功能尚未完善~');
				}
			},
		},
	};
</script>

<style>
	.tui-header-box {
		width: 100%;
		padding: 0 30rpx 0 20rpx;
		box-sizing: border-box;
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		height: 32px;
		transform: translateZ(0);
		z-index: 9999;
	}

	/* #ifndef MP */
	.tui-header-icon {
		min-width: 120rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	/* #endif */
	/* #ifdef MP */
	.tui-set-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	/* #endif */
	.tui-icon-box {
		position: relative;
	}

	.tui-icon-setup {
		margin-left: 8rpx;
	}

	.tui-badge {
		position: absolute;
		font-size: 24rpx;
		height: 32rpx;
		min-width: 20rpx;
		padding: 0 6rpx;
		border-radius: 40rpx;
		right: 10rpx;
		top: -5rpx;
		transform: scale(0.8) translateX(60%);
		transform-origin: center center;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
	}

	.tui-badge-red {
		background: #f74d54;
		color: #fff;
	}

	.tui-badge-white {
		background: #fff;
		color: #f74d54;
	}

	.tui-badge-dot {
		position: absolute;
		height: 12rpx;
		width: 12rpx;
		border-radius: 50%;
		right: -12rpx;
		top: 0;
		background: #f74d54;
	}

	.tui-mybg-box {
		width: 100%;
		height: 464rpx;
		position: relative;
	}

	.tui-my-bg {
		width: 100%;
		height: 464rpx;
		display: block;
	}

	.tui-header-center {
		position: absolute;
		width: 100%;
		height: 128rpx;
		left: 0;
		top: 140rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
	}

	.tui-avatar {
		flex-shrink: 0;
		width: 128rpx;
		height: 128rpx;
		overflow: hidden;
		border-radius: 50%;
		border: 2px solid #fff;
		display: block;
	}
	.tui-info {
		width: 60%;
		padding-left: 30rpx;
	}
	.tui-login {
		width: 60%;
		padding-left: 30rpx;
		font-size: 32rpx;
		line-height: 32rpx;
		color: #fff;
		display: flex;
		align-items: center;
	}
    .tui-login-btn {
		font-size: 26rpx;
	}
	.tui-nickname {
		font-size: 30rpx;
		font-weight: 500;
		color: #fff;
		display: flex;
		align-items: center;
	}

	.tui-img-vip {
		width: 56rpx;
		height: 24rpx;
		margin-left: 10rpx;
	}

	.tui-explain {
		width: 80%;
		margin-left: 4rpx;
		font-size: 24rpx;
		font-weight: 400;
		color: #fff;
		opacity: 0.75;
		padding-top: 8rpx;
		white-space: nowrap;
		overflow: hidden;
		display: flex;
		align-items: center;
		text-overflow: ellipsis;
	}

	.tui-phoneNumber{
		display: flex;
		align-items: center;
	}

	.tui-btn-edit {
		flex-shrink: 0;
		padding-right: 22rpx;
	}

	.tui-header-btm {
		width: 100%;
		padding: 0 30rpx;
		box-sizing: border-box;
		position: absolute;
		left: 0;
		top: 300rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #fff;
	}

	.tui-btm-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.tui-btm-num {
		font-size: 32rpx;
		font-weight: 600;
		position: relative;
	}

	.tui-btm-text {
		font-size: 24rpx;
		opacity: 0.85;
		padding-top: 4rpx;
	}

	.tui-content-box {
		width: 100%;
		padding: 0 30rpx;
		box-sizing: border-box;
		position: relative;
		top: -72rpx;
		z-index: 10;
	}

	.tui-box {
		width: 100%;
		background: #fff;
		box-shadow: 0 3rpx 20rpx rgba(183, 183, 183, 0.1);
		border-radius: 10rpx;
		overflow: hidden;
	}

	.tui-order-box {
		height: 208rpx;
	}

	.tui-cell-header {
		width: 100%;
		height: 74rpx;
		padding: 0 26rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tui-cell-title {
		font-size: 30rpx;
		line-height: 30rpx;
		font-weight: 600;
		color: #333;
	}

	.tui-cell-sub {
		font-size: 24rpx;
		font-weight: 400;
		color: #999;
		padding-right: 28rpx;
	}

	.tui-order-list {
		width: 100%;
		height: 134rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tui-order-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.tui-order-text,
	.tui-tool-text {
		font-size: 26rpx;
		font-weight: 400;
		color: #666;
		padding-top: 4rpx;
	}

	.tui-tool-text {
		font-size: 24rpx;
	}

	.tui-order-icon {
		width: 56rpx;
		height: 56rpx;
		display: block;
	}

	.tui-assets-box {
		height: 178rpx;
		margin-top: 20rpx;
	}

	.tui-assets-list {
		height: 84rpx;
	}

	.tui-assets-num {
		font-size: 32rpx;
		font-weight: 500;
		color: #333;
		position: relative;
	}

	.tui-assets-text {
		font-size: 24rpx;
		font-weight: 400;
		color: #666;
		padding-top: 6rpx;
	}

	.tui-tool-box {
		margin-top: 20rpx;
	}

	.tui-flex-wrap {
		flex-wrap: wrap;
		height: auto;
		padding-bottom: 30rpx;
	}

	.tui-tool-item {
		width: 25%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding-top: 30rpx;
	}

	.tui-tool-icon {
		width: 64rpx;
		height: 64rpx;
		display: block;
	}

	.tui-badge-icon {
		width: 66rpx;
		height: 30rpx;
		position: absolute;
		right: 0;
		transform: translateX(88%);
		top: -15rpx;
	}

	/*为你推荐*/
	.tui-product-list {
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		flex-wrap: wrap;
		box-sizing: border-box;
	}

	.tui-product-container {
		flex: 1;
		margin-right: 2%;
	}

	.tui-product-container:last-child {
		margin-right: 0;
	}

	.tui-pro-item {
		width: 100%;
		margin-bottom: 4%;
		background: #fff;
		box-sizing: border-box;
		border-radius: 12rpx;
		overflow: hidden;
	}

	.tui-pro-img {
		width: 100%;
		display: block;
	}

	.tui-pro-content {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 20rpx;
	}

	.tui-pro-tit {
		color: #2e2e2e;
		font-size: 26rpx;
		line-height: 32rpx;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.tui-pro-price {
		padding-top: 18rpx;
	}

	.tui-sale-price {
		font-size: 34rpx;
		font-weight: 500;
		color: #e41f19;
	}

	.tui-factory-price {
		font-size: 24rpx;
		color: #a0a0a0;
		text-decoration: line-through;
		padding-left: 12rpx;
	}

	.tui-pro-pay {
		padding-top: 10rpx;
		font-size: 24rpx;
		color: #656565;
	}
</style>
