<template>
	<view class="container">
		<tui-tab :tabs="tabs" isSticky :current="currentTab" selectedColor="#E41F19" sliderBgColor="#E41F19" @change="change"></tui-tab>
		<view class="tui-records__list">
			<view v-for="(item,index) in recordsList" :key="index" v-show="currentTab==index">
				<tui-list-cell :hover="false" v-for="(model,subIndex) in item.data" :key="subIndex">
					<view class="tui-records__item">
						<image class="tui-icon" :src="'https://system.chuangbiying.com/static/images/mall/wallet/'+model.icon"></image>
						<view>
							<view class="tui-title">{{model.title}}</view>
							<view class="tui-desc">{{model.time}}</view>
						</view>
						<view class="tui-right__box">
							<view class="tui-amount" :class="{'tui-expend':model.type==2}">{{model.type==2?'-':'+'}}{{model.amount}}</view>
							<view class="tui-desc">钱包余额: {{model.balance}}</view>
						</view>
					</view>
				</tui-list-cell>
				<!--加载loading-->
				<tui-loadmore v-if="recordsList[index].loading" :index="3" type="red"></tui-loadmore>
				<tui-nomore v-if="!recordsList[index].pullUpOn"></tui-nomore>
				<!--加载loading-->
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabs: ["全部", "收入", "支出"],
				currentTab: 0,
				recordsList: [{
					loading: false,
					pullUpOn: true,
					pageIndex: 1,
					noData: false,
					data: []
				}, {
					loading: false,
					pullUpOn: true,
					pageIndex: 1,
					noData: false,
					data: []
				}, {
					loading: false,
					pullUpOn: true,
					pageIndex: 1,
					noData: false,
					data: []
				}],
				//模拟请求返回数据
				requestData: [{
					type: 1, //1-收入 2-支出
					title: "充值收入",
					time: "2019-05-12 11:53:06",
					balance: '3006.50',
					amount: '2000.00',
					icon: 'icon_income_3x.png'
				}, {
					type: 1,
					title: "充值收入",
					time: "2019-05-12 11:53:06",
					balance: '3006.50',
					amount: '2000.00',
					icon: 'icon_income_3x.png'
				}, {
					type: 2,
					title: "交易支出",
					time: "2019-05-12 11:53:06",
					balance: '4206.50',
					amount: '2500.00',
					icon: 'icon_expend_3x.png'
				}, {
					type: 1,
					title: "充值收入",
					time: "2019-05-12 11:53:06",
					balance: '3006.50',
					amount: '2000.00',
					icon: 'icon_income_3x.png'
				}, {
					type: 1,
					title: "充值收入",
					time: "2019-05-12 11:53:06",
					balance: '3006.50',
					amount: '2000.00',
					icon: 'icon_income_3x.png'
				}, {
					type: 2,
					title: "交易支出",
					time: "2019-05-12 11:53:06",
					balance: '4206.50',
					amount: '2500.00',
					icon: 'icon_expend_3x.png'
				}, {
					type: 2,
					title: "交易支出",
					time: "2019-05-12 11:53:06",
					balance: '4206.50',
					amount: '2500.00',
					icon: 'icon_expend_3x.png'
				}, {
					type: 1,
					title: "充值收入",
					time: "2019-05-12 11:53:06",
					balance: '3006.50',
					amount: '2000.00',
					icon: 'icon_income_3x.png'
				}, {
					type: 1,
					title: "充值收入",
					time: "2019-05-12 11:53:06",
					balance: '3006.50',
					amount: '2000.00',
					icon: 'icon_income_3x.png'
				}, {
					type: 2,
					title: "交易支出",
					time: "2019-05-12 11:53:06",
					balance: '4206.50',
					amount: '2500.00',
					icon: 'icon_expend_3x.png'
				}]
			}
		},
		onLoad() {
			this.getRecordsList(this.currentTab)
		},
		methods: {
			change(e) {
				this.currentTab = e.index
				if (this.recordsList[this.currentTab].pageIndex == 1) {
					this.getRecordsList(this.currentTab)
				}
			},
			getRecordsList(index, refresh) {
				let item = this.recordsList[index]
				if (!refresh) {
					item.loading = true;
				}
				setTimeout(() => {
					refresh && uni.stopPullDownRefresh();
					let recordsList = [...this.requestData];
					if (this.currentTab > 0) {
						recordsList = recordsList.filter(item => item.type === this.currentTab)
					}
					if (item.pageIndex == 1) {
						item.data = recordsList;
					} else {
						item.data = item.data.concat(recordsList);
					}
					if (item.pageIndex > 2 || recordsList.length < 10) {
						item.pullUpOn = false;
					}
					item.pageIndex++;
					item.loading = false;
				}, 0)
			}
		},
		onPullDownRefresh() {
			let index = this.currentTab
			let item = this.recordsList[index]
			item.pageIndex = 1;
			item.loading = false;
			item.pullUpOn = true;
			item.noData = false;
			this.getRecordsList(index, true)
		},
		onReachBottom() {
			let index = this.currentTab
			if (!this.recordsList[index].pullUpOn) return;
			this.getRecordsList(index)
		}
	}
</script>

<style>
	.container {
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-records__list {
		margin-top: 20rpx;
	}

	.tui-records__item {
		width: 100%;
		display: flex;
		align-items: center;
	}

	.tui-icon {
		width: 72rpx;
		height: 72rpx;
		margin-right: 20rpx;
	}

	.tui-title {
		font-size: 30rpx;
		font-weight: 400;
		color: #333333;
	}

	.tui-desc {
		font-size: 24rpx;
		font-weight: 400;
		color: #888888;
		padding-top: 12rpx;
	}

	.tui-right__box {
		margin-left: auto;
		text-align: right;
	}

	.tui-amount {
		font-size: 30rpx;
		font-weight: 400;
		color: #EB0909;
	}

	.tui-expend {
		color: #19be6b !important;
	}
</style>
