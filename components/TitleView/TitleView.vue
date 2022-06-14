<template>
    <view :style="{
        marginTop: item.style.topMargin*2 + 'rpx',
        marginBottom: item.style.bottomMargin*2+ 'rpx',
    }">
        <tui-list-view>
            <tui-list-cell :arrow="item.style.entryStyle!=='text'" padding="8rpx 0"
             :backgroundColor=item.style.backgroundColor
             :size=item.style.fontSize*2
             :color=item.style.color @click="onClick">
                <view class="tui-item-box" >
					<tui-icon name="shop-fill" :size="23" color="#ed3f14"></tui-icon>
					<view class="tui-list-cell_name" :style="{bold: item.style.isBold}">{{item.content}}</view>
					<view class="tui-right" :style="{color: item.style.iconColor}">{{item.style.entryContent}}</view>
				</view>
            </tui-list-cell>
        </tui-list-view>
    </view>
</template>

<script>
    export default {
        props: ['item'],
        methods: {
            onClick(e){
                console.log('e')
            }
        }
    }
</script>

<style lang="scss" scoped>
    .tui-item-box {
		width: 100%;
		display: flex;
		align-items: center;
	}

	.tui-list-cell_name {
		padding-left: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-right {
		margin-left: auto;
		margin-right: 34rpx;
		font-size: 26rpx;
		color: #999;
	}
</style>
