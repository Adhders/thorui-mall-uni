<template>
	<view class="container">
		<tui-tabs :tabs="tabs" :currentTab="currentTab" :isFixed="scrollTop>=0" @change="change" selectedColor="#E41F19" sliderBgColor="#E41F19"
				:itemWidth="(100/tabs.length)+'%'"></tui-tabs>	
		<!--选项卡逻辑自己实现即可，此处未做处理-->
    	<tui-loading v-if="loadding"></tui-loading>
		<view class="tui-order-list" v-else>
			<view class="tui-order-item" v-for="(order, orderIndex) in displayList" :key="orderIndex">
				<tui-list-cell :hover="false" :lineLeft="false">
					<view class="tui-goods-title">
						<view v-if='currentTab===0'>订单号：{{order.orderNum}}</view>
						<block v-else>
							<view>服务单号：{{order.refundNum}}</view>
							<view class="tui-order-status">{{order.status}}</view>
						</block>
					</view>
				</tui-list-cell>
				<block v-for="(item,index) in order.goodsList" :key="index">
					<tui-list-cell padding="0" :hover="false"  @tap="detail(order)">
						<view class="tui-goods-item">
								<image :src=item.defaultImageUrl class="tui-goods-img"></image>
								<view class="tui-goods-center">
									<view class="tui-goods-name">{{item.title}}</view>
									<view class="tui-goods-attr">{{item.propertyList | getProperty}}</view>
								</view>
								<view class="tui-price-right">
									<view>￥{{item.price}}</view>
									<view>x{{item.buyNum}}</view>
								</view>
							</view>
					</tui-list-cell>
				</block>
				<tui-list-cell :hover="false" unlined v-if="currentTab!==0">
					<view class="tui-goods-price" v-if="order.status==='退款成功'">
						<view style="margin-left: 10px">已退款：</view>
						<view class="tui-price-large tui-order-status">￥{{order.netCost}}</view>
					</view>
					<view class="tui-goods-price" v-else>
						<view>实付：</view>
						<view class="tui-price-large">￥{{order.netCost}}</view>
						<view style="margin-left: 10px">退款金额：</view>
						<view class="tui-price-large tui-order-status">￥{{order.netCost}}</view>
					</view>
				</tui-list-cell>
			
				<view class="tui-order-message" v-if="currentTab===0 && order.index!==-1">
					<view style="width: 252rpx" @tap="refundDetail(order.index)">
						<tui-list-cell  arrow unlined :hover="false" color="#888" size=22>
							该商品已申请售后
						</tui-list-cell>
					</view>
				</view>
				<view class="tui-order-btn" v-else>
					<view class="tui-btn-ml tui-apply-btn" v-if="currentTab===0 && order.index===-1">
						<tui-button type="danger" plain width="152rpx" height="56rpx" :size="26" shape="circle" @tap="onApply(order)">
							申请售后
						</tui-button>
					</view>
					<block v-if="currentTab===1">
						<view class="tui-btn-ml">
							<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @tap="detail(order)">
								售后详情
							</tui-button>
						</view>
						<view class="tui-btn-ml">
							<tui-button type="danger" plain width="152rpx" height="56rpx" :size="26" shape="circle" @tap="onCancel(order)">
								取消售后
							</tui-button>
							<!-- <tui-button type="danger" plain width="152rpx" height="56rpx" :size="26" shape="circle" @tap="onCancel(order)">
								去处理
							</tui-button> -->
						</view>
					</block>
					<block v-if="currentTab===2">
					    <block v-if="order.status==='处理中'">
							<view class="tui-btn-ml">
								<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @tap="detail(order)">
									售后详情
								</tui-button>
							</view>
							<view class="tui-btn-ml">
								<tui-button type="danger" plain width="152rpx" height="56rpx" :size="26" shape="circle" @tap="onCancel(order)">
									取消售后
								</tui-button>
							</view>
							<!-- <view class="tui-btn-ml" v-if="order.status==='处理中'">
								<tui-button type="danger" plain width="152rpx" height="56rpx" :size="26" shape="circle" @tap="onCancel(order)">
									去处理
								</tui-button>
							</view> -->
						</block>
						<block v-if="order.status==='申请已撤销'">
							<view class="tui-btn-ml">
								<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @tap="detail(order)">
									售后详情
								</tui-button>
							</view>
							<view class="tui-btn-ml">
								<tui-button type="danger" plain width="152rpx" height="56rpx" :size="26" shape="circle" @tap="onApply(order)">
									再次申请
								</tui-button>
							</view>
						</block>
					    <block  v-if="order.status==='退款成功'">
							<view class="tui-btn-ml">
								<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @tap="onDelete(order)">
									删除售后单
								</tui-button>
							</view>
							<view class="tui-btn-ml">
								<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @tap="detail(order)">
									售后详情
								</tui-button>
							</view>
						</block>
					</block>
				</view>
			</view>
      		<tui-no-data v-if="displayList.length===0" :fixed="false"
						 imgUrl="https://system.chuangbiying.com/static/images/index/img_noorder.png">
				您还没有相关的订单</tui-no-data>
			<tui-modal :show="isDelete" @click="onRemove"  title="确定删除售后单？" content="删除之后此售后单将无法恢复，请慎重考虑？"></tui-modal>	
		</view>
		<tui-divider width="60%" gradual>没有更多了</tui-divider>
	</view>
</template>

