<template>
	<view class="tui-set-box">
		<tui-list-cell padding="0" :lineLeft="false" :arrow="true" @click="href(1)">
			<view class="tui-list-cell tui-info-box">
				<image :src="userInfo.avatarUrl" class="tui-avatar"></image>
				<view>{{userInfo.nickName}}</view>
			</view>
		</tui-list-cell>
		<tui-list-cell padding="0" :lineLeft="false" :arrow="true" @click="href(2)">
			<view class="tui-list-cell">
				地址管理
			</view>
		</tui-list-cell>
		<view class="tui-mtop">
			<tui-list-cell padding="0" :lineLeft="false" :arrow="true">
				<view class="tui-list-cell">
					账户与安全
				</view>
			</tui-list-cell>
			<tui-list-cell padding="0" :lineLeft="false" :arrow="true">
				<view class="tui-list-cell">
					支付设置
				</view>
			</tui-list-cell>
			<tui-list-cell padding="0" :lineLeft="false" :arrow="true" @click="href(3)">
				<view class="tui-list-cell">
					消息提醒设置
				</view>
			</tui-list-cell>
		</view>
		<view class="tui-mtop">
			<tui-list-cell padding="0" :lineLeft="false" :arrow="true" @click="href(5)">
				<view class="tui-list-cell">
					意见反馈
				</view>
			</tui-list-cell>
		</view>
		<view class="tui-exit" v-if="isLogin">
			<tui-button shape="circle" shadow type="danger" @tap="logout">退出登录</tui-button>
		</view>
		<view class="tui-exit" v-else>
			<tui-button shape="circle" shadow type="danger" @tap="login">登录</tui-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		computed: {
			userInfo(){
				return this.$store.state.userInfo
			},
			isLogin(){
				return uni.getStorageSync("pid") || this.$store.state.isLogin
			}
		},
		methods: {
			href(page) {
				let url = "";
				switch (page) {
					case 1:
						url = "/pages/my/userInfo/userInfo"
						break;
					case 2:
						url = "/pages/my/address/address"
						break;
					case 3:
						url = "/pages/my/notice/notice"
						break;
					case 4:
						url = "/pages/common/about/about"
						break;
					case 5:
						url = "/pages/my/feedback/feedback?page=mall"
						break;
					default:
						break;
				}
				uni.navigateTo({
					url: url
				})
			},
			login(){
				uni.navigateTo({
					url: "/pages/my/login/login"
				})
			},
			logout() {
				let userInfo = {
					avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
					phone: '',
					nickName: '未登录'}
				this.$store.commit('setUserInfo', userInfo)
				this.$store.commit('login', false)
				uni.removeStorageSync('token')
				uni.removeStorageSync('pid')
				uni.removeStorageSync('userInfo')
				uni.navigateBack({delta: 1})
			}
		}
	}
</script>

<style>
	.tui-set-box {
		padding-bottom: 20rpx;
		color: #333;
	}

	.tui-list-cell {
		display: flex;
		align-items: center;
		padding: 24rpx 30rpx;
		font-size: 30rpx;
	}

	.tui-info-box {
		font-size: 34rpx;
	}

	.tui-avatar {
		width: 140rpx;
		height: 140rpx;
		margin-right: 20rpx;
		overflow: hidden;
		border-radius: 50%;
	}

	.tui-mtop {
		margin-top: 20rpx;
	}

	.tui-exit {
		padding: 100rpx 24rpx;
	}
</style>
