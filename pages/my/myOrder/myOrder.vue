<template>
	<view class="container">
		<tui-tabs :tabs="tabs" :isFixed="scrollTop>=0" :currentTab="currentTab" selectedColor="#E41F19" sliderBgColor="#E41F19"
		 @change="change"></tui-tabs>
		<!--选项卡逻辑自己实现即可，此处未做处理-->
    	<tui-loading v-if="loadding"></tui-loading>
		<view :class="{'tui-order-list':scrollTop>=0}" v-else>
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
				<t-order-item :order="order"></t-order-item>
				<tui-list-cell :hover="false" unlined>
					<view class="tui-goods-price">
						<view>共{{order.goodsList | getNum}}件商品 实付：</view>
						<view class="tui-size-24">￥</view>
						<view class="tui-price-large">{{order.netCost.split('.')[0]}}</view>
						<view class="tui-size-24">.{{order.netCost.split('.')[1]}}</view>
					</view>
				</tui-list-cell>
				<view class="tui-order-btn">
<!--					<view class="tui-btn-ml">-->
<!--						<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @click="invoiceDetail">查看发票</tui-button>-->
<!--					</view>-->
					<block v-if="order.status==='交易关闭'">
						<view class="tui-btn-ml">
							<tui-button type="danger" plain width="152rpx" height="56rpx" :size="26" shape="circle" @tap="onDelete(order)">删除订单</tui-button>
						</view>
					</block>
					<block v-if="order.status==='待支付'">
						<view class="tui-btn-ml">
							<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @click="cancelOrder(order)">取消订单</tui-button>
						</view>
						<view class="tui-btn-ml">
							<tui-button type="danger" plain width="152rpx" height="56rpx" :size="26" shape="circle" @click="pay(order)">去支付</tui-button>
						</view>
					</block>
					<block v-if="order.status==='待发货'">
						<view class="tui-btn-ml">
							<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @tap="refund(order)">申请退款</tui-button>
						</view>
						<view class="tui-btn-ml">
							<tui-button type="danger" plain width="152rpx" height="56rpx" :size="26" shape="circle" @click="remind">催发货</tui-button>
						</view>
					</block>
					<block v-if="order.status==='待收货'">
						<view class="tui-btn-ml">
							<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @click="refund(order)">申请退款</tui-button>
						</view>
						<view class="tui-btn-ml">
							<tui-button type="black"  plain width="152rpx" height="56rpx" :size="26" shape="circle" @click="buy(order)">再次购买</tui-button>
						</view>
						<view class="tui-btn-ml">
							<tui-button type="danger" plain width="152rpx" height="56rpx" :size="26" shape="circle" @click="onReceipt(order)">确认收货</tui-button>
						</view>
					</block>
					<block v-if="order.status==='交易成功'">
					    <view class="tui-btn-ml">
							<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @tap="onDelete(order)">删除订单</tui-button>
						</view>
						<view class="tui-btn-ml">
							<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @click="refund(order)">退换/售后</tui-button>
						</view>
						<view class="tui-btn-ml" v-if="isVisible(order.reviewState)">
							<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @click="addEvaluate(order, 'additional')">追加评价</tui-button>
						</view>
						<view class="tui-btn-ml">
							<tui-button type="danger"  plain width="152rpx" height="56rpx" :size="26" shape="circle" @click="buy(order)">再次购买</tui-button>
						</view>
					</block>
					<block v-if="order.status==='待评价'">
						<view class="tui-btn-ml">
							<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @click="refund(order)">退换/售后</tui-button>
						</view>
						<view class="tui-btn-ml">
							<tui-button type="black"  plain width="152rpx" height="56rpx" :size="26" shape="circle" @click="buy(order)">再次购买</tui-button>
						</view>
						<view class="tui-btn-ml">
							<tui-button type="danger" plain width="152rpx" height="56rpx" :size="26" shape="circle" @click="addEvaluate(order, 'first')">评价</tui-button>
						</view>
					</block>
                   
                    <block v-if="order.status==='处理中'">
						<view class="tui-btn-ml">
							<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @tap="detail(order)">
								售后信息
							</tui-button>
						</view>
					</block>
					<block v-if="order.status==='申请已撤销'">
						<view class="tui-btn-ml">
							<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @tap="onDelete(order)">
								删除订单
							</tui-button>
						</view>
						<view class="tui-btn-ml">
							<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @tap="detail(order)">
								售后信息
							</tui-button>
						</view>
					</block>
					<block  v-if="order.status==='退款成功'">
						<view class="tui-btn-ml">
							<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @tap="onDelete(order)">
								删除订单
							</tui-button>
						</view>
						<view class="tui-btn-ml">
							<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @tap="detail(order)">
								售后信息
							</tui-button>
						</view>
					</block>
					<block v-if="order.mode=='groupBuy'">
						<view class="tui-btn-ml" v-if="order.status!='待支付'">
							<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle" @click="groupDetail(order)">
								我的拼团
							</tui-button>
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
				<image :src=selectedImg class="tui-tips-img" mode="aspectFill"></image>
				<view class="tips-title">
					<view class="tui-modal-custom-text">确认收到货了吗？</view>
					<view class="tui-modal-custom-text subTitle">为保障售后权益，请检查后再确认收货</view>
				</view>
				<view class="btn-block">
					<tui-button class="btn" height="72rpx" type="gray-danger" :size="28" shape="circle" @click="onCancel">取消</tui-button>
					<tui-button class="btn" height="72rpx" :size="28" type="danger" shape="circle" @click="onConfirm">确认收货</tui-button>
				</view>
			</view>
		</tui-modal>
		<tui-modal :show="isDelete" @click="onRemove"  title="确定删除订单？" content="删除之后订单无法恢复，请慎重考虑？"></tui-modal>
		<!--加载loadding-->
		<tui-loadmore v-if="loaddingMore" :index="3" type="red"></tui-loadmore>
		<tui-nomore v-if="!pullUpOn" backgroundColor="#fafafa"></tui-nomore>
		<!--加载loadding-->

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
				appid: '',
				tabs: [{name: "全部"},  {name: "待付款"},  {name: "待发货"},  {name: "待收货"}, {name: "待评价"}],
        		loadding: true,
				displayList: [],
				selectedOrder: null,
				selectedImg: '',
				currentTab: 0,
				pageIndex: 1,
				isShow: false,
				isDelete: false,
				loaddingMore: false,
				pullUpOn: true,
				scrollTop: 0,
			}
		},
		onLoad(options){
			this.appid = this.$store.state.appid
			this.loadData(options)
		},
		computed: {
			orderList(){
				return this.$store.state.orderList
			}
		},
		filters: {
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
			},
			orderList: {
				deep: true,
				handler(v){
					this.switchTab(this.currentTab)
				}
			}
		},
		methods: {
			getTime(time){
				time = time.replace(/-/g, "/") //如果不转化，在ios设备上会计算错误
				const expireTime = 24*60*60*1000 //一天后过期
				let t1 = Date.parse(new Date(time)) + expireTime
				let t2 = Date.parse(new Date())
				return (t1-t2)/1000
			},
			loadData(e, fresh){
				let url = '/getOrders/' + uni.getStorageSync("pid")
				this.tui.request(url,'GET', undefined, true).then((res)=>{
					if(res.code==='0'){
						this.loadding = false
						this.currentTab= (e.currentTab)? parseInt(e.currentTab): 0
						this.$store.commit('setOrderList', res.orderList)
						if(fresh){
							setTimeout(()=>{
								wx.stopPullDownRefresh() //停止下拉刷新
							}, 300)
						}
					}
				})
			},
			isVisible(state){
				//当o.id为-1表示失效，无法追加评论
				return state.findIndex(o=>{return o.count===1 && o.id!=-1}) !==-1
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
				let url = '/closeOrder_miniProg/' + this.appid + '/' + order.orderNum
				this.tui.request(url).then(
					(res)=>{
						if(res.code===204){
							let index =  this.orderList.findIndex((o)=>{ return o.orderNum === order.orderNum})
							this.orderList[index].status = "交易关闭"
							this.tui.toast('取消成功，交易关闭')
						}else if(res.code===400){
							let index =  this.orderList.findIndex((o)=>{ return o.orderNum === order.orderNum})
							this.tui.toast('无法取消订单，该订单已支付成功')
							if(order.mode==='groupBuy'){
								this.orderList[index].status = "拼团中"
								let url = '/addActivityOrder/' + uni.getStorageSync("pid") + '/' + order.orderNum
								this.tui.request(url, 'POST', order.activity).then()
								//更新活动商品库存
								this.tui.request('/updateGoodsStock/activity', 'PUT', order.goodsList)
							}else{
								this.orderList[index].status = "待评价"
								this.tui.request('/updateGoodsStock/', 'PUT', order.goodsList)
							}
						}
						else{
							this.tui.toast(res.message)
						}		
				})
			},
			pay(order) {
				let _this = this
				let result = order.paymentInfo
				wx.requestPayment({
					appid: result.appid,
					nonceStr: result.nonceStr,
					package: result.package,
					timeStamp: result.timeStamp,
					signType: result.signType,
					paySign: result.paySign,
					success: function () {
						if(order.mode==='groupBuy'){
							let url = '/addActivityOrder/' + uni.getStorageSync("pid") + '/' + order.orderNum
							_this.tui.request(url, 'POST', order.activity).then()
							//更新活动商品库存
							_this.tui.request('/updateGoodsStock/activity', 'PUT', order.goodsList)
						}else{
							let url = '/updateOrder/' + order.orderNum + '/' + 'payment'
							order.status = '待发货'
							_this.tui.request(url, 'PUT', {status: "待发货"}).then()
							//更新商品库存
							_this.tui.request('/updateGoodsStock/', 'PUT', order.goodsList)
						}
						_this.tui.href("/pages/order/success/success")},
					fail: function (err) {
						console.log('err', err)
						_this.tui.toast('支付失败')
					}
				})
			},
			groupDetail(order){
				this.tui.href('/pages/my/myGroup/myGroup?orderNum=' + order.orderNum)
			},
			buy(order){
				let goods = order.goodsList[0]
				this.tui.href('/pages/index/productDetail/productDetail?spu_id=' + goods.id + '&buy=true')
			},
			remind() {
                this.tui.toast('已提醒卖家发货')
			},
			refund(order){
				this.tui.href('/pages/my/refundList/refundList?order=' + encodeURIComponent(JSON.stringify(order)))
			},
			onReceipt(item){  
				this.selectedOrder = item
				this.selectedImg = item.goodsList[0].defaultImageUrl
				this.isShow=true
			},
			onConfirm(){
				this.addEvaluate(this.selectedOrder, 'first')
				this.selectedOrder = null
				this.selectedImg = ''
				this.isShow=false
			},
			onDelete(order){
				this.selectedOrder = order
				this.isDelete=true
			},
			onRemove(e){
				if(e.index===1){
					let selectedIndex = this.orderList.findIndex((o)=>{ return o.orderNum === this.selectedOrder.orderNum})
					this.orderList.splice(selectedIndex,1)
					let url = '/deleteOrder/' + this.selectedOrder.orderNum
					this.tui.request(url, 'DELETE').then(()=>{this.tui.toast('删除订单成功')})
				}
				this.isDelete = false
			},
			invoiceDetail(){
				this.tui.href('/pages/my/invoiceDetail/invoiceDetail')
			},
			addEvaluate(order, mode){
				let url = (order.goodsList.length>1)? '/pages/my/evaluateList/evaluateList?':
					('/pages/my/addEvaluate/addEvaluate?mode=' + mode + '&')
				url = url + 'order=' + encodeURIComponent(JSON.stringify(order))
				uni.navigateTo({
					url: url
				})
			},
			detail(order) {
				this.tui.href('/pages/my/refundList/refundList?history=' + encodeURIComponent(JSON.stringify(order)))
			}
		},
		onPullDownRefresh() {
			let e = {currentTab: this.currentTab}
			this.loadData(e, true)
		},
		onReachBottom() {
			//只是测试效果，逻辑以实际数据为准
			this.loaddingMore = true
			this.pullUpOn = true
			setTimeout(() => {
				this.loaddingMore = false
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
		padding: 0 30rpx 20rpx;
		box-sizing: border-box;
	}
	.tui-btn-ml {
		margin-left: 20rpx;
	}
	.tui-tips-img{
		width: 300rpx;
		height: 300rpx;
		margin: 0 auto;
		border-radius: 8rpx;
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
	}
</style>
