<template>
	<view class="container">
		<!--screen-->
		<view class="tui-header-screen">
			<view class="tui-search__bar">
				<view class="tui-searchbox" @tap="search">
					<icon type="search" :size="13" color="#999"></icon>
					<text class="tui-search-text">请输入搜索关键词</text>
				</view>
			</view>
			<view class="tui-screen__box">
				<view class="tui-screen-item" :class="[tabIndex == -1 ? 'tui-active tui-bold' : '']" @tap="screen" data-index="-1">综合</view>
				<view class="tui-screen-item" :class="[tabIndex == 0 ? 'tui-active tui-bold' : '']" data-index="0" @tap="screen">
					<view>价格</view>
					<tui-icon :name="selectH > 0 ? 'arrowup' : 'arrowdown'" :size="14" :color="tabIndex == 0 ? '#e41f19' : '#444'"></tui-icon>
				</view>
				<view class="tui-screen-item" :class="[tabIndex == 1 ? 'tui-active tui-bold' : '']" @tap="screen" data-index="1">销量</view>
				<view class="tui-screen-item" @tap="screen" data-index="2">
					<tui-icon :name="isList ? 'manage' : 'listview'" :size="isList ? 22 : 18" :bold="isList ? false : true" color="#333"></tui-icon>
				</view>
				<view class="tui-screen-item" @tap="screen" data-index="3">
					<text>筛选</text>
					<tui-icon name="screen" :size="12" color="#333" :bold="true"></tui-icon>
				</view>

				<!--下拉选择列表--综合-->
				<view class="tui-dropdownlist" :class="[selectH > 0 ? 'tui-dropdownlist-show' : '']" :style="{ height: selectH + 'rpx' }">
					<view class="tui-dropdownlist-item" :class="[item.selected ? 'tui-bold' : '']" v-for="(item, index) in dropdownList"
					 :key="index" @tap.stop="dropdownItem" :data-index="index">
						<text>{{ item.name }}</text>
						<tui-icon name="check" :size="16" color="#e41f19" :bold="true" v-if="item.selected"></tui-icon>
					</view>
				</view>
				<view class="tui-dropdownlist-mask" :class="[selectH > 0 ? 'tui-mask-show' : '']" @tap.stop="hideDropdownList"></view>
				<!--下拉选择列表--综合-->
			</view>
		</view>
		<!--screen-->
		<!--=======商品=======-->
		<view class="tui-product__box">
			<!--list-->
			<view class="tui-product-list">
				<view class="tui-product-container">
					<block v-for="(item, index) in productList" :key="index" v-if="(index + 1) % 2 != 0 || isList">
						<!-- <template is="productItem" data="{{item,index:index,isList:isList}}" /> -->
						<!--商品列表-->
						<view class="tui-pro-item" :class="[isList ? 'tui-flex-list' : '']" hover-class="tui-hover" :hover-start-time="150"
						 @tap="detail">
							<image :src="'https://system.chuangbiying.com/static/images/mall/product/' + item.img + '.jpg'" class="tui-pro-img" :class="[isList ? 'tui-proimg-list' : '']"
							 mode="widthFix" />
							<view class="tui-pro-content">
								<view class="tui-pro-tit">{{ item.name }}</view>
								<view>
									<view class="tui-price__box">
										<view class="tui-price">
											<view class="tui-price__small">￥</view>
											<view class="tui-price__large">{{ item.sale }}</view>
											<view class="tui-price__small">.00</view>
										</view>
										<view class="tui-price__original">￥{{ item.factory}}.00</view>
									</view>
									<view class="tui-group-text">已有{{ item.payNum }}人拼团</view>
									<view class="tui-group-btn">
										<view class="tui-flex-btn tui-color-red">2人团</view>
										<view class="tui-flex-btn">去拼团</view>
									</view>
								</view>
							</view>
						</view>
						<!--商品列表-->
					</block>
				</view>
				<view class="tui-product-container" v-if="!isList">
					<block v-for="(item, index) in productList" :key="index" v-if="(index + 1) % 2 == 0">
						<!-- <template is="productItem" data="{{item,index:index}}" /> -->
						<!--商品列表-->
						<view class="tui-pro-item" :class="[isList ? 'tui-flex-list' : '']" hover-class="tui-hover" :hover-start-time="150"
						 @tap="detail">
							<image :src="'https://system.chuangbiying.com/static/images/mall/product/' + item.img + '.jpg'" class="tui-pro-img" :class="[isList ? 'tui-proimg-list' : '']"
							 mode="widthFix" />
							<view class="tui-pro-content">
								<view class="tui-pro-tit">{{ item.name }}</view>
								<view>
									<view class="tui-price__box">
										<view class="tui-price">
											<view class="tui-price__small">￥</view>
											<view class="tui-price__large">{{ item.sale }}</view>
											<view class="tui-price__small">.00</view>
										</view>
										<view class="tui-price__original">￥{{ item.factory}}.00</view>
									</view>
									<view class="tui-group-text">已有{{ item.payNum }}人拼团</view>
									<view class="tui-group-btn">
										<view class="tui-flex-btn tui-color-red">2人团</view>
										<view class="tui-flex-btn">去拼团</view>
									</view>
								</view>
							</view>
						</view>
						<!--商品列表-->
					</block>
				</view>
			</view>

			<!--list-->
		</view>
		<!--=======商品 end=======-->


		<!--左抽屉弹层 筛选 -->
		<tui-drawer mode="right" :visible="drawer" @close="closeDrawer">
			<view class="tui-drawer-box" :style="{ height: drawerH + 'px' }">
				<scroll-view class="tui-drawer-scroll" scroll-y :style="{ height: drawerH-tabbarHeight + 'px' }">
					<view class="tui-drawer-title tui-mtop__30">
						<text class="tui-title-bold">价格区间</text>
						<view class="tui-attr-right">
							<tui-icon name="position-fill" color="#e41f19" :size="14" class="tui-location"></tui-icon>
							<text class="tui-addr-left">北京朝阳区三环到四环之间</text>
						</view>
					</view>
					<view class="tui-drawer-content">
						<input placeholder-class="tui-phcolor" class="tui-input" placeholder="最低价" maxlength="11" type="number" />
						<tui-icon name="reduce" color="#333" :size="14"></tui-icon>
						<input placeholder-class="tui-phcolor" class="tui-input" placeholder="最高价" maxlength="11" type="number" />
					</view>

					<view class="tui-drawer-title">
						<text class="tui-title-bold">全部分类</text>
						<view class="tui-all-box tui-icon-ml">
							<view class="tui-attr-right">全部</view>
							<tui-icon name="arrowdown" :size="14" color="#444"></tui-icon>
						</view>
					</view>
					<view class="tui-drawer-content tui-flex-attr">
						<view class="tui-attr-item tui-btmItem-active">
							<view class="tui-attr-ellipsis">男装</view>
						</view>
						<view class="tui-attr-item">
							<view class="tui-attr-ellipsis">女装</view>
						</view>
						<view class="tui-attr-item">
							<view class="tui-attr-ellipsis">运动服饰</view>
						</view>
						<view class="tui-attr-item">
							<view class="tui-attr-ellipsis">户外鞋服</view>
						</view>
						<view class="tui-attr-item">
							<view class="tui-attr-ellipsis">文化</view>
						</view>
						<view class="tui-attr-item">
							<view class="tui-attr-ellipsis">服饰配件</view>
						</view>
						<view class="tui-attr-item">
							<view class="tui-attr-ellipsis">流行男鞋</view>
						</view>
						<view class="tui-attr-item">
							<view class="tui-attr-ellipsis">艺术</view>
						</view>
					</view>

					<view class="tui-drawer-title">
						<text class="tui-title-bold">品牌</text>
						<view class="tui-all-box tui-icon-ml">
							<view class="tui-attr-right tui-active ">花花公子，七匹狼（SEPTWOLVES）</view>
							<tui-icon name="arrowdown" :size="14" color="#444"></tui-icon>
						</view>
					</view>
					<view class="tui-drawer-content tui-flex-attr">
						<view class="tui-attr-item tui-btmItem-active">
							<view class="tui-attr-ellipsis">花花公子</view>
						</view>
						<view class="tui-attr-item tui-btmItem-active">
							<view class="tui-attr-ellipsis">七匹狼（SEPTWOLVES）</view>
						</view>
						<view class="tui-attr-item">
							<view class="tui-attr-ellipsis">吉普</view>
						</view>
					</view>

					<view class="tui-drawer-title">
						<text class="tui-title-bold">尺码</text>
						<view class="tui-all-box tui-icon-ml">
							<view class="tui-attr-right">全部</view>
							<tui-icon name="arrowup" :size="14" color="#444"></tui-icon>
						</view>
					</view>
					<view class="tui-drawer-content tui-flex-attr">
						<view class="tui-attr-item tui-btmItem-active">
							<view class="tui-attr-ellipsis">27</view>
						</view>
						<view class="tui-attr-item" v-for="(item,index) in 12" :key="index">
							<view class="tui-attr-ellipsis">{{28+index}}</view>
						</view>
					</view>
					<view class="tui-safearea-bottom"></view>
				</scroll-view>
				<view class="tui-attr-btnbox">
					<view class="tui-attr-safearea">
						<view class="tui-drawer-btn">
							<tui-button type="black" plain height="60rpx" shape="circle" :size="26">重置</tui-button>
						</view>
						<view class="tui-drawer-btn">
							<tui-button type="danger" height="60rpx" shape="circle" :size="26" @click="closeDrawer">确定(80万+件商品)</tui-button>
						</view>
					</view>
				</view>
			</view>
		</tui-drawer>
		<!--左抽屉弹层 筛选-->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				webURL: 'https://thorui.cn/images/mall/group/',
				selectH: 0,
				dropdownList: [{
						name: '价格升序',
						selected: false
					},
					{
						name: '价格降序',
						selected: false
					}
				],
				isList: false, //列表或大图
				tabIndex: 0, //顶部筛选索引
				drawer: false,
				drawerH: 0,
				productList: [{
						img: 1,
						name: '欧莱雅（LOREAL）奇焕光彩粉嫩透亮修颜霜 30ml（欧莱雅彩妆 BB霜 粉BB 遮瑕疵 隔离）',
						sale: 599,
						factory: 899,
						payNum: 2342
					},
					{
						img: 2,
						name: '德国DMK进口牛奶  欧德堡（Oldenburger）超高温处理全脂纯牛奶1L*12盒',
						sale: 29,
						factory: 69,
						payNum: 999
					},
					{
						img: 3,
						name: '【第2支1元】柔色尽情丝柔口红唇膏女士不易掉色保湿滋润防水 珊瑚红',
						sale: 299,
						factory: 699,
						payNum: 666
					},
					{
						img: 4,
						name: '百雀羚套装女补水保湿护肤品',
						sale: 1599,
						factory: 2899,
						payNum: 236
					},
					{
						img: 5,
						name: '百草味 肉干肉脯 休闲零食 靖江精制猪肉脯200g/袋',
						sale: 599,
						factory: 899,
						payNum: 2399
					},
					{
						img: 6,
						name: '短袖睡衣女夏季薄款休闲家居服短裤套装女可爱韩版清新学生两件套 短袖粉色长颈鹿 M码75-95斤',
						sale: 599,
						factory: 899,
						payNum: 2399
					},
					{
						img: 1,
						name: '欧莱雅（LOREAL）奇焕光彩粉嫩透亮修颜霜',
						sale: 599,
						factory: 899,
						payNum: 2342
					},
					{
						img: 2,
						name: '德国DMK进口牛奶',
						sale: 29,
						factory: 69,
						payNum: 999
					},
					{
						img: 3,
						name: '【第2支1元】柔色尽情丝柔口红唇膏女士不易掉色保湿滋润防水 珊瑚红',
						sale: 299,
						factory: 699,
						payNum: 666
					},
					{
						img: 4,
						name: '百雀羚套装女补水保湿护肤品',
						sale: 1599,
						factory: 2899,
						payNum: 236
					}
				],
				tabbarHeight: uni.upx2px(100)
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: res => {
					let drawerH = res.windowHeight;
					// #ifdef H5
					this.drawerH = drawerH + 44;
					// #endif
					// #ifndef H5
					this.drawerH = drawerH;
					// #endif
				}
			});
		},
		methods: {
			search: function() {
				this.tui.href('/pages/common/search/search')
			},
			screen: function(e) {
				this.hideDropdownList();
				let index = e.currentTarget.dataset.index;
				if (index == -1 || index == 1) {
					this.tabIndex = index;
				} else if (index == 0) {
					this.showDropdownList();
				} else if (index == 2) {
					this.isList = !this.isList;
				} else if (index == 3) {
					this.drawer = true;
				}
			},
			showDropdownList: function() {
				this.selectH = 176;
			},
			hideDropdownList: function() {
				this.selectH = 0;
			},
			dropdownItem: function(e) {
				let index = Number(e.currentTarget.dataset.index);
				let arr = this.dropdownList;
				for (let i = 0; i < arr.length; i++) {
					if (i === index) {
						arr[i].selected = true;
					} else {
						arr[i].selected = false;
					}
				}
				this.dropdownList = arr;
				this.tabIndex = 0;
				this.selectH = 0;
			},
			closeDrawer: function() {
				this.drawer = false;
			},
			detail() {
				this.tui.href('/pages/index/groupDetail/groupDetail')
			}
		}
	}
