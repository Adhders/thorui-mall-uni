<template>
	<view class="container">
		<!--header-->
		<view class="tui-header-box">
			<view class="tui-header" :style="{ width: width + 'px', height: height + 'px' }">
				<view class="tui-back" :style="{ marginTop: arrowTop + 'px' }" @tap="back"><tui-icon name="arrowleft" color="#000"></tui-icon></view>
				<view class="tui-searchbox tui-search-mr" :style="{ marginTop: inputTop + 'px' }" @tap="search">
					<icon type="search" :size="13" color="#999"></icon>
					<text class="tui-search-text" v-if="!searchKey">搜索商品</text>
					<view class="tui-search-key" v-if="searchKey">
						<view class="tui-key-text">{{ searchKey }}</view>
						<tui-icon name="shut" :size="11" color="#fff"></tui-icon>
					</view>
				</view>
			</view>
		</view>
		<!--header-->
		<!--screen-->
		<view class="tui-header-screen" :style="{ top: height + 'px' }">
			<view class="tui-screen-top">
				<view class="tui-top-item tui-icon-ml" :class="[tabIndex == 0 ? 'tui-active tui-bold' : '']" data-index="0" @tap="screen">
					<view>{{ selectedName }}</view>
					<tui-icon :name="selectH > 0 ? 'arrowup' : 'arrowdown'" :size="14" :color="tabIndex == 0 ? '#e41f19' : '#444'"></tui-icon>
				</view>
				<view class="tui-top-item" :class="[tabIndex == 1 ? 'tui-active tui-bold' : '']" @tap="screen" data-index="1">销量</view>
				<view class="tui-top-item" @tap="screen" data-index="2">
					<tui-icon :name="isList ? 'manage' : 'listview'" :size="isList ? 22 : 18" :bold="isList ? false : true" color="#333"></tui-icon>
				</view>
				<view class="tui-top-item tui-icon-ml" @tap="screen" data-index="3">
					<text>筛选</text>
					<tui-icon name="screen" :size="12" color="#333" :bold="true"></tui-icon>
				</view>

				<!--下拉选择列表--综合-->
				<view class="tui-dropdownlist" :class="[selectH > 0 ? 'tui-dropdownlist-show' : '']" :style="{ height: selectH + 'rpx' }">
					<view
						class="tui-dropdownlist-item tui-icon-middle"
						:class="[item.selected ? 'tui-bold' : '']"
						v-for="(item, index) in dropdownList"
						:key="index"
						@tap.stop="dropdownItem"
						:data-index="index"
					>
						<text class="tui-ml tui-middle">{{ item.name }}</text>
						<tui-icon name="check" :size="16" color="#e41f19" :bold="true" v-if="item.selected"></tui-icon>
					</view>
				</view>
				<view class="tui-dropdownlist-mask" :class="[selectH > 0 ? 'tui-mask-show' : '']" @tap.stop="hideDropdownList"></view>
				<!--下拉选择列表--综合-->
			</view>
	
		</view>
		<!--screen-->

		<!--list-->
		<view class="tui-product-list" :style="{ marginTop: px(dropScreenH + 18) }">
			<view class="tui-product-container">
				<block v-for="(item, index) in displayList" :key="index">
					<!--商品列表-->
					<view class="tui-pro-item" :class="[isList ? 'tui-flex-list' : '']" hover-class="tui-hover" :hover-start-time="150" @tap="detail(item)" v-if="(index + 1) % 2 != 0 || isList">
						<image :src="item.defaultImageUrl" class="tui-pro-img" :class="[isList ? 'tui-proimg-list' : '']" mode="widthFix" />
						<view class="tui-pro-content">
							<view class="tui-pro-tit">{{item.title}}</view>
							<view class="tui-sub-info">{{item.slogan}}</view>
							<view class="tui-pro-price">
								<text class="tui-size-24">￥</text>
								<text class="tui-sale-price">{{ item.price.split('.')[0] }}</text>
								<text class="tui-size-24" v-show="item.price.indexOf('.')!==-1">.{{item.price.split('.')[1]}}</text>
								<text class="tui-factory-price">￥{{ item.originalPrice }}</text>
							</view>
							<view class="tui-cart">
								<view class="tui-pro-pay">{{ item.salesNum }}人付款</view>
								<tui-icon name="cart" :size="16" color="#e41f19" @tap.stop="addCart(item)"></tui-icon>
							</view>
						</view>
					</view>
					<!--商品列表-->
				</block>
			</view>
			<view class="tui-product-container" v-if="!isList">
				<block v-for="(item, index) in displayList" :key="index">
					<!--商品列表-->
					<view class="tui-pro-item" :class="[isList ? 'tui-flex-list' : 'tui-double-list']"  @tap="detail(item)" hover-class="tui-hover" :hover-start-time="150"  v-if="(index + 1) % 2 == 0">
						<image :src="item.defaultImageUrl" class="tui-pro-img" :class="[isList ? 'tui-proimg-list' : '']" mode="widthFix" />
						<view class="tui-pro-content">
							<view class="tui-pro-tit">{{item.title}}</view>
							<view class="tui-sub-info">{{item.slogan}}</view>
							<view class="tui-pro-price">
								<text class="tui-size-24">￥</text>
								<text class="tui-sale-price">{{ item.price.split('.')[0] }}</text>
								<text class="tui-size-24"  v-show="item.price.indexOf('.')!==-1">.{{ item.price.split('.')[1]}}</text>
								<text class="tui-factory-price">￥{{ item.originalPrice }}</text>
							</view>
							<view class="tui-cart">
								<view class="tui-pro-pay">{{ item.salesNum }}人付款</view>
								<tui-icon name="cart" :size="16" color="#e41f19" @tap.stop="addCart(item)"></tui-icon>
							</view>
						</view>
					</view>
					<!--商品列表-->
				</block>
			</view>
		</view>


		<!--左抽屉弹层 筛选 -->
		<tui-drawer mode="right" :visible="drawer"  @close="closeDrawer">
			<view class="tui-drawer-box" :style="{ paddingTop: height + 'px' }">
				<scroll-view class="tui-drawer-scroll" scroll-y :style="{ height: drawerH + 'px' }">
					<view class="tui-drawer-title">
						<text class="tui-title-bold">价格区间</text>
					</view>
					<view class="tui-drawer-content">
						<input placeholder-class="tui-phcolor" class="tui-input" v-model="min" placeholder="最低价" maxlength="11" type="number" />
						<tui-icon name="reduce" color="#333" :size="14"></tui-icon>
						<input placeholder-class="tui-phcolor" class="tui-input" v-model="max" placeholder="最高价" maxlength="11" type="number" />
					</view>
					<block v-for="(item,i) in dataList" :key="i">
						<tui-collapse :index="i" :current="item.current" :condition=selectedCondition[i] @click="change">
							<view slot="title">
								<view class="tui-drawer-title">
									<text class="tui-title-bold">{{item.name}}</text>
								</view>
							</view>
							<view slot="top">
								<view class="tui-drawer-content tui-flex-attr tui-drawer-top">
								  	<block v-for="(value, j) in item.values.slice(0,3)" :key="j">
										<view class="tui-attr-item" :class="{'tui-btmItem-active': selectedIndex[i].includes(j)}" @tap=onSelect(i,j)>
											<view class="tui-attr-ellipsis">{{value}}</view>
										</view>
									</block>  	
								</view>
							</view>
							<view slot="content">
								<view class="tui-drawer-content tui-flex-attr">
								  	<block v-for="(value, j) in item.values.slice(3)" :key="j">
										<view class="tui-attr-item" :class="{'tui-btmItem-active': selectedIndex[i].includes(j+3)}" @tap=onSelect(i,j+3)>
											<view class="tui-attr-ellipsis">{{value}}</view>
										</view>
									</block>  	
								</view>
							</view>
						</tui-collapse>
					</block>				
					<view class="tui-safearea-bottom"></view>
				</scroll-view>
				<view class="tui-attr-btnbox">
					<view class="tui-attr-safearea">
						<view class="tui-drawer-btn tui-drawerbtn-black" hover-class="tui-white-hover" :hover-stay-time="150" @tap="reset">重置</view>
						<view class="tui-drawer-btn tui-drawerbtn-primary" hover-class="tui-red-hover" :hover-stay-time="150" @tap="closeDrawer">确定(80万+件商品)</view>
					</view>
				</view>
			</view>
		</tui-drawer>
		<!--左抽屉弹层 筛选-->

		<!--加载loadding-->
		<tui-loadmore v-if="loadding" :index="3" type="red"></tui-loadmore>
		<tui-nomore v-if="!pullUpOn && isList" backgroundColor="#f7f7f7"></tui-nomore>
		<!--加载loadding-->
	</view>
