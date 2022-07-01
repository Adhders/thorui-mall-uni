<template>
	<view>
		<view class="container">

			<!--header-->
			<view class="tui-header-box" :style="{ height: height + 'px', background: 'rgba(255,255,255,' + opcity + ')' }">
				<view class="tui-header" :style="{ paddingTop: top + 'px', opacity: opcity }">商品详情</view>
				<view class="tui-header-icon" :style="{ marginTop: top + 'px' }">
					<view class="tui-icon-box" :style="{ backgroundColor: 'rgba(0, 0, 0,' + iconOpcity + ')' }" @tap="back">
						<tui-icon name="arrowleft" :size="30" :color="opcity >= 1 ? '#000' : '#fff'"></tui-icon>
					</view>
					<view class="tui-icon-box tui-icon-ml" :style="{backgroundColor: 'rgba(0, 0, 0,' + iconOpcity + ')'}" @tap.stop="openMenu">
						<tui-icon name="more-fill" :size="20" :color="opcity >= 1 ? '#000' : '#fff'"></tui-icon>
						<tui-badge type="red" :scaleRatio="0.9" absolute top="-6rpx" right="-8rpx">5</tui-badge>
					</view>
				</view>
			</view>
			<!--header-->

			<!--banner-->
			<view class="tui-banner-swiper">
				<swiper :autoplay="false" class="tui-swiper" :interval="5000" :duration="150" :circular="true" :style="{ height: scrollH + 'px' }"
				 @change="bannerChange">
					<swiper-item class="swiper-video" v-if="goodsDetail.videoUrl">
						<view @tap="play(goodsDetail.videoUrl)">
							<video id="myVideo" :style="{ height: scrollH + 'px' }"
								@timeupdate="timeupdate" @ended.stop="endedFun()" autoplay :controls="false"
								:src="goodsDetail.videoUrl" :show-center-play-btn="false" :muted="ismute">
							</video>
							<view class="video-img" @tap.stop="videoPlay()" v-if="startVideo">
								<image src="https://system.chuangbiying.com/assets/play.svg" mode=""></image>
							</view>
						</view>
						<tui-slider class="tui-video-slider" :height="2" :blockWidth="0" :blockHeight="0"  radius="0"  backgroundColor="#ccc" 
							activeColor="#e41f19" :value="currentTime" :max="duration" :width="scrollH"></tui-slider>
					</swiper-item>
					<swiper-item class="swiper-img" v-for="(item,index) in goodsDetail.goodsImageUrls" :key="index">
						<image  class="tui-slide-image" :style="{ height: scrollH + 'px' }"  mode="aspectFill" :src="item"></image>
					</swiper-item>
				</swiper>

				<view class="tui-video-voice" v-if="goodsDetail.videoUrl && bannerIndex === 0"  @tap.stop="onChange">
					<tui-tag padding="6rpx 18rpx" type="translucent" shape="circle" :scaleMultiple="0.82" originRight>
						<image :src="voiceControl" mode=""></image>
					</tui-tag>
				</view>
				<view class="tui-banner-tag">
					<tui-tag padding="12rpx 18rpx" type="translucent" shape="circle" :scaleMultiple="0.82" originRight>{{ bannerIndex + 1 }}/{{ goodsDetail.goodsImageUrls.length + (goodsDetail.videoUrl? 1: 0) }}</tui-tag>
				</view>
			</view>

			<!--banner-->

			<view class="tui-pro-detail">
				<view class="tui-product-title tui-border-radius">
					<view class="tui-pro-pricebox tui-padding">
						<view class="tui-pro-price ">
							<view>
								<text>￥</text>
								<text class="tui-price">{{goodsDetail.price}}</text>
							</view>
							<view class="tui-original-price tui-gray" v-if="goodsDetail.originalPrice">
								<text class="tui-line-through">￥{{goodsDetail.originalPrice}}</text>
							</view>
						</view>
						<view class="tui-sales tui-gray" style="font-size: 26rpx">
							已售{{goodsDetail.salesNum}}件
						</view>
					</view>
					<view class="tui-pro-titbox">
						<view class="tui-pro-title">
							<text>{{goodsDetail.title}}</text>
							<tui-tag type="green" padding="10rpx" scaleMultiple="0.8" size="28rpx"  style="display: -webkit-inline-flex; line-height: 32rpx;" v-if="goodsDetail.selectedTag.length>0">
								{{goodsDetail.selectedTag[0]['name']}}
							</tui-tag>	
						</view>
						<view class="tui-share-position" @tap="showSharePopup">
							<tui-tag type="gray" shape="circleLeft" padding="12rpx 16rpx">
								<view class="tui-share-box ">
									<tui-icon name="partake" color="#999" :size="15"></tui-icon>
									<text class="tui-share-text tui-gray tui-size">分享</text>
								</view>
							</tui-tag>
						</view>
					</view>
					<view class="tui-padding">
						<view class="tui-sub-title tui-size tui-gray ">{{goodsDetail.slogan}}</view>
					</view>
				</view>

				<!-- <view class="tui-discount-box tui-radius-all tui-mtop">
					<view class="tui-list-cell" @tap="coupon">     
						<view class="tui-bold tui-cell-title" >领券</view>
						<view class="tui-flex-center ">
							<tui-tag type="red" shape="circle" padding="12rpx 24rpx" size="24rpx">满99减8</tui-tag>
							<tui-tag margin="0 0 0 20rpx" type="red" padding="12rpx 24rpx" size="24rpx" shape="circle">满59减5</tui-tag>
						</view>
						<view class="tui-ml-auto">
							<tui-icon name="more-fill" :size="20" color="#666"></tui-icon>
						</view>
					</view>
				</view> -->

				<view class="tui-basic-info tui-mtop tui-radius-all">
					<view class="tui-list-cell" @tap="showPopup('cart')">
						<view class="tui-bold tui-cell-title">已选</view>
						<view class="tui-selected-box">{{selectedGoodsAttrList | attrFormat}}，</view>
						<view class="tui-buyNum">{{buyNum}}{{goodsDetail.sellUnit}}</view>
						<view class="tui-ml-auto">
							<tui-icon name="arrowright" :size="16" color="#666"></tui-icon>
						</view>
					</view>

					<view class="tui-list-cell tui-last" @tap="showPopup('property')">
						<view class="tui-bold tui-cell-title" >参数</view>
						<view class="tui-selected-box" style="max-width: 160rpx">{{ goodsDetail.selectedGoodsPropList | propsFormat}}</view>
						<view class="tui-ml-auto">
							<tui-icon name="arrowright" :size="16" color="#666"></tui-icon>
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
						<view class="tui-bold tui-cell-title ">评价
                            <text>({{reviews}})</text>
                        </view>
						<view style="display: flex" @tap="evaluate">
							<view class="tui-cell-notice">查看全部</view>
							<tui-icon name="arrowright" :size="16" color="#666"></tui-icon>
						</view>
					</view>

                    <block v-for="review, index in reviewList" :key="index">
						<view class="tui-cmt-content tui-padding" v-if="index<=1">
							<view class="tui-cmt-user">
								<image :src="review.avatar" class="tui-avatar"></image>
								<view style="margin-left: 10rpx">
									<view class="tui-nickname">{{review.name}}</view>
									<tui-rate :current="review.star" :size="11"></tui-rate>
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
				<tui-nomore text="已经到最底了" backgroundColor="#f7f7f7"></tui-nomore>
				<view class="tui-safearea-bottom"></view>
			</view>

			<!--底部操作栏-->
			<view class="tui-operation">
				<view class="tui-operation-left tui-col-5">
					<view class="tui-operation-item" hover-class="tui-opcity" :hover-stay-time="150" @tap="shop">
						<tui-icon name="home" :size="22" color="#333"></tui-icon>
						<view class="tui-operation-text tui-scale-small">首页</view>
					</view>
					<view class="tui-operation-item" hover-class="tui-opcity" :hover-stay-time="150" @tap="collecting">
						<tui-icon  :size="22" :name="collected ? 'like-fill' : 'like'" :color="collected ? '#ff201f' : '#333'"></tui-icon>
						<view class="tui-operation-text tui-scale-small">收藏</view>
					</view>
					<view class="tui-operation-item" hover-class="tui-opcity" :hover-stay-time="150" @tap="openService">
						<tui-icon name="kefu" :size="22" color="#333"></tui-icon>
						<view class="tui-operation-text tui-scale-small">客服</view>
					</view>
				</view>
				<view class="tui-operation-right tui-right-flex tui-col-7 tui-btnbox-4">
					<view class="tui-flex-1">
						<tui-button height="68rpx" :size="26" type="danger" shape="circle" @tap="showPopup('cart')">加入购物车</tui-button>
					</view>
					<view class="tui-flex-1">
						<tui-button height="68rpx" :size="26" type="warning" shape="circle" @click="submit">立即购买</tui-button>
					</view>
				</view>
			</view>

			<!--底部操作栏-->

			<!--顶部下拉菜单-->
			<tui-top-dropdown backgroundColor="rgba(76, 76, 76, 0.95)" :show="menuShow" :height="0" @close="closeMenu">
				<view class="tui-menu-box tui-padding tui-ptop">
					<view class="tui-menu-header" :style="{ paddingTop: top + 'px' }">功能直达</view>
					<view class="tui-menu-itembox">
						<block v-for="(item, index) in topMenu" :key="index">
							<view class="tui-menu-item" hover-class="tui-opcity" :hover-stay-time="150" @tap="btnTopMenu(index)">
								<view class="tui-badge-box">
									<tui-icon :name="item.icon" color="#fff" :size="item.size"></tui-icon>
									<tui-badge type="red" :scaleRatio="0.8" absolute right="-8rpx" v-if="item.badge">{{ item.badge }}</tui-badge>
								</view>
								<view class="tui-menu-text">{{ item.text }}</view>
							</view>
						</block>
					</view>
					<view class="tui-icon-up_box">
						<tui-icon name="up" color="#fff" :size="26" @click="closeMenu"></tui-icon>
					</view>
				</view>
			</tui-top-dropdown>
			<!---顶部下拉菜单-->

			<!--底部选择层-->
			<tui-bottom-popup :show="popupShow" @close="hidePopup">
				<view class="tui-popup-box" v-if="mode==='service'">
					<view class="tui-right">
						<tui-icon name="close-fill" color="#999" :size="20"  @click="hidePopup"></tui-icon>
					</view>
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
				</view>
				<view class="tui-popup-box" v-if="mode==='property'">
					<view class="tui-right">
						<tui-icon name="close-fill" color="#999" :size="20"  @click="hidePopup"></tui-icon>
					</view>
					<view class="property-header">产品参数</view>
					<scroll-view scroll-y class="tui-popup-scroll">
						<view class="tui-scrollview-box">
							<view class="tui-property-item" v-for="(prop, index) in goodsDetail.selectedGoodsPropList" :key="index">
								<view class="property-value">{{prop.name}}</view>
								<view>{{prop.value}}</view>
							</view>
						</view>
					</scroll-view>
					<view class="tui-operation tui-operation-right tui-right-flex tui-popup-btn">
						<view class="tui-flex-1">
							<tui-button height="72rpx" :size="32" type="danger" shape="circle" @click="hidePopup">完成</tui-button>
						</view>
					</view>
				</view>
			</tui-bottom-popup>

            <!-- 添加购物车 -->
			<popup-box ref="popup" @select="onSelectGoods"></popup-box>
			<!--底部选择层-->

			<!--底部分享弹层-->
			<tui-bottom-popup :show="sharePopup" @close="hideSharePopup">
				<view class="tui-share__box">
					<view class="tui-share__header">
						<text>分享</text>
						<view class="tui-close__box" @tap="hideSharePopup">
							<tui-icon name="shut" :size="20" color="#C9C9C9"></tui-icon>
						</view>
					</view>
					<view class="tui-share__list">
						<button open-type="share" class="tui-share-btn" @tap="onShare">
							<view class="tui-share__item">
								<image src="https://system.chuangbiying.com/static/images/mall/icon_popup_share.png"></image>
								<view class="tui-share__text">分享给好友</view>
							</view>
						</button>
						<view class="tui-share__item" @tap="createPoster">
							<image src="https://system.chuangbiying.com/static/images/mall/icon_popup_poster.png"></image>
							<view class="tui-share__text">生成分享海报</view>
						</view>
					</view>
				</view>
			</tui-bottom-popup>
			<!--底部分享弹层-->
			<canvas :style="{ width: winWidth + 'px', height: winHeight + 'px' }" canvas-id="posterId" id="posterId" class="tui-poster__canvas"></canvas>
			<tui-modal custom :show="modalShow" backgroundColor="transparent" padding="0" @cancel="hideModal">
				<view class="tui-poster__box" :style="{marginTop:height+'px'}">
					<image src="https://system.chuangbiying.com/static/images/mall/icon_popup_closed.png" class="tui-close__img" @tap.stop="hideModal"></image>
					<image :src="posterImg" v-if="posterImg" class="tui-poster__img"></image>
					<tui-button type="danger" width="460rpx" height="80rpx" shape="circle" @click="savePic">保存图片</tui-button>
					<view class="tui-share__tips">保存图片到手机相册后，将图片分享到您的圈子</view>
				</view>
			</tui-modal>
		</view>
	</view>
