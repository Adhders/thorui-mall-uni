<template>
	<view class="container">
		<view class="tui-group-box tui-top tui-btm">
			<tui-list-cell :hover="false">
				<view class="tui-group-header">
					<view class="tui-group-title">还差<text class="tui-color-red">1人</text>即可拼团成功</view>
				</view>
			</tui-list-cell>
			<view v-for="(item, index) in 12" :key="index">
				<tui-list-cell :hover="false">
					<view class="tui-pro-item">
						<image :src="webURL+ (index%2==0?'mine_avatar_3x.jpg':'img_not_tuxedo.png')" class="tui-avatar"></image>
						<view class="tui-name">{{index%2==0?'不许人间见白头':'手可摘星辰'}}</view>
						<view class="tui-pro__right tui-btn__box">
							<view>
								<tui-button type="danger" width="128rpx" height="52rpx" :size="24" shadow shape="circle">去参团</tui-button>
							</view>
							<view class="tui-group-countdown">
								<view class="tui-countdown-right">剩余</view>
								<tui-countdown :time="3800" scale colonColor="#EB0909" borderColor="#EB0909" color="#EB0909"></tui-countdown>
								<view class="tui-countdown-left">结束</view>
							</view>
						</view>
					</view>
				</tui-list-cell>
			</view>
		</view>
		<tui-divider gradual width="60%">没有更多了</tui-divider>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				webURL: 'https://thorui.cn/images/mall/group/'
			}
		},
		onLoad(options) {
			
		},
		methods: {
			
		}
	}
</script>

<style>
	.tui-group-box {
		background: #fff;
		box-sizing: border-box;
	}

	.tui-group-header {
		padding: 0 48rpx 0 24rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #555555;
		font-size: 28rpx;
	}
	.tui-group-title{
		font-size: 32rpx;
	}
	.tui-color-red{
		color: #EB0909;
	}

	.tui-pro-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12rpx 0;
		box-sizing: border-box;
	}

	.tui-name {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 28rpx;
	}

	.tui-avatar {
		width: 108rpx;
		height: 108rpx;
		flex-shrink: 0;
		margin-right: 20rpx;
		display: block;
		border-radius: 50%;
	}

	.tui-pro__right {
		width: 40%;
		height: 104rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.tui-group-countdown {
		display: flex;
		align-items: center;
		font-size: 24rpx;
		color: #666666;
		white-space: nowrap;
	}

	.tui-btn__box {
		align-items: flex-end;
		flex: 1;
	}

	.tui-countdown-right {
		padding-right: 6rpx;
	}

	.tui-countdown-left {
		padding-left: 6rpx;
	}
</style>