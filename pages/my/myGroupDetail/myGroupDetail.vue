<template>
	<view class="container">
		<t-order-item :order="groupOrder" type="groupDetail"></t-order-item>
		<view class="tui-group__box tui-mtop__20">
			<tui-divider backgroundColor="#fff" width="70%" gradual v-if="groupOrder.status!='拼团中'">
				<view class="tui-divider__content">
					<image :src="webURL + 'img_invoice_success3x.png'" v-if="groupOrder.status == '拼团成功'"></image>
					<text>{{groupOrder.status}}</text>
				</view>
			</tui-divider>
			<block v-else>
				<view class="tui-group__title">
					<text>还差</text>
					<text class="tui-color__red">{{groupOrder.activityPeople - groupOrder.participants}}</text>
					<text>人，赶快邀请好友来拼团吧</text>
				</view>
				<view class="tui-group-countdown">
					<view class="tui-countdown-right">剩余</view>
					<tui-countdown :time="getTime(groupOrder.open_time)" scale colonColor="#EB0909" borderColor="#EB0909" color="#EB0909" @end="onEnd(groupOrder)"></tui-countdown>
					<view class="tui-countdown-left">结束</view>
				</view>
			</block>
			<view class="tui-user__box">
				<view class="tui-user__item" :key="index">
					<view class="tui-avatar__box tui-size">
						<image class="tui-size" :src="groupOrder.avatarUrl"></image>
						<view class="tui-team__leader">团长</view>
					</view>
					<view class="tui-nickname">{{groupOrder.nickName}}</view>
				</view>
				<view class="tui-user__item" v-if="groupOrder.status!='拼团成功'">
					<view class="tui-avatar__box tui-user__none">
						<image class="tui-size" :src="webURL + 'img_not_tuxedo.png'"></image>
					</view>
					<view class="tui-nickname">暂无</view>
				</view>
				<!-- 当本人不是团长时，显示团长和本人的头像 -->
				<view class="tui-user__item" v-if="groupOrder.status=='拼团成功' && !groupOrder.organizer">
					<view class="tui-avatar__box tui-user__none">
						<image class="tui-size" :src="userInfo.avatarUrl"></image>
					</view>
					<view class="tui-nickname">{{userInfo.nickName}}</view>
				</view>
			</view>
			<view class="tui-btn__box" v-if="groupOrder.status == '拼团中'">
				<tui-button type="danger" open-type="share" height="88rpx" shadow shape="circle">邀请好友拼团</tui-button>
			</view>
		</view>
		<!--拼团规则玩法介绍-->
		<view class="tui-group-rule tui-mtop__20">
			<tui-list-cell padding="30rpx" :hover="false" v-if="groupOrder.status == '拼团失败'">
				<view class="tui-group__text tui-group__start tui-between">
					<view class="tui-group-title">已退款</view>
					<view class="tui-sub__info">￥{{groupOrder.netCost}}</view>
				</view>
			</tui-list-cell>
			<tui-list-cell padding="30rpx" :hover="false">
				<view class="tui-group__text tui-group__start tui-between">
					<view class="tui-group-title">开团时间</view>
					<view class="tui-sub__info">{{groupOrder.open_time}}</view>
				</view>
			</tui-list-cell>
			<tui-list-cell padding="30rpx" arrow @click="showModal">
				<view class="tui-group__text tui-between">
					<view class="tui-group-title">拼团规则</view>
					<view class="tui-sub__info">拼团玩法介绍</view>
				</view>
			</tui-list-cell>
			<view class="tui-step__box">
				<view class="tui-step-item">
					<image :src="webURL + 'img_opengroup_3x.png'"></image>
					<view class="tui-step-text">团长开团</view>
				</view>
				<view class="tui-step-arrow">
					<image :src="webURL + 'img_arrow_3x.png'"></image>
				</view>
				<view class="tui-step-item">
					<image :src="webURL + 'img_invitefriends_3x.png'"></image>
					<view class="tui-step-text">邀请好友</view>
				</view>
				<view class="tui-step-arrow">
					<image :src="webURL + 'img_arrow_3x.png'"></image>
				</view>
				<view class="tui-step-item">
					<image :src="webURL + 'img_spellgroupsuccess_3x.png'"></image>
					<view class="tui-step-text">拼团成功</view>
				</view>
				<view class="tui-step-arrow">
					<image :src="webURL + 'img_arrow_3x.png'"></image>
				</view>
				<view class="tui-step-item">
					<image :src="webURL + 'img_tosend_3x.png'"></image>
					<view class="tui-step-text">等待发货</view>
				</view>
			</view>
		</view>

		<!--热销爆款-->
		<tui-divider width="50%" gradual><text class="tui-hot__title">热销爆品</text></tui-divider>

		<!--=======商品=======-->
		<view class="tui-product__box">
			<tui-waterfall :listData="productList" :type="2" :pageSize="10">
				<template slot-scope="{ entity }" slot="left">
					<tGroupItem :entity="entity"></tGroupItem>
				</template>
				<template slot-scope="{ entity }" slot="right">
					<tGroupItem :entity="entity"></tGroupItem>	
				</template>
			</tui-waterfall>
		</view>
		<!--=======商品 end=======-->

		<!--拼团玩法介绍-->
		<tui-modal :show="modal" shape="circle" padding="30rpx 40rpx" custom>
			<view class="tui-modal__title">拼团玩法</view>
			<view class="tui-modal__p">1.全民拼团，所有用户都可直接参团或开团；</view>
			<view class="tui-modal__p">2.拼团成功，指开团后在规定时间内达到规定成团人数；拼团成功后，商家会根据团长的配送地址进行配送。</view>
			<view class="tui-modal__p">3.拼团失败，指开团后在规定时间内未能找到相应的人数的好友参团，该团失败，系统取消该团订单，退款原路退回。</view>
			<view class="tui-modal__btn">
				<tui-button type="danger" shape="circle" width="280rpx" height="68rpx" :size="26" @click="modal = false">我知道了</tui-button>
			</view>
		</tui-modal>
	</view>
