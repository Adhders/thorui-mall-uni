<template>
    <view :style="{
        marginBottom: item.style.bottomMargin*2 + 'rpx',
        marginTop: item.style.topMargin*2 + 'rpx'}">
        <view class="displayBox type1" v-if="item.style.layout==='1'">
            <view class="merchandise-item" v-for="(product,index) in goodsList" :key="index"
                :class="{border: item.style.type=='3',shadow: item.style.type=='2'}"
                :style="{borderRadius: item.style.borderRadius*2 + 'px'}">
                 <image class='img' mode="widthFix" :style="{
                    height: (item.style.scale==='0')? '300rpx' : '600rpx',
                    borderRadius: item.style.type!='1' ? 0 : item.style.borderRadius*2 + 'rpx' }"
                    :src=product.defaultImageUrl  @tap.stop="detail(product)" />
                <!-- <view class="image-tag" v-if="item.style.showTags">
                    <image  class="img" style="width: 53px; height: 15px" src="https://system.chuangbiying.com/static/images/mini/listTpl_goods.png"/>
                </view> -->
                <view class="price-panel">
                    <view class="title"><span>{{product.title}}</span></view>
                    <view class="tui-sub-info">{{product.slogan}}</view>
                    <view class="label-box" v-if="item.style.showTags">
                        <tui-tag type="green"  padding="10rpx" scaleMultiple="0.8" size="24rpx" v-for="tag in product.selectedTag" :key="tag.name">{{tag.name}}</tui-tag>
                    </view>
                    <view class="icon-box">
                        <view class="price">
                            <text class="price-unit">¥</text>
                            <text class="price-val">{{product.integerPrice}}</text>
                            <text class="dot-val" v-if="product.decimalPrice">.{{product.decimalPrice}}</text>
                            <text class="del-val" v-if="item.style.showPrice">¥{{product.originalPrice}}</text>
                        </view>
                        <view class="saled-out" v-if="item.style.showSales">已售{{numFormat(product.salesNum)}}件</view>
                        <tui-icon name="cart" :size="32" unit="rpx" color="#e41f19" @tap.stop="onSelect(product)" v-if="item.style.showCart"></tui-icon>
                    </view>
                </view>
            </view>
        </view>
        <view class="type2" v-if="item.style.layout==='2'">
            <tui-waterfall :listData="goodsList" :params="item.style" :type="2">
				<template slot-scope="{ entity, params }" slot="left"> 
                    <tGoodsItem :entity="entity" :params="params"></tGoodsItem>
				</template>
				<template slot-scope="{ entity, params }" slot="right">
                    <tGoodsItem :entity="entity" :params="params"></tGoodsItem>
				</template>
			</tui-waterfall>
        </view>
        <view class="displayBox type4" v-if="item.style.layout==='4'">
            <view class="merchandise-item" v-for="(product,index) in goodsList" :key="index"
                :class="{border: item.style.type=='3',shadow: item.style.type=='2'}"
                :style="{borderRadius: item.style.borderRadius*2 + 'rpx'}">
                <image class='img' style="minWidth: 240rpx; width: 240rpx; height: 240rpx" :src=product.defaultImageUrl  mode="aspectFill"
                :style="{borderRadius: item.style.type!='1'? 0 : item.style.borderRadius*2 + 'rpx'}"  @tap.stop="detail(product)" />
                <!-- <view class="image-tag" v-if="item.style.showTags">
                    <img class="img" style="width: 53px; height: 15px" src="https://system.chuangbiying.com/static/images/mini/listTpl_goods.png">
                </view> -->
                <view class="price-panel type4">
                    <view class="title"><text>{{product.title}}</text></view>
                    <view class="tui-sub-info">{{product.slogan}}</view>
                    <view class="label-box" v-if="item.style.showTags">
                       <tui-tag type="green"  padding="10rpx" scaleMultiple="0.8" size="24rpx" v-for="tag in product.selectedTag" :key="tag.name">
                       {{tag.name}}</tui-tag>
                    </view>
                    <view class="saled-out" v-if="item.style.showSales">已售{{numFormat(product.salesNum)}}件</view>
                    <view class="icon-box">
                        <view class="price">
                            <text class="price-unit">¥</text>
                            <text class="price-val">{{product.integerPrice}}</text>
                            <text class="dot-val" v-if="product.decimalPrice">.{{product.decimalPrice}}</text>
                            <text class="del-val" v-if="item.style.showPrice">¥{{product.originalPrice}}</text>
                        </view>
                        <tui-icon name="cart" :size="32" unit="rpx" color="#e41f19" @tap.stop="onSelect(product)" v-if="item.style.showCart"></tui-icon>
                    </view>
                </view>
            </view>
        </view>
        <view class="displayBox type5" v-if="item.style.layout==='5'">
            <scroll-view class="scroll-view_H" scroll-x="true">
                 <view class="scroll-view-item_H merchandise-item" v-for="(product,index) in goodsList" :key="index"
                    :class="{border: item.style.type=='3',shadow: item.style.type=='2'}"
                    :style="{borderRadius: item.style.borderRadius + 'px'}">
                    <image class="img" :src="product.defaultImageUrl" mode="widthFix"  @tap.stop="detail(product)"
                        :style="{ width: '260rpx',borderRadius: item.style.type!='1'? 0 : item.style.borderRadius*2 + 'rpx'}"/>
                    <!-- <view class="image-tag" v-if="item.style.showTags">
                        <img class='img' style="width: 53px; height: 15px" src="https://system.chuangbiying.com/static/images/mini/listTpl_goods.png">
                    </view> -->
                    <view class="price-panel">
                        <view class="title"><span>{{product.title}}</span></view>
                        <view class="icon-box">
                            <view class="price">
                                <text class="price-unit">¥</text>
                                <text class="price-val">{{product.integerPrice}}</text>
                                <text class="dot-val" v-if="product.decimalPrice">.{{product.decimalPrice}}</text>
                                <text class="del-val" v-if="item.style.showPrice">¥{{product.originalPrice}}</text>
                            </view>
                            <tui-icon name="cart" :size="32" unit="rpx" color="#e41f19" @tap.stop="onSelect(product)" v-if="item.style.showCart"></tui-icon>
                        </view>
                    </view>
                </view>
           </scroll-view>
        </view>
    </view>
