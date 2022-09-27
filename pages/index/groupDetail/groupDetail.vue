<template>
	<view class="container">
		<!--header-->
		<view class="tui-header-box" :style="{ height: height + 'px', background: 'rgba(255,255,255,' + opcity + ')' }">
			<view class="tui-header" :style="{ paddingTop: top + 'px', opacity: opcity }">商品详情</view>
			<view class="tui-header-icon" :style="{ marginTop: top + 'px' }">
				<view class="tui-icon-box" :style="{ backgroundColor: 'rgba(0, 0, 0,' + iconOpcity + ')' }" @tap="back">
					<tui-icon name="arrowleft" :size="30" :color="opcity >= 1 ? '#000' : '#fff'"></tui-icon>
				</view>
			</view>
		</view>
		<!--header-->

		<!--banner-->
		<view class="tui-banner-swiper">
			<swiper :autoplay="true" class="tui-swiper" :interval="5000" :duration="150" :circular="true" :style="{ height: scrollH + 'px' }"
			 @change="bannerChange">
				<block v-for="(item, index) in goodsDetail.goodsImageUrls" :key="index">
					<swiper-item :data-index="index" @tap.stop="previewImage">
						<image :src="item" class="tui-slide-image" mode="aspectFill" :style="{ height: scrollH + 'px' }" />
					</swiper-item>
				</block>
			</swiper>
			<view class="tui-video__box" @tap.stop="play(goodsDetail.videoUrl)" v-if="goodsDetail.videoUrl">
				<image src="https://www.thorui.cn/images/mall/img_video_3x.png" mode="widthFix"></image>
				<view>{{goodsDetail.playTime | playTimeFormat}}</view>
			</view>
			<view class="tui-banner-tag">
				<tui-tag padding="12rpx 18rpx" type="translucent" shape="circleLeft" :scaleMultiple="0.82" originRight>{{ bannerIndex + 1 }}/{{ goodsDetail.goodsImageUrls.length }}</tui-tag>
			</view>
		</view>

		<!--banner-->
		<view class="tui-pro-detail">
			<tui-skeleton v-if="skeletonShow"  backgroundColor='#fff'></tui-skeleton>

			<view  v-if="skeletonShow" class="tui-skeleton">
				<view class="tui-cell">
					<view class="tui-title tui-skeleton-rect">xxxxxxxxxxxxxxxx</view>
					<view style="float: right">
						<view style="width: 25px; height: 25px;float: right; margin-left: 10px" class="tui-skeleton-circular"></view>
						<view style="width: 25px; height: 25px; float: right;margin-left: 10px" class="tui-skeleton-circular"></view>
					</view>
				</view>
				<view class="tui-cell">
					<view class="tui-title tui-skeleton-rect">xxxxxxxxxxxxxxxxxxxxxxxxxx</view>
				</view>
				<view class="tui-cell">
					<view class="tui-title tui-skeleton-rect">xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</view>
				</view>
				<view class="tui-cell" style="padding: 20rpx;">
					<view style="border: 1rpx solid #eaeef1; position: relative;"></view>
				</view>
				<view class="tui-cell">
					<view class="tui-title tui-skeleton-rect">xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</view>
				</view>
				<view class="tui-cell">
					<view class="tui-title tui-skeleton-rect">xxxxxxxxxxxxxxxxxxxxxxxxxxxx</view>
				</view>
			</view>
			<view  v-else class="tui-product-title tui-border-radius">
				<view class="tui-price__box tui-padding">
					<view class="tui-pro-price">
						<view>
							<text>￥</text>
							<text class="tui-price">{{goodsDetail.price}}</text>
						</view>
						<view class="tui-original-price tui-gray" v-if="goodsDetail.originalPrice">
							<text class="tui-line-through">￥{{goodsDetail.originalPrice}}</text>
						</view>
					</view>
					<view class="tui-sold">已拼{{goodsDetail.salesNum}}件</view>
				</view>
				<view class="tui-pro-titbox">
					<view class="tui-pro-title">{{goodsDetail.title}}
						<tui-tag type="green" padding="10rpx" scaleMultiple="0.8" size="28rpx"  style="display: -webkit-inline-flex; line-height: 32rpx;">
							{{goodsDetail.activityPeople}}人团
						</tui-tag>	
					</view>
					<button open-type="share" class="tui-share-position">
						<tui-tag type="gray" shape="circleLeft" padding="12rpx 16rpx">
							<view class="tui-share-box">
								<tui-icon name="partake" color="#999" :size="15"></tui-icon>
								<text class="tui-share-text tui-gray tui-size">分享</text>
							</view>
						</tui-tag>
					</button>
				</view>
				<view class="tui-padding">
					<view class="tui-size-26 tui-gray">{{goodsDetail.slogan}}</view>
				</view>
			</view>

			<!--正在拼团中-->
			<view class="tui-radius-all tui-mtop" v-if="activityOrders.length!=0">
				<tui-list-cell padding="30rpx" arrow  @click="moreGroup">
					<view class="tui-group-text tui-between">
						<view class="tui-group-title">{{participants}}人正在拼团，可直接参与</view>
						<view class="tui-sub__title" v-if="activityOrders.length>2">查看全部</view>
					</view>
				</tui-list-cell>
				<swiper :indicator-dots="false" :autoplay="true" :interval="5000" :duration="500" :circular="true"
				 :display-multiple-items="getNum(activityOrders.length)" :vertical="true" class="tui-group-swiper" :style="{'height': getNum(activityOrders.length)*156+'rpx'}">
					<block v-for="(item, index) in activityOrders" :key="index">
						<swiper-item>
							<view class="tui-group-user">
								<view class="tui-user-left">
									<image :src="item.avatarUrl" :lazy-load="true"></image>
									<view class="tui-user-name">{{item.nickName}}</view>
								</view>
								<view class="tui-user-right">
									<view class="tui-user-countdown">
										<view class="tui-group-num">
											还差<text class="tui-color-red">{{item.activityPeople - item.participants}}</text>人拼成
										</view>
										<view class="tui-group-countdown">
											<view class="tui-countdown-right">剩余</view>
											<tui-countdown :time="getTime(item.create_time)" scale colonColor="#EB0909" borderColor="#EB0909" color="#EB0909" @end="onEnd(item)"></tui-countdown>
											<view class="tui-countdown-left">结束</view>
										</view>
									</view>
									<tui-button open-type="share" width="130rpx" height="54rpx" :size="26" shadow type="danger" shape="circle" v-if="item.isMyself">
										邀请好友
									</tui-button>
									<tui-button width="130rpx" height="54rpx" :size="26" shadow type="danger" shape="circle" @click="join(item)" v-else>
										去参团
									</tui-button>
								</view>
							</view>
						</swiper-item>
					</block>
				</swiper>
			</view>

			<!--拼团规则玩法介绍-->
			<view class="tui-group-rule tui-mtop tui-radius-all">
				<tui-list-cell padding="30rpx" arrow @click="showModal">
					<view class="tui-group-text tui-between">
						<view class="tui-group-title">拼团规则</view>
						<view class="tui-sub__title">拼团玩法介绍</view>
					</view>
				</tui-list-cell>
				<view class="tui-step__box">
					<view class="tui-step-item">
						<image :src="webURL+'img_opengroup_3x.png'"></image>
						<view class="tui-step-text">团长开团</view>
					</view>
					<view class="tui-step-arrow">
						<image :src="webURL+'img_arrow_3x.png'"></image>
					</view>
					<view class="tui-step-item">
						<image :src="webURL+'img_invitefriends_3x.png'"></image>
						<view class="tui-step-text">邀请好友</view>
					</view>
					<view class="tui-step-arrow">
						<image :src="webURL+'img_arrow_3x.png'"></image>
					</view>
					<view class="tui-step-item">
						<image :src="webURL+'img_spellgroupsuccess_3x.png'"></image>
						<view class="tui-step-text">拼团成功</view>
					</view>
					<view class="tui-step-arrow">
						<image :src="webURL+'img_arrow_3x.png'"></image>
					</view>
					<view class="tui-step-item">
						<image :src="webURL+'img_tosend_3x.png'"></image>
						<view class="tui-step-text">等待发货</view>
					</view>
				</view>
			</view>

			<!-- 商品信息 -->
			<view v-if="!skeletonShow" class="tui-basic-info tui-mtop tui-radius-all">
				<view class="tui-list-cell" @tap="showPopup('groupBuy')">
					<view class="tui-bold tui-cell-title">已选</view>
					<view class="tui-selected-box">{{selectedGoodsAttrList | attrFormat}}</view>
					<view class="tui-buyNum" v-show="goodsDetail.sellUnit">，{{buyNum}}件</view>
					<view class="tui-ml-auto">
						<tui-icon name="arrowright" :size="36" color="#666" unit="rpx"></tui-icon>
					</view>
				</view>

				<view class="tui-list-cell tui-last" @tap="showPopup('property')">
					<view class="tui-bold tui-cell-title">参数</view>
					<view class="tui-selected-box" style="max-width: 160rpx">{{ goodsDetail.selectedGoodsPropList | propsFormat}}</view>
					<view class="tui-ml-auto">
						<tui-icon name="arrowright" :size="36" color="#666" unit="rpx"></tui-icon>
					</view>
				</view>
				<view class="tui-guarantee" @tap="showPopup('service')">
					<view class="tui-guarantee-item " v-for="(service, index) in goodsDetail.selectedGoodsRightsList" :key="index">
						<tui-icon name="circle-selected" :size="14" color="#999"></tui-icon>
						<text class="tui-pl">{{service.value}}</text>
					</view>
				</view>
			</view>

			<view class="tui-cmt-box tui-mtop tui-radius-all">
				<view class="tui-list-cell tui-last tui-between">
					<view class="tui-bold tui-cell-title">
						<text>评价</text>
						<text style="font-size: 24rpx; margin-left: 5rpx;">({{reviews}})</text>
					</view>
					<view class="tui-showAll" @tap="evaluate">
						<view>查看全部</view>
						<tui-icon name="arrowright" :size="32" color="#666" unit="rpx"></tui-icon>
					</view>
				</view>
				<block v-for="review, index in reviewList" :key="index">
					<view class="tui-cmt-content tui-padding" v-if="index<=1">
						<view class="tui-cmt-user">
							<image :src="review.avatar" class="tui-avatar"></image>
							<view class="tui-user-info">
								<view class="tui-nickname">{{review.name}}</view>
								<tui-rate :current="review.star" :size="14"></tui-rate>
							</view>	
						</view>
						<view class="tui-cmt ">{{review.msg}}</view>
					</view>
				</block>
			</view>

			<view class="tui-nomore-box">
				<tui-nomore text="宝贝详情" backgroundColor="#f7f7f7"></tui-nomore>
			</view>
			<view class="tui-product-img">
					<uParse :content="parseDetail(goodsDetail.detail)" class="productDetail-element"></uParse>
			</view>
			<!-- <tui-nomore text="已经到最底了" backgroundColor="#f7f7f7"></tui-nomore> -->
			<view class="tui-safearea-bottom"></view>
		</view>

		<!--底部操作栏-->
		<view class="tui-operation" v-if="!skeletonShow">
			<view class="tui-operation-left tui-col-5">
				<view class="tui-operation-item" hover-class="tui-opcity" :hover-stay-time="150" @tap="shop">
					<tui-icon name="home" :size="22" color="#333"></tui-icon>
					<view class="tui-operation-text tui-scale-small">首页</view>
				</view>
				<button open-type="contact" class="tui-operation-item" hover-class="tui-opcity" :hover-stay-time="150">
					<tui-icon name="kefu" :size="22" color="#333"></tui-icon>
					<view class="tui-operation-text tui-scale-small">客服</view>	
				</button>
				<view class="tui-operation-item" hover-class="tui-opcity" :hover-stay-time="150">
					<tui-icon name="like" :size="22" color="#333"></tui-icon>
					<view class="tui-operation-text tui-scale-small">收藏</view>
				</view>
			</view>
			<view class="tui-operation-right tui-right-flex tui-col-7 tui-btnbox-4">
				<view class="tui-flex-1">
					<tui-button height="100rpx" :size="26" type="warning" shape="rightAngle" @click="showPopup('single')">
						<view class="tui-btn__box">
							<view>单独购买</view>
							<view class="tui-flex-end">
								<view class="tui-size-26">￥</view>
								<view class="tui-size-36">{{goodsDetail.integerPrice}}</view>
								<view class="tui-size-26" v-if="goodsDetail.decimalPrice">.{{goodsDetail.decimalPrice}}</view>
							</view>
						</view>
					</tui-button>
				</view>
				<view class="tui-flex-1">
					<tui-button height="100rpx" :size="26" type="danger" shape="rightAngle" @click="showPopup('groupBuy')">
						<view class="tui-btn__box">
							<view>发起拼团</view>
							<view class="tui-flex-end">
								<view class="tui-size-28">￥</view>
								<view class="tui-price-large tui-size-36">{{goodsDetail.integerActivityPrice}}</view>
								<view class="tui-size-28" v-if="goodsDetail.decimalActivityPrice">.{{goodsDetail.decimalActivityPrice}}</view>
							</view>
						</view>
					</tui-button>
				</view>
			</view>
		</view>
		<!--底部操作栏-->
		<tui-bottom-popup :show="popupShow" @close="hidePopup">
			<view class="tui-popup-box" v-if="mode==='service'">
				<view class="service-header">服务说明</view>
				<scroll-view scroll-y class="tui-popup-scroll">
					<view class="tui-scrollview-box">
						<view class="tui-service-item" v-for="(service, index) in goodsDetail.selectedGoodsRightsList" :key="index">
							<view class="tui-value">
								<tui-badge :scaleRatio="0.6" type="gray" dot></tui-badge>
								<view style="margin-left: 15rpx">{{service.value}}</view>
							</view>
							<view class="tui-description">
								{{service.description}}
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="tui-popup-btn">
					<tui-button :size="32" type="danger" shape="circle" @click="hidePopup">完成</tui-button>
				</view>
			</view>
			<view class="tui-popup-box" v-if="mode==='property'">
				<view class="property-header">产品参数</view>
				<scroll-view scroll-y class="tui-popup-scroll">
					<view class="tui-scrollview-box">
						<view class="tui-property-item" v-for="(prop, index) in goodsDetail.selectedGoodsPropList" :key="index">
							<view class="property-value">{{prop.name}}</view>
							<view>{{prop.value}}</view>
						</view>
					</view>
				</scroll-view>
				<view class="tui-popup-btn">
					<tui-button :size="32" type="danger" shape="circle" @click="hidePopup">完成</tui-button>
				</view>
			</view>
		</tui-bottom-popup>

        <popupBox ref="popup" @select="onSelectGoods" :mode="mode" @change="change"></popupBox>
		
		<!--底部选择层-->
		<!--拼团玩法介绍-->
		<tui-modal :show.sync="modal" shape="circle" padding="30rpx 40rpx" custom>
			<view class="tui-modal__title">拼团玩法</view>
			<view class="tui-modal__p">1.全民拼团，所有用户都可直接参团或开团；</view>
			<view class="tui-modal__p">2.拼团成功，指开团后在规定时间内达到规定成团人数；拼团成功后，商家会根据团长的配送地址进行配送。</view>
			<view class="tui-modal__p">3.拼团失败，指开团后在规定时间内未能找到相应的人数的好友参团，该团失败，系统取消该团订单，退款原路退回。</view>
			<view class="tui-modal__btn">
				<tui-button type="danger" shape="circle" width="420rpx" height="68rpx" :size="26" @click="modal = false">我知道了</tui-button>
			</view>
		</tui-modal>
		<tui-alert :show.sync="show" maskClosable padding="0">
			<view v-for="(item, index) in activityOrders" :key="index">
				<tui-list-cell :hover="false" >
					<view class="tui-flex-center" style="justify-content: space-between">
						<view class="tui-user-left">
							<image :src="item.avatarUrl" :lazy-load="true"></image>
							<view class="tui-activity-info">
								<viev class="tui-flex-center">
									<view class="tui-user-name">{{item.nickName}}</view>
									<view class="remain-info">还差{{item.activityPeople - item.participants}}人</view>
								</viev>
								<view v-if="item.isMyself" style="color: #999">我发起的拼团</view>
								<view class="tui-group-countdown" v-else>
									<view class="tui-countdown-right">剩余</view>
									<tui-countdown :time="getTime(item.create_time)" scale colonColor="#EB0909" borderColor="#fff" color="#EB0909"></tui-countdown>
								</view>
							</view>	
						</view>
						<view class="tui-user-right">
							<tui-button open-type="share" width="128rpx" height="54rpx" :size="26" shadow type="danger" shape="circle" v-if="item.isMyself">
								邀请好友
							</tui-button>
							<tui-button width="128rpx" height="54rpx" :size="26" shadow type="danger" shape="circle" @click="join(item)" v-else>
								去参团
							</tui-button>
						</view>
					</view>
				</tui-list-cell>
			</view>
		</tui-alert>
		<tui-modal :show.sync="joinModal" maskClosable shape="circle" padding="30rpx 40rpx" custom>
		    <tui-icon name="close-fill" color="#999" :size="22" @click="joinModal=false" class="tui-close-btn"></tui-icon>
			<view class="tui-modal__title">参与
				<view class="tui-user-name tui-organizer-name">{{selectedGroup.nickName}}</view>的拼单
			</view>
			<view class="tui-flex-center tui-sub-title">
				<view>剩余{{selectedGroup.activityPeople - selectedGroup.participants}}个名额</view>
				<!-- tui-model show为false时，也会渲染，导致倒计时为undefined，因此要设置v-if -->
				<view class="tui-group-countdown" v-if="joinModal">
					<tui-countdown :time="getTime(selectedGroup.create_time)" scale colonColor="#EB0909" borderColor="#fff" color="#EB0909" @end="onEnd(item)"></tui-countdown>
					<view>结束</view>
				</view>
			</view>
			<view class="tui-user__box">
				<view class="tui-user__item" :key="index">
					<view class="tui-avatar__box tui-size">
						<image class="tui-size" :src="selectedGroup.avatarUrl"></image>
						<view class="tui-team__leader">团长</view>
					</view>
				</view>
				<view class="tui-user__item">
					<view class="tui-avatar__box tui-user__none">
						<image class="tui-size" :src="webURL + 'img_not_tuxedo.png'"></image>
					</view>
				</view>
			</view>
			<view class="tui-modal__btn">
				<tui-button type="danger" shape="circle" width="420rpx" height="68rpx" :size="26" @click="onConfirm">参与拼团</tui-button>
			</view>
		</tui-modal>

	</view>