</template>

<script>
	import tOrderItem from '@/components/views/t-order-item/t-order-item'
	import tGroupItem from '@/components/views/t-group-item/t-group-item'
	export default {
		components: {
			tGroupItem,
			tOrderItem
		},
		data() {
			return {
				webURL: 'https://thorui.cn/images/mall/group/',
				modal: false,
				goodsDetail: '',
				groupOrder: {}
			};
		},
		onLoad(options) {
			this.groupOrder = JSON.parse(options.groupOrder)
			console.log('groupOrder', this.groupOrder)
			this.goodsDetail = this.groupOrder.goodsList[0]
		},
		computed: {
			productList(){
				return this.$store.state.activityGoods
			},
			userInfo(){
		    	return this.$store.state.userInfo
			},
		},
		onShareAppMessage: function(res) {
			let nickName = this.userInfo.nickName
			// 返回数据
			return {
				title: `来自好友${nickName}的邀请`,
				path: '/pages/index/groupDetail/groupDetail?spu_id=' + this.goodsDetail.spu_id + '&sku_id=' + this.goodsDetail.id + 
					'&activity_id=' + this.groupOrder.activity,
				imageUrl: this.goodsDetail.defaultImageUrl + '-shareImage',
				success: function(res) {
				// 转发成功，可以把当前页面的链接发送给后端，用于记录当前页面被转发了多少次或其他业务
					console.log('success', res)
				},
				fail: function(res) {
					console.log('fail', res)
				// 转发失败
				}
			}
		},
		methods: {
			showModal() {
				this.modal = true;
			},
			getTime(time){
				time = time.replace(/-/g, "/") //如果不转化，在ios设备上会计算错误
				const expireTime = 24*60*60*1000 //一天后过期
				let t1 = Date.parse(new Date(time)) + expireTime
				let t2 = Date.parse(new Date())
				return (t1-t2)/1000
			},
			onEnd(e){
				let url='/updateActivityOrders/' + e.activityNum + '/fail'
				this.tui.request(url, 'PUT').then((res)=>{
					console.log('res', res)
				})
			},
		}
	};
</script>