</script>

<style>
	.tui-search__bar {
		width: 100%;
		background-color: #fff;
		padding: 20rpx 25rpx;
		box-sizing: border-box;
	}

	.tui-searchbox {
		width: 100%;
		height: 64rpx;
		margin-right: 30rpx;
		border-radius: 15px;
		font-size: 24rpx;
		background: #f7f7f7;
		padding: 6rpx 20rpx;
		box-sizing: border-box;
		color: #999;
		display: flex;
		align-items: center;
		overflow: hidden;
	}

	.tui-search-text {
		padding-left: 16rpx;
	}

	/*screen*/

	.tui-header-screen {
		width: 100%;
		box-sizing: border-box;
		background: #fff;
		position: fixed;
		z-index: 996;
	}

	.tui-screen__box {
		width: 100%;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		color: #333;
		position: relative;
		background: #fff;
	}


	.tui-screen-item {
		height: 28rpx;
		line-height: 28rpx;
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}



	.tui-btmItem-active {
		background-color: #fcedea !important;
		color: #e41f19;
		font-weight: bold;
		position: relative;
	}

	.tui-btmItem-active::after {
		content: '';
		position: absolute;
		border: 1rpx solid #e41f19;
		width: 100%;
		height: 100%;
		border-radius: 40rpx;
		left: 0;
		top: 0;
	}


	.tui-addr-left {
		padding-left: 6rpx;
	}

	.tui-bold {
		font-weight: bold;
	}

	.tui-active {
		color: #e41f19;
	}


	/*screen*/


	/*顶部下拉选择 综合*/

	.tui-dropdownlist {
		width: 100%;
		position: absolute;
		background-color: #fff;
		border-bottom-left-radius: 24rpx;
		border-bottom-right-radius: 24rpx;
		overflow: hidden;
		box-sizing: border-box;
		padding-top: 10rpx;
		padding-bottom: 26rpx;
		left: 0;
		top: 80rpx;
		visibility: hidden;
		transition: all 0.2s ease-in-out;
		z-index: 996;
	}

	.tui-dropdownlist-show {
		visibility: visible;
	}

	.tui-dropdownlist-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: -1;
		transition: all 0.2s ease-in-out;
		opacity: 0;
		visibility: hidden;
	}

	.tui-mask-show {
		opacity: 1;
		visibility: visible;
	}

	.tui-dropdownlist-item {
		color: #333;
		height: 70rpx;
		font-size: 28rpx;
		padding: 0 40rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	/*顶部下拉选择 综合*/


	/*筛选*/
	.tui-drawer-box {
		width: 686rpx;
		height: 100%;
		font-size: 24rpx;
		position: relative;
		overflow: hidden;
	}

	.tui-drawer-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx;
		box-sizing: border-box;
		height: 80rpx;
	}

	.tui-title-bold {
		font-size: 26rpx;
		font-weight: bold;
		flex-shrink: 0;
	}

	.tui-location {
		margin-right: 6rpx;
	}

	.tui-attr-right {
		width: 70%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: right;
	}

	.tui-all-box {
		width: 90%;
		white-space: nowrap;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.tui-drawer-content {
		padding: 16rpx 30rpx 30rpx 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
	}

	.tui-input {
		border: 0;
		height: 64rpx;
		border-radius: 32rpx;
		width: 45%;
		background-color: #f7f7f7;
		text-align: center;
		font-size: 24rpx;
		color: #333;
	}

	.tui-phcolor {
		text-align: center;
		color: #b2b2b2;
		font-size: 24rpx;
	}

	.tui-flex-attr {
		flex-wrap: wrap;
		justify-content: flex-start;
	}

	.tui-attr-item {
		width: 30%;
		height: 64rpx;
		background-color: #f7f7f7;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 4rpx;
		box-sizing: border-box;
		border-radius: 32rpx;
		margin-right: 5%;
		margin-bottom: 5%;
	}

	.tui-attr-ellipsis {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		width: 96%;
		text-align: center;
	}

	.tui-attr-item:nth-of-type(3n) {
		margin-right: 0%;
	}

	.tui-attr-btnbox {
		width: 100%;
		position: absolute;
		left: 0;
		bottom: 0;
		box-sizing: border-box;
		padding: 0 30rpx;
		background: #fff;
		z-index: 10;
	}

	.tui-attr-safearea {
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-safearea-bottom {
		width: 100%;
		height: env(safe-area-inset-bottom);
	}

	.tui-attr-btnbox::before {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		border-top: 1px solid #eaeef1;
		transform: scaleY(0.5) translateZ(0);
		transform-origin: 0 0;
	}

	.tui-drawer-btn {
		width: 48%;
		flex-shrink: 0;
	}

	.tui-mtop__30 {
		margin-top: 30rpx;
	}

	/*========商品 start======*/

	.tui-product__box {
		width: 100%;
		padding: 184rpx 25rpx 60rpx 25rpx;
		box-sizing: border-box;
	}

	.tui-product-list {
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		flex-wrap: wrap;
		box-sizing: border-box;
		padding-top: 10rpx;
	}

	.tui-product-container {
		flex: 1;
		margin-right: 10rpx;
	}

	.tui-product-container:last-child {
		margin-right: 0;
	}

	.tui-pro-item {
		width: 100%;
		margin-bottom: 10rpx;
		background: #fff;
		box-sizing: border-box;
		border-radius: 12rpx;
		overflow: hidden;
		transition: all 0.15s ease-in-out;
	}

	.tui-flex-list {
		display: flex;
		margin-bottom: 1rpx !important;
	}

	.tui-pro-img {
		width: 100%;
		display: block;
		flex-shrink: 0;
		background-color: #f5f5f5;
	}

	.tui-proimg-list {
		width: 280rpx;
		height: 280rpx !important;
		flex-shrink: 0;
		border-radius: 12rpx;
	}

	.tui-pro-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 20rpx;
	}

	.tui-pro-tit {
		color: #2e2e2e;
		font-size: 26rpx;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.tui-price__box {
		width: 100%;
		display: flex;
		align-items: center;
		padding-top: 12rpx;
	}

	.tui-price {
		display: flex;
		align-items: flex-end;
		color: #eb0909;
	}

	.tui-price__small {
		font-size: 24rpx;
		line-height: 24rpx;
	}

	.tui-price__large {
		font-size: 34rpx;
		line-height: 32rpx;
		font-weight: 600;
	}

	.tui-price__original {
		font-size: 24rpx;
		line-height: 24rpx;
		text-decoration: line-through;
		color: #999;
		padding-top: 10rpx;
		padding-left: 12rpx;
	}

	.tui-group-btn {
		max-width: 312rpx;
		height: 48rpx;
		border-radius: 6rpx;
		background: #EB0909;
		display: flex;
		align-items: center;
		padding: 4rpx;
		margin-top: 10rpx;
		box-sizing: border-box;
	}

	.tui-flex-btn {
		height: 100%;
		flex: 1;
		text-align: center;
		font-size: 26rpx;
		line-height: 26rpx;
		font-weight: 400;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-flex-btn:first-child {
		background: #fff;
	}

	.tui-group-text {
		font-size: 25rpx;
		line-height: 25rpx;
		transform: scale(0.8);
		transform-origin: 0 center;
		padding-top: 30rpx;
		color: #999;
	}

	.tui-color-red {
		color: #EB0909;
	}

	/*======商品======= end*/
</style>
