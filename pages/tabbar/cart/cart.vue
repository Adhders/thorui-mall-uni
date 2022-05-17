<template>
	<view class="container">
		<tui-loading v-if="loadding"></tui-loading>
		<block v-else>
			<block v-if="dataList.length>0">
				<view class="tui-edit-goods">
					<view>购物车共<text class="tui-goods-num">{{total}}</text>件商品</view>
					<view>
						<tui-button type="gray" :plain="true" shape="circle" width="160rpx" height="60rpx" :size="24" @click="editGoods">{{isEdit?"完成":"编辑商品"}}</tui-button>
					</view>
				</view>
				<checkbox-group @change="buyChange">
					<view class="tui-cart-cell" v-for="(item,index) in dataList" :key="index">  
						<tui-swipe-action :actions="actions" @click="handlerButton" :params="item">
							<template v-slot:content>
								<view class="tui-goods-item">
									<label class="tui-checkbox">
										<checkbox :value="item.id" :checked="item.selected" color="#fff"></checkbox>
									</label>
									<image :src="item.defaultImageUrl" class="tui-goods-img" @tap="detail(item)"/>
									<view class="tui-goods-info">
										<view class="tui-goods-title">
											{{item.title}}
										</view>
										<view class="tui-goods-extraInfo">
											<view class="tui-sub-info">{{item.slogan}}</view>
											<view>{{item.propertyList | attrFormat}}</view>
										</view>
										<view class="tui-price-box">
											<view>
												<text class="tui-size-24">￥</text>
												<text class="tui-sale-price">{{ item.price.split('.')[0] }}</text>
												<text class="tui-size-24">.{{ item.price.split('.')[1]}}</text>
											</view>
											<tui-numberbox :value="item.buyNum" :height="36" :width="64" :min="1" :index="index" @change="changeNum"></tui-numberbox>
										</view>
									</view>
								</view>
							</template>
						</tui-swipe-action>
					</view>
				</checkbox-group>
			</block>
			<view  v-else>
				<tui-no-data  :fixed="false"
					imgUrl="https://system.chuangbiying.com/static/images/index/img_noorder.png">
					请添加商品到购物车</tui-no-data>
			</view>
			<!--商品失效-->
			<view class="tui-cart-cell  tui-mtop" v-if="invalidList.length>0">
				<view class="tui-activity">
					<view class="tui-bold">失效商品</view>
					<view class="tui-buy">
						<tui-button type="gray" :plain="true" shape="circle" width="200rpx" height="56rpx" :size="24" @tap="clearAll">清空失效商品</tui-button>
					</view>
				</view>
				<view :class="{'tui-invalid-ptop':index!==0}" v-for="(item,index) in invalidList" :key="index">
					<tui-swipe-action :actions="actions2" @click="handlerButton" :params="item">
						<template v-slot:content>
							<view class="tui-goods-item">
								<view class="tui-checkbox tui-invalid-pr">
									<view class="tui-invalid-text">失效</view>
								</view>
								<image :src="item.defaultImageUrl" class="tui-goods-img opcity" />
								<view class="tui-goods-info">
									<view class="tui-goods-title tui-gray">
										{{item.title}}
									</view>
									<view class="tui-price-box tui-flex-center">
										<view class="tui-goods-invalid">宝贝已不能购买</view>
										<view class="tui-btn-alike">
											<tui-button type="danger" shape="circle" width="120rpx" height="48rpx" :size="24">找相似</tui-button>
										</view>
									</view>
								</view>
							</view>
						</template>
					</tui-swipe-action>
				</view>
			</view>
			<!--猜你喜欢-->
			<block v-if="!isEdit && productList.length>0">
				<tui-divider :size="28" :bold="true" color="#333" width="50%">
				<tui-icon name="like" :size="18" color="#e41f19"></tui-icon>
				<text class="tui-youlike">猜你喜欢</text>
				</tui-divider>
				<view class="tui-product-list">
					<view class="tui-product-container">
						<block v-for="(item,index) in productList" :key="index">
							<!--商品列表-->
							<view class="tui-pro-item" hover-class="hover" :hover-start-time="150" @tap="detail(item)" v-if="(index+1)%2!==0">
								<image :src="item.defaultImageUrl" class="tui-pro-img" mode="widthFix" />
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
						</block>
					</view>
					<view class="tui-product-container">
						<block v-for="(item,index) in productList" :key="index">
							<!--商品列表-->
							<view class="tui-pro-item" hover-class="hover" :hover-start-time="150" @tap="detail(item)" v-if="(index+1)%2==0">
								<image :src="item.defaultImageUrl" class="tui-pro-img" mode="widthFix" />
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
						</block>
					</view>
				</view>
				<tui-nomore text="没有更多了"></tui-nomore>
			</block>

			<!--tabbar-->
			<view class="tui-tabbar" v-if="dataList.length>0">
				<view class="tui-checkAll">
					<checkbox-group @change="checkAll">
						<label class="tui-checkbox">
							<checkbox :checked="isAll" color="#fff"></checkbox>
							<text class="tui-checkbox-pl">全选</text>
						</label>
					</checkbox-group>
					<view class="tui-total-price" v-if="!isEdit">合计:<text class="tui-bold">￥{{totalPrice | getPrice}}</text> </view>
				</view>
				<view>
					<tui-button width="200rpx" height="70rpx" :size="30" type="danger" shape="circle" v-if="!isEdit" @click="btnPay">去结算({{buyNum}})</tui-button>
					<view v-else style="display: flex">
						<tui-button width="200rpx" height="70rpx" margin="0 20rpx" :size="30" type="danger" shape="circle" :plain="true" @tap="openActionSheet(1)">移入收藏</tui-button>
						<tui-button width="130rpx" height="70rpx" :size="30" type="danger" shape="circle" :plain="true" @tap="openActionSheet(2)">删除</tui-button>
					</view>
				</view>
			</view>
			<!--加载loadding-->
			<tui-loadmore v-if="loadding" :index="3" type="red"></tui-loadmore>
			<tui-actionsheet :show="showActionSheet" :tips="tips" :item-list="itemList" :mask-closable="maskClosable" :color="color"
			:is-cancel="isCancel" @click="itemClick" @cancel="closeActionSheet"></tui-actionsheet>
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loadding: true,
				cart: [],
				total: 0,
				isAll: false,
				totalPrice: 0,
				buyNum: 0,
				cartIds: [],
				actions: [{
						name: '收藏',
						width: 64,
						color: '#fff',
						fontsize: 28,
						background: '#FFC600'
					},
					{
						name: '看相似',
						color: '#fff',
						fontsize: 28,
						width: 64,
						background: '#FF7035'
					},
					{
						name: '删除',
						color: '#fff',
						fontsize: 28,
						width: 64,
						background: '#F82400'
					}
				],
				actions2: [{
						name: '看相似',
						color: '#fff',
						fontsize: 28,
						width: 64,
						background: '#FF7035'
					},
					{
						name: '删除',
						color: '#fff',
						fontsize: 28,
						width: 64,
						background: '#F82400'
					}
				],
				productList: [],
				isEdit: false,
				pageIndex: 1,
				loadding: false,
				pullUpOn: true,
				showActionSheet: false,
				maskClosable: true,
				tips: "",
				itemList: [],
				color: "#9a9a9a",
				isCancel: true
			}
		},

		filters: {
			getPrice(price) {
				price = price || 0;
				return price.toFixed(2)
			},
			attrFormat(attr) {
				let str = ''
				attr.forEach(o=>{
					str = str + o.value + '，'
				})
				return str.slice(0,-1)
			},
		},
	
		onShow(){
			if(!this.tui.isLogin()) {
				uni.redirectTo({url: '/pages/my/login/login?from=cart'})
			}else{
				let goodsList = this.$store.state.goodsList
				let url = '/getCartInfo/' + this.$store.state.appid + '/' + uni.getStorageSync("pid")
				this.tui.request(url,'GET', undefined, true).then((res)=>{
					this.cart = res.cart
					let total = 0
					this.dataList.map((item) => {
						total += item.buyNum;
					})
					this.total = total
					this.productList = goodsList.filter((sku)=>{ 
						let index = this.cart.findIndex((o) => {return sku.id === o.id})
						return sku.stock>0 && index ===-1
					})
					this.loadding = false
				})
			}
		},
		computed: {
			dataList() {
                return this.cart.filter((o)=>{return o.valid})
			},
			invalidList() {
				return this.cart.filter((o)=>{return !o.valid})
			}
		},
		methods: {
			calcHandle() {
				let total=0
				let buyNum = 0;
				let totalPrice = 0;
				let selectedNum = 0;
				this.dataList.map((item) => {
					total += item.buyNum;
					if (item.selected) {
						buyNum += item.buyNum;
						totalPrice += item.price * item.buyNum;
						selectedNum++
					}
				})
				this.isAll = selectedNum === this.dataList.length
				this.total = total
				this.buyNum = buyNum
				this.totalPrice = totalPrice
			},
			changeNum: function(e) {
				this.dataList[e.index].buyNum = e.value
				setTimeout(() => {
					this.calcHandle()
				}, 0)
			},
			handlerButton: function(e) {
				let index = e.index;
				let item = e.item;
				if(index===2 || index ===1&&!item.valid){
					let _index = this.cart.findIndex((o)=>{return o.id === item.id})
					this.cart.splice(_index, 1)
				}
			},
			editGoods() {
				this.isEdit = !this.isEdit;
			},
			detail(item) {
				uni.navigateTo({
					url: '/pages/index/productDetail/productDetail?spu_id=' + item.spu_id + '&sku_id=' + item.id
				})
			},
			btnPay() {
				const goods = this.dataList.filter((o)=>{return o.selected})
				uni.navigateTo({
					url: '/pages/order/submitOrder/submitOrder?goods=' + JSON.stringify(goods)
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
					valid: true,
				}
				let url = '/updateCustomer/' + uni.getStorageSync("pid") +'/addCart'
				this.tui.request(url, 'PUT', {'newGoods': newGoods}).then(res=>{
					if(res.code==='0'){
						this.total += 1
						let index = this.cart.findIndex((o)=>{return o.id===newGoods.id})
						if(index !==-1){
							this.cart[index].buyNum +=1
						}else{
							this.cart.push(newGoods)
						}
						
					}
				}
				)
				
			},
			updateCart(){
				let url = '/updateCustomer/' + uni.getStorageSync("pid") +'/updateCart'
				this.tui.request(url, 'PUT', {'cart': this.cart}).then()
			},
			buyChange(e) {
				this.cartIds = e.detail.value;
				this.dataList.map(item => {
					//如果购物车id为数字统一转成字符串
					if (~this.cartIds.indexOf(item.id.toString())) {
						item.selected = true;
					} else {
						item.selected = false;
					}
				})
				setTimeout(() => {
					this.calcHandle()
				}, 0)
			},
			clearAll(){
				this.invalidList.map((item) => {
					let _index = this.cart.findIndex((o)=>{return o.id === item.id})
					this.cart.splice(_index, 1)
				})
				this.updateCart()
			},
			itemClick: function(e) {
				if(e.type===2){
					this.dataList.map((item) => {
						if (item.selected) {
							let _index = this.cart.findIndex((o)=>{return o.id === item.id})
							this.cart.splice(_index, 1)
						}
					})
					this.updateCart()
				}
				this.closeActionSheet();
				
			},
			closeActionSheet: function() {
				this.showActionSheet = false
			},
			openActionSheet: function(type) {
				let itemList = [{
					text: "确定",
					color: "#1a1a1a"
				}];
				let maskClosable = true;
				let tips = "";
				let color = "#9a9a9a";
				let isCancel = true;
				//组件中都有默认值，实际应用中不需要可不操作
				switch (type) {
					case 1:
						break;
					case 2:
						tips = `确认要删除这${this.buyNum}种商品吗？`;
						itemList = [{
							type: type,
							text: "确定",
							color: "#E3302D"
						}];
						break;
					default:
						break;
				}
				setTimeout(() => {
					this.showActionSheet = true;
					this.itemList = itemList;
					this.maskClosable = maskClosable;
					this.tips = tips;
					this.color = color;
					this.isCancel = isCancel
				}, 0)
			},
			checkAll(e) {
				this.isAll = !this.isAll;
				let buyNum = 0;
				let totalPrice = 0;
				this.dataList.map((item) => {
					item.selected = this.isAll;
					if (this.isAll) {
						buyNum += item.buyNum;
						totalPrice += item.price * item.buyNum;
					}
				})
				this.totalPrice = totalPrice;
				this.buyNum = buyNum;
			}
		},
		onPullDownRefresh() {
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 200)
		},
		onPullDownRefresh: function() {
			// let loadData = JSON.parse(JSON.stringify(this.productList));
			// loadData = loadData.splice(0, 10)
			// this.productList = loadData;
			this.pageIndex = 1;
			this.pullUpOn = true;
			this.loadding = false
			uni.stopPullDownRefresh()
		},
		onReachBottom: function() {
			if (!this.pullUpOn) return;
			this.loadding = true;
			if (this.pageIndex == 4) {
				this.loadding = false;
				this.pullUpOn = false
			} else {
				// let loadData = JSON.parse(JSON.stringify(this.productList));
				// loadData = loadData.splice(0, 10)
				// if (this.pageIndex == 1) {
				// 	loadData = loadData.reverse();
				// }
				// this.productList = this.productList.concat(loadData);
				this.pageIndex = this.pageIndex + 1;
				this.loadding = false
			}
		},
	    
		onNavigationBarButtonTap(e) {
			this.isEdit = !this.isEdit;
			let text = this.isEdit ? "完成" : "编辑";
			// #ifdef APP-PLUS
			let webView = this.$mp.page.$getAppWebview();
			webView.setTitleNViewButtonStyle(0, {
				text: text
			});
			// #endif
		}, 
		onHide(){
			let url = '/updateCustomer/' + uni.getStorageSync("pid") +'/updateCart'
			this.tui.request(url, 'PUT', {'cart': this.cart}).then()
		}
	}