<style>

	.tui-mtop__20 {
		margin-top: 20rpx;
	}

	.tui-divider__content {
		display: flex;
		align-items: center;
	}

	.tui-divider__content image {
		width: 36rpx;
		height: 36rpx;
		margin-right: 20rpx;
	}

	.tui-divider__content text {
		font-size: 34rpx;
		line-height: 34rpx;
		color: #000000;
		font-weight: bold;
	}

	.tui-group__time {
		font-size: 24rpx;
		font-weight: 400;
		color: #999;
		text-align: center;
	}

	.tui-group__box {
		width: 100%;
		padding: 50rpx 25rpx;
		box-sizing: border-box;
		background-color: #fff;
	}

	.tui-group__title {
		width: 100%;
		font-size: 34rpx;
		line-height: 34rpx;
		font-weight: 500;
		text-align: center;
	}

	.tui-color__red {
		color: #eb0909;
	}

	.tui-group-countdown {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		color: #666666;
		padding-top: 20rpx;
	}

	.tui-countdown-right {
		padding-right: 6rpx;
	}

	.tui-countdown-left {
		padding-left: 6rpx;
	}

	.tui-user__box {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding-top: 60rpx;
	}

	.tui-user__item {
		max-width: 128rpx;
		margin: 0 40rpx;
	}

	.tui-size {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
	}

	.tui-avatar__box {
		position: relative;
		border: 4rpx solid #eb0909;
	}

	.tui-user__none {
		width: 108rpx;
		height: 108rpx;
		border: 0;
	}

	.tui-avatar__box image {
		display: block;
	}

	.tui-team__leader {
		position: absolute;
		width: 64rpx;
		height: 28rpx;
		font-size: 24rpx;
		background-color: #eb0909;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 30px;
		left: 50%;
		top: -14rpx;
		transform: translateX(-50%);
		z-index: 10;
	}

	.tui-nickname {
		font-size: 24rpx;
		color: #999;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: center;
		padding-top: 12rpx;
	}

	.tui-btn__box {
		padding-top: 60rpx;
	}

	.tui-group__text {
		width: 100%;
		display: flex;
		align-items: center;
	}

	.tui-group-title {
		font-size: 30rpx;
		line-height: 30rpx;
		padding-left: 16rpx;
		border-left: 2px solid #eb0909;
		box-sizing: border-box;
	}

	.tui-sub__info {
		font-size: 26rpx;
		padding-right: 30rpx;
	}

	.tui-group__start .tui-group-title {
		border-left: 0;
		padding-left: 0;
	}

	.tui-group__start .tui-sub__info {
		padding-right: 0;
	}

	.tui-step__box {
		width: 100%;
		height: 210rpx;
		background: #fff;
		padding: 0 60rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
	}

	.tui-step-item {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		font-size: 26rpx;
		color: #666666;
	}

	.tui-step-item image {
		width: 64rpx;
		height: 55rpx;
		flex-shrink: 0;
	}

	.tui-step-item image:first-child {
		width: 60rpx !important;
	}

	.tui-step-arrow {
		height: 90rpx;
	}

	.tui-step-arrow image {
		width: 11rpx;
		height: 20rpx;
		flex-shrink: 0;
	}

	.tui-step-text {
		line-height: 26rpx;
		padding-top: 24rpx;
	}

	.tui-between {
		justify-content: space-between;
	}

	/*拼团玩法介绍 modal*/
	.tui-modal__title {
		text-align: center;
		font-weight: bold;
		padding-bottom: 8rpx;
	}

	.tui-modal__p {
		font-size: 26rpx;
		color: #888;
		padding-top: 20rpx;
	}

	.tui-modal__btn {
		width: 100%;
		padding: 60rpx 0 20rpx;
		display: flex;
		justify-content: center;
	}

	.tui-hot__title {
		font-size: 30rpx;
		line-height: 30rpx;
		color: #333;
		font-weight: bold;
	}

	/*========商品 start======*/
	.tui-product__box {
		width: 100%;
		padding: 0 25rpx 60rpx 25rpx;
		box-sizing: border-box;
	}
	/*======商品======= end*/
</style>