<script>
import utils from "@/utils/util.js"
export default {
	data() {
		return {
			tabs: [{name: "售后申请"}, {name: "处理中"}, {name: "申请记录"}],
			scrollTop: 0,
			currentTab: 1,
			selectedOrder: null,
			isDelete: false,
			loadding: true,
			orderList: [],
      		displayList: [],
		};
	},
    onLoad(option){
		let url = '/getRefundOrders/' + uni.getStorageSync("pid")
		this.tui.request(url,'GET', undefined, true).then((res)=>{
			this.loadding = false
			this.$store.commit('setRefundList', res.refundList)
			if(option.order){
				this.currentTab = 0
				let order =  this.$store.state.targetOrder
				order.index = this.refundList.findIndex((o)=>{	return o.orderNum === order.orderNum})
				this.orderList.push(order)
			}else{
				url = '/getOrders/' + uni.getStorageSync("pid") + '/refundList'
				this.tui.request(url,'GET', undefined, true).then((res)=>{
					res.orderList.forEach(order=>{
						order.index = this.refundList.findIndex((o)=>{	return o.orderNum === order.orderNum}) 
					})
					this.orderList = res.orderList
				})
			}
			console.log('options', this.currentTab)
			this.switchTab(this.currentTab)
		})
	},
	onShow(){
		this.orderList.forEach(order=>{
			order.index = this.refundList.findIndex((o)=>{	return o.orderNum === order.orderNum})
		})
	},
	filters: {
		getPrice(price) {
			price = price || 0;
			return price.toFixed(2)
		},
		formatDate(v){
			return utils.formatDate("y-m-d h:i:s", v)
		},
		getProperty(attr) {
			let str = ''
			attr.forEach(o=>{
				str = str + o.value + '，'
			})
			return str.slice(0,-1)
		}
	},
	computed: {
        refundList(){
			return this.$store.state.refundList
		}
	},
	methods: {
		change(e) {
			this.currentTab = e.index
			this.switchTab(this.currentTab)
		},
		switchTab(v){
			switch(v){
				case 0: {
					this.displayList = this.orderList
					break;
				}
				case 1: {
					this.displayList = this.refundList.filter((o)=>{
						return o.status==="处理中"
					})
					break;
				}
				case 2: {
					this.displayList = this.refundList
					break;
				}
			}
		},
		onDelete(order){
			this.selectedOrder = order
			this.isDelete=true
		},
		onRemove(e){
			if(e.index===1){
				let selectedIndex = this.refundList.findIndex((o)=>{ return o.refundNum === this.selectedOrder.refundNum})
				this.refundList.splice(selectedIndex,1)
				this.switchTab(this.currentTab)
				let url = '/deleteRefundOrder/' + this.selectedOrder.refundNum
				this.tui.request(url, 'DELETE').then(()=>{this.tui.toast('删除售后单成功')})
			}
			this.isDelete = false
		},
		onCancel(order) {
			let url = '/updateRefundOrders/' + order.refundNum
			this.tui.request(url, 'PUT', {status: '申请已撤销'}).then((res)=>{
				let selectedIndex = this.refundList.findIndex((o)=>{ return o.refundNum === order.refundNum})
				this.refundList[selectedIndex].status = '申请已撤销'
				this.switchTab(this.currentTab)
				this.tui.toast('取消服务单成功')
			})

		},
		onApply(order) {
			this.$store.commit('setTargetOrder', order)
			this.tui.href('/pages/my/refundType/refundType')
		},
		refundDetail(index){
			let order = this.refundList[index]
			this.$store.commit('setTargetOrder', order)
		  	this.tui.href('/pages/my/refundDetail/refundDetail')
		},
		detail(order) {
			if(order.refundNum){
				this.$store.commit('setTargetOrder', order)
		  		this.tui.href('/pages/my/refundDetail/refundDetail')
			}
		}
	}
};
</script>

<style>

.container {
	padding: 20rpx 0;
	box-sizing: border-box;
}

.tui-order-list {
	width: 100%;
 	margin-top: 60rpx;
	box-sizing: border-box;
}

.tui-order-item {
  margin-top: 20rpx;
  border-radius: 10rpx;
  overflow: hidden;
}

.tui-goods-title {
	width: 100%;
	font-size: 28rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.tui-order-type {
	font-size: 26rpx;
	display: flex;
	align-items: center;
}

.tui-order-status {
	color: #eb0909;
	font-size: 26rpx;
}

.tui-goods-item {
	width: 100%;
	padding: 20rpx 30rpx;
	box-sizing: border-box;
	display: flex;
	justify-content: space-between;
}

.tui-goods-img {
	width: 180rpx;
	height: 180rpx;
	display: block;
	flex-shrink: 0;
}

.tui-goods-center {
	flex: 1;
	padding: 20rpx 8rpx;
	box-sizing: border-box;
}

.tui-goods-name {
	max-width: 310rpx;
	word-break: break-all;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	font-size: 26rpx;
	line-height: 32rpx;
}

.tui-goods-attr {
	font-size: 22rpx;
	color: #888888;
	line-height: 32rpx;
	padding-top: 20rpx;
	word-break: break-all;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
}

.tui-price-right {
	text-align: right;
	font-size: 24rpx;
	color: #888888;
	line-height: 30rpx;
	padding-top: 20rpx;
}

.tui-goods-price {
	width: 100%;
	display: flex;
	align-items: flex-end;
	justify-content: flex-end;
	font-size: 24rpx;
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
	padding: 0 30rpx 20rpx;
	box-sizing: border-box;
}
.tui-order-message{
	background: #fff;
	/* padding: 0 30rpx; */
}

.tui-apply-btn {
	padding-top: 20rpx;
}

.tui-btn-ml {
	margin-left: 20rpx;
}
</style>
