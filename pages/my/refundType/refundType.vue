<template>
    <view class="container">
		<view class="tui-order-item">
			<tui-list-cell padding="20rpx 30rpx" :hover="false" :lineLeft="false">
				<view class="tui-goods-title"><view>商品信息</view></view>
			</tui-list-cell>
			<tOrderItem :order="order"></tOrderItem>
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

import tOrderItem from '@/components/views/t-order-item/t-order-item'
export default {
	components: {
		tOrderItem
	},
	data() {
		return {
            order: {}
        }
    },
    onLoad(options){
		this.order = JSON.parse(decodeURIComponent(options.order))
    },
    methods: {
        goto(refundType){
            this.tui.href('/pages/my/refund/refund?refundType=' + refundType + '&order=' + encodeURIComponent(JSON.stringify(this.order)))
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
.tui-list-cell {
    display: flex; 
    align-items: center; 
    width: 100%; 
    padding: 24rpx 30rpx;
}
</style>