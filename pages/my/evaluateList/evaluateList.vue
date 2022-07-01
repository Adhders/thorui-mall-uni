<template>
    <view class="tui-order-item">
        <block v-for="(goods,index) in order.goodsList" :key="index">
            <tui-list-cell padding="0" @click="detail" v-if="order.reviewState[index].count<=1">
                <view class="tui-goods-item">
                    <image :src="goods.defaultImageUrl" class="tui-goods-img"></image>
                    <view class="tui-goods-center">
                        <view class="tui-goods-name">{{goods.title}}</view>
                        <view class="tui-goods-attr">{{goods.propertyList | getProperty}}</view>
                        <view class="tui-evalute-btn" >
                            <tui-button type="danger" plain width="120rpx" height="56rpx" :size="26" shape="circle" @click="addEvaluate(goods, index)">
                                {{order.reviewState[index].count===0? '评价': '追评'}}
                            </tui-button>
                        </view>
                    </view>
                </view>
            </tui-list-cell>
        </block>
        <tui-divider :size="28" :bold="true" color="#333" width="50%" v-if="isShow">已评价</tui-divider>
        <block v-for="(goods,index) in order.goodsList" :key="index">
            <tui-list-cell padding="0" @click="detail(goods)" v-if="order.reviewState[index].count>=2">
                <view class="tui-goods-item">
                    <image :src="goods.defaultImageUrl" class="tui-goods-img"></image>
                    <view class="tui-goods-center">
                        <view class="tui-goods-name">{{goods.title}}</view>
                        <view class="tui-goods-attr">{{goods.propertyList | getProperty}}</view>
                        <view class="tui-evalute-btn">
                           <view class="tui-message">感谢您的用心评价！</view>
                        </view>
                    </view>
                </view>
            </tui-list-cell>
        </block>
    </view>
</template>

<script>
    export default {
        data(){
            return {
                order: {
                    goodsList: [],
                    reviewState:[],
                }
            }
        },
        onLoad(options){
            this.order = JSON.parse(decodeURIComponent(options.order))
        },
        computed: {
            isShow(){
                return this.order.reviewState.findIndex(o=>{return o.count>=2}) !==-1
            }
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
            detail(goods) {    
				this.tui.href(
					'/pages/index/productDetail/productDetail?spu_id=' + goods.spu_id + '&sku_id=' + goods.id
				)
			},
            addEvaluate(goods, index){
                this.order.index = index
                const mode = this.order.reviewState[index].count? 'additional' : 'first'
                this.$store.commit('setTargetOrder', this.order)
                uni.navigateTo({
					url: '../addEvaluate/addEvaluate?mode=' + mode
				})
            }
        }
    }
</script>

<style>
    .tui-order-item {
		margin-top: 20rpx;
		border-radius: 10rpx;
		overflow: hidden;
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
        border-radius: 8rpx;
	}

	.tui-goods-center {
		flex: 1;
		padding: 8rpx;
        max-width: 460rpx;
		box-sizing: border-box;
	}

	.tui-goods-name {
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
		font-size: 22rpx;
		color: #888888;
		line-height: 32rpx;
		padding-top: 20rpx;
		width: 90%;
		box-sizing: border-box;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
    .tui-evalute-btn {
        float: right
    }
    /*.tui-message {*/
    /*    font-size: 24rpx;*/
    /*}*/
</style>
