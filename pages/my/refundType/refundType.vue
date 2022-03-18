<template>
    <view class="container">
		<view class="tui-order-item">
			<tui-list-cell padding="20rpx 30rpx" :hover="false" :lineLeft="false">
				<view class="tui-goods-title"><view>商品信息</view></view>
			</tui-list-cell>
			<block v-for="(item, index) in order.goodsList" :key="index">
				<tui-list-cell padding="0" @click="detail(order)">
					<view class="tui-goods-item">
						<image :src="item.defaultImageUrl" class="tui-goods-img"></image>
						<view class="tui-goods-center">
							<view class="tui-goods-name">{{item.title}}</view>
							<view class="tui-goods-attr">{{item.propertyList | getProperty}}</view>
						</view>
						<view class="tui-price-right">
							<view>￥{{item.price}}</view>
							<view>x{{item.buyNum}}</view>
						</view>
					</view>
				</tui-list-cell>
			</block>
		</view>
        <view style="margin-top: 20rpx">
            <tui-list-cell arrow>
                <view class="tui-list-cell" @tap="goto('换货')">
                    <iconfont name='icon-huanhuo' color='#eea056' style="margin-right: 10px"></iconfont>
                    <text class="tui-text">换货</text>
                </view>
            </tui-list-cell>
            <tui-list-cell arrow>
                <view class="tui-list-cell" @tap="goto('退货退款')">
                    <iconfont name='icon-tuihuo' color= '#e41f19' style="margin-right: 10px" ></iconfont>
                    <text class="tui-text">退货退款</text>
                </view>
            </tui-list-cell>
        </view>
    </view>
</template>

<script>
export default {
	data() {
		return {
            order: {}
        }
    },
    onLoad(){
		this.order = this.$store.state.targetOrder
    },
    filters: {
		getProperty(attr) {
			let str = ''
			attr.forEach(o=>{
				str = str + o.value + '，'
			})
			return str.slice(0,-1)
		},
	},
    methods: {
        goto(refundType){
            console.log(refundType)
            this.tui.href('/pages/my/refund/refund?refundType=' + refundType)
        }
    }

}
</script>


<style scoped>

.tui-order-item {
	margin-top: 20rpx;
	border-radius: 10rpx;
	overflow: hidden;
}

.tui-goods-title {
	width: 100%;
	font-size: 28rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

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
}

.tui-goods-center {
	flex: 1;
	padding: 20rpx 8rpx;
	box-sizing: border-box;
}

.tui-goods-name {
	max-width: 310rpx;
	word-break: break-all;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	font-size: 26rpx;
	line-height: 32rpx;
}

.tui-goods-attr {
	font-size: 22rpx;
	color: #888888;
	line-height: 32rpx;
	padding-top: 20rpx;
	word-break: break-all;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
}

.tui-price-right {
	text-align: right;
	font-size: 24rpx;
	color: #888888;
	line-height: 30rpx;
	padding-top: 20rpx;
}

.tui-refund__form {
	margin-top: 20rpx;
}
.tui-list-cell {
    display: flex; 
    align-items: center; 
    width: 100%; 
    padding: 24rpx 30rpx;
}
</style>