<template>
    <view
        :style="{
            marginRight: (item.style.layout==='shu')? item.style.pageMargin*2 + 'rpx': 0,
            marginLeft: (item.style.layout==='shu')? item.style.pageMargin*2+ 'rpx': 0,
            marginBottom: item.style.bottomMargin*2 + 'rpx',
            marginTop: item.style.topMargin*2 + 'rpx'}">
         <view v-if="item.style.layout==='shu'">
            <view class="picture" v-for="(img,index) in item.content.imgList" :key="index"
                :class="{border: item.style.type=='3',shadow: item.style.type=='2'}"
                :style="{
                    marginBottom: item.style.space*2 + 'rpx',
                    borderRadius: item.style.borderRadius*2 + 'rpx',
                    overflow: 'hidden' }">
                <image :src="img.src" class="img" mode="widthFix" @tap="onClick(img)"
                     :style="{borderRadius: item.style.type!='1'? 0 : item.style.borderRadius*2 + 'rpx'}"/>
                <view class="title" v-show="item.style.showTitle!=='0'"
                    :style="{color: item.style.color, textAlign: item.style.textAlign}">
                    {{img.title}}
                </view>
            </view>
        </view>
        <view v-if="item.style.layout==='waterfall'" class="waterfall">
            <tui-waterfall :listData="item.content.imgList" :params="item.style" :type="2" :pageSize="10">
				<template slot-scope="{ entity, params}" slot="left"> 
                    <view class="picture" :class="{border: params.type=='3',shadow: params.type=='2'}"
                         :style="{ borderRadius: params.borderRadius + 'rpx'}">
                        <image class='img' :src="entity.src" mode="widthFix" @tap="onClick(entity)"
                            :style="{borderRadius: params.type!='1'? 0 : params.borderRadius + 'rpx'}"/>
                        <view class="title" v-show="params.showTitle!=='0'"
                            :style="{color: params.color, textAlign: params.textAlign}">
                            {{entity.title}}
                        </view>
                    </view>
				</template>
				<template slot-scope="{ entity, params }" slot="right">
                     <view class="picture" :class="{border: params.type=='3',shadow: params.type=='2'}"
                         :style="{ borderRadius: params.borderRadius + 'rpx'}">
                        <image class='img' :src="entity.src" mode="widthFix" @tap="onClick(entity)"
                            :style="{borderRadius: params.type!='1'? 0 : params.borderRadius + 'rpx'}"/>
                        <view class="title" v-show="params.showTitle!=='0'"
                            :style="{color: params.color, textAlign: params.textAlign}">
                            {{entity.title}}
                        </view>
                    </view>
				</template>
			</tui-waterfall>
        </view>
        <view v-if="item.style.layout==='huadong'" >
           <scroll-view class="scroll-view_H" scroll-x="true" @scroll="scroll">
                <view class="scroll-view-item_H picture" v-for="(img, index) in item.content.imgList" :key="index" :class="{border: item.style.type=='3',shadow: item.style.type=='2'}">
                    <view :style="{
                        width: item.style.width*2 + 'rpx',
                        borderRadius: item.style.borderRadius*(item.style.width/150) + 'rpx',
                        marginRight: item.style.space + 'rpx'}">
                        <image class='img' :src='img.src' mode="widthFix" @tap="onClick(img)"
                            :style="{borderRadius: item.style.type!='1'? 0 : item.style.borderRadius*(item.style.width/150) + 'rpx'}"/>
                    </view>
                    <view class="title" v-show="item.style.showTitle!=='0'"
                        :style="{width: item.style.width*2 + 'rpx', color: item.style.color, textAlign: item.style.textAlign}">
                        {{img.title}}
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
            }
		},
        methods: {
            onClick(v){
				this.$emit('goto', v.chooseLink)
        	}
        },
    }
</script>

<style scoped lang="scss">
    .scroll-view_H {
		white-space: nowrap;
		width: 100%;
	}
	.scroll-view-item_H {
		display: inline-block;
		text-align: center;
         .title{
            overflow: hidden;
            text-overflow: ellipsis;
            box-sizing: border-box;
            white-space: nowrap !important;
            overflow: hidden;
            text-overflow: ellipsis;
        }
	}
    .waterfall{
        margin: 0 10rpx !important;
        .picture{
            margin-bottom: 10rpx;
        }
    }
    .picture{
        overflow: hidden;
         .img{
            width: 100%;
        }
        .title{
            font-size: 26rpx;
            word-wrap: break-word;
            white-space:normal;
            padding: 10rpx 10rpx;
        }
        &.shadow{box-shadow: 0 4rpx 24rpx 0 rgba(0, 0, 0, 0.1)}
        &.border{border: 2rpx solid #e0e0e0}
    }
</style>
