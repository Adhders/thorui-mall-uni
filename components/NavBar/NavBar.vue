<template>
    <view class="navbar"  :style="{ height: height + 'px', color: page.style.color,
            backgroundColor: page.style.isEmbedding? 'transparent': page.style.backgroundColor}">
        <block v-if="!page.style.isEmbedding">
            <view class="tui-header" :style="{ paddingTop: top + 'px',  height: menuHeight + 'px', color: page.style.color}" v-if="page.title">
                {{page.title}}
            </view>
            <view class="navbarBox" :style="{marginTop: top + 'px', width: width + 'px', height: menuHeight + 'px', lineHeight:menuHeight + 'px'}">
                <block v-if="page.style.isBack">
                    <view class="default-icon" v-if="page.style.groupBox==1" :style="{color: page.style.color}">
                        <tui-icon name="arrowleft" :size="18" class='icon' :color="page.style.color" @tap="onBack('arrowleft')"/>
                        <view class="split-line"></view>
                        <tui-icon name="home" class='icon' :size="18" :color="page.style.color" @tap="onBack('home')"/>
                    </view>
                    <tui-icon  v-else :name="page.style.iconClass" :size="24" :color="page.style.color"
                         @tap="onBack(page.style.iconClass)">
                    </tui-icon>
                </block>
                <view class="searchBox">
                    <tui-input v-if="page.style.searchBoxStyle" :size="24" color="#333"  placeholder="搜索关键词" isFillet :borderBottom="false"
                     @focus="onFocus" padding="0" backgroundColor="#f2f2f2" placeholderStyle="color: #b2b2b2">
                        <view slot="left">
                            <tui-icon name="search" :size="14" margin="0 5px 0 10px" color="#333"></tui-icon>
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
            flex-direction: row;
            justify-content: center;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .navbarBox{
            position: fixed;
            top: 0;
            left: 5px;
            display: flex;
            flex-direction: row;
            transform: translateZ(0);
            z-index: 9999;
            .default-icon {
                display: flex;
                align-items: center;
                flex-direction: row;
                border-radius: 20px;
                border: 1px solid #eaeaea;
                .icon{
                    margin: 0 10px;
                }
                .split-line {
                    opacity: 0.6;
                    height: 16px;
                    line-height: 32px;
                    border-right: 1px solid #eaeaea;
                }
            }
            .searchBox{
                margin: 0 40rpx;
                display: flex;
            }

        }
	}
</style>
