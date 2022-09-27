<template>
    <view>
        <tui-list-cell padding="0" @tap="detail(order, goods)" v-for="(goods,index) in order.goodsList" :key="index">
            <view class="tui-goods-item">
                <image :src=goods.defaultImageUrl class="tui-goods-img" mode="aspectFill"></image>
                <view class="tui-goods-center">
                    <view class="tui-goods-name">{{goods.title}}</view>
                    <view class="tui-goods-attr">{{goods.propertyList | getProperty}}</view>
                </view>
                <view class="tui-price-right">
                    <view>￥{{goods.price}}</view>
                    <view>x{{goods.buyNum}}</view>
                </view>
				<view class="tui-price-tag" v-if="type=='groupDetail'">{{goods.activityPeople}}人团</view>
            </view>
        </tui-list-cell>
    </view>
</template>

<script>
	export default {
        props: ['order', 'type', 'orderType'],
        filters: {
			getProperty(attr) {
				let str = ''
				attr.forEach(o=>{
					str = str + o.value + '，'
				})
				return str.slice(0,-1)
			},
		},
        methods:{
            detail(order, goods) {
				if(order.mode=='groupBuy'){
					if(order.status==='拼团中' || order.status==='拼团失败，已退款'){
						this.tui.href('/pages/my/myGroup/myGroup?orderNum=' + order.orderNum)
					}
					else{
						this.tui.href('/pages/my/orderDetail/orderDetail?order=' + encodeURIComponent(JSON.stringify(order)))
					}
				}else{
					if(this.type==='detail'){
                    	this.tui.href('/pages/index/productDetail/productDetail?spu_id=' + goods.id)
					}else if(this.type=='groupDetail'){
						this.tui.href('/pages/index/groupDetail/groupDetail?spu_id=' + goods.id + '&activity_id=' + order.activity)
					}else if(this.type=='group'){
						this.tui.href(`/pages/my/myGroupDetail/myGroupDetail?groupOrder=${JSON.stringify(order)}`);
					}
					else{
						if(order.refundNum){
							this.tui.href('/pages/my/refundDetail/refundDetail?order=' + encodeURIComponent(JSON.stringify(order)))
						}else{
							this.tui.href('/pages/my/orderDetail/orderDetail?order=' + encodeURIComponent(JSON.stringify(order)))
						}
					}

				}
			},
        }
    }
</script>

<style  scoped>
    .tui-goods-item {
		width: 100%;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
	}

	.tui-goods-img {
		width: 180rpx;
		height: 180rpx;
		display: block;
		flex-shrink: 0;
		border-radius: 8rpx;
	}

	.tui-goods-center {
		flex: 1;
		max-width: 460rpx;
		padding: 8rpx;
		margin-left: 10rpx;
		box-sizing: border-box;
	}

	.tui-goods-name {
		width: 90%;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		font-size: 28rpx;
		line-height: 32rpx;
	}

	.tui-goods-attr {
		font-size: 24rpx;
		color: #888888;
		line-height: 32rpx;
		padding-top: 5rpx;
		width: 90%;
		box-sizing: border-box;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.tui-price-right {
		text-align: right;
		font-size: 24rpx;
		color: #888888;
		line-height: 30rpx;
		padding-top: 8rpx;
	}
	.tui-price-tag {
		height: 38rpx;
		border: 1rpx solid #eb0909;
		border-radius: 6rpx;
		display: flex;
		position: absolute;
		right: 30rpx;
		bottom: 10rpx;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		line-height: 24rpx;
		transform: scale(0.8);
		transform-origin: 100% center;
		border-radius: 6rpx;
		padding: 0 8rpx;
		color: #eb0909;
		flex-shrink: 0;
	}

</style>