</template>

<script>
	import thorui from '@/components/common/tui-clipboard/tui-clipboard.js'
	import poster from '@/components/common/tui-poster/tui-poster.js'
	import popupBox from '@/components/views/addCart/addCart'
	import uParse from '@/components/uni/uParse/src/wxParse'
	export default {
		components:{
			uParse,
			popupBox
		},
		data() {
			return {
				initial: true,
				ismute: true,
				voiceControl: "https://system.chuangbiying.com/assets/mute.svg",
				detail: '',
			    reviews: 0,
				skuArray: [], 
				propsList: [], //商品属性
				invalidSkuList: [],
				invalidSkuIndexList: [],
				selectedIndex: [],
				height: getApp().globalData.navBarHeight, //header高度
				top: getApp().globalData.menuTop, //标题图标距离顶部距离
				scrollH: 0, //滚动总高度
				opcity: 0,
				mode: 'service',
				iconOpcity: 0.5,
				bannerIndex: 0,
				topMenu: [{
						icon: 'message',
						text: '消息',
						size: 26,
						badge: 3
					},
					{
						icon: 'home',
						text: '首页',
						size: 23,
						badge: 0
					},
					{
						icon: 'people',
						text: '我的',
						size: 26,
						badge: 0
					},
					{
						icon: 'cart',
						text: '购物车',
						size: 23,
						badge: 2
					},
					{
						icon: 'kefu',
						text: '客服小蜜',
						size: 26,
						badge: 0
					},
					{
						icon: 'feedback',
						text: '我要反馈',
						size: 23,
						badge: 0
					},
					{
						icon: 'share',
						text: '分享',
						size: 26,
						badge: 0
					}
				],
				menuShow: false,
				popupShow: false,
				buyNum: 1,
                spu_id: 1,
				collected: false,
				sharePopup: false,
				posterImg: '',
				winWidth: uni.upx2px(560 * 2),
				winHeight: uni.upx2px(890 * 2),
				modalShow: false,
				skuList: [],
				videoplayObj: {}, //video对象
				playing: true, // 是否正在播放视频
				startVideo: true, //中间播放按钮
				currentTime: 0,
				duration: 15,
				selectedGoodsAttrList: [], //商品去重后的属性
				goodsDetail: {selectedGoodsPropList: []},
			};
		},
		
		onLoad: function(options) {
			let obj = {};
			// #ifdef MP-WEIXIN
			this.videoplayObj = wx.createVideoContext('myVideo')
			obj = wx.getMenuButtonBoundingClientRect();
			// #endif
			uni.setStorageSync('currentTime', 0)
			setTimeout(() => {
				this.startVideo = false
			}, 600);
			setTimeout(() => {
				uni.getSystemInfo({
					success: res => {
						this.width = obj.left || res.windowWidth;
						this.scrollH = res.windowWidth;
					}
				});
			}, 0);
            this.spu_id = parseInt(options.spu_id)
			const sku_id = parseInt(options.sku_id)
			this.$refs.popup.initial(this.spu_id, sku_id)
			let url = '/getGoodsReview/' + this.spu_id
			this.tui.request(url).then(res=>{
				if (res.code==='0'){
				    this.reviews = res.reviewList.length
					this.$store.commit('setReviewList', res.reviewList)
				}
			})		   
		},
		onShow(){
			// 视频全屏播放返回后的处理
			const playState = uni.getStorageSync("playState")
			if(playState!==''){
				uni.removeStorageSync("playState")
				let currentTime = uni.getStorageSync("currentTime")
				this.videoplayObj.seek(currentTime)
				if(playState){
					this.videoplayObj.play()
					this.startVideo = false
					this.playing = true
				}
				else{
					this.videoplayObj.pause()
					this.startVideo = true
					this.palying = false
				}
			}
		},
		filters: {
			getPrice(price) {
				price = price || 0;
				return price.toFixed(2)
			},
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
		},
		computed: {
			reviewList() {
				return this.$store.state.reviewList
			},
			goodsList() {
				return this.$store.state.goodsList
			}
		},
		methods: {
			onSelectGoods(goodsDetail, selectedGoodsAttrList){
				console.log('update', goodsDetail, selectedGoodsAttrList)
				this.goodsDetail = goodsDetail
				this.selectedGoodsAttrList = selectedGoodsAttrList
			},
			submit(){
				this.$refs.popup.submit()
			},
			endedFun() {
				this.startVideo = true
				this.playing = false
				uni.setStorageSync('currentTime', 0)
			},
			onChange(){
				this.ismute = !this.ismute
				this.voiceControl = this.ismute? 'https://system.chuangbiying.com/assets/mute.svg' : 'https://system.chuangbiying.com/assets/volume.svg'
			},
			videoPlay() {
				this.startVideo = false
				this.playing = true
				let currentTime = uni.getStorageSync("currentTime")
				this.videoplayObj.play()
				this.videoplayObj.seek(currentTime)
			},
			timeupdate(e){
				this.duration = parseInt(e.detail.duration)
				this.currentTime = parseInt(e.detail.currentTime)
			},
			bannerChange: function(e) { 
				this.bannerIndex = e.detail.current;
				if(this.goodsDetail.videoUrl){
					if(this.bannerIndex!==0){
						if(this.playing){
							this.playing=false
							uni.setStorageSync('currentTime', this.currentTime)
						}
						this.videoplayObj.pause()
					}
					else{
						if(!this.startVideo){
							let currentTime = uni.getStorageSync("currentTime")
							this.videoplayObj.play()
							this.videoplayObj.seek(currentTime)
							this.playing=true
						}	
					}
				}
			},
			previewImage: function(e) {
				let index = e.currentTarget.dataset.index;
				uni.previewImage({
					current: this.banner[index],
					urls: this.banner
				});
			},
			back: function() {
				uni.navigateBack();
			},
			openService: function() {
				// #ifdef MP-WEIXIN
				let servieId = this.$store.state.serviceId
				let corpId = this.$store.state.corpId
				wx.openCustomerServiceChat({
				  extInfo: {url: servieId},
				  corpId: corpId,
				  success(res) {console.log('res',res) }
				})
				// #endif
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
			openMenu: function() {
				this.menuShow = true;
			},
			closeMenu: function() {
				this.menuShow = false;
			},
			showPopup: function(v) {
				if(v==='cart'){
					this.$refs.popup.popupShow = true
				}else{
					this.mode = v
					this.popupShow = true;
				}
			},
			hidePopup: function() {
				this.popupShow = false;
			},
			change: function(e) {
				this.buyNum = e.value;
			},
			collecting: function() {
				this.collected = !this.collected;
			},
			evaluate() {
				if(this.reviews>0){
					this.tui.href('/pages/index/goodsEvaluate/goodsEvaluate')
				}
			},
			common: function() {
				this.tui.toast('功能开发中~');
			},
			btnTopMenu(index) {
				this.closeMenu()
				if (index == 4) {
					uni.makePhoneCall({
						phoneNumber: "10086"
					})
				} else if (index == 6) {
					this.showSharePopup()
				} else {
					let url = {
						0: '/pages/my/message/message',
						1: "/pages/tabbar/index/index",
						2: '/pages/tabbar/my/my',
						3: '/pages/tabbar/cart/cart',
						5: '/pages/my/feedback/feedback?page=mall'
					} [index];
					if (index == 0 || index == 5) {
						url && this.tui.href(url)
					} else {
						uni.switchTab({
							url: url
						})
					}
				}
			},
			coupon() {
				this.tui.href( '/pages/index/coupon/coupon', true)
			},
			onShare() {
				this.hideSharePopup()
				// #ifdef H5
				thorui.getClipboardData('https://thorui.cn/doc', res => {
					if (res) {
						this.tui.toast('链接复制成功，赶快去分享吧~');
					} else {
						this.tui.toast('链接复制失败');
					}
				});
				// #endif
			},
			shop() {
				uni.navigateTo({
					url: '/pages/tabbar/index/index'
				});
			},
			play(url) {
				uni.navigateTo({
					url: '/pages/index/video/video?videoUrl=' + url + '&currentTime=' + this.currentTime,
					animationType: 'zoom-out'
				})
			},
			showSharePopup(){
				this.sharePopup = true
			},
			hideSharePopup() {
				this.sharePopup = false
			},
			async createPoster() {
				this.hideSharePopup()
				if (this.posterImg) {
					this.modalShow = true;
					return;
				}
				uni.showLoading({
					mask: true,
					title: '图片生成中...'
				});
				let mainPic = await poster.getImage(this.goodsDetail.defaultImageUrl);
				let qrcode = await poster.getImage(this.$store.state.qrcode);
				// #ifdef MP-WEIXIN
				await poster.removeSavedFile();
				// #endif
				if (mainPic && qrcode) {
					const imgs = {
						mainPic: mainPic,
						qrcode: qrcode
					};
					poster.drawGoodsPoster('posterId', this.winWidth, this.winHeight, imgs,
					    this.goodsDetail.title, this.goodsDetail.price, this.goodsDetail.originalPrice, 'ThorUI示例小程序',
						res => {
							uni.hideLoading();
							if (res) {
								this.posterImg = res;
								setTimeout(() => {
									this.modalShow = true;
								}, 60);
							} else {
								this.tui.toast('生成海报失败,请稍后再试');
							}
						});
				} else {
					uni.hideLoading();
					this.tui.toast('生成海报图片下载失败,请稍后再试');
				}
			},
			hideModal() {
				this.modalShow = false;
			},
			savePic() {
				if (this.posterImg) {
					// #ifdef H5
					uni.previewImage({
						urls: [this.posterImg]
					});
					// #endif

					// #ifndef H5
					poster.saveImage(this.posterImg);
					// #endif

					this.hideModal();
				}
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
	.container {
		padding-bottom: 110rpx;
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
		font-size: 14px;
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
		.tui-badge {
			background: #e41f19 !important;
			position: absolute;
			right: -4px;
		}
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
		overflow: hidden;
	}
	.tui-swiper {
		position: absolute;
		width: 100%;
		top: 0;
	}
	.swiper-video {
		video {
			width: 100%;
		}
		/* 自定义按钮 */
		.video-img {
			display: inline-block;
			width: 80upx;
			height: 80upx;
			position: absolute;
			bottom: 0;
			left: 50%;
			top: 50%;
			transform: translateX(-50%) translateY(-50%);
			image {
				width: 80upx;
				height: 80upx;
				z-index: 999;
				opacity: 0.5;
			}
		}

	}
	
	.tui-video-slider{
		position: absolute;
		bottom: -4px;
	}

	.tui-banner-tag {
		position: absolute;
		color: #fff;
		bottom: 30rpx;
		right: 15rpx;
	}
	.tui-video-voice {
		position: absolute;
		color: #fff;
		bottom: 100rpx;
		right: 15rpx;
		image {
			width: 38rpx;
			height: 38rpx;
			z-index: 999;
		}
	}

	.tui-slide-image {
		width: 100%;
		display: block;
	}
	.tui-selected-box {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 300rpx;
	}

	/*顶部菜单*/

	.tui-menu-box {
		box-sizing: border-box;
	}

	.tui-menu-header {
		font-size: 34rpx;
		color: #fff;
		height: 32px;
		display: flex;
		align-items: center;
	}

	.tui-menu-itembox {
		color: #fff;
		padding: 40rpx 10rpx 0 10rpx;
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		font-size: 26rpx;
	}

	.tui-menu-item {
		width: 22%;
		height: 160rpx;
		border-radius: 24rpx;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		background: rgba(0, 0, 0, 0.4);
		margin-right: 4%;
		margin-bottom: 4%;
	}

	.tui-menu-item:nth-of-type(4n) {
		margin-right: 0;
	}

	.tui-badge-box {
		position: relative;
	}

	.tui-badge-box .tui-badge-class {
		position: absolute;
		top: -8px;
		right: -8px;
	}

	.tui-msg-badge {
		top: -10px;
	}

	.tui-icon-up_box {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-menu-text {
		padding-top: 12rpx;
	}

	.tui-opcity .tui-menu-text,
	.tui-opcity .tui-badge-box {
		opacity: 0.5;
		transition: opacity 0.2s ease-in-out;
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

	.tui-icon-red {
		color: #ff201f;
	}

	.tui-border-radius {
		border-bottom-left-radius: 24rpx;
		border-bottom-right-radius: 24rpx;
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
		padding: 30rpx 0;
	}

	.tui-pro-pricebox {
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #ff201f;
		font-size: 36rpx;
		line-height: 44rpx;
	}

	.tui-pro-price {
		display: flex;
		font-weight: 600;
		align-items: center;
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

	.tui-collection {
		color: #333;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		height: 44rpx;
	}

	.tui-scale-collection {
		transform: scale(0.7);
		transform-origin: center 90%;
		line-height: 24rpx;
		font-weight: normal;
		margin-top: 4rpx;
	}

	.tui-pro-titbox {
		font-size: 32rpx;
		font-weight: 500;
		position: relative;
		padding: 0 150rpx 0 30rpx;
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
	}

	.tui-share-text {
		padding-left: 8rpx;
	}

	.tui-sub-title {
		padding: 20rpx 0 0;
		line-height: 32rpx;
	}

	.tui-discount-box {
		background: #fff;
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

	.tui-list-cell::after {
		content: '';
		position: absolute;
		// border-bottom: 1rpx solid #eaeef1;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		bottom: 0;
		right: 0;
		left: 126rpx;
	}

	.tui-cell-notice{
		color: #888;
		font-size: 22rpx;
		margin-right: -4rpx;
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
		flex-shrink: 0;
	}
    .tui-cell-title text {
		font-size: 26rpx;
		margin-left: 6rpx;
	}

	.tui-promotion-box {
		display: flex;
		align-items: center;
		padding: 10rpx 0;
		width: 80%;
	}

	.tui-promotion-box text {
		width: 70%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
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
		padding: 20rpx 0rpx 30rpx 30rpx;
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

	.tui-cmt-box {
		background: #fff;
	}

	.tui-between {
		justify-content: space-between !important;
	}

	.tui-cmt-all {
		color: #ff201f;
	}
	.tui-cmt-content {
		font-size: 26rpx;
		padding-bottom: 30rpx;
	}
	.tui-cmt-user {
		display: flex;
		align-items: center;
	}

	.tui-avatar {
		width: 60rpx;
		height: 60rpx;
		border-radius: 30rpx;
		display: block;
	}
	.tui-nickname {
		margin-left: 5rpx;
		font-size: 22rpx;
	}
	.tui-cmt {
		font-size: 24rpx;
		padding: 14rpx 0;
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

	.tui-operation-right {
		height: 100rpx;
		padding: 0 12rpx;
		box-sizing: border-box;
	}

	.tui-right-flex {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-flex-1 {
		flex: 1;
		padding: 6rpx;
	}

	/*底部操作栏*/

	/*底部选择弹层*/

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
			margin: 0 10rpx;
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
		.tui-popup-btn {
			width: 100%;
			position: absolute;
			left: 0;
			bottom: 0;
		}
	}
	.tui-popup-scroll {
		max-height: 600rpx;
		font-size: 26rpx;
		.tui-scrollview-box {
			padding: 0 30rpx 60rpx 30rpx;
			box-sizing: border-box;
		}

	}
	/*底部选择弹层*/

	/*分享弹层*/
	.tui-share__box {
		width: 100%;
		height: 380rpx;
		background-color: #fff;
	}

	.tui-share__header {
		padding: 40rpx 0;
		text-align: center;
		font-size: 32rpx;
		font-weight: 500;
		color: #333333;
		text-align: center;
		position: relative;
	}

	.tui-close__box {
		position: absolute;
		right: 25rpx;
		top: 25rpx;
	}
	.tui-share__list{
		width: 100%;
		padding-top: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.tui-share__item{
		flex: 1;
		display: flex;
		align-items: center;
		flex-direction: column;
	}
	.tui-share__item image{
		width: 120rpx;
		height: 120rpx;
	}
	.tui-share__text{
		font-size: 28rpx;
		font-weight: 400;
		color: #333333;
		padding-top: 18rpx;
	}

	/*海报modal弹层*/
	.tui-poster__canvas {
		background-color: #fff;
		position: absolute;
		left: -9999px;
	}

	.tui-poster__box {
		width: 100%;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	.tui-close__img {
		width: 48rpx;
		height: 48rpx;
		position: absolute;
		right: 0;
		top: -60rpx;
	}

	.tui-poster__img {
		width: 560rpx;
		height: 890rpx;
		border-radius: 20rpx;
		margin-bottom: 40rpx;
	}

	.tui-share__tips {
		font-size: 24rpx;
		transform: scale(0.8);
		transform-origin: center center;
		color: #ffffff;
		padding-top: 12rpx;
	}
</style>