</template>

<script>
export default {
	data() {
		return {
			min: '',
			max: '',
			searchKey: '', //搜索关键词
			width: 200, //header宽度
			height: 64, //header高度
			inputTop: 0, //搜索框距离顶部距离
			arrowTop: 0, //箭头距离顶部距离
			dropScreenH: 0, //下拉筛选框距顶部距离
			attrIndex: -1,
			scrollTop: 0,
			tabIndex: 0, //顶部筛选索引
			isList: false, //是否以列表展示  | 列表或大图
			drawer: false,
			drawerH: 0, //抽屉内部scrollview高度
			selectedName: '综合',
			selectH: 0,
			dropdownList: [
				{
					name: '综合',
					selected: true
				},
				{
					name: '价格升序',
					selected: false
				},
				{
					name: '价格降序',
					selected: false
				}
			],
			displayList: [],
			productList: [],
			selectedIndex: [],
			selectedCondition: [],
			dataList: [
				{name: '全部分类', current: 0, values: ['男装', '女装', '运动服饰', '户外鞋服', '文化', '配件', '男鞋', '艺术']},
				{name: '尺码', current: -1,  values: [23,24,25,26,27,28,30,31,32,33,34,35,36,37,38,39,40,41,42,43]},
				{name: '品牌', current: -1,  values: ["花花公子","九匹狼","耐克","安踏"]}
			],
			pageIndex: 1,
			loadding: false,
			pullUpOn: true
		};
	},
	onLoad: function(options) {
        let size = this.dataList.length
		this.selectedIndex = this.dataList.map(function(){return []})
		this.selectedCondition = new Array(size).fill('')
		let goodsList = this.$store.state.goodsList
		goodsList.forEach((sku)=>{this.productList.push(sku.data[0])})
		console.log('productList', this.productList)
		this.displayList = this.productList
		let obj = {};
		// #ifdef MP-WEIXIN
		obj = wx.getMenuButtonBoundingClientRect();
		// #endif
		// #ifdef MP-BAIDU
		obj = swan.getMenuButtonBoundingClientRect();
		// #endif
		// #ifdef MP-ALIPAY
		my.hideAddToDesktopMenu();
		// #endif
		uni.getSystemInfo({
			success: res => {
				this.width = obj.left || res.windowWidth;
				this.height = obj.top ? obj.top + obj.height + 8 : res.statusBarHeight + 44;
				this.inputTop = obj.top ? obj.top + (obj.height - 30) / 2 : res.statusBarHeight + 7;
				this.arrowTop = obj.top ? obj.top + (obj.height - 32) / 2 : res.statusBarHeight + 6;
				this.searchKey = options.searchKey || '';
				//略小，避免误差带来的影响
				this.dropScreenH = (this.height * 750) / res.windowWidth + 84;
				this.drawerH = res.windowHeight - uni.upx2px(100) - this.height;
			}
		});
	},
	methods: {
		px(num) {
			return uni.upx2px(num) + 'px';
		},
		change(e){
			let index = e.index;
			let item = this.dataList[index];
			item.current = item.current == index ? -1 : index
		},
		detail(item) {
			uni.navigateTo({
				url: '/pages/index/productDetail/productDetail?spu_id=' + item.spu_id + '&sku_id=' + item.id
			})
		},
		addCart(item){
			let newGoods = {
				id: item.id,
				spu_id: item.spu_id,
				price: item.price,
				title: item.title,
				slogan: item.slogan,
				defaultImageUrl: item.defaultImageUrl,
				propertyList: item.selectedGoodsAttrList,
				buyNum: 1,
			}
			if(!this.tui.isLogin()) {
				uni.navigateTo({url: '/pages/my/login/login'})
			}else{
				let url = '/updateCustomer/' + uni.getStorageSync("pid") +'/addCart'
				this.tui.request(url, 'PUT', {'newGoods': newGoods}).then(res=>{
						if(res.code==='0'){
							this.tui.toast('成功添加到购物车')
						}
					}
				)
			}
		},
		reset() {
			console.log('min', this.min, 'max', this.max)
			let size = this.dataList.length
			this.min = ''
			this.max = ''
			this.selectedIndex = this.dataList.map(function(){return []})
			this.selectedCondition = new Array(size).fill('')
		},
		onSelect(i,j){
			let index = this.selectedIndex[i].indexOf(j)
			if(index !== -1){
				this.selectedIndex[i].splice(index, 1)
			}else{
				this.selectedIndex[i].push(j)
			}
			let res = ''
			const values = this.dataList[i].values
			this.selectedIndex[i].forEach((k)=>{
                res = res + values[k] + '，'
			})
			res = res.substr(0, res.length - 1)
			this.selectedCondition[i]=res
		},
		showDropdownList: function() {
			this.selectH = 246;
			this.tabIndex = 0;
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
			this.selectedName = index == 0 ? '综合' : index == 1 ? '价格升序' : '价格降序';
			this.selectH = 0;
			if(index===1){
				this.displayList = this.productList.sort((a,b)=>{ return a.price-b.price })
			}
			else if(index===2){
				this.displayList = this.productList.sort((a,b)=>{ return b.price-a.price })
			}
		},
		screen: function(e) {
			let index = e.currentTarget.dataset.index;
			this.hideDropdownList();
			if (index == 0) {
				this.showDropdownList();
			} else if (index == 1) {
				this.tabIndex = 1;
				this.selectedName = "综合"
				this.dropdownList.forEach((o)=>{o.select=false})
				this.displayList = this.productList.sort((a,b)=>{ return b.salesNum-a.salesNum })
			} else if (index == 2) {
				this.isList = !this.isList;
			} else if (index == 3) {
				this.drawer = true;
			}
		},
		closeDrawer: function() {
			this.drawer = false;
		},
		back: function() {
			if (this.drawer) {
				this.closeDrawer();
			} else {
				uni.navigateBack();
			}
		},
		search: function() {
			uni.navigateTo({
				url: '/pages/common/search/search'
			});
		}
	},
	onReachBottom: function() {
		if (!this.pullUpOn) return;
		this.loadding = true;
		// if (this.pageIndex == 4) {
		// 	this.loadding = false;
		// 	this.pullUpOn = false;
		// } else {
		// 	let loadData = JSON.parse(JSON.stringify(this.productList));
		// 	loadData = loadData.splice(0, 10);
		// 	if (this.pageIndex == 1) {
		// 		loadData = loadData.reverse();
		// 	}
		// 	this.productList = this.productList.concat(loadData);
		// 	this.pageIndex = this.pageIndex + 1;
		// 	this.loadding = false;
		// }
	}
};
</script>

