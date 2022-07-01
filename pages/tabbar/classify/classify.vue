<template>
	<view class="container">
		<view class="tui-searchbox">
			<view class="tui-search-input" @tap="search">
				<icon type="search" :size="13" color="#999"></icon>
				<text class="tui-search-text">请输入关键词</text>
			</view>
		</view>

		<scroll-view
			scroll-y
			:scroll-with-animation="isTap"
			scroll-anchoring
			class="tab-view"
			:scroll-into-view="scrollView_leftId"
			:style="{ height: height + 'px', top: top + 'px' }"
		>
			<view
				:id="`left_${index}`"
				v-for="(item, index) in goodsGroup"
				:key="index"
				class="tab-bar-item"
				:class="[currentTab == index ? 'active' : '']"
				:data-current="index"
				@tap.stop="swichNav"
			>
				<text>{{ item.name}}</text>
			</view>
		</scroll-view>
		<scroll-view
			@scroll="scroll"
			scroll-anchoring
			scroll-y
			scroll-with-animation
			class="right-box"
			:scroll-into-view="scrollView_rightId"
			:style="{ height: height + 'px', top: top + 'px' }"
		>
			<!--内容部分 start 自定义可删除-->
			<block v-for="(item, index) in goodsGroup" :key="index">
				<t-linkage :distanceTop="distanceTop" :recalc="1" :scrollTop="scrollTop" :index="index" @linkage="linkage">
					<view class="page-view" :id="`right_${index}`">
						<view class="class-box">
							<view class="class-item">
								<view class="class-name">{{ item.name }}</view>
								<view class="g-container">
									<view class="g-box" @tap.stop="detail(goods)" v-for="(goods, i) in item.goodsList" :key="i">
										<image :src=goods.defaultImageUrl class="g-image" />
										<view class="g-title">{{goods.title}}</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</t-linkage>
			</block>
			<!--内容部分 end 自定义可删除-->
		</scroll-view>
	</view>
</template>

<script>
import tLinkage from '@/components/views/t-linkage/t-linkage';
export default {
	components: {
		tLinkage
	},
	data() {
		return {
			height: 0, //scroll-view高度
			top: 0,
			currentTab: 0, //预设当前项的值
			scrollView_leftId: 'left_0',
			scrollView_rightId: 'right_0',
			scrollTop: 0,
			distanceTop: uni.upx2px(92),
			isScroll: true,
			isTap: true
		};
	},
	onLoad: function(options) {
		if(options.groupName){
			let cur = this.goodsGroup.findIndex((o)=>{return o.name===options.groupName})
			this.currentTab = cur;
			this.checkCor();
		}
		setTimeout(() => {
			uni.getSystemInfo({
				success: res => {
					let header = 92;
					let top = 0;
					//#ifdef H5
					top = 44;
					//#endif
					this.height = res.windowHeight - uni.upx2px(header);
					this.top = top + uni.upx2px(header);
				}
			});
		}, 50);
	},
	computed: {
		goodsGroup() {
			return this.$store.state.goodsGroup
		}
	},
	methods: {
		// 点击标题切换当前页时改变样式
		swichNav: function(e) {
			let cur = e.currentTarget.dataset.current;
			if (this.currentTab == cur) {
				return false;
			} else {
				this.currentTab = cur;
				this.checkCor();
			}
		},
		//判断当前滚动超过一屏时，设置tab标题滚动条。
		checkCor: function(isScroll) {
			if (!isScroll) {
				this.isScroll = false;
				this.isTap = true;
				if (this.currentTab > 6) {
					this.scrollView_leftId = `left_${this.currentTab - 2}`;
				} else {
					this.scrollView_leftId = `left_0`;
				}
				this.scrollView_rightId = `right_${this.currentTab}`;
			} else {
				this.scrollView_leftId = `left_${this.currentTab}`;
			}
		},
		detail(item){
			uni.navigateTo({
				url: '/pages/index/productDetail/productDetail?spu_id=' + item.spu_id + '&sku_id=' + item.id
			})
		},
		search: function() {
			uni.navigateTo({
				url: '/pages/common/search/search'
			});
		},
		scroll(e) {
			//动画时长固定300ms
			if (!this.isScroll) {
				setTimeout(() => {
					this.isScroll = true;
				}, 150);
			} else {
				this.scrollTop = e.detail.scrollTop;
			}
		},
		linkage(e) {
			if (e.isLinkage && e.index != this.currentTab) {
				this.isTap = false;
				this.currentTab = e.index;
				this.checkCor(true);
			}
		}
	}
};
</script>

<style>
page {
	background-color: #fcfcfc;
}

/* 左侧导航布局 start*/

.tui-searchbox {
	width: 100%;
	height: 92rpx;
	padding: 0 30rpx;
	box-sizing: border-box;
	background-color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	position: fixed;
	left: 0;
	top: 0;
	/* #ifdef H5 */
	top: 44px;
	/* #endif */
	z-index: 100;
}

.tui-searchbox::after {
	content: '';
	position: absolute;
	border-bottom: 1rpx solid #d2d2d2;
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	bottom: 0;
	right: 0;
	left: 0;
}

.tui-search-input {
	width: 100%;
	height: 60rpx;
	background: #f1f1f1;
	border-radius: 30rpx;
	font-size: 26rpx;
	color: #999;
	display: flex;
	align-items: center;
	justify-content: center;
}

.tui-search-text {
	padding-left: 16rpx;
}

.tab-view {
	/* height: 100%; */
	width: 200rpx;
	position: fixed;
	left: 0;
	z-index: 10;
	background: #f6f6f6;
}

.tab-bar-item {
	width: 200rpx;
	height: 110rpx;
	background: #f6f6f6;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	color: #444;
	font-weight: 400;
}

.active {
	position: relative;
	color: #000;
	font-size: 32rpx;
	font-weight: 600;
	background: #fcfcfc;
}

.active::before {
	content: '';
	position: absolute;
	border-left: 8rpx solid #e41f19;
	height: 30rpx;
	left: 0;
}

/* 左侧导航布局 end*/

.right-box {
	width: 100%;
	position: fixed;
	padding-left: 220rpx;
	box-sizing: border-box;
	left: 0;
}

.page-view {
	width: 100%;
	overflow: hidden;
	padding-top: 20rpx;
	padding-right: 20rpx;
	box-sizing: border-box;
	/* padding-bottom: env(safe-area-inset-bottom); */
}

.class-item {
	background: #fff;
	width: 100%;
	box-sizing: border-box;
	padding: 20rpx;
	/* margin-bottom: 20rpx; */
	border-radius: 12rpx;
}

.class-name {
	font-size: 28rpx;
	font-weight: bold;
}

.g-container {
	/* padding-top: 20rpx; */
	display: flex;
	display: -webkit-flex;
	justify-content: flex-start;
	flex-direction: row;
	flex-wrap: wrap;
}

.g-box {
	width: 33.3333%;
	text-align: center;
	padding-top: 40rpx;
}

.g-image {
	width: 130rpx;
	height: 130rpx;
	border-radius: 10rpx;
}

.g-title {
	font-size: 24rpx;
	text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    word-break: break-all;
    -webkit-line-clamp: 2;
}
</style>
