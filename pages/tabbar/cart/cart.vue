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
										<checkbox :value="item.skuId" :checked="item.selected" color="#fff"></checkbox>
									</label>
									<image :src="item.defaultImageUrl" mode="aspectFill" class="tui-goods-img" @tap="detail(item)"/>
									<view class="tui-goods-info">
										<view class="tui-goods-title">
											{{item.title}}
										</view>
										<view class="tui-goods-extraInfo">
											<view class="tui-sub-info">{{item.slogan}}</view>
											<view class="tui-sub-info">{{item.propertyList | attrFormat}}</view>
										</view>
										<view class="tui-price-box">
											<view>
												<text class="tui-size-24">￥</text>
												<text class="tui-sale-price">{{ item.price.split('.')[0] }}</text>
												<text class="tui-size-24"  v-show="item.price.indexOf('.')!==-1">.{{ item.price.split('.')[1]}}</text>
											</view>
											<tui-numberbox class="tui-numberbox" :value="item.buyNum" :height="36" :width="64" :min="1" :index="index" @change="changeNum"></tui-numberbox>
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
					<tui-swipe-action :actions="actions2" @click.stop="handlerButton" :params="item">
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
											<tui-button type="danger" shape="circle" width="120rpx" height="48rpx" :size="24" @tap="onSearch(item.title)">找相似</tui-button>
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
					<tui-waterfall :listData="productList" :type="2" :pageSize="10">
						<template slot-scope="{ entity }" slot="left">
							<tGoodsItem :entity="entity" parent="cart" @select="onSelect"></tGoodsItem>
						</template>
						<template slot-scope="{ entity }" slot="right">
							<tGoodsItem :entity="entity" parent="cart" @select="onSelect"></tGoodsItem>	
						</template>
					</tui-waterfall>
				</view>
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
					<tui-button width="200rpx" height="70rpx" :size="30" type="danger" :disabled="buyNum==0" shape="circle" v-if="!isEdit" @click="btnPay">去结算({{buyNum}})</tui-button>
					<view v-else style="display: flex">
						<tui-button width="200rpx" height="70rpx" margin="0 20rpx" :size="30" type="danger" shape="circle" :plain="true" @tap="openActionSheet(1)">移入收藏</tui-button>
						<tui-button width="130rpx" height="70rpx" :size="30" type="danger" shape="circle" :plain="true" @tap="openActionSheet(2)">删除</tui-button>
					</view>
				</view>
			</view>
			<!--加载loadding-->
			<tui-loadmore v-if="loadding" :index="3" type="red"></tui-loadmore>
			<tui-actionsheet :show="showActionSheet" :tips="tips" :item-list="itemList" :mask-closable="maskClosable" :color="color"
				:is-cancel="isCancel" @click="actionClick" @cancel="closeActionSheet">
			</tui-actionsheet>
		</block>
	</view>
</template>

