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
			<tui-waterfall :listData="productList" :type="2" :pageSize="10" >
				<template slot-scope="{ entity }" slot="left">
					<tGoodsItem :entity="entity"></tGoodsItem>
				</template>
				<template slot-scope="{ entity }" slot="right">
					<tGoodsItem :entity="entity"></tGoodsItem>	
				</template>
			</tui-waterfall>
        </view>
		<tui-nomore text="没有更多了"></tui-nomore>
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
				productList: [],
				pageIndex: 1,
				loadding: false,
				pullUpOn: true,
			}
		},
		onLoad(){
			let goodsList = this.$store.state.goodsList
			this.productList = goodsList.filter((sku)=>{ 
				return sku.stock>0 
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
		margin: 0px 16rpx;
	}
</style>
