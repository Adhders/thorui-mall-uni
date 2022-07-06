<template>
	<view class="container">
		<view class="tui-order-header">
			<view class="tui-header-content">
				<view>
					<view class="tui-status-text">{{order.status}}</view>
					<view class="tui-reason" v-if="order.status==='退款成功'"><text class="tui-reason-text">退款原路退回 {{order.refund_time | formatDate}}</text></view>
				</view>
				<image :src="getImageUrl(order.status)" class="tui-status-img" mode="widthFix"></image>
			</view>
		</view>
		<tui-list-cell unlined :hover="false">
			<view class="tui-flex-box">
				<image :src="webURL+'img_order_address3x.png'" class="tui-icon-img"></image>
				<view class="tui-addr">
					<view class="tui-addr-userinfo">{{order.address.userName}}<text class="tui-addr-tel">{{order.address.telNumber | formatNumber}}</text></view>
					<view class="tui-addr-text">{{ order.address.location + order.address.detailInfo  }}</view>
				</view>
			</view>
		</tui-list-cell>
		<tui-list-cell :hover="false" unlined v-if="order.refundType==='退货退款'">
			<view class="tui-title">
				<text>退款金额</text>
				<text class="refund_fee">￥{{order.refund_fee}}</text>
			</view>
		</tui-list-cell>
		<view class="tui-order-item">
			<tui-list-cell :hover="false" :lineLeft="false"><view class="tui-order-title">订单信息</view></tui-list-cell>
			<tOrderItem :order="order" type="detail"></tOrderItem>
		</view>
		<view class="tui-order-info">
			<view class="tui-order-content">
        		<view class="tui-order-flex">
					<view class="tui-item-title">服务单号：</view>
					<view class="tui-item-content">{{order.refundNum}}</view>
				</view>
        		<view class="tui-order-flex">
					<view class="tui-item-title">申请时间：</view>
					<view class="tui-item-content">{{order.application_time | formatDate}}</view>
				</view>
				<view class="tui-order-flex">
					<view class="tui-item-title">服务类型：</view>
					<view class="tui-item-content">{{order.refundType}}</view>
				</view>
				<view class="tui-order-flex">
					<view class="tui-item-title">申请说明:</view>
					<view class="tui-item-content">{{order.reason}}</view>
				</view>
        		<view class="tui-order-flex">
					<view class="tui-item-title">退款方式:</view>
					<view class="tui-item-content">原支付返还</view>
				</view>
				<view class="tui-order-flex">
					<view class="tui-item-title">退款详情:</view>
					<view class="tui-item-content"></view>
				</view>
				<view class="tui-content__box">
					<view class="tui-desc">
						{{order.detail}}
					</view>
					<view class="tui-img__box">
						<block v-for="(img, index) in order.imgs" :key="index">
							<image :src="imgUrl+img" mode="aspectFill" @tap.stop="previewImage(index, order.imgs)"></image>
						</block>
					</view>
				</view>
			</view>
			<tui-list-view unlined="bottom">
				<tui-list-cell unlined>
					<view class="tui-contact">
						<image src="https://thorui.cn/images/mall/group/icon_order_contactmerchant.png"></image>
						<text>联系商家</text>
					</view>
				</tui-list-cell>
			</tui-list-view>
			<view class="tui-tabbar tui-order-btn">
				<block v-if="order.status==='处理中'">
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
				</block>
				<block v-if="order.status==='申请已撤销' || order.status==='退款成功'">
					<view class="tui-btn-ml">
						<tui-button type="black" :disabled="order.undeletable"  plain width="175rpx" height="56rpx" :size="26" shape="circle" @tap="onDelete(order)">
							删除售后单
						</tui-button>
					</view>
					<view class="tui-btn-ml" v-if="order.refundList[0].refundNum === order.refundNum">
						<tui-button type="danger" plain width="152rpx" height="56rpx" :size="26" shape="circle" @tap="onApply(order)">
							再次申请
						</tui-button>
					</view>
				</block>
			</view>
		</view>
		<tui-modal :show="isDelete" @click="onRemove"  title="确定删除售后单？" content="删除之后此售后单将无法恢复，请慎重考虑？"></tui-modal>	
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
			imgUrl: 'http://review.chuangbiying.com/',
			webURL: 'https://system.chuangbiying.com/static/images/mall/order/',
			//1-退款中 2-退款成功 3-退款失败
			status: 1,
			selectedOrder: null,
			isDelete: false,
      		order: {
				address: {'telNumber': ''}
			}
		};
	},
	onLoad(options){
		this.order = JSON.parse(decodeURIComponent(options.order))
	},
   	filters: {
		formatNumber(v){
			return utils.formatNumber(v)
		},
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
	methods: {
		getImageUrl(status){
			let fileName = (status==='退款成功')? 'img_success3x.png' : (status==='处理中' )? 'img_waiting.png' : 'img_refundfailure.png'
			return this.webURL + fileName
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
                    //更新退款列表
					let selectedIndex = this.refundList.findIndex((o)=>{ return o.refundNum === this.selectedOrder.refundNum})
					this.refundList.splice(selectedIndex,1)
				})
			}
			this.isDelete = false
			uni.navigateBack({delta: 1})
		},
		onCancel(order) {
			let url = '/updateRefundOrders/' + order.refundNum + '/status'
			this.tui.request(url, 'PUT', {status: '申请已撤销'}).then((res)=>{
				if(res.code==='0'){
                    order.status = '申请已撤销'
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
		onApply(order) {
			let url = '/pages/my/refundType/refundType?order=' + encodeURIComponent(JSON.stringify(order)) + '&repeat=refundDetail' 
			this.tui.href(url)
		},
		onEdit(order){
			this.tui.href('/pages/my/refund/refund?edit=true' + '&order=' + encodeURIComponent(JSON.stringify(order)))
		},
		detail(order) {
			this.tui.href('/pages/my/refundDetail/refundDetail?order=' + encodeURIComponent(JSON.stringify(order)))
		},
		previewImage(current, imgs) {
			let urls = imgs.map(item => {
				return this.imgUrl + item
			})
			uni.previewImage({
				current: current,
				urls: urls
			})
		},
	}
};
</script>

<style scoped>
.container {
	padding-bottom: 80rpx;
}
.tui-order-header {
	width: 100%;
	height: 160rpx;
	position: relative;
	background: linear-gradient(90deg, rgb(255, 89, 38), rgb(240, 14, 44));
}

.tui-img-bg {
	width: 100%;
	height: 160rpx;
}

.tui-header-content {
	width: 100%;
	height: 160rpx;
	position: absolute;
	z-index: 10;
	left: 0;
	top: 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 70rpx;
	box-sizing: border-box;
}

.tui-status-text {
	font-size: 34rpx;
	line-height: 34rpx;
	color: #fefefe;
}

.tui-reason {
	font-size: 24rpx;
	line-height: 24rpx;
	color: rgba(254, 254, 254, 0.75);
	padding-top: 15rpx;
	display: flex;
	align-items: center;
}

.tui-reason-text {
	padding-right: 12rpx;
}

.tui-status-img {
	width: 80rpx;
	height: 80rpx;
	display: block;
}

.tui-flex-box {
	width: 100%;
	display: flex;
	align-items: center;
}

.tui-icon-img {
	width: 44rpx;
	height: 44rpx;
	flex-shrink: 0;
}

.tui-addr {
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding-left: 20rpx;
	box-sizing: border-box;
}

.tui-addr-userinfo {
	font-size: 30rpx;
	line-height: 30rpx;
	font-weight: bold;
}

.tui-addr-text {
	font-size: 24rpx;
	line-height: 32rpx;
	padding-top: 16rpx;
}

.tui-addr-tel {
	padding-left: 40rpx;
}

.tui-order-item {
	margin-top: 20rpx;
	border-radius: 10rpx;
	overflow: hidden;
}

.tui-title {
	width: 100%;
	font-size: 28rpx;
	line-height: 28rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.refund_fee {
	font-size: 32rpx;
    font-weight: 500;
    color: #eb0909;
}
.tui-order-title {
	position: relative;
	font-size: 28rpx;
	line-height: 28rpx;
	box-sizing: border-box;
}

.tui-order-content {
	width: 100%;
	padding: 24rpx 30rpx 0;
	box-sizing: border-box;
	background: #fff;
	font-size: 24rpx;
	line-height: 30rpx;
}

.tui-order-flex {
	display: flex;
	padding-top: 18rpx;
}

.tui-order-flex:first-child {
	padding-top: 0;
}

.tui-item-title {
	width: 132rpx;
	flex-shrink: 0;
	white-space: nowrap;
}

.tui-item-content {
	color: #666;
	line-height: 32rpx;
}
.tui-contact {
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
}
.tui-contact image {
	width: 36rpx;
	height: 36rpx;
	margin-right: 16rpx;
}

.tui-content__box {
	/* min-height: 250rpx; */
	width: 100%;
	font-size: 24rpx;
	background: #fff;
	padding: 10rpx 0;
	box-sizing: border-box;
}

.tui-desc {
	color: #666;
	text-indent: 2em;
	word-break: break-all;
	text-align: justify;
}

.tui-img__box {
	width: 100%;
	font-size: 0;
	padding-top: 4rpx;
}

.tui-img__box image {
	width: 200rpx;
	height: 200rpx;
	border-radius: 8rpx;
	margin-right: 12rpx;
	margin-top: 12rpx;
}
.tui-tabbar {
	width: 100%;
	height: 100rpx;
	background: #fff;
	position: fixed;
	left: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	font-size: 26rpx;
	box-shadow: 0 0 1px rgba(0, 0, 0, .3);
	padding-bottom: env(safe-area-inset-bottom);
	z-index: 996;
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
</style>