<script>
	import tGoodsItem from '@/components/views/t-goods-item/t-goods-item'
	export default {
		components: {
			tGoodsItem
		},
		data() {
			return {
				loadding: true,
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
				actions2: [
					{
						name: '删除',
						color: '#fff',
						fontsize: 28,
						width: 64,
						background: '#F82400'
					}
				],
				isEdit: false,
				pageIndex: 1,
				loadding: false,
				pullUpOn: true,
				showActionSheet: false,
				maskClosable: true,
				tips: "",
				itemList: [],
				color: "#9a9a9a",
				isCancel: true,
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
		},
		onLoad(){
			this.loadData()
		},
		watch: {
			cart: {
				deep: true,
				handler(v){
					// console.log('cart', v)
					this.calcHandle()
				}
			}
		},
		computed: {
			dataList() {
                return this.cart.filter((o)=>{return !o.invalid})
			},
			invalidList() {
				return this.cart.filter((o)=>{return o.invalid})
			},
			productList() {
				return this.$store.state.goodsList
			},
			cart() {
				return this.$store.state.cart
			}
		},
		methods: {
			loadData(fresh){
				if(fresh){ //下拉刷出新
					wx.hideNavigationBarLoading() //完成停止加载
					wx.stopPullDownRefresh() //停止下拉刷新
				}
				if(!this.tui.isLogin()) {
					uni.redirectTo({url: '/pages/my/login/login'})
				}else{
					// console.log('cart', this.cart)
					this.cart.forEach((o)=>{
						o.selected = false
						let goods = this.productList.find((product)=>{
							return product.skuList.findIndex((sku)=>{return (sku.skuId == o.skuId) && sku.stock>0}) !==-1
						})
						o.invalid = goods? false : true
					})
					let total = 0
					this.dataList.map((o) => {
						total += o.buyNum;
					})
					this.total = total
					this.loadding = false
				}
			},
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
				let goods = this.dataList[e.index]
				goods.buyNum = e.value
				let index = this.cart.findIndex((o)=>{return o.id===goods.id})
				this.cart[index].buyNum = e.value
				setTimeout(() => {
					this.updateCart()
				}, 0)  
			},
			handlerButton(e) {
				let index = e.index;
				let item = e.item;
				if(index===2 || index===0&&item.invalid){
					let _index = this.cart.findIndex((o)=>{return o.id === item.id})
					this.cart.splice(_index, 1)
					this.updateCart()
				}
				if(index===1){
					this.onSearch(item.title)
				}
			},
			editGoods() {
				this.isEdit = !this.isEdit;
			},
			detail(item) {
				uni.navigateTo({
					url: '/pages/index/productDetail/productDetail?spu_id=' + item.id
				})
			},
			onSelect(item){
				const sku = item.skuList[0]
				let newGoods = {
                    id: item.id,
                    skuId: sku.skuId,
                    price: sku.price,
                    title: item.title,
                    slogan: item.slogan,
                    defaultImageUrl: sku.src? sku.src : item.defaultImageUrl,
                    propertyList: sku.skuSpecValueList,
                    buyNum: 1,
					invalid: sku.stock<=0,
					select: false
                }
				let url = '/updateCustomer/' + uni.getStorageSync("pid") +'/updateCart'
				let index = this.cart.findIndex((o)=>{return o.skuId === newGoods.skuId})
				if(index===-1){
					this.cart.unshift(newGoods)
				}else{
					this.cart[index].buyNum +=newGoods.buyNum
				}
				this.tui.request(url, 'PUT', {'cart': this.cart}).then((res)=>{
					if(res.code==0){
						this.tui.toast('添加成功')
					}
				})
			},
			btnPay() {
				const goods = this.dataList.filter((o)=>{return o.selected})
				uni.navigateTo({
					url: '/pages/order/submitOrder/submitOrder?goods=' + JSON.stringify(goods) + '&mode=cart'
				})
			},
			onSearch(similarKey){
				uni.navigateTo({
					url: '/pages/index/productList/productList?similarKey='+ similarKey
				})
			},
			updateCart(){
				let url = '/updateCustomer/' + uni.getStorageSync("pid") +'/updateCart'
				this.tui.request(url, 'PUT', {'cart': this.cart}).then((res)=>{})
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
			actionClick: function(e) {
				if(e.type===2){
					this.dataList.map((item) => {
						if (item.selected) {
							let _index = this.cart.findIndex((o)=>{return o.id === item.id})
							this.cart.splice(_index, 1)
						}
					})
					if(this.dataList.length===0){
						this.isEdit = false
					}
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
			// this.pageIndex = 1;
			// this.pullUpOn = true;
			// this.loadding = false
			// uni.stopPullDownRefresh()
			this.loadData(true)
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
		width: 425rpx;
		padding: 10rpx;
        display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.tui-goods-title {
		white-space: normal;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		font-size: 30rpx;
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
		display: flex;
		align-items: align-center;
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
		font-size: 22rpx;
		flex: auto;
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

	.tui-sub-info {
		color: #888;
		font-size: 24rpx;
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
		z-index: 10;
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
		margin: 0 16rpx;
	}
</style>
