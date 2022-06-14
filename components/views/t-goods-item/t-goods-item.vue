<template>
	<view class="tui-pro-item" :class="[isList ? 'tui-flex-list' : '']"  hover-class="tui-hover" :hover-start-time="150" @tap="detail(entity)">
		<image :src="entity.defaultImageUrl" class="tui-pro-img" mode="widthFix" :class="[isList ? 'tui-proimg-list' : '']" />
		<view class="tui-pro-content">
			<view class="tui-pro-tit">{{entity.title}}</view>
			<view class="tui-sub-info">{{entity.slogan}}</view>
			<view class="tui-pro-price">
				<text class="tui-size-24">￥</text>
				<text class="tui-sale-price">{{entity.integerPrice}}</text>
				<text class="tui-size-24" v-if="entity.decimalPrice">.{{entity.decimalPrice}}</text>
				<text class="tui-factory-price">￥{{ entity.originalPrice }}</text>
			</view>
			<view class="tui-cart">
				<view class="tui-pro-pay">{{ entity.salesNum }}人付款</view>
				<tui-icon name="cart" :size="16" color="#e41f19" @tap.stop="addCart(entity)"></tui-icon>
			</view>
		</view>
	</view>		
</template>

<script>
export default {
	name: 'tGoodsItem',
	props: {
		entity: {
			type: Object,
			default() {
				return {};
			}
		},
		isList: {
			type: Boolean,
			default: false,
		}
	},
	data() {
		return {}
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
	}
};
</script>

<style scoped lang="less">
.tui-pro-item {
	width: 100%;
	margin-bottom: 10rpx;
	background: #fff;
	box-sizing: border-box;
	border-radius: 12rpx;
	overflow: hidden;
	transition: all 0.15s ease-in-out;
}
.tui-proimg-list {
	width: 240rpx !important;
	height: 240rpx !important;
	flex-shrink: 0;
	border-radius: 10rpx;
}
.tui-flex-list {
	display: flex;
	.tui-pro-content{
		max-width: 470rpx;
	}
}
.tui-pro-img {
	width: 100%;
	display: block;
}

.tui-pro-content {
	display: flex;
	flex: auto;
	flex-direction: column;
	justify-content: space-between;
	box-sizing: border-box;
	padding: 20rpx;
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

</style>
