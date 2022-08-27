<template>
	<view class="container">
		<tui-tabs :tabs="tabs" isFixed :currentTab="currentTab" selectedColor="#E41F19" sliderBgColor="#E41F19" @change="change" itemWidth="25%"></tui-tabs>
		<view class="tui-order-list">
			<view class="tui-order-item" v-for="(groupOrder, orderIndex) in displayList" :key="orderIndex" @tap="detail(groupOrder)">
				<tui-list-cell :hover="false" :lineLeft="false">
					<view class="tui-goods-title">
						<view v-if="currentTab!=1">{{groupOrder.create_time}}</view>
						<view v-else class="tui-flex">
							<text>距离结束剩余</text>
							<tui-countdown :time="getTime(groupOrder.open_time)" scale colonColor="#EB0909" borderColor="#EB0909" color="#EB0909"></tui-countdown>
						</view>
						<view class="tui-order-status">{{groupOrder.status}}</view>
					</view>
				</tui-list-cell>
				<t-order-item :order="groupOrder" type="group"></t-order-item>
				<tui-list-cell :hover="false" unlined>
					<view class="tui-goods-price">
						<view>共{{getNum(groupOrder.goodsList)}}件商品 实付：</view>
						<view class="tui-size-24">￥</view>
						<view class="tui-price-large">{{groupOrder.netCost.split('.')[0]}}</view>
						<view class="tui-size-24">.{{groupOrder.netCost.split('.')[1]}}</view>
					</view>
				</tui-list-cell>
				<view class="tui-order-btn">
					<tui-button type="black" plain width="152rpx" height="52rpx" :size="26" shape="circle">拼团详情</tui-button>
				</view>
			</view>
		</view>
		<tui-divider width="60%" gradual>没有更多了</tui-divider>
	</view>
</template>

<script>

import tOrderItem from '@/components/views/t-order-item/t-order-item'
	export default {
		components: {
			tOrderItem
		},
	data() {
		return {
			id: '',
			spu_id: '',
			tabs: [
				{
					name: '全部'
				},
				{
					name: '拼团中'
				},
				{
					name: '拼团成功'
				},
				{
					name: '拼团失败'
				}
			],
			currentTab: 0,
			displayList: [],
			groupOrderList: []
		};
	},
	onLoad(options){
		let url = '/getCustomerActivityOrders/' + uni.getStorageSync("pid")
		this.tui.request(url).then((res)=>{
			this.groupOrderList = res.activityOrderList
			if(options.orderNum){
				this.displayList = this.groupOrderList.filter((o)=>{
					return o.order === options.orderNum
				})
			}else{
				this.displayList = this.groupOrderList
			}
		})
	},
	watch: {
		currentTab(v){
			this.switchTab(v)
		}
	},
	methods: {
		change(e) {
			this.currentTab = e.index;
		},
		getTime(time){
			time = time.replace(/-/g, "/") //如果不转化，在ios设备上会计算错误
			const expireTime = 24*60*60*1000 //一天后过期
			let t1 = Date.parse(new Date(time)) + expireTime
			let t2 = Date.parse(new Date())
			return (t1-t2)/1000
		},
		getNum(goodsList) {
			let res = 0
			goodsList.forEach((o)=>{
				res += o.buyNum
			})
			return res
		},
		loadData(e, fresh){
			let url = '/getOrders/' + uni.getStorageSync("pid")
			this.tui.request(url,'GET', undefined, true).then((res)=>{
				if(res.code==='0'){
					this.loadding = false
					this.currentTab= (e.currentTab)? parseInt(e.currentTab): 0
					// this.$store.commit('setOrderList', res.orderList)
					if(fresh){
						setTimeout(()=>{
							wx.stopPullDownRefresh() //停止下拉刷新
						}, 300)
					}
				}
			})
		},
		switchTab(v){
			switch(v){
				case 0: {
					this.displayList = this.groupOrderList
					break;
				}
				case 1: {
					this.displayList = this.groupOrderList.filter((o)=>{
						return o.status==="拼团中"
					})
					break;
				}
				case 2: {
					this.displayList = this.groupOrderList.filter((o)=>{
						return o.status==="拼团成功"
					})
					break;
				}
				case 3: {
					this.displayList = this.groupOrderList.filter((o)=>{
						return o.status==="拼团失败"
					})
					break;
				}
			}
		},
		detail(order) {
			this.tui.href(`/pages/my/myGroupDetail/myGroupDetail?groupOrder=${JSON.stringify(order)}`);
		}
	}
};
</script>

<style>
.tui-order-list {
	width: 100%;
	padding: 0 25rpx;
	margin-top: 80rpx;
	box-sizing: border-box;
}

.tui-order-item {
	margin-top: 20rpx;
	border-radius: 12rpx;
	box-shadow: 0 5rpx 10rpx 0 rgba(0, 0, 0, 0.06);
	overflow: hidden;
}

.tui-goods-title {
	width: 100%;
	font-size: 28rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.tui-flex {
	display: flex;
	align-items: center;
}
.tui-flex text {
	padding-right: 12rpx;
}

.tui-order-status {
	color: #eb0909;
	font-size: 26rpx;
}


.tui-goods-price {
	width: 100%;
	display: flex;
	align-items: flex-end;
	justify-content: flex-end;
	font-size: 24rpx;
}

.tui-size-24 {
	font-size: 24rpx;
	line-height: 24rpx;
}

.tui-price-large {
	font-size: 32rpx;
	line-height: 30rpx;
	font-weight: 500;
}

.tui-order-btn {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	background: #fff;
	padding: 0rpx 30rpx 20rpx;
	box-sizing: border-box;
}
</style>