</script>

<style>
	.container {
		padding-bottom: 120rpx;
	}

	.tui-mtop {
		margin-top: 24rpx;
	}

	.tui-edit-goods {
		width: 100%;
		border-radius: 12rpx;
		overflow: hidden;
		padding: 24rpx 30rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #333;
		font-size: 24rpx;
	}

	.tui-goods-num {
		font-weight: bold;
		color: #e41f19;
	}

	.tui-cart-cell {
		width: 100%;
		border-radius: 12rpx;
		background: #FFFFFF;
		padding: 20rpx 0;
		overflow: hidden;
	}

	.tui-goods-item {
		display: flex;
		padding: 0 30rpx;
		box-sizing: border-box;
	}

	.tui-checkbox {
		min-width: 70rpx;
		display: flex;
		align-items: center;
	}

	/* #ifdef MP-WEIXIN */
	.tui-checkbox .wx-checkbox-input {
		width: 40rpx;
		height: 40rpx;
		margin-right: 0 !important;
		border-radius: 50% !important;
		transform: scale(0.8);
		border-color: #d1d1d1 !important;
	}

	.tui-checkbox .wx-checkbox-input.wx-checkbox-input-checked {
		background: #eb0909;
		width: 44rpx !important;
		height: 44rpx !important;
		border: none;
	}

	/* #endif */

	.tui-goods-img {
		width: 180rpx;
		height: 180rpx !important;
		border-radius: 12rpx;
		flex-shrink: 0;
		display: block;
	}

	.tui-goods-info {
		width: 100%;
		padding: 10rpx;
        position: relative;
	}

	.tui-goods-title {
		white-space: normal;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		font-size: 24rpx;
		line-height: 30rpx;
		color: #333;
	}

	.tui-goods-model {
		max-width: 100%;
		color: #333;
		background: #F5F5F5;
		border-radius: 40rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 16rpx;
		box-sizing: border-box;
	}


	.tui-price-box {
		width: 100%;
		display: flex;
		position: absolute;
    	bottom: 10rpx;
		align-items: flex-end;
		justify-content: space-between;
	}

	.tui-goods-price {
		font-size: 34rpx;
		font-weight: 500;
		color: #e41f19;
	}

	.tui-scale {
		transform: scale(0.8);
		transform-origin: 100% 100%;
	}

	.tui-activity {
		font-size: 24rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx 20rpx 100rpx;
		box-sizing: border-box;
	}

	.tui-buy {
		display: flex;
		align-items: center
	}

	.tui-bold {
		font-weight: bold;
	}
    
	.tui-goods-extraInfo {
		color: #888;
		padding-top: 5rpx;
		font-size: 22rpx;
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

	.tui-invalid-text {
		width: 66rpx;
		margin-right: 4rpx;
		text-align: center;
		font-size: 24rpx;
		color: #fff;
		background: rgba(0, 0, 0, .3);
		transform: scale(0.8);
		transform-origin: center center;
		border-radius: 4rpx;
		flex-shrink: 0;
	}

	.tui-gray {
		color: #B2B2B2 !important;
	}

	.tui-goods-invalid {
		color: #555;
		font-size: 24rpx;
	}

	.tui-flex-center {
		align-items: center !important;
	}

	.tui-invalid-ptop {
		padding-top: 40rpx;
	}

	.tui-tabbar {
		width: 100%;
		height: 100rpx;
		background: #fff;
		position: fixed;
		left: 0;
		bottom: 0;
		/* #ifdef H5 */
		bottom: 50px;
		/* #endif */
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx;
		box-sizing: border-box;
		font-size: 24rpx;
		z-index: 9999;
	}

	.tui-tabbar::before {
		content: '';
		width: 100%;
		border-top: 1rpx solid #d9d9d9;
		position: absolute;
		top: 0;
		left: 0;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
	}

	.tui-checkAll {
		display: flex;
		align-items: center;
	}

	.tui-checkbox-pl {
		padding-left: 12rpx;
	}

	.tui-total-price {
		padding-left: 30rpx;
		font-size: 30rpx !important;
	}
		/*猜你喜欢*/
	.tui-youlike {
		padding-left: 12rpx
	}

	.tui-product-list {
		display: flex;
		margin: 0px 18rpx;
		justify-content: space-between;
		flex-direction: row;
		flex-wrap: wrap;
		box-sizing: border-box;
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

	.tui-size-24 {
		font-size: 24rpx;
		font-weight: 500;
		color: #e41f19;
	}

	.tui-pro-price {
		padding-top: 10rpx;
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
</style>
