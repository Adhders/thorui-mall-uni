<template>
	<view class="container">
		<tui-tabs :tabs="tabs" :isFixed="scrollTop>=0" :currentTab="currentTab" selectedColor="#E41F19" sliderBgColor="#E41F19"
		 @change="change" itemWidth="20%"></tui-tabs>
		<!--选项卡逻辑自己实现即可，此处未做处理-->
		<view :class="{'tui-order-list':scrollTop>=0}">
			<view class="tui-order-item" v-for="(order, orderIndex) in displayList" :key="orderIndex">
				<tui-list-cell :hover="false" :lineLeft="false">
					<view class="tui-goods-title">
						<view>订单号：{{order.orderNum}}</view>
						<view class="tui-countdown__box" v-if="order.status==='待支付'">
							<view class="tui-countdown__title">待付款</view>
							<view class="tui-flex__center">
								<tui-countdown :time="getTime(order.create_time)" backgroundColor="transparent" borderColor="transparent" color="#EB0909" colonColor="#EB0909" @end="onEnd(order)"></tui-countdown>
							</view>
						</view>
						<view class="tui-order-status" v-else >{{order.status}}</view>
					</view>
				</tui-list-cell>
				<block v-for="(item,index) in order.goodsList" :key="index">
					<tui-list-cell padding="0" @tap="detail(order)">
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
						<view>共{{order.goodsList | getNum}}件商品 实付：</view>
						<view class="tui-size-24">￥</view>
						<view class="tui-price-large">{{order.netCost.toFixed(2).split('.')[0]}}</view>
						<view class="tui-size-24">.{{order.netCost.toFixed(2).split('.')[1]}}</view>
					</view>
				</tui-list-cell>
				<view class="tui-order-btn">