</template>

<script>
	import uParse from '@/components/uni/uParse/src/wxParse'
	import popupBox from '@/components/views/groupBuy/groupBuy'
	export default {
		components:{
			uParse,
			popupBox
		},
		data() {
			return {
				spu_id: '',
				sku_id: '',
				activity_id: '',
				skeletonShow: true,
				webURL: 'https://thorui.cn/images/mall/group/',
				height: getApp().globalData.navBarHeight, //header高度
				top: getApp().globalData.menuTop, //标题图标距离顶部距离
				scrollH: getApp().globalData.windowWidth, //滚动总高度
				opcity: 0,
				iconOpcity: 0.5,
				bannerIndex: 0,
				menuShow: false,
				popupShow: false,
				initial: true,
				modal: false,
				joinModal: false,
				submitModal: false,
				sharePopup: false,
				posterImg: '',
				selectedGroup: '', //选择加入的分组
				winWidth: uni.upx2px(460 * 2),
				winHeight: uni.upx2px(800 * 2),
				modalShow: false,
				show: false,
				mode: 'groupBuy', //购买方式
				participants: 0, //拼团人数
				activityOrders: [], //正在拼团的订单
				buyNum: 1,
				reviews: 0,
				detail: '',
				selectedGoodsAttrList: [], //商品去重后的属性
				goodsDetail: {selectedGoodsPropList: [], goodsImageUrls: ['https://system.chuangbiying.com/assets/img/add-picture.png']},
			};
		},
		onLoad: function(options) {
			this.spu_id = parseInt(options.spu_id)
			this.sku_id = parseInt(options.sku_id)
            this.activity_id = parseInt(options.activity_id)
			console.log('options', options)
			if(this.goodsList.length===0){
				const accountInfo = wx.getAccountInfoSync();
				this.appid = accountInfo.miniProgram.appId
				const url = '/getStoreActivityGoods/' + this.appid + '/groupBuy'
                this.tui.request(url).then(res => {
                    if (res.code === '0') {
                        let activityGoods = []
                        res.activityList.forEach((activity)=>{
							activity.goodsList.forEach((o)=>{
								o.integerActivityPrice = parseInt(o.activityPrice)
								o.decimalActivityPrice = o.activityPrice.split('.')[1]
								o.integerPrice = parseInt(o.price)
								o.decimalPrice = o.price.split('.')[1]
							})
							activityGoods.push(...activity.goodsList)
                        })
                        this.$store.commit('setActivityGoods', activityGoods)
						this.$refs.popup.initial(this.spu_id, this.sku_id, this.activity_id)
                    }
                })
			}else{
				this.$refs.popup.initial(this.spu_id, this.sku_id, this.activity_id)
			}

			//是否拼团购买
            if(Boolean(options.buy)){ 
				this.mode='groupBuy'
				this.$refs.popup.popupShow = true
			}

			let url = '/getGoodsReview/' + this.spu_id
			this.tui.request(url).then(res=>{
				if (res.code==='0'){
				    this.reviews = res.reviewList.length
					this.$store.commit('setReviewList', res.reviewList)
				}
			})
			url = '/getActivityProductOrders/' + uni.getStorageSync("pid") + '/' + this.spu_id
			this.tui.request(url).then(res=>{
				if (res.code==='0'){
					this.activityOrders = res.activityOrders
					res.activityOrders.forEach((o)=>{
						this.participants += o.participants
					})
				}
			})
		},
		computed:{
			reviewList() {
				return this.$store.state.reviewList
			},
			goodsList(){
				return this.$store.state.activityGoods
			}
		},
		filters: {
			attrFormat(attr) {
				let res = ''
				attr.forEach((o)=>{
					res+=o.value+'，'
				})
				return res.slice(0, -1)
			},
			propsFormat(props) {
				let res = ''
				props.forEach((o)=>{
					res += o.name+ '\u3000'
				})
				return res
			},
			playTimeFormat(s){
				let res = s.split(':').slice(1)
				return `${res[0]}′${res[1]}″`
			}
		},
		onShareAppMessage: function(res) {
			let nickName = this.$store.state.userInfo.nickName
			// 返回数据
			return {
				title: `来自好友${nickName}的邀请`,
				path: '/pages/index/groupDetail/groupDetail?spu_id=' + this.spu_id + '&sku_id=' + this.sku_id + '&activity_id=' + this.activity_id,
				imageUrl: this.goodsDetail.defaultImageUrl+'-shareImage',
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
			onSelectGoods(goodsDetail, selectedGoodsAttrList){
				this.goodsDetail = goodsDetail
				this.sku_id = this.goodsDetail.id
				this.selectedGoodsAttrList = selectedGoodsAttrList
				this.skeletonShow = false
			},
			onEnd(e){
				let url='/updateActivityOrders/' + e.activityNum + '/fail'
				this.tui.request(url, 'PUT').then((res)=>{
					console.log('res', res)
				})
			},
			getNum(n){
				return n>=2? 2 : 1
			},
			bannerChange: function(e) {
				this.bannerIndex = e.detail.current;
			},
			previewImage: function(e) {
				let index = e.currentTarget.dataset.index;
				uni.previewImage({
					current: this.goodsDetail.goodsImageUrls[index],
					urls: this.goodsDetail.goodsImageUrls
				});
			},
			back: function() {
				uni.navigateBack();
			},
			getTime(time){
				time = time.replace(/-/g, "/") //如果不转化，在ios设备上会计算错误
				const expireTime = 24*60*60*1000//一天后过期
				let t1 = Date.parse(new Date(time)) + expireTime
				let t2 = Date.parse(new Date())
				return (t1-t2)/1000
			},
			openMenu: function() {
				this.menuShow = true;
			},
			closeMenu: function() {
				this.menuShow = false;
			},
			join(group){
				this.selectedGroup = group
				this.show = false
				this.joinModal = true
				console.log('join', this.selectedGroup)
			},
			onConfirm(){
				this.showPopup('join', this.selectedGroup)
				this.joinModal = false
			},
			showPopup(v, order){
				this.mode=v
				if(v=='service' || v=='property'){
					this.popupShow = true
				}else{
					this.$refs.popup.selectedActivityOrder = order
					this.$refs.popup.popupShow = true
					this.show = false
				}
			},
			hidePopup: function() {
				this.popupShow = false;
			},
			change: function(e) {
				this.buyNum = e.value;
			},
			evaluate() {
				this.tui.href('/pages/index/goodsEvaluate/goodsEvaluate')
			},
			common: function() {
				this.tui.toast('功能开发中~');
			},
			shop() {
				this.tui.href('/pages/tabbar/index/index');
			},
			parseDetail(s){
			    if(this.initial&&s){
				    this.initial = false
				   	const html = s.replace(/<\/br>|<br\/>/,"").split(/(<p><iframe.*?iframe><\/p>)/gi) //括号不能省去
					html.forEach(o=>{
						const matchedStr = o.match(/url=(.*)&coverurl/)
						if(matchedStr){
							const src = matchedStr[1]
							this.detail = this.detail + `<video style="width:100%" src=${src} controls></video>`
						}else{
							this.detail = this.detail + o
						}
					})
			    }
			    return this.detail
			},
			play(src) {
				uni.navigateTo({
					url: '/pages/index/video/video?videoUrl=' + src,
					animationType: 'zoom-out'
				})
			},
			showModal() {
				this.modal = true
			},
			moreGroup() {
				this.show=true
			}
		},
		onPageScroll(e) {
			let scroll = e.scrollTop <= 0 ? 0 : e.scrollTop;
			let opcity = scroll / this.scrollH;
			if (this.opcity >= 1 && opcity >= 1) {
				return;
			}
			this.opcity = opcity;
			this.iconOpcity = 0.5 * (1 - opcity < 0 ? 0 : 1 - opcity);
		}
	};
</script>

<style lang="less" scoped>
	page {
		background-color: #f7f7f7;
	}

	.container {
		padding-bottom: 110rpx;
	}
	.tui-cell {
		padding: 10rpx 30rpx;
		color: #555;
	}
	.tui-title {
		padding: 0;
		font-size: 24rpx;
		line-height: 24rpx;
		height: 24rpx;
		box-sizing: border-box;
		display: inline-block;
	}

	.tui-header-box {
		width: 100%;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 995;
	}

	.tui-header {
		width: 100%;
		font-size: 18px;
		line-height: 18px;
		font-weight: 500;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-header-icon {
		position: fixed;
		top: 0;
		left: 10px;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		height: 32px;
		transform: translateZ(0);
		z-index: 9999;
	}

	.tui-header-icon .tui-badge {
		background: #e41f19 !important;
		position: absolute;
		right: -4px;
	}

	.tui-icon-ml {
		margin-left: 20rpx;
	}

	.tui-icon-box {
		position: relative;
		height: 20px !important;
		width: 20px !important;
		padding: 6px !important;

		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-banner-swiper {
		position: relative;
		padding-top: 100%;
		height: 0;
		z-index: 1;
		overflow: hidden;
	}
	.tui-swiper {
		position: absolute;
		width: 100%;
		top: 0;
	}

	.tui-video__box {
		width: 166rpx;
		height: 60rpx;
		position: absolute;
		left: 50%;
		bottom: 50rpx;
		transform: translateX(-50%);
		z-index: 2;
	}

	.tui-video__box image {
		width: 166rpx;
		height: 60rpx;
	}

	.tui-video__box view {
		width: 100%;
		height: 100%;
		font-size: 24rpx;
		position: absolute;
		left: 0;
		top: 0;
		display: flex;
		align-items: center;
		padding-left: 66rpx;
		box-sizing: border-box;
	}

	.tui-banner-tag {
		position: absolute;
		color: #fff;
		bottom: 30rpx;
		right: 0;
	}

	.tui-slide-image {
		width: 100%;
		display: block;
	}

	/*顶部菜单*/


	/*内容 部分*/

	.tui-padding {
		padding: 0 30rpx;
		box-sizing: border-box;
	}

	.tui-ml-auto {
		margin-left: auto;
	}

	/* #ifdef H5 */
	.tui-ptop {
		padding-top: 44px;
	}

	/* #endif */

	.tui-size {
		font-size: 24rpx;
		line-height: 24rpx;
	}

	.tui-gray {
		color: #999;
	}

	.tui-white__gray {
		color: rgba(255, 255, 255, .8);
		font-weight: normal;
		font-size: 26rpx;
	}

	.tui-color-red {
		color: #EB0909;
	}

	.tui-border-radius {
		border-bottom-left-radius: 24rpx;
		border-bottom-right-radius: 24rpx;
		overflow: hidden;
	}

	.tui-radius-all {
		border-radius: 24rpx;
		overflow: hidden;
	}

	.tui-mtop {
		margin-top: 26rpx;
	}

	.tui-pro-detail {
		box-sizing: border-box;
		color: #333;
	}

	.tui-product-title {
		background: #fff;
		padding-bottom: 20rpx;
	}

	.tui-price__box {
		width: 100%;
		display: flex;
		margin-top: 20rpx;
		align-items: center;
		justify-content: space-between;
	}
	.tui-pro-price {
		display: flex;
		font-weight: 600;
		align-items: center;
		color: #ff201f;
		font-size: 36rpx;
		line-height: 44rpx;
	}

	.tui-price {
		font-size: 50rpx;
	}

	.tui-original-price {
		font-size: 26rpx;
		line-height: 26rpx;
		font-weight: normal;
		padding: 10rpx;
		box-sizing: border-box;
	}

	.tui-line-through {
		text-decoration: line-through;
	}

	.tui-sold {
		color: #999;
		font-size: 26rpx;
	}

	.tui-pro-titbox {
		font-size: 32rpx;
		font-weight: 500;
		position: relative;
		padding: 0 150rpx 0 30rpx;
		margin-bottom: 10rpx;
		box-sizing: border-box;
	}

	.tui-pro-title {
		padding-top: 20rpx;
	}

	.tui-share-btn {
		flex: 1;
		display: block;
		background: transparent;
		margin: 0;
		padding: 0;
		border-radius: 0;
		border: 0;
		line-height:1;
	}

	.tui-share-btn::after {
		border: 0;
	}

	.tui-share-box {
		display: flex;
		align-items: center;
	}

	.tui-share-position {
		position: absolute;
		right: 0;
		top: 30rpx;
		background: transparent;
		padding: 0;
	}

	.tui-share-text {
		padding-left: 8rpx;
	}

	.tui-selected-box {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 300rpx;
	}


	.tui-group-text {
		width: 100%;
		display: flex;
		align-items: center;
	}

	.tui-group-title {
		font-size: 30rpx;
		line-height: 30rpx;
		font-weight: bold;
		padding-left: 16rpx;
		border-left: 2px solid #eb0909;
		box-sizing: border-box;
	}

	.tui-sub__title {
		font-size: 26rpx;
		padding-right: 30rpx;
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

	.tui-discount-box {
		background: #fff;
	}

	.tui-list__cell {
		width: 100%;
		position: relative;
		display: flex;
		align-items: center;
		font-size: 26rpx;
		line-height: 26rpx;
		padding: 36rpx 30rpx;
		box-sizing: border-box;
	}

	.tui-right {
		position: absolute;
		right: 30rpx;
		top: 30rpx;
	}

	.tui-top40 {
		top: 40rpx !important;
	}

	.tui-bold {
		font-weight: bold;
	}

	.tui-list__cell::after {
		content: '';
		position: absolute;
		border-bottom: 1rpx solid #eaeef1;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		bottom: 0;
		right: 0;
		left: 126rpx;
	}

	.tui-last::after {
		border-bottom: 0 !important;
	}

	.tui-flex-center {
		display: flex;
		align-items: center;
	}

	.tui-cell-title {
		min-width: 66rpx;
		padding-right: 30rpx;
		font-size: 28rpx;
		flex-shrink: 0;
	}


	.tui-basic-info {
		background: #fff;
	}

	.tui-addr-box {
		width: 76%;
	}

	.tui-addr-item {
		padding: 10rpx;
		line-height: 34rpx;
	}

	.tui-guarantee {
		background: #fdfdfd;
		display: flex;
		flex-wrap: wrap;
		padding: 20rpx 30rpx 30rpx 30rpx;
		font-size: 24rpx;
	}

	.tui-guarantee-item {
		color: #999;
		padding-right: 30rpx;
		padding-top: 10rpx;
	}

	.tui-pl {
		padding-left: 4rpx;
	}

	.tui-list-cell {
		width: 100%;
		position: relative;
		display: flex;
		align-items: center;
		font-size: 26rpx;
		padding: 30rpx 30rpx;
		box-sizing: border-box;
	}
	.tui-cmt-box {
		background: #fff;
	}
	
	.tui-showAll{
		display: flex; 
		line-height: 24rpx;
		font-size: 24rpx ;
		color: #888;
	}

	.tui-between {
		justify-content: space-between !important;
	}

    .tui-cmt-content {
		font-size: 26rpx;
		padding-bottom: 30rpx;
	}
	.tui-cmt-user {
		display: flex;
		align-items: center;
	}
	.tui-user-info {
		margin-left: 10rpx;
		line-height: 26rpx;
	}
	.tui-avatar {
		width: 60rpx;
		height: 60rpx;
		border-radius: 30rpx;
		display: block;
	}
	.tui-nickname {
		margin-left: 5rpx;
		font-size: 24rpx;
	}
	.tui-cmt {
		font-size: 28rpx;
		padding: 14rpx 25rpx;
	}

	.tui-attr {
		font-size: 24rpx;
		color: #999;
		padding: 6rpx 0;
	}
	.tui-nomore-box {
		padding-top: 10rpx;
	}

	.tui-product-img {
		display: flex;
		flex-direction: column;
		transform: translateZ(0);
	}

	.tui-product-img image {
		width: 100%;
		display: block;
	}

	/*底部操作栏*/
	.tui-popup-box {
		position: relative;
		padding: 30rpx 0 100rpx 0;
		.service-header, .property-header{
			text-align: center;
			font-size: 34rpx;
			line-height: 36rpx;
    		margin-bottom: 60rpx;
		}
		.tui-service-item{
			font-size: 30rpx;
			margin: 40rpx 40rpx 40rpx 20rpx;
			.tui-value{
				display: -webkit-inline-flex;
				display: inline-flex;
				align-items: center;
			}
			.tui-description{
				color: #999;
				margin-left: 30rpx;
				line-height: 44rpx;
    			font-size: 26rpx;
			}
		}
		.property-header{
			margin-bottom: 40rpx;
		}
		.tui-property-item{
			display: flex;
			align-items: center;
			margin: 0 20rpx;
			padding: 30rpx 0;
			font-size: 30rpx;
			border-bottom: 1rpx solid var(--thorui-line-color,rgba(0,0,0,0.08));
			&:last-child{
				border: 0;
			}
			.property-value{
				flex: auto;
				color: #999;
				margin-right: 40rpx;
			}
		}

		.tui-popup-scroll {
			margin-bottom: 60rpx;
		}
		.tui-popup-btn {
			margin-top: 60rpx;
			bottom: 0;
			width: 94%;
			position: absolute;
			left: 3%;
		}
	}

	.tui-col-7 {
		width: 58.33333333%;
	}

	.tui-col-5 {
		width: 41.66666667%;
	}

	.tui-operation {
		width: 100%;
		height: 100rpx;
		background: rgba(255, 255, 255, 0.98);
		position: fixed;
		display: flex;
		align-items: center;
		justify-content: space-between;
		z-index: 10;
		bottom: 0;
		left: 0;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-safearea-bottom {
		width: 100%;
		height: env(safe-area-inset-bottom);
	}
	.tui-operation::before {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		border-top: 1rpx solid #eaeef1;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
	}

	.tui-operation-left {
		display: flex;
		align-items: center;
	}

	.tui-operation-item {
		height: 100rpx;
		line-height: 32rpx;
		background: #fff;
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		position: relative;
	}

	.tui-operation-text {
		font-size: 22rpx;
		color: #333;
	}

	.tui-opacity {
		opacity: 0.5;
	}

	.tui-scale-small {
		transform: scale(0.9);
		transform-origin: center center;
	}

	.tui-operation-right{
		height: 100rpx;
	}

	.tui-right-flex {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-flex-1 {
		flex: 1;
	}

	.tui-img__clock {
		width: 30rpx;
		height: 30rpx;
		margin-right: 8rpx;
	}

	/*底部操作栏*/

	

	/*拼团玩法介绍 modal*/
	.tui-modal__title {
		display: flex;
    	justify-content: center;
		font-weight: bold;
		padding-bottom: 20rpx;
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

	/*正在拼团*/
	.tui-group-swiper {
		width: 100%;
		background-color: #fff;
	}

	.tui-group-user {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 35rpx 40rpx;
		box-sizing: border-box;
	}

	.tui-user-left {
		font-size: 30rpx;
		display: flex;
		align-items: center;
	}

	.tui-user-left image {
		height: 80rpx;
		width: 80rpx;
		flex-shrink: 0;
		border-radius: 50%;
		margin-right: 16rpx;
	}

	.tui-user-right {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tui-user-name {
		max-width: 160rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.tui-group-num {
		font-size: 26rpx;
		line-height: 26rpx;
		padding-bottom: 12rpx;
	}

	.tui-user-countdown {
		padding-right: 18rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.tui-group-countdown {
		display: flex;
		align-items: center;
		font-size: 24rpx;
		color: #666666;
		white-space: nowrap;
	}

	.tui-countdown-right {
		padding-right: 6rpx;
	}

	.tui-countdown-left {
		padding-left: 6rpx;
	}

	.tui-btn__box {
		height: 98rpx;
		font-size: 26rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-direction: column;
		line-height: 28rpx;
		padding: 18rpx 0 14rpx 0;
		box-sizing: border-box;
	}

	.tui-size-26 {
		font-size: 26rpx;
		line-height: 26rpx;
		padding-top: 4rpx;
	}

	.tui-size-36 {
		font-size: 36rpx;
		line-height: 34rpx;
		font-weight: 500;
	}

	.tui-flex-end {
		display: flex;
		align-items: baseline;
	}

	/* alert 弹窗 */
	.tui-activity-info{
		font-size: 24rpx;
		line-height: 32rpx;
		text-align: left;
	}
	.remain-info{
		color: #666666;
		padding-left: 10rpx
	}

	/* 参与拼团 */
	.tui-user__box {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding-top: 60rpx;
		.tui-user__item {
			max-width: 128rpx;
			margin: 0 40rpx;
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
		}
	}
	.tui-sub-title{
		justify-content: center;
		font-size: 24rpx;
	}
	.tui-organizer-name{
		display: inline-block;
		max-width: 300rpx;
	}
	.tui-close-btn{
		position: absolute;
		right: -23rpx;
		top: -23rpx;
	}
</style>
