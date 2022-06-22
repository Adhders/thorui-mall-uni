<template>
	<view class="tui-pro-item" :class="[isList ? 'tui-flex-list' : '', {border: params.type==='3',shadow: params.type==='2'}]" 
	     :style="{ borderRadius: params.borderRadius*2 + 'rpx'}" hover-class="tui-hover" :hover-start-time="150" @tap="detail(entity)">
		<image :src="entity.defaultImageUrl" class="tui-pro-img" mode="widthFix" :class="[isList ? 'tui-proimg-list' : '']" />
		<view class="image-tag" v-show="params.showTags">
			<image  class="img" style="width: 53px; height: 15px" mode="widthFix" src="https://system.chuangbiying.com/static/images/mini/listTpl_goods.png"/>
		</view>
		<view class="tui-pro-content">
			<view class="tui-pro-tit">{{entity.title}}</view>
			<view class="tui-sub-info">{{entity.slogan}}</view>
			<view class="label-box" v-if="params.showTags">
				<image  class="img" style="width: 24px" src="https://system.chuangbiying.com/static/images/mini/listTpl_member.png"/>
				<image  class="img" style="width: 37px" src="https://system.chuangbiying.com/static/images/mini/listTpl_limit.png"/>
			</view>
			<view class="tui-pro-pay" v-show="params.showSales">{{ entity.salesNum }}人付款</view>
			<view class="icon-box">
				<view class="tui-pro-price">
					<text class="tui-size-24">￥</text>
					<text class="tui-sale-price">{{entity.integerPrice}}</text>
					<text class="tui-size-24" v-if="entity.decimalPrice">.{{entity.decimalPrice}}</text>
					<text class="tui-factory-price" v-if="params.showPrice && entity.originalPrice">￥{{ entity.originalPrice }}</text>
				</view>
				<tui-icon name="cart" :size="16" color="#e41f19" @tap.stop="addCart(entity)" v-show="params.showCart"></tui-icon>
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
		params: {
			type: Object,
			default(){
				return {
					type: '',
					borderRadius: 5,
					showTags: false,
					showSales: true,
					showCart: true,
					showPrice: true,
				}
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
				valid: true,
				spu_id: item.spu_id,
				price: item.price,
				title: item.title,
				slogan: item.slogan,
				defaultImageUrl: item.defaultImageUrl,
				propertyList: item.selectedGoodsAttrList,
				buyNum: 1
			}
			if(!this.tui.isLogin()) {
				uni.navigateTo({url: '/pages/my/login/login'})
			}else{
				let url = '/updateCustomer/' + uni.getStorageSync("pid") +'/addCart'
				this.tui.request(url, 'PUT', {'newGoods': newGoods}).then(res=>{
					if(res.code==='0'){
						this.$emit('add', newGoods)
						this.tui.toast('成功添加到购物车')
					}
				})
			}
		},
	}
};
</script>

<style scoped lang="less">
.tui-pro-item {
	position: relative;
	width: 100%;
	margin-bottom: 10rpx;
	background: #fff;
	box-sizing: border-box;
	overflow: hidden;
	transition: all 0.15s ease-in-out;
	&.shadow{box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.1)}
    &.border{border: 2rpx solid #e0e0e0}
	.image-tag{
		position: absolute;
		top: 0;
		left: 0;
	}
	.label-box{
		display: flex;
		.img{
			height: 28rpx;
			margin-right: 10rpx;
		}
	}
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
    padding: 5rpx 0;
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
 .icon-box{
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	height: 60rpx;
 }

.tui-pro-pay {
	font-size: 24rpx;
	color: #656565;
}

</style>
