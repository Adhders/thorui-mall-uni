<template>
    <view :style="{
        marginTop: item.style.topMargin*2 + 'rpx',
        marginBottom: item.style.bottomMargin*2+ 'rpx',
    }">
        <tui-list-view>
            <tui-list-cell padding="8rpx 0"
             :backgroundColor=item.style.backgroundColor
             :size=item.style.fontSize*2
             :color=item.style.color @click="onClick">
                <view class="tui-item-box" >
					<view class="line" :style="{background: item.style.color, height: item.style.fontSize*2+'rpx'}"
                        v-if="item.style.showLine"></view>
					<view class="tui-list-cell_name" :style="{bold: item.style.isBold}">{{item.content.title}}</view>
					<view class="tui-right" v-if="item.style.entryStyle!=='arrow'" :style="{color: item.style.iconColor}">
                        {{item.style.entryContent}}
                    </view>
                    <tui-icon name="arrowright" v-if="item.style.entryStyle!=='text'" :size="18" :color="item.style.iconColor">
                    </tui-icon>
				</view>
            </tui-list-cell>
        </tui-list-view>
    </view>
</template>

<script>
    export default {
        props: ['item'],
        methods: {
            onClick(){
				this.$emit('goto', this.item.content.chooseLink)
        	}
        }
    }
</script>

<style lang="scss" scoped>
    .tui-item-box {
        margin-right: 10rpx;
        line-height: 44rpx;
		display: flex;
		align-items: center;
	}

	.tui-list-cell_name {
		margin-left: 10rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-right {
		margin-left: auto;
		font-size: 24rpx;
		color: #999;
	}
    .line{
        display: inline-block;
        position: relative;
        width: 8rpx;
        opacity: 1;
        margin-left: 10rpx;
        border-radius: 20rpx;
    }
</style>