<!--					<view class="tui-btn-ml">-->
<!--						<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @click="invoiceDetail">查看发票</tui-button>-->
<!--					</view>-->
					<block v-if="order.status==='交易关闭'">
						<view class="tui-btn-ml">
							<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @tap="onDelete(order)">删除订单</tui-button>
						</view>
					</block>
					<block v-if="order.status==='待支付'">
						<view class="tui-btn-ml">
							<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @tap="cancelOrder(order)">取消订单</tui-button>
						</view>
						<view class="tui-btn-ml">
							<tui-button type="danger" plain width="152rpx" height="56rpx" :size="26" shape="circle" @click="pay(order)">去支付</tui-button>
						</view>
					</block>
					<block v-if="order.status==='待发货'">
						<view class="tui-btn-ml">
							<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @tap="">申请退款</tui-button>
						</view>
						<view class="tui-btn-ml">
							<tui-button type="danger" plain width="152rpx" height="56rpx" :size="26" shape="circle" @click="">催发货</tui-button>
						</view>
					</block>
					<block v-if="order.status==='待收货'">
						<view class="tui-btn-ml">
							<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @click="">申请退款</tui-button>
						</view>
						<view class="tui-btn-ml">
							<tui-button type="black"  plain width="152rpx" height="56rpx" :size="26" shape="circle">再次购买</tui-button>
						</view>
						<view class="tui-btn-ml">
							<tui-button type="danger" plain width="152rpx" height="56rpx" :size="26" shape="circle" @click="onReceipt(order)">确认收货</tui-button>
						</view>
					</block>
					<block v-if="order.status==='交易完成'">
						<view class="tui-btn-ml">
							<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @click="onReceipt(order)">退换/售后</tui-button>
						</view>
						<view class="tui-btn-ml" v-if="isVisible(order.reviewState)">
							<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @click="addEvaluate(order)">追加评价</tui-button>
						</view>
						<view class="tui-btn-ml">
							<tui-button type="danger"  plain width="152rpx" height="56rpx" :size="26" shape="circle">再次购买</tui-button>
						</view>
					</block>
					<block v-if="order.status==='待评价'">
						<view class="tui-btn-ml">
							<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @click="onReceipt(order)">退换/售后</tui-button>
						</view>
						<view class="tui-btn-ml">
							<tui-button type="black"  plain width="152rpx" height="56rpx" :size="26" shape="circle">再次购买</tui-button>
						</view>
						<view class="tui-btn-ml">
							<tui-button type="danger" plain width="152rpx" height="56rpx" :size="26" shape="circle" @click="addEvaluate(order)">评价</tui-button>
						</view>
					</block>
				</view>
			</view>
			<tui-no-data v-if="displayList.length===0" :fixed="false"
						 imgUrl="https://system.chuangbiying.com/static/images/index/img_noorder.png">
				您还没有相关的订单</tui-no-data>
		</view>
		<tui-modal :show="isShow" @cancel="onCancel" :custom="true">
			<view class="tui-modal-custom">
				<image :src=selectedImg class="tui-tips-img"></image>
				<view class="tips-title">
					<view class="tui-modal-custom-text">确认收到货了吗？</view>
					<view class="tui-modal-custom-text subTitle">为保障售后权益，请检查后再确认收货</view>
				</view>
				<view class="btn-block">
					<tui-button class="btn cancel" height="72rpx" :size="28" shape="circle" @click="onCancel">取消</tui-button>
					<tui-button class="btn" height="72rpx" :size="28" type="danger" shape="circle" @click="onConfirm">确认收货</tui-button>
				</view>
			</view>
		</tui-modal>
		<tui-modal :show="isDelete" @click="onRemove"  title="确定删除订单？" content="删除之后订单无法恢复，请慎重考虑？"></tui-modal>
		<!--加载loadding-->
		<tui-loadmore v-if="loadding" :index="3" type="red"></tui-loadmore>
		<tui-nomore v-if="!pullUpOn" backgroundColor="#fafafa"></tui-nomore>
		<!--加载loadding-->

	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabs: [{
					name: "全部"
				}, {
					name: "待付款"
				}, {
					name: "待发货"
				}, {
					name: "待收货"
				}, {
					name: "待评价"
				}],
				displayList: [],
				selectedOrder: null,
				selectedImg: '',
				currentTab: 0,
				pageIndex: 1,
				isShow: false,
				isDelete: false,
				loadding: false,
				pullUpOn: true,
				scrollTop: 0,
			}
		},
		onLoad(option){
			let url = '/getOrders/' + uni.getStorageSync("pid")
			this.tui.request(url).then((res)=>{
				console.log('res', res)
				this.$store.commit('setOrderList', res.orderList)
				this.currentTab= (option.currentTab!=='undefined')? parseInt(option.currentTab): 0
				this.switchTab(this.currentTab)
			})
		},
		computed: {
			orderList(){
				return this.$store.state.orderList
			}
		},
		filters: {
			getPrice(price) {
				price = price || 0;
				return price.toFixed(2)
			},
			getProperty(attr) {
				let str = ''
				attr.forEach(o=>{
					str = str + o.value + '，'
				})
				return str.slice(0,-1)
			},
			getNum(goodsList) {
				let res = 0
				goodsList.forEach((o)=>{
					res += o.buyNum
				})
				return res
			}
		},
		watch: {
			currentTab(v){
				this.switchTab(v)
			}
		},
		methods: {
			getTime(time){
				const expireTime = 1*24*60*60*1000 //一天后过期
				let t1 = Date.parse(new Date(time)) + expireTime
				let t2 = Date.parse(new Date())
				return (t1-t2)/1000
			},
			isVisible(state){
				return state.findIndex(o=>{return o.count===1}) !==-1
			},
			change(e) {
				this.currentTab = e.index
			},
			onCancel(){
				this.isShow = false
			},
			onEnd(order){
				this.tui.toast('订单已失效')
				this.cancelOrder(order)
			},
			switchTab(v){
				switch(v){
					case 0: {
						this.displayList = this.orderList
						break;
					}
					case 1: {
						this.displayList = this.orderList.filter((o)=>{
							return o.status==="待支付"
						})
						break;
					}
					case 2: {
						this.displayList = this.orderList.filter((o)=>{
							return o.status==="待发货"
						})
						break;
					}
					case 3: {
						this.displayList = this.orderList.filter((o)=>{
							return o.status==="待收货"
						})
						break;
					}
					case 4: {
						this.displayList = this.orderList.filter((o)=>{
							return o.status==="待评价"
						})
						break;
					}
				}
			},
			cancelOrder(order) {
				let url = '/closeOrder_miniProg/' + order.orderNum
				this.tui.request(url).then(
					(res)=>{
						console.log('res', res)
						if(res.code===204){
							url = '/updateOrder/' + order.orderNum + '/' + 'status'
							this.tui.request(url, 'PUT', {status : "交易关闭"}).then(
								(res)=>{
									if(res.code==='0'){
										let index =  this.orderList.findIndex((o)=>{ return o.orderNum === order.orderNum})
										this.orderList[index].status = "交易关闭"
                                        this.switchTab(this.currentTab)
									}
							})
						}else{
							this.tui.toast('取消失败，请稍后再试')
						}
				})
			},
			pay(order) {
				let _this = this
				let url = url
				let result = order.paymentInfo
				wx.requestPayment({
					appid: result.appid,
					nonceStr: result.nonceStr,
					package: result.package,
					timeStamp: result.timeStamp,
					signType: result.signType,
					paySign: result.paySign,
					success: function () {
						url = '/updateOrder/' + order.orderNum + '/' + 'status'
						_this.tui.request(url, 'PUT', {status : "待评价"}).then(()=>{})
						_this.tui.href("/pages/order/success/success")},
					fail: function (err) {
						console.log('err', err)
					},
				})
			},
			refund(order){
				const url = '/pages/my/refund/refund?order=' + JSON.stringify(order)
				this.tui.href(url)
			},
			onHide(){
				this.isDelete=false
			},
			onReceipt(item){
				this.selectedOrder = item
				this.selectedImg = item.goodsList[0].defaultImageUrl
				this.isShow=true
			},
			onConfirm(){
				this.addEvaluate(this.selectedOrder)
				this.selectedOrder = null
				this.selectedImg = ''
			},
			onDelete(order){
				this.selectedOrder = order
				this.isDelete=true
			},
			onRemove(e){
				if(e.index===1){
					let selectedIndex = this.orderList.findIndex((o)=>{ return o.orderNum === this.selectedOrder.orderNum})
					this.orderList.splice(selectedIndex,1)
					this.switchTab(this.currentTab)
					let url = '/deleteOrder/' + this.selectedOrder.orderNum
					this.tui.request(url, 'DELETE').then(()=>{this.tui.toast('删除成功')})
				}
				this.isDelete = false
			},
			detail(order) {
				this.$store.commit('setTargetOrder', order)
				uni.navigateTo({
					url: '/pages/my/orderDetail/orderDetail'
				})
			},
			invoiceDetail(){
				this.tui.href('/pages/my/invoiceDetail/invoiceDetail')
			},
			addEvaluate(order){
				let url = ''
				if (order.goodsList.length>1) {
					url  = '/pages/my/evaluateList/evaluateList'
				}else {
					url = '/pages/my/addEvaluate/addEvaluate'
					order.reviewState[0]+=1
				}
				this.$store.commit('setTargetOrder', order)
				uni.navigateTo({
					url: url
				})
			}
		},
		onPullDownRefresh() {
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 200);
		},
		onReachBottom() {
			//只是测试效果，逻辑以实际数据为准
			this.loadding = true
			this.pullUpOn = true
			setTimeout(() => {
				this.loadding = false
				this.pullUpOn = false
			}, 1000)
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		}
	}
