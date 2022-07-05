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
				<tOrderItem :order=order></tOrderItem>
				<tui-list-cell :hover="false" unlined v-if="currentTab!==0">
					<view class="tui-goods-price" v-if="order.status==='退款成功'">
						<view style="margin-left: 10px">已退款：</view>
						<view class="tui-price-large tui-order-status">￥{{order.netCost}}</view>
					</view>
					<view class="tui-goods-price" v-else>
						<view>实付：</view>
						<view class="tui-price-large">￥{{order.netCost}}</view>
						<view style="margin-left: 10px">退款金额：</view>
						<view class="tui-price-large tui-order-status">￥{{order.refund_fee}}</view>
					</view>
				</tui-list-cell>
			
				<view class="tui-order-message" v-if="currentTab===0 && order.refundList.length>0">
					<view style="width: 252rpx" @tap="refundHistory(order)">
						<tui-list-cell  arrow unlined :hover="false" color="#888" size=22>
							该商品已申请售后
						</tui-list-cell>
					</view>
				</view>
				<view class="tui-order-btn">
					<view class="tui-btn-ml tui-apply-btn" v-if="currentTab===0 && order.refundList.length===0">
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
								<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @tap="onEdit(order)">
									修改申请
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
								<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @tap="onEdit(order)">
									修改申请
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
						<block v-if="order.status==='申请已撤销' || order.status==='退款成功'">
							<view class="tui-btn-ml">
								<tui-button type="black" plain width="175rpx" height="56rpx" :size="26" shape="circle" @tap="onDelete(order)">
									删除售后单
								</tui-button>
							</view>
							<view class="tui-btn-ml">
								<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @tap="detail(order)">
									售后详情
								</tui-button>
							</view>
							<view class="tui-btn-ml" v-if="order.refundList[0].refundNum === order.refundNum">
								<tui-button type="danger" plain width="152rpx" height="56rpx" :size="26" shape="circle" @tap="onApply(order, true)">
									再次申请
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
		<!-- <tui-divider width="60%" gradual>没有更多了</tui-divider> -->
	</view>
</template>

<script>
import utils from "@/utils/util.js"
import tOrderItem from '@/components/views/t-order-item/t-order-item'
export default {
	components: {
		tOrderItem
	},
	data() {
		return {
			tabs: [{name: "售后申请"}, {name: "处理中"}, {name: "申请记录"}],
			initial: true,
			scrollTop: 0,
			currentTab: 1,
			selectedOrder: null,
			isDelete: false,
			loadding: true,
			// orderList: [], //可以申请退款的订单
			applylist: [],
      		displayList: [],
		};
	},
    onLoad(options){
		this.loadData(options)
	},
	filters: {
		formatDate(v){
			return utils.formatDate("y-m-d h:i:s", v)
		}
	},
	computed: {
        refundList(){
			return this.$store.state.refundList
		},
		orderList(){
			return this.$store.state.orderList
		}
	},
	watch: {
		refundList: {
			deep: true,
			handler(v){
				console.log('watch', v, this.initial)
				if(!this.initial){
					this.switchTab(this.currentTab)
					this.$forceUpdate()
				}
			}
		},
	},
	methods: {
		loadData(e, fresh){		
			let url = '/getRefundOrders/' + uni.getStorageSync("pid")
			this.tui.request(url,'GET', undefined, true).then((res)=>{
				console.log('refundList', res)
				if(res.code==='0'){
					this.loadding = false
					this.$store.commit('setRefundList', res.refundList)	
                    setTimeout(()=>{
						this.initial = false
					}, 500)	
					if(e.order){
						let refundOrder = JSON.parse(decodeURIComponent(e.order))
						this.currentTab = 0
						this.displayList = [refundOrder]
					}
					else if(e.history){
						let refundOrder = JSON.parse(decodeURIComponent(e.history))
						this.refundHistory(refundOrder)
					}else{
						this.switchTab(this.currentTab)
					}	
				} 
			})
			url = '/getOrders/' + uni.getStorageSync("pid")
			this.tui.request(url,'GET', undefined, true).then((res)=>{
				if(res.code==='0'){
					this.$store.commit('setOrderList', res.orderList)
				}
			})
			if(fresh){
				setTimeout(()=>{
					wx.hideNavigationBarLoading() //完成停止加载
					wx.stopPullDownRefresh() //停止下拉刷新
				}, 300)
			}
		},
		change(e) {
			this.currentTab = e.index
			this.switchTab(this.currentTab)
		},
		switchTab(v){
			switch(v){
				case 0: {
					this.displayList = this.orderList.filter((o)=>{
						const expireTime = 14*24*60*60*1000 //14天有效期
						let t1 = Date.parse(new Date(o.payment_time)) + expireTime
						let t2 = Date.parse(new Date())
						console.log(t1, t2)
						return t1-t2>0
					})
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
				let url = '/deleteRefundOrder/' + this.selectedOrder.refundNum
				this.tui.request(url, 'DELETE').then(()=>{
					this.tui.toast('删除售后单成功')
					//更新申请列表
					let orderIndex = this.orderList.findIndex((o)=>{ return o.orderNum === this.selectedOrder.orderNum})
					if(orderIndex!==-1){
						let refundList = this.orderList[orderIndex].refundList
						let index = refundList.findIndex((o)=>{
							return o.refundNum === this.selectedOrder.refundNum
						})
						refundList.splice(index, 1)
					}
                    //更新退款列表
					let selectedIndex = this.refundList.findIndex((o)=>{ return o.refundNum === this.selectedOrder.refundNum})
					this.refundList.splice(selectedIndex,1)
				})
			}
			this.isDelete = false
		},
		onCancel(order) {
			let url = '/updateRefundOrders/' + order.refundNum + '/status'
			this.tui.request(url, 'PUT', {status: '申请已撤销'}).then((res)=>{
				if(res.code==='0'){
					//更新申请列表
					let orderIndex = this.orderList.findIndex((o)=>{ return o.orderNum === order.orderNum})
					if(orderIndex !==-1){
						this.$set(this.orderList[orderIndex], 'status', '申请已撤销')
						let refundList = this.orderList[orderIndex].refundList
						let index = refundList.findIndex((o)=>{
							return o.refundNum === order.refundNum
						})
						refundList[index].status='申请已撤销'
					}
					//更新退款列表
                    this.$store.state.orderState[5]-=1 
					let selectedIndex = this.refundList.findIndex((o)=>{ return o.refundNum === order.refundNum})
					let refundOrder = this.refundList[selectedIndex]
					this.$set(refundOrder, 'status', '申请已撤销')
					this.tui.toast('取消服务单成功')
				}
			})
		},
		onApply(order, repeat) {
			let url = '/pages/my/refundType/refundType?order=' + encodeURIComponent(JSON.stringify(order))
			if(repeat){
				url = url + '&repeat=refundList'
			}
			this.tui.href(url)
		},
		refundHistory(order){ 
			this.currentTab = 2
			let res = []
			order.refundList.forEach((refundOrder)=>{    
				res.push(Object.assign({}, order, refundOrder))
			})
			this.displayList = res
		},
		onEdit(order){
			this.tui.href('/pages/my/refund/refund?edit=true' + '&order=' + encodeURIComponent(JSON.stringify(order)))
		},
		detail(order) {
			this.tui.href('/pages/my/refundDetail/refundDetail?order=' + encodeURIComponent(JSON.stringify(order)))
		}
	},
	onPullDownRefresh() {
		wx.showNavigationBarLoading() //在标题栏中显示加载
		this.loadData({}, true)
	},
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
