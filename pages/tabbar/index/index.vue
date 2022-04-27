<template>
	<view class="container">
		<!--header-->
		<view class="tui-header" :style="{opacity:opacity}">
			<!-- <view class="tui-category" hover-class="opcity" :hover-stay-time="150" @tap="classify">
				<tui-icon name="manage-fill" color="#fff" :size="44" unit="rpx"></tui-icon>
				<view class="tui-category-scale">分类</view>
			</view> -->
			<view class="tui-rolling-search">
				<tui-icon name="search-2" :size="32" unit="rpx"></tui-icon>
				<swiper vertical autoplay circular interval="8000" class="tui-swiper">
					<swiper-item v-for="(item, index) in hotSearch" :key="index" class="tui-swiper-item" @tap="search">
						<view class="tui-hot-item">{{ item }}</view>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<!--header-->
		<view class="tui-header-banner">
			<view class="tui-hot-search">
				<view>热搜</view>
				<view class="tui-hot-tag" @tap="search">自热火锅</view>
				<view class="tui-hot-tag" @tap="search">华为手机</view>
				<view class="tui-hot-tag" @tap="search">有机酸奶</view>
				<view class="tui-hot-tag" @tap="search">苹果手机</view>
			</view>
			<view class="tui-banner-bg">
				<view class="tui-primary-bg tui-route-left"></view>
				<view class="tui-primary-bg tui-route-right"></view>
				<!--banner-->
				<view class="tui-banner-box">
					<swiper :indicator-dots="true" :autoplay="true" :interval="5000" :duration="150" class="tui-banner-swiper"
					 :circular="true" indicator-color="rgba(255, 255, 255, 0.8)" indicator-active-color="#fff">
						<swiper-item v-for="(item, index) in banner" :key="index" @tap.stop="detail">
							<image :src="'https://thorui.cn/images/mall/banner/' + item" class="tui-slide-image" mode="scaleToFill" />
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>

		<view class="tui-product-category">
			<view class="tui-category-item" v-for="(item, index) in category" :key="index" :data-key="item.name" @tap="more">
				<image :src="'https://thorui.cn/images/mall/category/' + item.img" class="tui-category-img" mode="scaleToFill"></image>
				<view class="tui-category-name">{{ item.name }}</view>
			</view>
		</view>
		<image src="https://thorui.cn/images/mall/activity/img_coupon_banner.png" class="tui-img__coupon" @tap="coupon"></image>
		<view class="tui-product-box">
			
			<!--超值拼团-->
			<view class="tui-block__box tui-mtop__20">
				<view class="tui-group-name">
					<view>
						<text>超值拼团</text>
						<text class="tui-sub__desc tui-color__pink">拼着买更便宜</text>
					</view>
					<view class="tui-more__box" @tap="group(1)">
						<text>更多</text>
						<tui-icon name="arrowright" :size="36" unit="rpx" color="#999"></tui-icon>
					</view>
				</view>
				<scroll-view scroll-x>
					<view class="tui-goods__list">
						<view class="tui-goods__item" @tap="group(2)" v-for="(item, index) in 8" :key="index">
							<view class="tui-goods__imgbox">
								<image :src="`https://system.chuangbiying.com/static/images/product/${index % 2 == 0 ? 55 : 44}.jpg`" mode="widthFix" class="tui-goods__img"></image>
							</view>
							<view class="tui-pri__box">
								<view class="tui-sale-pri">
									<view class="tui-size-sm">¥</view>
									<view>298</view>
									<view class="tui-size-sm">.50</view>
								</view>
							</view>
							<view class="tui-original__pri">¥399.00</view>
						</view>
					</view>
				</scroll-view>
			</view>

			<!--排行榜-->
			<view class="tui-block__box tui-mtop__20">
				<view class="tui-group-name" @tap="more">
					<view>
						<text>排行榜</text>
						<text class="tui-sub__desc">大家都在买</text>
					</view>
					<view class="tui-more__box">
						<text>更多</text>
						<tui-icon name="arrowright" :size="36" unit="rpx" color="#999"></tui-icon>
					</view>
				</view>
				<view class="tui-new-box">
					<view class="tui-new-item" :class="[index != 0 && index != 1 ? 'tui-new-mtop' : '']" v-for="(item, index) in newProduct"
					 :key="index" @tap="detail(index)">
						<image :src="'https://system.chuangbiying.com/static/images/mall/new/' + (item.type == 1 ? 'new' : 'discount') + '.png'" class="tui-new-label"
						 v-if="item.isLabel"></image>
						<view class="tui-title-box">
							<view class="tui-new-title">{{ item.name }}</view>
							<view class="tui-new-price">
								<text class="tui-new-present">￥{{ item.present }}</text>
								<text class="tui-new-original">￥{{ item.original }}</text>
							</view>
						</view>
						<image :src="'https://system.chuangbiying.com/static/images/mall/new/' + item.pic" class="tui-new-img"></image>
					</view>
				</view>
			</view>
		</view>

		<view class="tui-product-box">
			<view class="tui-title__img">
				<image src="https://thorui.cn/images/mall/img_home_update_3x.png" mode="widthFix"></image>
			</view>
			<view class="tui-product-list">
				<view class="tui-product-container">
					<block v-for="(item, index) in productList" :key="index">
						<!--商品列表-->
						<view class="tui-pro-item" hover-class="hover" :hover-start-time="150" @tap="detail(item.spu_id)" v-if="(index + 1) % 2 != 0">
							<image :src="item.defaultImageUrl" class="tui-pro-img" mode="widthFix" />
							<view class="tui-pro-content">
								<view class="tui-pro-tit">{{ item.title }}</view>
								<view>
									<view class="tui-pro-price">
										<text class="tui-sale-price">￥{{ item.price.split('.')[0] }}</text>
										<text class="tui-size-24">.{{ item.price.split('.')[1]}}</text>
										<text class="tui-factory-price">￥{{ item.originalPrice }}</text>
									</view>
									<view class="tui-pro-pay">{{ item.salesNum }}人付款</view>
								</view>
							</view>
						</view>
						<!--商品列表-->
						<!-- <template is="productItem" data="{{item,index:index}}" /> -->
					</block>
				</view>
				<view class="tui-product-container">
					<block v-for="(item, index) in productList" :key="index">
						<!--商品列表-->
						<view class="tui-pro-item" hover-class="hover" :hover-start-time="150" @tap="detail(item.spu_id)" v-if="(index + 1) % 2 == 0">
							<image :src="item.defaultImageUrl" class="tui-pro-img" mode="widthFix" />
							<view class="tui-pro-content">
								<view class="tui-pro-tit">{{ item.title }}</view>
								<view class="tui-pro-price">
									<text class="tui-sale-price">￥{{ item.price.split('.')[0] }}</text>
									<text class="tui-size-24">.{{ item.price.split('.')[1]}}</text>
									<text class="tui-factory-price">￥{{ item.originalPrice }}</text>
								</view>
								<view class="tui-pro-pay">{{ item.salesNum }}人付款</view>
							</view>
						</view>
						<!--商品列表-->
					</block>
				</view>
			</view>
		</view>

		<!--加载loadding-->
		<tui-loadmore v-if="loadding" :index="3" type="red"></tui-loadmore>
		<!-- <tui-nomore v-if="!pullUpOn"></tui-nomore> -->
		<!--加载loadding-->
		<view class="tui-safearea-bottom"></view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				hotSearch: [],
				banner: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg'],
				category: [{
						img: '1.png',
						name: '短袖T恤'
					},
					{
						img: '2.png',
						name: '足球'
					},
					{
						img: '3.png',
						name: '运动鞋'
					},
					{
						img: '4.png',
						name: '中老年'
					},
					{
						img: '5.png',
						name: '甜美风'
					},
					{
						img: '6.png',
						name: '鱼尾裙'
					},
					{
						img: '7.png',
						name: '相机配件'
					},
					{
						img: '8.png',
						name: '护肤套装'
					},
					{
						img: '9.png',
						name: '单肩包'
					},
					{
						img: '10.png',
						name: '卫衣'
					}
				],
				newProduct: [{
						name: '时尚舒适公主裙高街修身长裙',
						present: 198,
						original: 298,
						pic: '1.jpg',
						type: 1,
						isLabel: true
					},
					{
						name: '高街修身雪纺衫',
						present: 398,
						original: 598,
						pic: '2.jpg',
						type: 2,
						isLabel: true
					},
					{
						name: '轻奢商务上衣',
						present: 99,
						original: 199,
						pic: '3.jpg',
						type: 1,
						isLabel: true
					},
					{
						name: '品质牛皮婚鞋牛皮婚鞋品质就是好',
						present: 99,
						original: 199,
						pic: '5.jpg',
						type: 1,
						isLabel: true
					},
					{
						name: '轻奢时尚大包限时新品推荐',
						present: 99,
						original: 199,
						pic: '6.jpg',
						type: 1,
						isLabel: false
					},
					{
						name: '高街修身长裙',
						present: 999,
						original: 1299,
						pic: '4.jpg',
						type: 2,
						isLabel: true
					}
				],
				productList: [],
				pageIndex: 1,
				loadding: false,
				pullUpOn: true,
				appid: '',
				opacity: 1
			};
		},
		onLoad(){
			setTimeout(() => {
				this.skeletonShow = false
				uni.getSystemInfo({
					success: res => {
						this.width = res.windowWidth;
						this.$store.commit('setWidth', this.width)
					}
				});
			}, 1800);
			this.appid = this.$store.state.appid
			let url = '/getStoreSpu/' + this.appid
			this.tui.request(url).then(res=>{
				if (res.code==='0'){
					res.skuList.forEach(
						sku=>{
							this.productList.push(sku.data[0])
						}
					)
					this.$store.commit('setGoodsList', res.skuList)
				}
			})
			this.hotSearch = uni.getStorageSync('hotKeys') || []
		},
		methods: {
			detail(spu_id) {
				uni.navigateTo({
					url: '/pages/index/productDetail/productDetail?spu_id=' + spu_id
				});
			},
			coupon() {
				uni.navigateTo({
					url: '/pages/index/coupon/coupon'
				});
			},
			classify: function() {
				uni.switchTab({
					url:'../classify/classify'
				});
			},
			more: function(e) {
				let key = e.currentTarget.dataset.key || '';
				uni.navigateTo({
					url: '/pages/index/productList/productList?searchKey=' + key
				});
			},
			search: function() {
				uni.navigateTo({
					url: '/pages/common/search/search'
				});
			},
			seckill(type) {
				let url = type == 1 ? '/pages/index/seckillList/seckillList' : '/pages/index/seckillDetail/seckillDetail';
				this.tui.href(url);
			},
			group(type) {
				let url = type == 1 ? '/pages/index/groupList/groupList' : '/pages/index/groupDetail/groupDetail';
				this.tui.href(url);
			}
		},
		onPullDownRefresh: function() {
			let loadData = JSON.parse(JSON.stringify(this.productList));
			loadData = loadData.splice(0, 10);
			this.productList = loadData;
			this.pageIndex = 1;
			this.pullUpOn = true;
			this.loadding = false;
			uni.stopPullDownRefresh();
		},
		onReachBottom: function() {
			if (!this.pullUpOn) return;
			this.loadding = true;
			if (this.pageIndex == 4) {
				this.loadding = false;
				this.pullUpOn = false;
			} else {
				// let loadData = JSON.parse(JSON.stringify(this.productList));
				// loadData = loadData.splice(0, 10);
				// if (this.pageIndex == 1) {
				// 	loadData = loadData.reverse();
				// }
				// this.productList = this.productList.concat(loadData);
				this.pageIndex = this.pageIndex + 1;
				this.loadding = false;
			}
		},
		onPageScroll(e) {
			// #ifdef APP-PLUS
			let scrollTop = e.scrollTop;
			if (scrollTop < 0) {
				if (this.opacity > 0)
					this.opacity = 1 - Math.abs(scrollTop) / 30;
			} else {
				this.opacity = 1
			}
			// #endif
		}
	};
