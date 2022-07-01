<template>
    <view class="tui-divider" :style="{height: item.style.height*2+'rpx'}">
		<view class="tui-divider-line"
             :style="{ width: item.style.width+'%',
                 background: getBgColor(item.style.gradual,['#eee', '#ccc'], item.style.lineColor) }">
        </view>
		<view
			class="tui-divider-text"
			:style="{
		        color: item.style.color,
		        fontSize: item.style.fontSize*2 + 'rpx',
		        lineHeight: item.style.fontSize*2  + 'rpx',
		        backgroundColor: item.style.backgroundColor,
		        fontWeight: item.style.isBold ? 'bold' : 'normal' }">
			{{item.content.title}}
		</view>
	</view>
</template>

<script>
    export default {
        props: ['item'],
        methods: {
            getBgColor: function(gradual, gradualColor, dividerColor) {
                let bgColor = dividerColor;
                if (gradual) {
                    bgColor = 'linear-gradient(to right,' + gradualColor[0] + ',' + gradualColor[1] + ',' + gradualColor[1] + ',' + gradualColor[0] + ')';
                }
                return bgColor;
            }
        }
    }
</script>

<style scoped>
    .tui-divider {
        width: 100%;
        position: relative;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        overflow: hidden;
    }
    .tui-divider-line {
        position: absolute;
        height: 1rpx;
        top: 50%;
        left: 50%;
        -webkit-transform: scaleY(0.5) translateX(-50%) translateZ(0);
        transform: scaleY(0.5) translateX(-50%) translateZ(0);
    }
    .tui-divider-text {
        position: relative;
        text-align: center;
        padding: 0 20rpx;
        z-index: 1;
    }
</style>