</script>

<style lang="less">
	.container {
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-order-list {
		margin-top: 80rpx;
	}

	.tui-order-item {
		margin-top: 20rpx;
		border-radius: 10rpx;
		overflow: hidden;
	}

	.tui-countdown__box {
		width: 228rpx;
		display: flex;
		align-items: center;

		color: #fff;
		background-color: #fff;
		font-weight: 400;
		border: 1rpx solid #eb0909;
		height: 40rpx;
		border-radius: 30px;
		overflow: hidden;
		margin-left: 25rpx;
	}
	.tui-countdown__title {
		width: 100rpx;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #eb0909;
		flex-shrink: 0;
		font-size: 24rpx;
		line-height: 24rpx;
	}
	.tui-flex__center {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.tui-goods-title {
		width: 100%;
		font-size: 28rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tui-order-status {
		color: rgb(228, 31, 25);
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
		padding: 20rpx 8rpx 0;
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
	.tui-color-red {
		color: #E41F19;
		padding-right: 30rpx;
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
		padding: 10rpx 30rpx 20rpx;
		box-sizing: border-box;
	}
	.tui-btn-ml {
		margin-left: 20rpx;
	}
	.tui-tips-img{
		width: 300rpx;
		height: 300rpx;
		margin: 0 auto;
		display: block;
	}
	.tips-title{
		display: block;
		text-align: center;
		padding: 20px 0;
		.subTitle{
			margin-top: 5px;
			font-size: 14px;
			color: #999;
		}
	}
	.btn-block {
		display: flex;
		justify-content: space-between;
		.btn{
			width: 46% !important;
		}
		.btn.cancel{
			background: #ededed !important;
    		color: #999 !important;
		}
	}
</style>
