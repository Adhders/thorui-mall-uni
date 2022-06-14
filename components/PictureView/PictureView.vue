<template>
    <view
        :style="{
            marginRight: (item.style.layout==='shu')? item.style.pageMargin*2 + 'rpx': 0,
            marginLeft: (item.style.layout==='shu')? item.style.pageMargin*2+ 'rpx': 0,
            marginBottom: item.style.bottomMargin*2 + 'rpx',
            marginTop: item.style.topMargin*2 + 'rpx'}">
         <view v-if="item.style.layout==='shu'">
            <view class="picture" v-for="(img,index) in item.content.imgList" :key="index"
                :class="{border: item.style.type==='3',shadow: item.style.type==='2'}"
                :style="{
                    marginBottom: item.style.space*2 + 'rpx',
                    borderRadius: item.style.borderRadius*2 + 'rpx',
                    overflow: 'hidden' }">
                <image :src="img.src" class="img" mode="widthFix" :style="{borderRadius: item.style.type!=='1'? 0 : item.style.borderRadius*2 + 'rpx'}"/>
                <view class="title" v-show="item.style.showTitle!=='0'"
                    :style="{color: item.style.color, textAlign: item.style.textAlign}">
                    <view>{{img.title}}</view>
                </view>
            </view>
        </view>
        <view v-if="item.style.layout==='waterfall'" class="waterfall">
            <tui-waterfall :listData="item.content.imgList" :params="item.style" :type="2" :pageSize="10">
				<template slot-scope="{ entity, params}" slot="left"> 
                    <div class="picture" :class="{border: params.type==='3',shadow: params.type==='2'}"
                         :style="{ borderRadius: params.borderRadius + 'rpx'}">
                        <image class='img' :src="entity.src" mode="widthFix"
                            :style="{borderRadius: params.type!=='1'? 0 : params.borderRadius + 'rpx'}"/>
                        <div class="title-box" v-show="params.showTitle!=='0'"
                            :style="{color: params.color, textAlign: params.textAlign}">
                            <div>{{entity.title}}</div>
                        </div>
                    </div>
				</template>
				<template slot-scope="{ entity, params }" slot="right">
                     <div class="picture" :class="{border: params.type==='3',shadow: params.type==='2'}"
                         :style="{ borderRadius: params.borderRadius + 'rpx'}">
                        <image class='img' :src="entity.src" mode="widthFix"
                            :style="{borderRadius: params.type!=='1'? 0 : params.borderRadius + 'rpx'}"/>
                        <div class="title-box" v-show="params.showTitle!=='0'"
                            :style="{color: params.color, textAlign: params.textAlign}">
                            <div>{{entity.title}}</div>
                        </div>
                    </div>
				</template>
			</tui-waterfall>
        </view>
        <view v-if="item.style.layout==='huadong'" >
           <scroll-view class="scroll-view_H" scroll-x="true" @scroll="scroll">
                <view class="scroll-view-item_H" v-for="(img, index) in item.content.imgList" :key="index">
                    <view :style="{
                        overflow: 'hidden',
                        width: item.style.width*2 + 'rpx',
                        flex: '0 0 auto',
                        borderRadius: item.style.borderRadius + 'rpx',
                        marginRight: item.style.space + 'rpx'}">
                        <image class='img' :src='img.src' mode="widthFix" :style="{borderRadius: item.style.type!=='1'? 0 : item.style.borderRadius + 'rpx'}"/>
                    </view>
                    <view class="title" v-show="item.style.showTitle!=='0'"
                        :style="{color: item.style.color, textAlign: item.style.textAlign}">
                        <view>{{img.title}}</view>
                    </view>
                </view>
           </scroll-view>
        </view>
    </view>
</template>

<script>
    export default {
        props: ['item'],
        data() {
			return {
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
                list: []
            }
		},
        methods: {
            scroll: function(e) {
				this.old.scrollTop = e.detail.scrollTop
			},
        },
    }
</script>

<style scoped lang="scss">
    .img{
        width: 100%;
    }
    .title{
        width: 100%;
        font-weight: 700;
        font-size: 24rpx;
        word-wrap: break-word;
        white-space:normal;
        padding: 10rpx 10rpx;
    }
    .scroll-view_H {
		white-space: nowrap;
		width: 100%;
	}
	.scroll-view-item {
		height: 300rpx;
		line-height: 300rpx;
		text-align: center;
		font-size: 36rpx;
	}
	.scroll-view-item_H {
		display: inline-block;
		/*line-height: 300rpx;*/
		text-align: center;
		font-size: 36rpx;
	}
    .waterfall{
        margin: 0 10rpx !important;
        .picture{
            margin-bottom: 20rpx;
        }
    }
    .rollingBox{
        display:flex;
        overflow:hidden;
        .picture{  
            flex: 0 0 auto;
            margin-bottom: 20rpx;
        }
    }
    .picture{
        overflow: hidden;
        margin-block: 10rpx;
        .title-box{
            font-size: 28rpx;
            text-align: left;
            word-wrap: break-word;
            white-space:normal;
            word-break:break-all;
            padding: 10rpx 0;
            margin: 0 10rpx;
            overflow: hidden;
        }
        &.shadow{box-shadow: 0 4rpx 24rpx 0 rgba(0, 0, 0, 0.1)}
        &.border{border: 2rpx solid #e0e0e0}
    }
</style>
