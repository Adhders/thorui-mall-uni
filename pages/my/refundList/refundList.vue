<template>
	<view class="container">
    <tui-tab :tabs="tabs" :isFixed="scrollTop>=0" :currentTab="currentTab" selectedColor="#E41F19" sliderBgColor="#E41F19"
		 @change="change"></tui-tab>
		<!--选项卡逻辑自己实现即可，此处未做处理-->
    <tui-loading v-if="loadding"></tui-loading>
		<view class="tui-order-list" v-else>
			<view class="tui-order-item" v-for="(order, orderIndex) in displayList" :key="orderIndex" @tap="detail(order)">
        <tui-list-cell :hover="false" :lineLeft="false">
					<view class="tui-goods-title">
						<view v-if='currentTab===0'>订单号：{{order.orderNum}}</view>
						<view v-else>服务单号：{{order.refundNum}}</view>
						<view></view>
						<view class="tui-order-status">{{order.status}}</view>
					</view>
				</tui-list-cell>
        <block v-for="(item,index) in order.goodsList" :key="index">
				  <tui-list-cell padding="0" :hover="false">
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
				<tui-list-cell :hover="false" unlined>
          <view class="tui-goods-price">
						<view>实付：</view>
						<view class="tui-price-large">￥{{order.netCost}}</view>
            <view style="margin-left: 10px">退款金额：</view>
						<view class="tui-price-large tui-order-status">￥{{order.netCost}}</view>
					</view>
				</tui-list-cell>
			</view>
      <tui-no-data v-if="displayList.length===0" :fixed="false"
						 imgUrl="https://system.chuangbiying.com/static/images/index/img_noorder.png">
				您还没有相关的订单</tui-no-data>
		</view>
		<tui-divider width="60%" gradual>没有更多了</tui-divider>
	</view>
</template>

<script>
import utils from "@/utils/util.js"
export default {
	data() {
		return {
			tabs: [ "售后申请",  "处理中", "申请记录"],
			scrollTop: 0,
			currentTab: 1,
			loadding: true,
			orderList: [],
			refundList: [],
      		displayList: [],
		};
	},
  onLoad(){
    let url = '/getRefundOrders/' + uni.getStorageSync("pid")
    this.tui.request(url,'GET', undefined, true).then((res)=>{
      console.log('res', res)
      this.loadding = false
      this.refundList = res.refundList
      // this.$store.commit('setRefundList', res.refundList)
      this.switchTab(this.currentTab)
    })
    url = '/getOrders/' + uni.getStorageSync("pid") + '/refundList'
    this.tui.request(url,'GET', undefined, true).then((res)=>{
      console.log('orderList', res)
      this.orderList = res.orderList
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
  watch: {
    currentTab(v){
      this.switchTab(v)
    }
	},
	methods: {
    change(e) {
      this.currentTab = e.index
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
		detail(order) {
      this.$store.commit('setTargetOrder', order)
			this.tui.href('/pages/my/refundDetail/refundDetail')
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
</style>
