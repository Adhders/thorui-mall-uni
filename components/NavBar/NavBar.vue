<template>
    <view class="navbar"  :style="{ height: height + 'px', color: page.style.color,
            backgroundColor: page.style.isEmbedding? 'transparent': page.style.backgroundColor}">
        <block v-if="!page.style.isEmbedding">
            <view class="tui-header" :style="{ paddingTop: top + 'px',  height: menuHeight + 'px', color: page.style.color}">
                {{page.title}}
            </view>
            <view class="navbarBox" :style="{marginTop: top + 'px', width: width + 'px', height: menuHeight + 'px'}">
                <tui-icon :name="page.style.iconClass" :size="24" :color="page.style.color" v-if="page.style.isBack"
                 :style="{lineHeight: menuHeight + 'px'}" @tap="onBack(page.style.iconClass)"></tui-icon>
                <view class="searchBox" :style="{lineHeight: menuHeight-2 + 'px'}">
                    <tui-input v-if="page.style.searchBoxStyle" :size="24"  placeholder="搜索关键词" isFillet inputBorder  @focus="onFocus" padding="0">
                        <view slot="left">
                            <tui-icon name="search" :size="32" unit="rpx" margin="0 5px 0 10px"></tui-icon>
                        </view>
                    </tui-input>
                </view>
            </view>
        </block>    
    </view>
</template>

<script>
    export default{
        props: ['page'],
        data(){
            return {
                width: 200,
                top: getApp().globalData.menuTop,
                menuWidth: getApp().globalData.menuWidth,
                menuHeight: getApp().globalData.menuHeight,
                height: getApp().globalData.navBarHeight
            }
        },
        mounted(){
            this.width = getApp().globalData.windowWidth - this.menuWidth - 10*2
        },
        methods: {
            onBack(iconClass){
                this.$emit('back', iconClass)
            },
            onFocus(){
                 uni.navigateTo({
					url: '/pages/common/search/search'
				});
            },
        }
    }
</script>

<style lang="less" scoped>
    .navbar {
        width: 100%;
		position: fixed;
		left: 0;
		top: 0;
        background-color: #fff;
		z-index: 995;
        .tui-header {
            width: 100%;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .navbarBox{
            position: fixed;
            top: 0;
            left: 10px;
            display: flex;
            transform: translateZ(0);
            z-index: 9999;
            .searchBox{
                margin: 0 auto;
                width: 80%;
            }
        }
	}
</style>
