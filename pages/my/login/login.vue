<template>
	<view class="container">
		<view class="tui-avatar-box">
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
				nickname: ''
			};
		},
		onLoad() {
			this.appid = this.$store.state.appid
			this.secret = this.$store.state.secret
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
						console.log('userInfo', res.userInfo)
						let data = res.userInfo
						uni.login({
							provider: 'weixin',
							success: function(res) {
								let js_code = res.code;
								const url = '/customerLogin/'+ _this.appid  + '/' + _this.secret + '/' + js_code
								_this.tui.request(url, 'POST', data).then((res)=>{
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
										data.phone = decoded.userInfo.phone
										_this.$store.commit('login', true)
										_this.$store.commit('setUserInfo', data)
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
				uni.navigateBack({delta: 1})
			}
		}
	};
</script>

<style lang="scss" scoped>
.container {
	padding: 0 60rpx;
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
