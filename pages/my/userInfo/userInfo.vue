<template>
	<view class="tui-userinfo-box">
		<tui-list-cell padding="0" :hover="false">
			<view class="tui-list-cell">
				<view>头像</view>
				<image :src="userInfo.avatarUrl" class="tui-avatar"></image>
			</view>
		</tui-list-cell>
		<tui-list-cell padding="0" @tap="editname" :arrow="true">
			<view class="tui-list-cell">
				<view>用户昵称</view>
				<view class="tui-content">{{userInfo.nickName}}</view>
			</view>
		</tui-list-cell>
		<tui-list-cell padding="0" :hover="false">
			<view class="tui-list-cell">
				<view>性别</view>
				<view class="tui-content">{{['男', '女'][userInfo.gender]}}</view>
			</view>
		</tui-list-cell>
		<picker mode="date" @change="changeDate">
			<tui-list-cell padding="0" :arrow="true" unlined>
				<view class="tui-list-cell">
					<view>出生日期</view>
					<view class="tui-content">{{userInfo.birthDay}}</view>
				</view>
			</tui-list-cell>
		</picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo
			}
		},
		methods: {
			// changeAvatar() {
			// 	uni.chooseImage({
			// 		count: 1,
			// 		sizeType: ['original', 'compressed'],
			// 		sourceType: ['album', 'camera'],
			// 		success: res => {
			// 			const tempFilePaths = res.tempFilePaths[0];
			// 			this.tui.href('/pages/my/cropper/cropper?src=' + tempFilePaths);
			// 		}
			// 	});
			// },
			editname() {
				const url = "/pages/my/nickname/nickname?nickName=" + this.userInfo.nickName
				this.tui.href(url)
			},
			changeDate(e){
				this.userInfo.birthDay=e.detail.value
				const pid = uni.getStorageSync("pid")
				const url = '/updateCustomer/' + pid + '/' + 'birthDay'
				this.tui.request(url, 'PUT',{birthDay: e.detail.value}).then(res => {
					this.userInfo.birthDay = e.detail.value
					uni.setStorage({
						key: 'userInfo',
						data: this.userInfo,
					})
				})
			}
		}
	}
</script>

<style>
	.tui-userinfo-box {
		margin: 20rpx 0;
		color: #333;
	}

	.tui-list-cell {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 24rpx 60rpx 24rpx 30rpx;
		box-sizing: border-box;
		font-size: 30rpx;
	}

	.tui-avatar {
		width: 100rpx;
		height: 100rpx;
		display: block;
		overflow: hidden;
		border-radius: 50%;
	}

	.tui-content {
		font-size: 26rpx;
		color: #666;
	}
</style>