</template>

<script>
    import tGoodsItem from '@/components/views/t-goods-item/t-goods-item'
    export default {
        components: {
            tGoodsItem
        },
        props: ['item'],
        data(){
            return {
                goodsList: [],
                entity: '',
                goods: '',
            }
        },
        computed: {
            productList(){
                return this.$store.state.goodsList
            }
        },
        watch:{
            productList: {
                immediate: true,
                handler(v){
                    let goodsList = []
                    this.item.content.goodsList.forEach((goods)=>{
                        let index = v.findIndex((o)=>{ return o.id ===goods.id })
                        if(index!==-1){
                            goodsList.push(v[index])
                        }
                    })
                    this.goodsList = goodsList
                }
            }

        },
        methods: {
            numFormat(v){
                return v>=10000? parseInt(v/10000) + '万+': v
            },
            detail(item) {
			    uni.navigateTo({
                    url: '/pages/index/productDetail/productDetail?spu_id=' + item.spu_id + '&sku_id=' + item.id
                })
            },
            onSelect(goods){
                this.tui.href('/pages/index/productDetail/productDetail?spu_id=' + goods.spu_id + '&sku_id=' + goods.id + '&buy=true')
            }
        }
    }
</script>

<style lang="less" scoped>
    .el-button.is-round{
        padding: 0;
    }
    .el-button--primary{
        width: 170rpx;
        background-color: #ef1033;
        border-color: #ef1033;;
    }
    .displayBox{
        display: flex;
        text-align: center;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: 0 10rpx;
    }
    .merchandise-item{
        width: 100%;
        flex-shrink: 0;
        overflow: hidden;
        position: relative;
        margin-bottom: 10rpx;
        &.shadow{box-shadow: 0 4px 24px 0 rgba(100, 100, 100, 0.1)}
        &.border{border: 2rpx solid #e0e0e0}
        .img{
            width: 100%;
        }
        .image-tag{
            position: absolute;
            top: 0;
            left: 0;
        }
        .price-panel {
            margin: 0 20rpx;
            position: relative;
            .title {
                text-align: left;
                margin: 12rpx 0;
                font-size: 28rpx;
                overflow: hidden;
                word-wrap: break-word;
                white-space:normal;
                word-break:break-all;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }
            .tui-sub-info {
                color: #888;
                text-align: left;
                margin-top: -6rpx;
                font-size: 22rpx;
                box-sizing: border-box;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .label-box{
                display: flex;
                margin-left: -10rpx;
            }
            .icon-box{
                display: flex;
                align-items: baseline;
                justify-content: space-between;
                width: 100%;
                // height: 60rpx;
                .price {
                    display: flex;
                    align-items: baseline;
                    color: #ef1033;
                    .price-unit, .dot-val{
                        font-size: 24rpx;
                    }
                    .del-val{
                        font-size: 24rpx;
                        color: #a0a0a0;
                        text-decoration: line-through;
                        padding-left: 12rpx;
                    }
                    .price-val{
                        font-size: 32rpx;
                    }
                }
                .cart{
                    color: #ef1033;
                    font-size: 36rpx;
                }
            }
        }
        .saled-out{
            font-size: 24rpx;
            margin-top: 20rpx;
            color: #9f9f9f;
            flex: auto;
            text-align: left;
        }
    }
    .type1 {
        .saled-out {
            margin: 0 20rpx 0 0;
            text-align: right;
        }
    }
    .type2{
        padding: 0 10rpx;
    }
    .type4{
        .merchandise-item{
            display: flex;
            .tui-sub-info {
                max-width: 420rpx;
            }
            .price-panel{
                margin: 0 20rpx;
                flex: 1;
                .icon-box{
                    position: absolute;
                    bottom: 0rpx;
                }
            }
            .img{
                max-height: 240rpx;
            }
        }
    }
    .type5 {
        overflow: hidden;
        flex-wrap: nowrap;
        margin-right: 0;
        .scroll-view_H {
            white-space: nowrap;
            width: 100%;
        }
        .scroll-view-item_H {
            display: inline-block;
            /*line-height: 300rpx;*/
            text-align: center;
            font-size: 36rpx;
        }
        .merchandise-item {
            width: 260rpx;
            margin-right: 10rpx;
            .price-panel{
                height: 110rpx;
                .icon-box{
                    position: absolute;
                    bottom: 0rpx;
                }
                .title{
                    // min-height: 28px;
                    font-size: 24rpx;
                }
            }
        }
    }
</style>
