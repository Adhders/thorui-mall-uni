<template>
	<view class="container">
        <tui-no-data  :fixed="false" :size="24"  backgroundColor="#ccc"
            imgUrl="https://system.chuangbiying.com/static/images/index/img_nodata.png">
            <text class="tui-message">商品已下架</text>
        </tui-no-data>
    
        <!--猜你喜欢-->
        <tui-divider :size="28" :bold="true" color="#333" width="50%">
        <text class="tui-youlike">试试其它宝贝</text>
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
                                <text class="tui-size-24" v-show="item.price.indexOf('.')!==-1">.{{ item.price.split('.')[1]}}</text>
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
	</view>
</template>

<script>
	export default {
		data() {
			return {
				productList: [],
				pageIndex: 1,
				loadding: false,
				pullUpOn: true,
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
		onLoad(){
			let goodsList = this.$store.state.goodsList
			this.productList = goodsList.filter((sku)=>{ 
				let index = this.cart.findIndex((o) => {return sku.id === o.id})
				return sku.stock>0 && index ===-1
			})
		},
		methods: {
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
		}
	}
</script>

<style scoped>
    .container{
		padding-top: 10rpx;
	}
    
	.tui-message {
		font-size: 24rpx;
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
		padding-top: 18rpx;
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