<style >

.container {
	padding-bottom: env(safe-area-inset-bottom);
}

/* 隐藏scroll-view滚动条*/

::-webkit-scrollbar {
	width: 0;
	height: 0;
	color: transparent;
}

.tui-header-box {
	width: 100%;
	background: #fff;
	position: fixed;
	z-index: 1001;
	left: 0;
	top: 0;
}

.tui-header {
	display: flex;
	align-items: flex-start;
}

.tui-back {
	margin-left: 8rpx;
	height: 32px !important;
	width: 32px !important;
}

.tui-searchbox {
	width: 100%;
	height: 30px;
	margin-right: 30rpx;
	border-radius: 15px;
	font-size: 12px;
	background: #f7f7f7;
	padding: 3px 10px;
	box-sizing: border-box;
	color: #999;
	display: flex;
	align-items: center;
	overflow: hidden;
}

/* #ifdef MP */
.tui-search-mr {
	margin-right: 20rpx !important;
}
/* #endif */

.tui-search-text {
	padding-left: 16rpx;
}

.tui-search-key {
	max-width: 80%;
	height: 80%;
	padding: 0 16rpx;
	margin-left: 12rpx;
	display: flex;
	align-items: center;
	border-radius: 15px;
	background: rgba(0, 0, 0, 0.5);
	color: #fff;
}