</script>

<style>
	page {
		background-color: #f7f7f7;
	}
	.container {
		padding-bottom: 100rpx;
		color: #333;
	}

	.tui-header {
		width: 100%;
		height: 100rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
		background-color: #e41f19;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: fixed;
		left: 0;
		top: 0;
		/* #ifdef H5 */
		top: 44px;
		/* #endif */
		z-index: 999;
		transition: opacity .4s;
	}

	.tui-rolling-search {
		width: 100%;
		height: 60rpx;
		border-radius: 35rpx;
		padding: 0 40rpx 0 30rpx;
		box-sizing: border-box;
		background-color: #fff;
		display: flex;
		align-items: center;
		flex-wrap: nowrap;
		color: #999;
	}

	.tui-category {
		font-size: 24rpx;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		margin: 0;
		margin-right: 22rpx;
		flex-shrink: 0;
	}

	.tui-category-scale {
		transform: scale(0.7);
		line-height: 24rpx;
	}

	.tui-icon-category {
		line-height: 20px !important;
		margin-bottom: 0 !important;
	}

	.tui-swiper {
		font-size: 26rpx;
		height: 60rpx;
		flex: 1;
		padding-left: 12rpx;
	}

	.tui-swiper-item {
		display: flex;
		align-items: center;
	}

	.tui-hot-item {
		line-height: 26rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.tui-header-banner {
		padding-top: 100rpx;
		box-sizing: border-box;
		background: #e41f19;
	}

	.tui-hot-search {
		color: #fff;
		font-size: 24rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20rpx;
		box-sizing: border-box;
		position: relative;
		z-index: 2;
	}

	.tui-hot-tag {
		background-color: rgba(255, 255, 255, 0.15);
		padding: 10rpx 24rpx;
		border-radius: 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 24rpx;
	}

	.tui-banner-bg {
		display: flex;
		height: 180rpx;
		background-color: #e41f19;
		position: relative;
	}

	.tui-primary-bg {
		width: 50%;
		display: inline-block;
		height: 224rpx;
		border: 1px solid transparent;
		position: relative;
		z-index: 1;
		background-color: #e41f19;
	}

	.tui-route-left {
		transform: skewY(8deg);
	}

	.tui-route-right {
		transform: skewY(-8deg);
	}

	.tui-banner-box {
		width: 100%;
		padding: 0 20rpx;
		box-sizing: border-box;
		position: absolute;
		/* overflow: hidden; */
		z-index: 99;
		bottom: -80rpx;
		left: 0;
	}

	.tui-banner-swiper {
		width: 100%;
		height: 240rpx;
		border-radius: 20rpx;
		overflow: hidden;
		transform: translateY(0);
		background-color: #f8f8f8;
	}

	.tui-slide-image {
		width: 100%;
		height: 240rpx;
		display: block;
	}

	/* #ifdef MP-WEIXIN */
	.tui-banner-swiper .wx-swiper-dot {
		width: 8rpx;
		height: 8rpx;
		display: inline-flex;
		background: none;
		justify-content: space-between;
	}

	.tui-banner-swiper .wx-swiper-dot::before {
		content: '';
		flex-grow: 1;
		background-color: rgba(255, 255, 255, 0.8);
		border-radius: 16rpx;
		overflow: hidden;
	}

	.tui-banner-swiper .wx-swiper-dot-active::before {
		background-color: #fff;
	}

	.tui-banner-swiper .wx-swiper-dot.wx-swiper-dot-active {
		width: 16rpx;
	}

	/* #endif */

	/* #ifndef MP-WEIXIN */
	>>>.tui-banner-swiper .uni-swiper-dot {
		width: 8rpx;
		height: 8rpx;
		display: inline-flex;
		background-color: none;
		justify-content: space-between;
	}

	>>>.tui-banner-swiper .uni-swiper-dot::before {
		content: '';
		flex-grow: 1;
		background-color: rgba(255, 255, 255, 0.8);
		border-radius: 16rpx;
		overflow: hidden;
	}

	>>>.tui-banner-swiper .uni-swiper-dot-active::before {
		background-color: #fff;
	}

	>>>.tui-banner-swiper .uni-swiper-dot.uni-swiper-dot-active {
		width: 16rpx;
	}

	/* #endif */

	.tui-product-category {
		padding: 80rpx 20rpx 30rpx 20rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		font-size: 24rpx;
		color: #555;
		/* margin-bottom: 20rpx; */
	}

	.tui-category-item {
		width: 20%;
		height: 118rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-direction: column;
		padding-top: 30rpx;
	}

	.tui-category-img {
		height: 80rpx;
		width: 80rpx;
		display: block;
	}

	.tui-category-name {
		line-height: 24rpx;
	}

	.tui-block__box {
		width: 100%;
		padding: 0 25rpx 25rpx;
		box-sizing: border-box;
		background-color: #ffffff;
		border-radius: 20rpx;
		overflow: hidden;
	}

	.tui-product-box {
		margin-top: 20rpx;
		padding: 0 25rpx;
		box-sizing: border-box;
	}

	.tui-img__coupon {
		width: 100%;
		height: 184rpx;
		display: block;
	}

	.tui-mtop__20 {
		margin-top: 20rpx;
	}

	.tui-bg-white {
		background-color: #fff;
	}

	.tui-group-name {
		width: 100%;
		font-size: 34rpx;
		line-height: 34rpx;
		font-weight: bold;
		text-align: center;
		padding: 30rpx 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #333;
	}

	.tui-sub__desc {
		color: #34c7a9;
		font-size: 28rpx;
		font-weight: 400;
		padding-left: 25rpx;
	}

	.tui-color__pink {
		color: #EF1346;
	}

	.tui-seckill__box {
		display: flex;
		align-items: center;
	}

	.tui-seckill__img {
		width: 160rpx;
		height: 34rpx;
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

	/*秒杀商品*/
	.tui-goods__list {
		display: flex;
		align-items: center;
	}

	.tui-goods__item {
		background-color: #fff;
		width: 150rpx;
		height: 230rpx;
		border-radius: 6rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		flex-shrink: 0;
		margin-right: 18rpx;
	}

	.tui-goods__imgbox {
		width: 150rpx;
		height: 150rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
	}

	.tui-goods__img {
		max-width: 150rpx;
		max-height: 150rpx;
		display: block;
	}

	.tui-pri__box {
		max-width: 150rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.tui-sale-pri {
		display: flex;
		align-items: flex-end;
		padding: 10rpx 0 8rpx;
		box-sizing: border-box;
		font-size: 28rpx;
		line-height: 28rpx;
		color: #eb0909;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.tui-size-sm {
		font-size: 24rpx;
		line-height: 24rpx;
		transform: scale(0.8);
		transform-origin: 0 50%;
	}

	.tui-original__pri {
		font-size: 24rpx;
		line-height: 24rpx;
		color: #999999;
		transform-origin: center 10%;
		transform: scale(0.8);
		display: flex;
		align-items: center;
		justify-content: center;
		text-decoration: line-through;
	}

	/*秒杀商品*/

	.tui-more__box {
		display: flex;
		align-items: center;
		font-weight: 400;
		color: #999;
	}

	.tui-more__box text {
		font-size: 24rpx;
		line-height: 24rpx;
	}

	.tui-new-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.tui-new-item {
		width: 49%;
		height: 180rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		background: #f5f2f9;
		position: relative;
		border-radius: 12rpx;
	}

	.tui-new-mtop {
		margin-top: 2%;
	}

	.tui-title-box {
		font-size: 24rpx;
	}

	.tui-new-title {
		font-size: 26rpx;
		line-height: 32rpx;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.tui-new-price {
		padding-top: 18rpx;
	}

	.tui-new-present {
		color: #ff201f;
		font-weight: bold;
	}

	.tui-new-original {
		display: inline-block;
		color: #a0a0a0;
		text-decoration: line-through;
		padding-left: 12rpx;
		transform: scale(0.8);
		transform-origin: center center;
	}

	.tui-new-img {
		width: 148rpx;
		height: 148rpx;
		display: block;
		flex-shrink: 0;
	}

	.tui-new-label {
		width: 56rpx;
		height: 56rpx;
		border-top-left-radius: 12rpx;
		position: absolute;
		left: 0;
		top: 0;
	}

	.tui-title__img {
		width: 100%;
		padding: 30rpx 0;
		display: flex;
		justify-content: center;
	}

	.tui-title__img image {
		width: 352rpx;
		height: 32rpx;
	}

	.tui-product-list {
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		flex-wrap: wrap;
		box-sizing: border-box;
		/* padding-top: 20rpx; */
	}

	.tui-product-container {
		flex: 1;
		margin-right: 2%;
	}

	.tui-product-container:last-child {
		margin-right: 0;
	}

	.tui-pro-item {
		width: 100%;
		margin-bottom: 4%;
		background: #fff;
		box-sizing: border-box;
		border-radius: 12rpx;
		overflow: hidden;
	}

	.tui-pro-img {
		width: 100%;
		display: block;
	}

	.tui-pro-content {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 20rpx;
	}

	.tui-pro-tit {
		color: #2e2e2e;
		font-size: 26rpx;
		line-height: 32rpx;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.tui-pro-price {
		padding-top: 18rpx;
	}
    .tui-size-24 {
		font-size: 24rpx;
		font-weight: 500;
		color: #e41f19;
	}
	.tui-sale-price {
		font-size: 34rpx;
		font-weight: 500;
		color: #e41f19;
	}

	.tui-factory-price {
		font-size: 24rpx;
		color: #a0a0a0;
		text-decoration: line-through;
		padding-left: 12rpx;
	}

	.tui-pro-pay {
		padding-top: 10rpx;
		font-size: 24rpx;
		color: #656565;
	}
</style>
