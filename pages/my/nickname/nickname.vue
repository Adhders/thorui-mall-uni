<template>
	<view class="container">
		<tui-list-cell :hover="false" :lineLeft="false">
			<view class="tui-cell-input">
				<input :value="nickName" placeholder="请输入昵称" placeholder-class="tui-phcolor" type="text" :auto-focus="true" :focus="true" maxlength="40" @input="inputNickname" />
			<!-- 	<view class="tui-icon tui-icon-close_fill" v-show="nickName" @tap="clearInput"></view> -->
			   <icon type="clear" :size="14" color="#bfbfbf" v-show="nickName" @tap="clearInput"></icon>
			</view>
		</tui-list-cell>
		<view class="tui-btn-box">
			<tui-button shadow height="88rpx" shape="circle" type="danger" @tap="onConfirm">确定</tui-button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			nickName: '',
		};
	},
	onLoad(options) {
		this.nickName = options.nickName
	},
	computed: {
		userInfo() {
			return this.$store.state.userInfo
		}
	},
	methods: {
		inputNickname(e) {
			this.nickName = e.detail.value;
		},
		clearInput() {
			this.nickName = '';
		},
		onConfirm() {
			const url = '/updateCustomer/' + uni.getStorageSync("pid") + '/' + 'nickName'
			this.tui.request(url, 'PUT',{ nickName: this.nickName}).then(res => {
				this.userInfo.nickName = this.nickName
				uni.setStorage({
					key: 'userInfo',
					data: this.userInfo,
				})
				uni.navigateBack({delta: 1})
			})

		}
	}
}
</script>

<style lang="scss">
.container {
	padding-top: 20rpx;
	.tui-cell-input {
		width: 100%;
		display: flex;
		align-items: center;
		box-sizing: border-box;

		input {
			flex: 1;
			padding-left: $uni-spacing-row-base;
		}
	}
	.tui-btn-box {
		padding: 40rpx 30rpx 10rpx 30rpx;
		box-sizing: border-box;
	}
}
</style>
