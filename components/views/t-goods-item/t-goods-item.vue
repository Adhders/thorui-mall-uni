<template>
	<view class="tui-pro-item" :class="[isList ? 'tui-flex-list' : '', {border: params.type==='3', shadow: params.type==='2'}]" 
	     :style="{ borderRadius: params.borderRadius*2 + 'rpx'}" hover-class="tui-hover" :hover-start-time="150">
		<image :src="entity.defaultImageUrl" @tap="detail(entity)" class="tui-pro-img"  :style="{borderRadius: params.type!='1'? 0 : params.borderRadius*2 + 'rpx'}"
			:mode="isList? 'aspectFill': 'widthFix'" :class="[isList? 'tui-proimg-list' : '']" />
		<!-- <view class="image-tag" v-if="params.showTags" >
			<image  class="img" style="width: 53px; height: 15px" mode="widthFix" src="https://system.chuangbiying.com/static/images/mini/listTpl_goods.png"/>
		</view> -->
		<view class="tui-pro-content">
			<view class="tui-pro-tit">{{entity.title}}</view>
			<view class="tui-sub-info">{{entity.slogan}}</view>
			<view class="label-box" v-if="params.showTags">
				<tui-tag type="green" padding="10rpx" scaleMultiple="0.8" size="24rpx" v-for="(tag) in entity.selectedTag" :key="tag.name">
					{{tag.name}}
				</tui-tag>
			</view>
			<view class="tui-pro-pay" v-if="params.showSales">{{ entity.salesNum }}人付款</view>
			<view class="icon-box">
				<view class="tui-pro-price">
					<text class="tui-size-24">￥</text>
					<text class="tui-sale-price">{{entity.integerPrice}}</text>
					<text class="tui-size-24" v-if="entity.decimalPrice">.{{entity.decimalPrice}}</text>
					<text class="tui-factory-price" v-if="params.showPrice && entity.originalPrice">￥{{ entity.originalPrice }}</text>
				</view>
				<tui-icon name="cart" :size="32" unit="rpx" color="#e41f19" @tap.stop="detail(entity, true)" v-if="params.showCart"></tui-icon>
			</view>
		</view>
		<!-- 当mode为list时，addCart组件会跟随scroll-view一起滚动，addCart组件要放到list页面里才能避免一起滚动-->
		<!-- <popup-box ref="popup" @add="onAdd" v-if="mode!=='list'"></popup-box> -->
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
					type: '2',
					scrollTop: '0',
					borderRadius: 5,
					showTags: true,
					showSales: true,
					showCart: true,
					showPrice: true,
				}
			}
		},
		isList: {
			type: Boolean,
			default: false,
		},
		mode: {
			type: String,
			default: '',
		}
	},
	data() {
		return {
		}
	},
	methods: {
		detail(item, buy) {
			uni.navigateTo({
				url: '/pages/index/productDetail/productDetail?spu_id=' + item.spu_id + '&sku_id=' + item.id + (buy? '&buy=true': '')
			})
		}
	}
};
</script>

<style scoped lang="less">
.tui-pro-item {
	position: relative;
	width: 100%;
	margin-bottom: 16rpx;
	background: #fff;
	box-sizing: border-box;
	overflow: hidden;
	transition: all 0.15s ease-in-out;
	&.shadow{box-shadow: 0 4px 24px 0 rgba(100, 100, 100, 0.1)}
    &.border{border: 2rpx solid #e0e0e0}
	.image-tag{
		position: absolute;
		top: 0;
		left: 0;
	}
	.label-box{
		margin-left: -10rpx;
		display: flex;
		flex-direction: row;
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
		max-width: 460rpx;
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
	.tui-pro-tit {
		color: #2e2e2e;
		font-size: 28rpx;
		line-height: 32rpx;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
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
	.tui-pro-pay {
		font-size: 24rpx;
		color: #656565;
	}
	.icon-box{
		display: flex;
		align-items: baseline;
		flex-direction: row;
		justify-content: space-between;
		width: 100%;
		// height: 60rpx;
		.tui-pro-price {
			padding-top: 10rpx;
			flex: auto;
			display: inline;
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
		}
	}
}

</style>