.tui-key-text {
	box-sizing: border-box;
	padding-right: 12rpx;
	font-size: 22rpx;
	line-height: 22rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

/*screen*/

.tui-header-screen {
	width: 100%;
	box-sizing: border-box;
	background: #fff;
	position: fixed;
	z-index: 1000;
}

.tui-screen-top,
.tui-screen-bottom {
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 28rpx;
	color: #333;
}

.tui-screen-top {
	height: 88rpx;
	position: relative;
	background: #fff;
}

.tui-top-item {
	height: 28rpx;
	line-height: 28rpx;
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
}


.tui-bold {
	font-weight: bold;
}

.tui-active {
	color: #e41f19;
}
.tui-btmItem-active{
	border: 1px solid;
	color: #e41f19;
    font-weight: bold;
	background-Color: #ebcdcb !important;
}

.tui-addr-left {
	padding-left: 6rpx;
}

.tui-seizeaseat-20 {
	height: 20rpx;
}

.tui-seizeaseat-30 {
	height: 30rpx;
}

/*screen*/

/*顶部下拉选择 属性*/

.tui-scroll-box {
	width: 100%;
	height: 480rpx;
	box-sizing: border-box;
	position: relative;
	z-index: 99;
	color: #fff;
	font-size: 30rpx;
	word-break: break-all;
}

.tui-drop-item {
	color: #333;
	height: 80rpx;
	font-size: 28rpx;
	padding: 20rpx 40rpx 20rpx 40rpx;
	box-sizing: border-box;
	display: inline-block;
	width: 50%;
}

.tui-drop-btnbox {
	width: 100%;
	height: 100rpx;
	position: absolute;
	left: 0;
	bottom: 0;
	box-sizing: border-box;
	display: flex;
}

.tui-drop-btn {
	width: 50%;
	font-size: 32rpx;
	text-align: center;
	height: 100rpx;
	line-height: 100rpx;
	border: 0;
}

.tui-btn-red {
	background: #e41f19;
	color: #fff;
}

.tui-red-hover {
	background: #c51a15 !important;
	color: #e5e5e5;
}

.tui-btn-white {
	background: #fff;
	color: #333;
}

.tui-white-hover {
	background: #e5e5e5;
	color: #2e2e2e;
}

.tui-sub-info {
	color: #888;
	max-width: 90%;
    padding-top: 5rpx;
    font-size: 22rpx;
	box-sizing: border-box;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}



/*顶部下拉选择 属性*/

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
	top: 88rpx;
	visibility: hidden;
	transition: all 0.2s ease-in-out;
	z-index: 999;
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

.tui-drawer-box {
	width: 686rpx;
	font-size: 24rpx;
	overflow: hidden;
	position: relative;
	padding-bottom: 100rpx;
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
	padding: 0 30rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	box-sizing: border-box;
}

.tui-drawer-top {
    padding-top: 16rpx;
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
	z-index: 1000;
	box-sizing: border-box;
	padding: 0 30rpx;
	background: #fff;
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
	width: 47%;
	text-align: center;
	height: 60rpx;
	border-radius: 30rpx;
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
}

.tui-drawerbtn-black {
	border: 1rpx solid #555;
}

.tui-drawerbtn-primary {
	background: #e41f19;
	color: #fff;
}

/* 商品列表*/

.tui-product-list {
	display: flex;
	margin: 0 10rpx;
	justify-content: space-between;
	flex-direction: row;
	flex-wrap: wrap;
	box-sizing: border-box;
}

.tui-product-container {
	flex: 1;
	margin-right: 15rpx;
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
}

.tui-pro-img {
	width: 100%;
	display: block;
}

.tui-proimg-list {
	width: 260rpx;
	height: 260rpx !important;
	flex-shrink: 0;
	border-radius: 10rpx;
}
.tui-pro-content {
	display: flex;
	width: 100%;
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

.tui-size-24 {
	font-size: 24rpx;
	font-weight: 500;
	color: #e41f19;
}

.tui-pro-price {
	padding-top: 10rpx;
	flex: auto;
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
.tui-cart {
	display: flex;
	margin-top: 10rpx;
	justify-content: space-between;
}

.tui-pro-pay {
	font-size: 24rpx;
	color: #656565;
}

/* 商品列表*/
</style>
