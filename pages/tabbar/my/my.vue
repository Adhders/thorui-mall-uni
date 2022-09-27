<template>
	<view>
		<!--header-->
		<view class="tui-mybg-box">
			<image src="https://system.chuangbiying.com/static/images/my/img_bg_3x.png" class="tui-my-bg" mode="widthFix"></image>
			<view class="tui-header-center">
				<image :src="userInfo.avatarUrl" class="tui-avatar" @tap="href('userInfo')"></image>
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
				<view class="tui-login" v-else @tap="href('login')">
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
					<view class="tui-icon-box tui-icon-message" @tap="href('message')">
						<tui-icon name="message" color="#fff" :size="26"></tui-icon>
						<!-- <view v-if="isLogin" class="tui-badge tui-badge-white">1</view> -->
					</view>
					<view class="tui-icon-box tui-icon-setup" @tap="href('setup')">
						<tui-icon name="setup" color="#fff" :size="26"></tui-icon>
					</view>
				</view>
				<!-- #endif -->
			</view>
			<view class="tui-header-btm">
				<view class="tui-btm-item">
					<view class="tui-btm-num"  @tap="href('')">0</view>
					<view class="tui-btm-text">收藏夹</view>
				</view>
				<view class="tui-btm-item">
					<view class="tui-btm-num" @tap="href('myCoupon')">0</view>
					<view class="tui-btm-text">优惠券</view>
				</view>
				<view class="tui-btm-item">
					<view class="tui-btm-num" @tap="href('')">0</view>
					<view class="tui-btm-text">积分</view>
				</view>
				<view class="tui-btm-item">
					<view class="tui-btm-num" @tap="href('')">0</view>
					<view class="tui-btm-text">足迹</view>
				</view>
			</view>
		</view>
		<view class="tui-content-box">
			<view class="tui-box tui-order-box">
				<tui-list-cell :arrow="true" padding="0" :lineLeft="false" @click="href('order',0)">
					<view class="tui-cell-header">
						<view class="tui-cell-title">我的订单</view>
						<view class="tui-cell-sub">查看全部订单</view>
					</view>
				</tui-list-cell>
				<view class="tui-order-list">
					<view class="tui-order-item" @tap="href('order', 1)">
						<view class="tui-icon-box">
							<image src="https://system.chuangbiying.com/static/images/mall/my/icon_daifukuan_3x.png" class="tui-order-icon"></image>
							<view class="tui-badge tui-badge-red" v-if="orderState[1]">{{orderState[1]}}</view>
						</view>
						<view class="tui-order-text">待付款</view>
					</view>
					<view class="tui-order-item" @tap="href('order', 2)">
						<view class="tui-icon-box">
							<image src="https://system.chuangbiying.com/static/images/mall/my/icon_daifahuo_3x.png" class="tui-order-icon"></image>
							<view class="tui-badge tui-badge-red" v-if="orderState[2]">{{orderState[2]}}</view>
						</view>
						<view class="tui-order-text">待发货</view>
					</view>
					<view class="tui-order-item" @tap="href('order', 3)">
						<view class="tui-icon-box">
							<image src="https://system.chuangbiying.com/static/images/mall/my/icon_daishouhuo_3x.png" class="tui-order-icon"></image>
						    <view class="tui-badge tui-badge-red" v-if="orderState[3]">{{orderState[3]}}</view>
						</view>
						<view class="tui-order-text">待收货</view>
					</view>
					<view class="tui-order-item" @tap="href('order', 4)">
						<view class="tui-icon-box">
							<image src="https://system.chuangbiying.com/static/images/mall/my/icon_pingjia_3x.png" class="tui-order-icon"></image>
							<view class="tui-badge tui-badge-red" v-if="orderState[4]"> {{orderState[4]}}</view>
						</view>
						<view class="tui-order-text">待评价</view>
					</view>
					<view class="tui-order-item" @tap="href('refund')">
						<view class="tui-icon-box">
							<image src="https://system.chuangbiying.com/static/images/mall/my/icon_tuikuan_3x.png" class="tui-order-icon"></image>
							<view class="tui-badge tui-badge-red" v-if="orderState[5]">{{orderState[5]}}</view>
						</view>
						<view class="tui-order-text">退款/售后</view>
					</view>
				</view>
			</view>

			<!-- <view class="tui-box tui-assets-box">
				<tui-list-cell padding="0" unlined :hover="false">
					<view class="tui-cell-header">
						<view class="tui-cell-title">我的资产</view>
					</view>
				</tui-list-cell>
				<view class="tui-order-list tui-assets-list">
					<view class="tui-order-item" @tap="href(11)">
						<view class="tui-assets-num"><text>20</text></view>
						<view class="tui-assets-text">余额</view>
					</view>
					<view class="tui-order-item" @tap="href(8)">
						<view class="tui-assets-num">
							<text>3</text>
							<view class="tui-badge-dot"></view>
						</view>
						<view class="tui-assets-text">优惠券</view>
					</view>
					<view class="tui-order-item">
						<view class="tui-assets-num">
							<text>7</text>
							<view class="tui-badge-dot"></view>
						</view>
						<view class="tui-assets-text">积分</view>
					</view>
					<view class="tui-order-item">
						<view class="tui-assets-num"><text>0</text></view>
						<view class="tui-assets-text">红包</view>
					</view>
					<view class="tui-order-item">
						<view class="tui-assets-num"><text>1</text></view>
						<view class="tui-assets-text">礼品卡</view>
					</view>
				</view>
			</view> -->


			<view class="tui-box tui-tool-box">
				<tui-list-cell :arrow="true" padding="0" :lineLeft="false">
					<view class="tui-cell-header">
						<view class="tui-cell-title">常用工具</view>
						<view class="tui-cell-sub">查看更多</view>
					</view>
				</tui-list-cell>
				<view class="tui-order-list tui-flex-wrap">
					<view class="tui-tool-item"  @tap="href('')">
						<view class="tui-icon-box">
							<image src="https://system.chuangbiying.com/static/images/mall/my/icon_gift_3x.png" class="tui-tool-icon"></image>
							<image src="https://system.chuangbiying.com/static/images/mall/my/icon_tab_3x.png" class="tui-badge-icon"></image>
						</view>
						<view class="tui-tool-text">免费领好礼</view>
					</view>
					<view class="tui-tool-item" @tap="href('wallet')">
						<view class="tui-icon-box">
							<image src="https://system.chuangbiying.com/static/images/mall/my/icon_purse_3x.png" class="tui-tool-icon"></image>
						</view>
						<view class="tui-tool-text">钱包</view>
					</view>
					<view class="tui-tool-item" @tap="href('coupon')">
						<view class="tui-icon-box">
							<image src="https://system.chuangbiying.com/static/images/mall/my/icon_ticket_3x.png" class="tui-tool-icon"></image>
						</view>
						<view class="tui-tool-text">领券中心</view>
					</view>
					<button open-type="contact"  class="tui-tool-item tui-service" :hover-stay-time="150">
						<view class="tui-icon-box">
							<image src="https://system.chuangbiying.com/static/images/mall/my/icon_kefu_3x.png" class="tui-tool-icon"></image>
						</view>
						<view class="tui-tool-text">客服服务</view>
					</button>
					<view class="tui-tool-item" @tap="href('group')">
						<view class="tui-icon-box">
							<image src="https://system.chuangbiying.com/static/images/mall/my/icon_tuan_3x.png" class="tui-tool-icon"></image>
						</view>
						<view class="tui-tool-text">我的拼团</view>
					</view>
					<!-- <view class="tui-tool-item">
						<view class="tui-icon-box">
							<image src="https://system.chuangbiying.com/static/images/mall/my/icon_zhihuan_3x.png" class="tui-tool-icon"></image>
						</view>
						<view class="tui-tool-text">闲置换钱</view>
					</view> -->
					<!-- <view class="tui-tool-item">
						<view class="tui-icon-box">
							<image src="https://system.chuangbiying.com/static/images/mall/my/icon_kaipiao_3x.png" class="tui-tool-icon"></image>
						</view>
						<view class="tui-tool-text">开发票</view>
					</view> -->
				</view>
			</view>
			<tui-footer copyright="Copyright ©2021 创比赢提供技术支持" :navigate="navigate"></tui-footer>
		</view>
		<tui-tabbar :current="current" :tabBar="tabBar.list" 
			:color="tabBar.color" :selectedColor="tabBar.selectedColor" :backgroundColor="tabBar.backgroundColor"
			@click="tabbarSwitch">
		</tui-tabbar>
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
				top: getApp().globalData.menuTop,
                height: getApp().globalData.navBarHeight,
				opacity: 0,
				scrollTop: 0.5,
				pullUpOn: true,
				current: 2,
				// navigate: [{
				// 	text: "创比赢提供技术支持",
				// 	color: "#A7A7A7",
				// 	size: 24
				// }]
			};
		},
		onLoad: function() {
			this.appid = this.$store.state.appid
			if(!this.isLogin){
				this.loadData()
			}
		},
		onShow(){
			this.current = this.tabBar.list.length-1
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
		    	return this.$store.state.isLogin
			},
			orderState(){
				return this.$store.state.orderState
			},
			tabBar(){
				return this.$store.state.tabBar
			}
		},
		methods: {
			loadData(fresh){
				let pid = uni.getStorageSync("pid")
				if(pid){
					let url = '/queryUserInfo/' + pid
					this.tui.request(url).then((res)=>{
						// console.log('res', res)
						if(fresh){ //下拉刷出新
							wx.hideNavigationBarLoading() //完成停止加载
							wx.stopPullDownRefresh() //停止下拉刷新
						}
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
							let userInfo =  res.userInfo
							uni.setStorage({
								key: 'userInfo',
								data: userInfo,
							})
							this.$store.commit('login', true)
							this.$store.commit('setOrderState', res.orderState)
							this.$store.commit('setUserInfo', userInfo)
							this.$store.commit('setCart', userInfo.cart)
							this.$store.commit('setAddress', userInfo.addressList)
						}
						else{
							this.userInfo.nickName=''
							this.userInfo.phone=''
							this.$store.commit('login', false)
							uni.removeStorageSync('pid')
							uni.removeStorageSync('token')
							this.tui.href('/pages/my/login/login')
						}
					})
				}else{
					this.tui.href('/pages/my/login/login')
				}
			},
			getPhoneNumber: function(e) {
				const data = {code: e.code}
				const pid = uni.getStorageSync("pid")
				const url = '/getPhoneNumber/'+ this.appid + '/' + pid
                this.tui.request(url, 'POST', data).then(res=>{
					console.log('res', res)
					this.userInfo.phone=res.phone
				}).catch(err => {console.log('err', err)})
            },
			href(page, params) {
				//未登录状态下应跳转至登录页面，此处未作处理
				let url = '';
				switch (page) {
					case 'setup':
						url = '/pages/my/set/set';
						break;
					case 'userInfo':
						url = '/pages/my/userInfo/userInfo';
						break;
					case 'order':
						url = '/pages/my/myOrder/myOrder?' + 'currentTab=' + params;
						break;
					case 'login':
						url = '/pages/my/login/login';
						break;
					case 'coupon':
						url = '/pages/index/coupon/coupon';
						break;
					case 'message':
						url = '/pages/my/message/message';
						break;
					case 'myCoupon':
						url = '/pages/my/myCoupon/myCoupon';
						break;
					case 'group':
						url = '/pages/my/myGroup/myGroup';
						break;
					case 'refund':
						url = '/pages/my/refundList/refundList';
						break;
					case 'wallet':
						url = '/pages/my/wallet/wallet';
						break;
					default:
						break;
				}
				if (url){
					this.tui.href(url, true);
				} else {
					this.tui.toast('功能尚未完善~');
				}
			},
			redirect(e){
				if(e.pageName===''){
					return
				}
				let title = e.selectedLink.title
				if (title==='首页'){
					this.tui.href('/pages/tabbar/index/index')
				}else if(title==='分类页'){
					this.tui.href('/pages/tabbar/classify/classify')
				}else if(title==='全部商品'){
					this.tui.href('/pages/index/productList/productList')
				}else if(title==='用户中心'){
					this.tui.href('/pages/tabbar/my/my')
				}else if(title==='购物车'){
					this.tui.href('/pages/tabbar/cart/cart')
				}
			},
			tabbarSwitch(e){
				this.current = e.index
				this.redirect(e.chooseLink)
			}
		},
		onPullDownRefresh() {
			 this.loadData(true)
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

	/* .tui-assets-box {
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
	} */

	/* .tui-assets-text {
		font-size: 24rpx;
		font-weight: 400;
		color: #666;
		padding-top: 6rpx;
	} */

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
    .tui-service {
		background: #fff; 
		line-height: 30rpx;
		margin-bottom: -8rpx;
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
