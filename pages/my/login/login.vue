<template>
	<view class="container">
		<view class="tui-header-box" :style="{ height: height + 'px', background: '#fff' }">
			<view class="tui-header" :style="{ paddingTop: top + 'px'}">授权登陆</view>
			<view class="tui-header-icon" :style="{ marginTop: top + 'px' }" @tap="onCancel">
				<tui-icon name="arrowleft" :size="30" color="#000" ></tui-icon>
			</view>
		</view>
		<view class="tui-avatar-box" :style="{ paddingTop: height + 'px' }">
			<!--只显示头像不获取-->
			<open-data type="userAvatarUrl" class="tui-avatar"></open-data>
<!--			<image :src="userInfo.avatarUrl" class="tui-avatar"></image>-->
		</view>
		<view class="tui-notice">
			<view class="notice-title">申请获取以下权限</view>
			<view class="notice-content">获得您的公开信息（昵称、头像等）</view>
		</view>
		<view class="tui-btn-box">
			<tui-button shape="circle" shadow type="danger" margin="13px 0" @tap="onConfirm">授权登录</tui-button>
			<tui-button shape="circle" shadow type="gray"  @tap="onCancel">暂不登录</tui-button>
		</view>
	</view>
</template>

<script>
	import jwt from "@/utils/jwt-decode.js";
	export default {
		data() {
			return {
				top: getApp().globalData.menuTop,
                height: getApp().globalData.navBarHeight,
				nickname: '',
				from: '',
				appid: '',
			};
		},
		onLoad(options) {
	        this.from = options.from
			this.appid = this.$store.state.appid
		},
		computed: {
			userInfo(){
				return this.$store.state.userInfo
			},
		},		
		methods: {
			onConfirm(){
				let _this = this
				uni.getUserProfile({
					desc: '获取您的昵称、头像',
					success: res => {
						let userInfo = res.userInfo
						uni.login({
							provider: 'weixin',
							success: function(res) {
								let js_code = res.code;
                                if(!_this.appid){
									const accountInfo = wx.getAccountInfoSync();
									_this.appid = accountInfo.miniProgram.appId
									_this.$store.commit('setAppid', _this.appid)
								}
								const url = '/customerLogin/'+ _this.appid + '/' + js_code
								_this.tui.request(url, 'POST', userInfo).then((res)=>{
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
										userInfo = res.userInfo
										uni.setStorage({
											key: 'userInfo',
											data: userInfo,
										})
					                    _this.$store.commit('login', true)
										_this.$store.commit('setUserInfo', userInfo)
										_this.$store.commit('setOrderState', res.orderState)
										_this.$store.commit('setAddress', userInfo.addressList)
										_this.$store.commit('setCart', userInfo.cart)
										uni.navigateBack({delta: 1})
									}else{
										uni.showToast({
											title: '请求失败,请重新进入小程序',
											icon: 'error',
											duration: 2000
										});
									}
								})
							},
							fail: function(err) {
								console.log('err', err)
							}
						})
					},
				})
			},
			onCancel(){
				if(this.from === 'cart'){
					uni.navigateTo({url: '/pages/tabbar/cart/cart'})
				}else{
					uni.navigateBack({delta: 1})
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
.container {
	padding: 0 60rpx;
	.tui-header-box {
		width: 100%;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 995;
	}
	.tui-header {
		width: 100%;
		font-size: 14px;
		font-weight: 500;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.tui-header-icon {
		position: fixed;
		top: 0;
		left: 10px;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		height: 32px;
		transform: translateZ(0);
		z-index: 9999;
		.tui-badge {
			background: #e41f19 !important;
			position: absolute;
			right: -4px;
		}
	}
	.tui-btn-box {
		padding: 40rpx 20rpx;
		box-sizing: border-box;
	}
	.tui-avatar-box {
		border-bottom: 1px solid #eaeef1;
	}
	.tui-avatar {
		flex-shrink: 0;
		margin: 60rpx auto;
		width: 160rpx;
		height: 160rpx;
		overflow: hidden;
		border-radius: 50%;
		border: 2px solid #fff;
		display: block;
	}
	.tui-notice{
		margin-top: 10px;
	}
	.notice-title {
		margin: 10px 0;
	}
	.notice-content {
		font-size: 14px;
		color: #999;
	}
}
</style>
